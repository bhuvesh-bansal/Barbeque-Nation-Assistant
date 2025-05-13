import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { states } from './config/stateMachine';
import { knowledgeBase } from './config/knowledgeBase';
import { locations } from './config/locations';
import { menu } from './config/menu';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to generate response based on enquiry type and location
function generateResponse(enquiryType: string, location: string): string {
  const locationKey = location.toLowerCase();
  // Find the matching location key (e.g., bangalore-indiranagar, bangalore-electronic-city)
  const locationKeys = Object.keys(locations).filter(key => key.startsWith(locationKey));
  
  if (locationKeys.length === 0) {
    return "I apologize, but I don't have information about that location.";
  }

  // Use the first matching location for now
  const locationDetails = locations[locationKeys[0]];

  switch (enquiryType) {
    case '1': // Menu and pricing
      let menuResponse = "Here's our current menu selection:\n\n";
      
      // Add Veg Starters
      menuResponse += "🌱 VEG STARTERS:\n";
      menu.veg[0].items.forEach(item => {
        menuResponse += `- ${item.name}\n`;
      });

      // Add Non-Veg Starters
      menuResponse += "\n🍗 NON-VEG STARTERS:\n";
      menu.nonVeg[0].items.forEach(item => {
        menuResponse += `- ${item.name}\n`;
      });

      // Add Main Course
      menuResponse += "\n🍱 MAIN COURSE:\n";
      menuResponse += "Vegetarian:\n";
      menu.veg[1].items.forEach(item => {
        menuResponse += `- ${item.name}\n`;
      });
      
      menuResponse += "\nNon-Vegetarian:\n";
      menu.nonVeg[1].items.forEach(item => {
        menuResponse += `- ${item.name}\n`;
      });

      // Add Desserts
      menuResponse += "\n🍰 DESSERTS:\n";
      const desserts = menu.common.find(cat => cat.name === "Dessert");
      desserts?.items.forEach(item => {
        menuResponse += `- ${item.name}\n`;
      });

      menuResponse += "\nWould you like to know about our current food festival or special offers?";
      return menuResponse;

    case '2': // Offers
      let offersResponse = "Here are our current offers:\n";
      if (locationDetails.offers.earlyBird) {
        offersResponse += "- Early Bird Special Discount\n";
      }
      if (locationDetails.offers.buffetOffer) {
        offersResponse += "- Special Buffet Offer\n";
      }
      if (locationDetails.offers.armyOffer) {
        offersResponse += "- Special Discount for Armed Forces\n";
      }
      if (locationDetails.offers.studentOffer) {
        offersResponse += "- Student Discount Available\n";
      }
      if (locationDetails.offers.complimentaryDrinks) {
        offersResponse += `- ${locationDetails.offers.complimentaryDrinks}\n`;
      }
      return offersResponse || "I'll check and get back to you about our current offers.";

    case '3': // Timings
      const timingInfo = locationDetails.timings["Monday to Friday"];
      return `Our timings are:\n
Lunch: ${timingInfo.lunch.opening} to ${timingInfo.lunch.closing} (Last entry: ${timingInfo.lunch.lastEntry})
Dinner: ${timingInfo.dinner.opening} to ${timingInfo.dinner.closing} (Last entry: ${timingInfo.dinner.lastEntry})

Note: Timings might vary on weekends and holidays. Please call us to confirm.`;

    case '4': // Location
      let response = `${locationDetails.name} is located at: ${locationDetails.address}\n\n`;
      
      if (locationDetails.amenities) {
        response += "Amenities:\n";
        if (locationDetails.amenities.bar) response += "- Full Bar Available\n";
        if (locationDetails.amenities.valetParking) response += `- Valet Parking: ${locationDetails.amenities.valetParking}\n`;
        if (locationDetails.amenities.babyChair) response += "- Baby Chairs Available\n";
        if (locationDetails.amenities.lift) response += "- Lift Access\n";
      }

      if (locationDetails.nearestOutlets && locationDetails.nearestOutlets.length > 0) {
        response += "\nNearest outlets:\n";
        locationDetails.nearestOutlets.forEach(outlet => {
          response += `- ${outlet.name} (${outlet.distance}): ${outlet.address}\n`;
        });
      }

      return response;

    default:
      return "I apologize, but I couldn't understand your query. Could you please rephrase it?";
  }
}

