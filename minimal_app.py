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

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Simple echo for testing
        print(f"Received request: {request}")
        
        # If the user is asking for the menu (state DISCOVER, input 1)
        if request.state == 'DISCOVER' and request.input == '1':
            menu_response = data_service.get_menu_info()
            return ChatResponse(
                prompt=menu_response,
                state="ASK_MORE_HELP"
            )
        
        # Simple echo for all other cases
        return ChatResponse(
            prompt=f"You said: {request.input}, your state is {request.state}",
            state=request.state
        )
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000) 