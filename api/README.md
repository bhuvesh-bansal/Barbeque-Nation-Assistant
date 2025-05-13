# BBQ Nation Chatbot API

A FastAPI-based chatbot API for Barbeque Nation restaurant chain. This API handles user interactions for restaurant information, menu details, bookings, and more.

## Features

- Location-based restaurant information
- Detailed menu with veg and non-veg options
- Current offers and promotions
- Restaurant timings and availability
- Booking management (new bookings, modifications, cancellations)
- State-based conversation flow

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the API:
```bash
uvicorn app:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /chat
Main endpoint for chatbot interactions.

Request body:
```json
{
  "input": "string",
  "state": "string",
  "context": {
    "location": "string",
    "name": "string",
    "phone": "string",
    "date": "string",
    "time_slot": "string",
    "pax": "string"
  }
}
```

Response:
```json
{
  "prompt": "string",
  "state": "string",
  "error": "string"
}
```

## State Machine Flow

1. START → User selects city (Delhi/Bangalore)
2. VERIFY_LOCATION → Confirm selected city
3. COLLECT_NAME → Get user's name
4. COLLECT_PHONE → Get user's phone number
5. CONFIRM_PHONE → Verify phone number
6. DISCOVER → Main menu with options:
   - Menu and pricing
   - Current offers
   - Restaurant timings
   - Location details
   - New booking
   - Modify booking
   - Cancel booking
7. Various states for handling each option

## Development

The API is structured into several modules:

- `app.py`: Main FastAPI application
- `config/`:
  - `state_machine.py`: Conversation flow and state management
  - `menu.py`: Restaurant menu configuration
  - `locations.py`: Restaurant location details

## Testing

You can test the API using the interactive Swagger documentation at `http://localhost:8000/docs`

Example curl command:
```bash
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"input": "Delhi", "state": "START", "context": {}}'
``` 