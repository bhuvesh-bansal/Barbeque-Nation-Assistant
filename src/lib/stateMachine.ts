import { ChatState, Message, ChatStateType } from '../types';
import { states, StateConfig } from '../config/stateMachine';
import { locations } from '../config/locations';
import { getFAQsByTags, searchFAQs } from '../config/faqs';
import { menu, searchMenu } from '../config/menu';
import { aiService } from '../api/aiService';

export class StateMachine {
  private state: ChatState;
  private availableProperties: Set<string>;
  private knowledgeBase: Map<string, string[]>;
  private readonly states: { [key: string]: StateConfig };

  constructor(initialState: ChatState = { currentState: 'START', messages: [] }) {
    this.state = initialState;
    this.states = states;
    // Initialize with available locations from the locations config
    this.availableProperties = new Set(Object.keys(locations).map(key => key.toLowerCase()));

    // Initialize knowledge base for common queries
    this.knowledgeBase = new Map<string, string[]>([
      ['menu', ['food', 'dish', 'starter', 'main course', 'dessert', 'ice cream', 'kulfi']],
      ['pricing', ['cost', 'price', 'expensive', 'cheap', 'affordable', 'budget']],
      ['booking', ['reserve', 'reservation', 'book', 'table', 'seats', 'availability']],
      ['timing', ['hours', 'open', 'close', 'time', 'schedule', 'when']],
      ['location', ['where', 'address', 'directions', 'located', 'find', 'nearest']],
      ['offers', ['discount', 'offer', 'promotion', 'deal', 'special']],
      ['dietary', ['vegetarian', 'vegan', 'halal', 'jain', 'allergy', 'gluten', 'non-veg']],
    ]);

    // Initialize with the first message
    this.state.messages.push({
      role: 'assistant',
      content: this.getCurrentPrompt(),
      timestamp: Date.now()
    });
  }

  public getState(): ChatState {
    return this.state;
  }

  public getCurrentState(): string {
    return this.state.currentState;
  }

  public getCurrentPrompt(): string {
    const config = this.states[this.state.currentState];
    if (!config) return "I apologize, but I'm not sure how to proceed.";

    let prompt = config.prompt;
    
    // Replace placeholders with actual values
    if (this.state.location) {
      const locationDetails = this.getLocationDetails(this.state.location);
      const locationName = locationDetails ? locationDetails.name : this.formatLocationName(this.state.location);
      prompt = prompt.replace('{location}', locationName);
    }
    if (this.state.name) {
      prompt = prompt.replace('{name}', this.state.name);
    }
    if (this.state.phoneNumber) {
      prompt = prompt.replace('{phone}', this.formatPhoneNumber(this.state.phoneNumber));
    }
    if (this.state.dateTime) {
      prompt = prompt.replace('{dateTime}', this.state.dateTime);
    }
    if (this.state.newDateTime) {
      prompt = prompt.replace('{newDateTime}', this.state.newDateTime);
    }
    if (this.state.paxSize) {
      prompt = prompt.replace('{paxSize}', this.state.paxSize.toString());
    }
    if (this.state.bookingRef) {
      prompt = prompt.replace('{bookingRef}', this.state.bookingRef);
    }
    if (this.state.enquiryType && this.state.location) {
      prompt = prompt.replace('{enquiryResponse}', this.getEnquiryResponse(this.state.enquiryType, this.state.location));
    }

    return prompt;
  }

  private formatLocationName(locationKey: string): string {
    // Convert location key to a more readable format
    // E.g., "delhi-connaught-place" -> "Delhi Connaught Place"
    try {
      const location = locations[locationKey.toLowerCase()];
      if (location) {
        return location.name;
      }
      
      return locationKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } catch (e) {
      return locationKey;
    }
  }