// Home page
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>BBQ Nation Chatbot</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; padding: 0 20px; }
        #chat-container { border: 1px solid #ccc; padding: 20px; border-radius: 5px; }
        #messages { height: 300px; overflow-y: auto; margin-bottom: 20px; }
        .message { margin: 10px 0; padding: 10px; border-radius: 5px; }
        .user { background: #e3f2fd; text-align: right; }
        .bot { background: #f5f5f5; }
        input[type="text"] { width: 80%; padding: 10px; margin-right: 10px; }
        button { padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>BBQ Nation Chatbot</h1>
      <div id="chat-container">
        <div id="messages"></div>
        <div>
          <input type="text" id="user-input" placeholder="Type your message...">
          <button onclick="sendMessage()">Send</button>
        </div>
      </div>
      <script>
        let currentState = 'START';
        let userLocation = '';
        let userName = '';
        let userPhone = '';
        const messagesDiv = document.getElementById('messages');
        const userInput = document.getElementById('user-input');

        // Add initial bot message
        addMessage("Welcome to Barbeque Nation! Which city would you like to dine in - Delhi or Bangalore?", 'bot');

        async function sendMessage() {
          const message = userInput.value.trim();
          if (!message) return;

          // Add user message to chat
          addMessage(message, 'user');
          userInput.value = '';

          try {
            const response = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                input: message, 
                state: currentState,
                context: {
                  location: userLocation,
                  name: userName,
                  phone: userPhone
                }
              })
            });

            const data = await response.json();
            if (data.error) {
              addMessage(data.error + ". " + data.prompt, 'bot');
            } else {
              // Update context based on state transitions
              if (currentState === 'START' && data.state === 'VERIFY_LOCATION') {
                userLocation = message;
              } else if (currentState === 'COLLECT_NAME') {
                userName = message;
              } else if (currentState === 'COLLECT_PHONE') {
                userPhone = message;
              }

              addMessage(data.prompt.replace('{location}', userLocation)
                                  .replace('{name}', userName)
                                  .replace('{phone}', userPhone), 'bot');
              currentState = data.state;
            }
          } catch (error) {
            addMessage('Sorry, something went wrong. Please try again.', 'bot');
          }
        }

        function addMessage(text, sender) {
          const div = document.createElement('div');
          div.className = 'message ' + sender;
          div.textContent = text;
          messagesDiv.appendChild(div);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        // Handle Enter key
        userInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendMessage();
        });
      </script>
    </body>
    </html>
  `);
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { input, state, context } = req.body;
    const currentState = states[state];
    if (!currentState) {
      return res.status(400).json({ error: 'Invalid state' });
    }

    let processedInput = input;
    let responsePrompt = currentState.prompt;
    
    // Special handling for DISCOVER state
    if (state === 'DISCOVER') {
      const lowercaseInput = input.toLowerCase();
      if (lowercaseInput.includes('menu') || lowercaseInput.includes('pricing')) {
        processedInput = '1';
      } else if (lowercaseInput.includes('offer') || lowercaseInput.includes('promotion')) {
        processedInput = '2';
      } else if (lowercaseInput.includes('timing') || lowercaseInput.includes('hour')) {
        processedInput = '3';
      } else if (lowercaseInput.includes('location') || lowercaseInput.includes('direction')) {
        processedInput = '4';
      } else if (lowercaseInput.includes('book') || lowercaseInput.includes('reservation')) {
        processedInput = '5';
      } else if (lowercaseInput.includes('modify') || lowercaseInput.includes('change')) {
        processedInput = '6';
      } else if (lowercaseInput.includes('cancel')) {
        processedInput = '7';
      }
    }

    // Process input based on current state
    const isValid = currentState.validation ? currentState.validation(processedInput) : true;
    if (!isValid) {
      return res.json({
        prompt: currentState.prompt,
        state: state,
        error: 'Invalid input'
      });
    }

    // Get next state
    const nextState = currentState.transitions[processedInput.toLowerCase()] || currentState.transitions['*'];
    const nextStateConfig = states[nextState];

    // Generate response for PROVIDE_INFO state
    if (nextState === 'PROVIDE_INFO' && context?.location) {
      responsePrompt = generateResponse(processedInput, context.location);
    } else {
      responsePrompt = nextStateConfig.prompt;
    }

    return res.json({
      prompt: responsePrompt,
      state: nextState
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 