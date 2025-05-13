import { ChatState } from '../types';
import { states, StateConfig } from '../config/stateMachine';
import { locations } from '../config/locations';

export class StateMachine {
  private state: ChatState;
  private availableProperties: Set<string>;

  constructor() {
    this.state = {
      currentState: 'START',
      history: []
    };
    // Initialize with available locations from the locations config
    this.availableProperties = new Set(Object.keys(locations).map(key => key.toLowerCase()));

    // Initialize with the first message
    this.state.history.push({
      state: 'START',
      input: '',
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
    const currentState = states[this.state.currentState];
    if (!currentState) {
      console.error(`Invalid state: ${this.state.currentState}`);
      this.state.currentState = 'START';
      return states.START.prompt;
    }

    // Replace placeholders in prompt with actual values
    let prompt = currentState.prompt;
    if (this.state.currentState === 'CONFIRM_DETAILS') {
      prompt = prompt
        .replace('{phone}', this.formatPhoneNumber(this.state.phoneNumber || ''))
        .replace('{name_confirmation}', this.state.name ? `your name is ${this.state.name}` : 'you preferred not to provide your name');
    } else if (this.state.currentState === 'CONFIRM_BOOKING') {
      prompt = prompt
        .replace('{dateTime}', this.state.dateTime || '')
        .replace('{paxSize}', this.state.paxSize?.toString() || '')
        .replace('{location}', this.state.location || '');
    } else if (this.state.currentState === 'BOOKING_CONFIRMED') {
      prompt = prompt.replace('{bookingRef}', this.state.bookingRef || 'BN' + Date.now().toString().slice(-6));
    } else if (this.state.currentState === 'CONFIRM_MODIFICATION') {
      prompt = prompt.replace('{newDateTime}', this.state.newDateTime || '');
    } else if (this.state.currentState === 'PROVIDE_INFO') {
      prompt = prompt.replace('{enquiryResponse}', this.getEnquiryResponse(this.state.enquiryType));
    }
    return prompt;
  }

  private formatPhoneNumber(phone: string): string {
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1-$2-$3');
  }

  private getEnquiryResponse(type: string | undefined): string {
    const location = this.state.location ? locations[this.state.location.toLowerCase()] : undefined;
    
    if (!location) {
      return "I apologize, but I couldn't find information for this location. Please try again.";
    }

    switch (type) {
      case '1':
        return "Our unlimited buffet includes a wide variety of veg and non-veg starters, main course, and desserts. Please visit us to know the current pricing.";
      case '2':
        const offers = [];
        if (location.offers.complimentaryDrinks) offers.push(location.offers.complimentaryDrinks);
        if (location.offers.foodFestival) offers.push("Ongoing food festival");
        if (location.offers.earlyBird) offers.push("Early bird discounts available");
        if (location.offers.buffetOffer) offers.push("Special buffet offers");
        if (location.offers.armyOffer) offers.push("Special discounts for army personnel");
        if (location.offers.drinksOffer) offers.push("Special drinks packages available");
        return offers.length > 0 ? offers.join(". ") : "Currently, we don't have any ongoing special offers.";
      case '3':
        const timings = location.timings;
        return `Our timings are:\n${Object.entries(timings).map(([day, time]) => 
          `${day}:\nLunch: ${time.lunch.opening} - ${time.lunch.closing} (Last entry: ${time.lunch.lastEntry})\nDinner: ${time.dinner.opening} - ${time.dinner.closing} (Last entry: ${time.dinner.lastEntry})`
        ).join('\n')}`;
      case '4':
        return `We are located at: ${location.address}\n\nNearest landmarks:\n${location.nearestOutlets.map(outlet => 
          `${outlet.name} (${outlet.distance})`
        ).join('\n')}`;
      default:
        return "I apologize, but I couldn't understand which information you're looking for. Could you please select from the options provided?";
    }
  }

  public async processInput(input: string): Promise<string> {
    // Special handling for initial state
    if (input === 'START') {
      return this.getCurrentPrompt();
    }

    const currentState = states[this.state.currentState];
    if (!currentState) {
      console.error(`Invalid state: ${this.state.currentState}`);
      this.state.currentState = 'START';
      return states.START.prompt;
    }

    // Validate input if validation function exists
    if (currentState.validation && !currentState.validation(input)) {
      return currentState.prompt;
    }

    // Determine next state based on input
    let nextState = '';
    switch (this.state.currentState) {
      case 'START':
        const location = input.toLowerCase().trim();
        nextState = 'VERIFY_LOCATION';
        this.state.location = location;
        break;

      case 'VERIFY_LOCATION':
        nextState = this.availableProperties.has(this.state.location?.toLowerCase() || '')
          ? 'COLLECT_NAME'
          : 'LOCATION_NOT_FOUND';
        break;

      case 'LOCATION_NOT_FOUND':
        nextState = input.toLowerCase() === 'yes' ? 'START' : 'END';
        break;

      case 'COLLECT_NAME':
        if (input.toLowerCase() === 'no' || input.toLowerCase() === 'skip') {
          nextState = 'COLLECT_PHONE';
          this.state.name = undefined;
        } else {
          nextState = 'COLLECT_PHONE';
          this.state.name = input;
        }
        break;

      case 'COLLECT_PHONE':
        if (/^\d{10}$/.test(input)) {
          this.state.phoneNumber = input;
          nextState = 'CONFIRM_DETAILS';
        } else {
          return "I apologize, but I need a valid 10-digit phone number. Could you please provide it again?";
        }
        break;

      case 'CONFIRM_DETAILS':
        nextState = input.toLowerCase() === 'yes' ? 'DISCOVER' : 'COLLECT_NAME';
        break;

      case 'DISCOVER':
        switch (input) {
          case '1':
            nextState = 'COLLECT_DATE_TIME_NEW';
            break;
          case '2':
          case '3':
            nextState = 'COLLECT_BOOKING_REF';
            this.state.actionType = input === '2' ? 'MODIFY' : 'CANCEL';
            break;
          case '4':
            nextState = 'HANDLE_ENQUIRY';
            break;
          default:
            return "Please select a valid option (1-4).";
        }
        break;

      case 'COLLECT_DATE_TIME_NEW':
        this.state.dateTime = input;
        nextState = 'COLLECT_PAX_SIZE';
        break;

      case 'COLLECT_PAX_SIZE':
        const paxSize = parseInt(input);
        if (isNaN(paxSize) || paxSize <= 0) {
          return "Please provide a valid number of guests.";
        }
        this.state.paxSize = paxSize;
        nextState = 'CONFIRM_BOOKING';
        break;

      case 'CONFIRM_BOOKING':
        switch (input.toLowerCase()) {
          case 'yes':
            nextState = 'BOOKING_CONFIRMED';
            this.state.bookingRef = 'BN' + Date.now().toString().slice(-6);
            break;
          case 'no':
            nextState = 'DISCOVER';
            break;
          case 'modify':
            nextState = 'COLLECT_DATE_TIME_NEW';
            break;
          default:
            return "Please confirm with 'yes' or 'no', or say 'modify' to change the details.";
        }
        break;

      case 'COLLECT_BOOKING_REF':
        // Simple validation for booking reference
        if (/^BN\d{6}$/.test(input)) {
          this.state.bookingRef = input;
          nextState = 'VERIFY_BOOKING';
        } else {
          nextState = 'BOOKING_NOT_FOUND';
        }
        break;

      case 'VERIFY_BOOKING':
        switch (input.toLowerCase()) {
          case 'modify':
            nextState = 'COLLECT_DATE_TIME_MOD';
            break;
          case 'cancel':
            nextState = 'CONFIRM_CANCELLATION';
            break;
          case 'back':
            nextState = 'DISCOVER';
            break;
          default:
            return "Please select 'modify', 'cancel', or 'back'.";
        }
        break;

      case 'COLLECT_DATE_TIME_MOD':
        this.state.newDateTime = input;
        nextState = 'CONFIRM_MODIFICATION';
        break;

      case 'CONFIRM_MODIFICATION':
      case 'CONFIRM_CANCELLATION':
        nextState = input.toLowerCase() === 'yes' 
          ? (this.state.currentState === 'CONFIRM_MODIFICATION' ? 'MODIFICATION_CONFIRMED' : 'CANCELLATION_CONFIRMED')
          : 'VERIFY_BOOKING';
        break;

      case 'HANDLE_ENQUIRY':
        if (['1', '2', '3', '4'].includes(input)) {
          this.state.enquiryType = input;
          nextState = 'PROVIDE_INFO';
        } else {
          return "Please select a valid option (1-4).";
        }
        break;

      case 'PROVIDE_INFO':
      case 'MODIFICATION_CONFIRMED':
      case 'BOOKING_CONFIRMED':
      case 'CANCELLATION_CONFIRMED':
      case 'END':
        nextState = input.toLowerCase() === 'yes' ? 'DISCOVER' : 'FINAL';
        break;

      default:
        nextState = currentState.transitions.NEXT || currentState.transitions.BACK;
    }

    // Log state transition
    this.state.history.push({
      state: this.state.currentState,
      input,
      timestamp: Date.now()
    });

    // Update current state
    this.state.currentState = nextState || this.state.currentState;

    // Execute action if it exists
    if (states[this.state.currentState].action) {
      await states[this.state.currentState].action!(this.state, input);
    }

    return this.getCurrentPrompt();
  }

  public reset(): void {
    this.state = {
      currentState: 'START',
      history: [{
        state: 'START',
        input: '',
        timestamp: Date.now()
      }]
    };
  }
} 