  private formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  private generateBookingRef(): string {
    return `BN${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  }

  private getLocationDetails(location: string) {
    return locations[location.toLowerCase()];
  }

  private getEnquiryResponse(enquiryType: string, location: string): string {
    const locationDetails = this.getLocationDetails(location);
    if (!locationDetails) return "I apologize, but I don't have information about that location.";

    switch (enquiryType) {
      case '1': // Menu and pricing
        return `Our menu includes a wide variety of starters, main course items, and desserts. Would you like to know about specific menu items?`;
      case '2': // Offers
        const offers = [];
        if (locationDetails.offers.complimentaryDrinks) offers.push(locationDetails.offers.complimentaryDrinks);
        if (locationDetails.offers.foodFestival) offers.push("Ongoing food festival");
        if (locationDetails.offers.earlyBird) offers.push("Early bird discounts available");
        if (locationDetails.offers.buffetOffer) offers.push("Special buffet offers");
        if (locationDetails.offers.armyOffer) offers.push("Special discounts for army personnel");
        if (locationDetails.offers.drinksOffer) offers.push("Special drinks packages available");
        if (locationDetails.specialOffers?.earlyBird) offers.push(locationDetails.specialOffers.earlyBird);
        if (locationDetails.specialOffers?.kittyParty) offers.push(`Kitty party offers available - ${locationDetails.specialOffers.kittyParty}`);
        if (locationDetails.specialOffers?.student) offers.push(`Student offers available - ${locationDetails.specialOffers.student}`);
        
        return offers.length > 0 
          ? `Current offers at ${locationDetails.name}:\n${offers.join("\n")}` 
          : `Currently, we don't have any ongoing special offers at ${locationDetails.name}.`;
      case '3': // Timings
        const timings = locationDetails.timings;
        return `Operating hours at ${locationDetails.name}:\n${Object.entries(timings).map(([day, time]) => 
          `${day}:\nLunch: ${time.lunch.opening} - ${time.lunch.closing} (Last entry: ${time.lunch.lastEntry})\nDinner: ${time.dinner.opening} - ${time.dinner.closing} (Last entry: ${time.dinner.lastEntry})`
        ).join('\n')}`;
      case '4': // Location
        const nearestInfo = locationDetails.nearestOutlets.length > 0 
          ? `\n\nNearest Barbeque Nation outlets:\n${locationDetails.nearestOutlets.map(outlet => 
              `• ${outlet.name} (${outlet.distance}): ${outlet.address}`
            ).join('\n')}`
          : '';
        
        return `${locationDetails.name} is located at:\n${locationDetails.address}${nearestInfo}`;
      default:
        return "I apologize, but I couldn't understand your query. Could you please rephrase it?";
    }
  }

  // Helper method to check if input is related to specific topics
  private checkTopicRelevance(input: string): string | null {
    const lowercaseInput = input.toLowerCase();
    
    // Fix for MapIterator error - convert to array entries first
    const entries = Array.from(this.knowledgeBase.entries());
    for (const [topic, keywords] of entries) {
      if (keywords.some((keyword: string) => lowercaseInput.includes(keyword))) {
        return topic;
      }
    }
    
    return null;
  }

  // Method to handle general inquiries without requiring state changes
  private handleGeneralInquiry(input: string): string | null {
    const lowercaseInput = input.toLowerCase();
    
    // Try to find an answer in FAQs first
    const relevantFAQs = searchFAQs(input);
    if (relevantFAQs.length > 0) {
      return relevantFAQs[0].answer;
    }
    
    // Check for menu related queries
    if (lowercaseInput.includes('menu') || 
        lowercaseInput.includes('food') || 
        lowercaseInput.includes('dish') ||
        lowercaseInput.includes('serve')) {
      
      // Check for specific items
      const menuItems = searchMenu(input);
      if (menuItems.length > 0) {
        const itemNames = menuItems.map(item => item.name).join(', ');
        return `Yes, we serve ${itemNames}. Is there anything specific you'd like to know about these items?`;
      }
      
      // Generic menu response
      return "Our menu features a variety of veg and non-veg starters, main course items, and desserts. We serve BASA fish, Zinga prawns, various kebabs, curries, and more. Would you like details about a specific category or dish?";
    }
    
    // Check for location specific queries
    if (lowercaseInput.includes('where') || 
        lowercaseInput.includes('location') || 
        lowercaseInput.includes('address')) {
      
      if (this.state.location) {
        const locationData = locations[this.state.location.toLowerCase()];
        if (locationData) {
          return `${locationData.name} is located at: ${locationData.address}`;
        }
      }
      
      return "We have multiple locations across India. Could you specify which city you're interested in?";
    }
    
    // No relevant general inquiry found
    return null;
  }

  public async processInput(input: string): Promise<string> {
    const config = this.states[this.state.currentState];
    if (!config) {
      return "How can I assist you today?";
    }

    const lowercaseInput = input.toLowerCase().trim();

    try {
      // Check for general inquiries at the START state
      if (this.state.currentState === 'START') {
        // See if the input is a location (Delhi or Bangalore)
        if (lowercaseInput.includes('delhi') || lowercaseInput.includes('bangalore')) {
          // Process normally for location selection
          if (lowercaseInput.includes('delhi')) {
            this.state.location = 'Delhi';
          } else if (lowercaseInput.includes('bangalore')) {
            this.state.location = 'Bangalore';
          }
          
          // Move to the next state
          const nextState = (config.transitions[lowercaseInput] || config.transitions['*']) as ChatStateType;
          this.state.currentState = nextState;
          return this.getCurrentPrompt();
        } 
        
        // Check if it's a general inquiry about services/offerings
        const intentCategory = this.getIntentCategory(lowercaseInput);
        if (intentCategory) {
          // Provide a general response but stay in the START state
          return this.getGeneralInquiryResponse(intentCategory);
        }
      }

      // Get AI analysis of the input
      const aiResponse = await aiService.analyzeQuery({
        query: input,
        context: {
          currentState: this.state.currentState,
          location: this.state.location,
          previousIntent: this.state.enquiryType,
          customerPreferences: []
        }
      });

      // Use AI for validation if confidence is high
      if (aiResponse.confidence > 0.8) {
        // Extract entities from AI response
        if (aiResponse.entities.city) {
          this.state.location = this.formatLocationName(aiResponse.entities.city);
        }
        if (aiResponse.entities.name) {
          this.state.name = aiResponse.entities.name;
        }
        if (aiResponse.entities.phone) {
          this.state.phoneNumber = aiResponse.entities.phone;
        }
        if (aiResponse.entities.datetime) {
          this.state.dateTime = aiResponse.entities.datetime;
        }
        if (aiResponse.entities.pax) {
          this.state.paxSize = parseInt(aiResponse.entities.pax);
        }

        // If AI suggests a valid next state, use it
        const suggestedState = aiResponse.entities.suggestedState as ChatStateType;
        if (suggestedState && this.states[suggestedState]) {
          this.state.currentState = suggestedState;
          return aiResponse.suggestedResponse || this.getCurrentPrompt();
        }
      }

      // Fall back to rule-based validation if AI confidence is low
      if (config.validation && !config.validation(lowercaseInput)) {
        if (this.state.currentState === 'START') {
          return "Please select either Delhi or Bangalore to proceed.";
        }
        if (this.state.currentState === 'VERIFY_LOCATION') {
          return "Please respond with 'yes' or 'no' to confirm the location.";
        }
        return `That's not a valid input. ${this.getCurrentPrompt()}`;
      }

      // Process input based on current state
      switch (this.state.currentState) {
        case 'START':
          if (lowercaseInput.includes('delhi')) {
            this.state.location = 'Delhi';
          } else if (lowercaseInput.includes('bangalore')) {
            this.state.location = 'Bangalore';
          }
          break;

        case 'VERIFY_LOCATION':
          if (lowercaseInput === 'no') {
            this.state.location = undefined;
          }
          break;

        case 'COLLECT_NAME':
          this.state.name = input;
          break;

        case 'COLLECT_PHONE':
          this.state.phoneNumber = input.replace(/\D/g, '');
          break;

        case 'DISCOVER':
          this.state.enquiryType = input;
          if (['5', '6', '7'].includes(input)) {
            this.state.actionType = input === '5' ? 'new' : input === '6' ? 'modify' : 'cancel';
          }
          break;

        case 'COLLECT_DATE_TIME':
          this.state.dateTime = input;
          break;

        case 'COLLECT_NEW_DATE_TIME':
          this.state.newDateTime = input;
          break;

        case 'COLLECT_PAX_SIZE':
          this.state.paxSize = parseInt(input);
          break;

        case 'BOOKING_CONFIRMED':
          if (!this.state.bookingRef) {
            this.state.bookingRef = this.generateBookingRef();
          }
          break;

        case 'COLLECT_BOOKING_REF':
          this.state.bookingRef = input;
          break;
      }

      // Execute any additional actions
      if (config.action) {
        await config.action(this.state, input);
      }

      // Determine next state
      const nextState = (config.transitions[lowercaseInput] || config.transitions['*']) as ChatStateType;
      this.state.currentState = nextState;

      // If AI provided a good response for this state, use it
      if (aiResponse.suggestedResponse && aiResponse.confidence > 0.8) {
        return aiResponse.suggestedResponse;
      }

      // Fall back to template response
      return this.getCurrentPrompt();

    } catch (error) {
      console.error('Error processing input:', error);
      // Fall back to rule-based processing if AI fails
      return this.getCurrentPrompt();
    }
  }

  public reset(): void {
    this.state = {
      currentState: 'START',
      messages: [{
        role: 'assistant',
        content: this.getCurrentPrompt(),
        timestamp: Date.now()
      }]
    };
  }

  // Check if input contains any of the provided keywords
  private matchesIntent(input: string, keywords: string[]): boolean {
    const lowercaseInput = input.toLowerCase();
    return keywords.some(keyword => lowercaseInput.includes(keyword));
  }

  // Get the category with the highest number of matching keywords
  private getIntentCategory(input: string): string | null {
    let bestCategory = null;
    let maxMatches = 0;

    for (const [category, keywords] of this.knowledgeBase.entries()) {
      const matches = keywords.filter(keyword => input.toLowerCase().includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestCategory = category;
      }
    }

    return maxMatches > 0 ? bestCategory : null;
  }

  // Get a response for a general inquiry
  private getGeneralInquiryResponse(category: string): string {
    switch (category) {
      case 'menu':
        return "I'd be happy to tell you about our menu! We offer a variety of starters, main courses and desserts, including both vegetarian and non-vegetarian options. Our buffet includes grilled starters, main course dishes, and desserts. To see specific menu items for a location, please first tell me which city you're interested in - Delhi or Bangalore?";
      
      case 'pricing':
        return "Our pricing varies by location. The typical cost for our buffet is between ₹800-1500 per person depending on the time of visit and specific outlet. For exact pricing at a particular location, please let me know which city you're interested in - Delhi or Bangalore?";
      
      case 'booking':
        return "I'd be happy to help you make a reservation! To check availability and book a table, I'll need to know which city you're interested in first - Delhi or Bangalore?";
      
      case 'timing':
        return "Our restaurants are typically open for lunch from 12:00 PM to 4:00 PM and dinner from 6:00/6:30 PM to 11:00/11:55 PM. Opening hours may vary slightly by location. To check the exact timings for a specific outlet, please tell me which city you're interested in - Delhi or Bangalore?";
      
      case 'location':
        return "We have multiple outlets in both Delhi and Bangalore. To see the list of specific locations with addresses, please tell me which city you're interested in - Delhi or Bangalore?";
      
      case 'offers':
        return "We have various offers including Early Bird discounts, special promotions for large groups (5+ people), and student discounts at select locations. For current offers at a specific outlet, please let me know which city you're interested in - Delhi or Bangalore?";
      
      case 'dietary':
        return "We cater to various dietary preferences with a wide selection of vegetarian and non-vegetarian dishes. Our buffet includes veg starters like Cajun Spice Potato, Mushroom, and Paneer, as well as non-veg options like Chicken Tangdi and Fish. For the complete menu at a specific location, please tell me which city you're interested in - Delhi or Bangalore?";
      
      default:
        return "I'd be happy to help you with information about our restaurants. To get started, please tell me which city you're interested in - Delhi or Bangalore?";
    }
  }
} 