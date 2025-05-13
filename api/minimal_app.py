from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from services.data_service import DataService

app = FastAPI(title="BBQ Nation Chatbot API")
data_service = DataService()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    input: str
    state: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    prompt: str
    state: str
    error: Optional[str] = None

def get_city_restaurants(city: str) -> str:
    """Get list of restaurants in the specified city."""
    if city.lower() == "delhi":
        return """🍽️ Here are our restaurants in Delhi:

1. BBQ Nation Connaught Place
2. BBQ Nation Vasant Kunj
3. BBQ Nation Unity Mall Janakpuri

Which restaurant would you like to visit? Please type or select the restaurant name or number."""
    elif city.lower() == "bangalore":
        return """🍽️ Here are our restaurants in Bangalore:

1. BBQ Nation Indiranagar
2. BBQ Nation Koramangala
3. BBQ Nation Whitefield

Which restaurant would you like to visit? Please type or select the restaurant name or number."""
    else:
        return f"No restaurants found in {city}."

def get_restaurant_details(restaurant: str) -> str:
    """Get detailed information about a restaurant."""
    # This is a simplified version
    return f"""✨ BBQ Nation {restaurant}
📍 Address: Sample address, {restaurant}, India
📞 Contact: 1234567890
⏰ Mon-Sun: Lunch 12:00-15:30, Dinner 19:00-23:00
🌟 Amenities: Bar available, Parking, Baby chairs
🎁 Offers: Early bird discount, Buffet special

Would you like to proceed with this restaurant? (yes/no)"""

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"Received request: {request}")
        
        # Handle each state based on the conversation flow
        if request.state == 'START':
            city = request.input.strip().capitalize()
            if city.lower() in ['delhi', 'bangalore']:
                # Show restaurant list for the selected city
                return ChatResponse(
                    prompt=get_city_restaurants(city),
                    state='SELECT_RESTAURANT'
                )
            else:
                return ChatResponse(
                    prompt="Please select either Delhi or Bangalore.",
                    state='START'
                )
        
        elif request.state == 'SELECT_RESTAURANT':
            restaurant = request.input.strip()
            # Show details for the selected restaurant
            return ChatResponse(
                prompt=get_restaurant_details(restaurant),
                state='CONFIRM_RESTAURANT'
            )
        
        elif request.state == 'CONFIRM_RESTAURANT':
            if request.input.lower() == 'yes':
                return ChatResponse(
                    prompt="Great! Please tell me your name.",
                    state='COLLECT_NAME'
                )
            else:
                # Go back to city selection if they don't confirm
                return ChatResponse(
                    prompt="Which city would you like to dine in - Delhi or Bangalore?",
                    state='START'
                )
        
        elif request.state == 'COLLECT_NAME':
            name = request.input.strip()
            return ChatResponse(
                prompt=f"Hello {name}! Please share your 10-digit phone number.",
                state='COLLECT_PHONE'
            )
        
        elif request.state == 'COLLECT_PHONE':
            return ChatResponse(
                prompt="""How can I assist you today? Please choose from the following options:
1. Menu and pricing information
2. Current offers and promotions
3. Restaurant timings
4. Location and directions
5. Make a new booking
6. Modify existing booking
7. Cancel booking""",
                state='DISCOVER'
            )
        
        elif request.state == 'DISCOVER':
            if request.input == '1':
                # Show menu information
                menu_response = data_service.get_menu_info()
                return ChatResponse(
                    prompt=menu_response,
                    state="ASK_MORE_HELP"
                )
            elif request.input in ['2', '3', '4']:
                # For simplicity, we'll handle these cases similarly
                return ChatResponse(
                    prompt="This information will be available soon.",
                    state="ASK_MORE_HELP"
                )
            else:
                return ChatResponse(
                    prompt="Please select a valid option (1-7).",
                    state='DISCOVER'
                )
        
        elif request.state == 'ASK_MORE_HELP':
            if request.input.lower() == 'yes':
                return ChatResponse(
                    prompt="""How can I assist you today? Please choose from the following options:
1. Menu and pricing information
2. Current offers and promotions
3. Restaurant timings
4. Location and directions
5. Make a new booking
6. Modify existing booking
7. Cancel booking""",
                    state='DISCOVER'
                )
            else:
                return ChatResponse(
                    prompt="Thank you for using BBQ Nation Assistant. Have a great day!",
                    state='END'
                )
        
        # Default fallback response
        return ChatResponse(
            prompt=f"I'm not sure how to respond to '{request.input}' in the current state.",
            state=request.state
        )
    
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000) 