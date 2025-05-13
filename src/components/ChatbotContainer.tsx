import React, { useEffect, useState } from 'react';
import { chatService } from '../services/chatService';
import { postCallAnalysisService } from '../services/postCallAnalysis';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatbotContainer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [hasAskedFollowUp, setHasAskedFollowUp] = useState(false);
  
  // Initialize chatbot
  useEffect(() => {
    const initChat = async () => {
      const state = chatService.getCurrentState();
      
      // Add the first bot message if we're starting fresh
      if (state.messages.length > 0) {
        setMessages([{
          role: 'assistant',
          content: state.messages[0].content
        }]);
      }
      
      // Setup beforeunload event to log the conversation when the window closes
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Process any pending logs from previous sessions
      try {
        await chatService.processPendingLogs();
      } catch (e) {
        console.error('Error processing pending logs:', e);
      }
    };
    
    initChat();
    
    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // Handle window close event
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    // Log the conversation asynchronously
    const state = chatService.getCurrentState();
    
    // Only log if there's been a meaningful conversation
    if (state.messages.length > 1) {
      postCallAnalysisService.logConversation(state);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Process the message
      const response = await chatService.processMessage(userMessage);
      
      // Add bot response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      // If we previously asked for a follow-up and the user responded, consider it handled
      if (hasAskedFollowUp) {
        setHasAskedFollowUp(false);
        
        // If the user's response to "anything else?" was affirmative, don't ask again
        const positiveResponses = ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay'];
        const isPositive = positiveResponses.some(word => 
          userMessage.toLowerCase().includes(word)
        );
        
        // If the response was negative, show end confirmation
        const negativeResponses = ['no', 'nope', 'done', 'finish', 'end', 'that\'s all', 'nothing'];
        const isNegative = negativeResponses.some(word => 
          userMessage.toLowerCase().includes(word)
        );
        
        if (isNegative) {
          // Wait a moment to show the final response before showing end confirmation
          setTimeout(() => setShowEndConfirmation(true), 1000);
        }
      } else {
        // After processing any message, check if we should ask if there's anything else
        // Don't ask immediately after starting, only after a meaningful conversation
        if (messages.length >= 3 && !showEndConfirmation) {
          askForFollowUp();
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ask if there's anything else the user wants to know
  const askForFollowUp = async () => {
    setIsLoading(true);
    
    // Wait a moment to make it feel more natural
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Is there anything else you would like to know about Barbeque Nation?' 
      }]);
      setHasAskedFollowUp(true);
      setIsLoading(false);
    }, 1000);
  };
  
  // Show confirmation before ending chat
  const handleEndClick = () => {
    setShowEndConfirmation(true);
  };
  
  // Cancel end chat
  const handleCancelEnd = () => {
    setShowEndConfirmation(false);
  };
  
  // End the conversation and log it
  const handleEndConversation = async () => {
    setIsLoading(true);
    setShowEndConfirmation(false);
    
    try {
      // Add a farewell message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Thank you for chatting with Barbeque Nation assistant. Have a great day!' 
      }]);
      
      await chatService.endConversation();
      
      // Wait a bit to show the farewell message before resetting
      setTimeout(() => {
        // Reset messages to show just the initial greeting
        const state = chatService.getCurrentState();
        if (state.messages.length > 0) {
          setMessages([{
            role: 'assistant',
            content: state.messages[0].content
          }]);
        }
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error('Error ending conversation:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Barbeque Nation Assistant</h3>
        <button 
          onClick={handleEndClick}
          disabled={isLoading || messages.length <= 1}
          className="end-btn"
        >
          End Chat
        </button>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="message assistant loading">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading || showEndConfirmation}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim() || showEndConfirmation}>
          Send
        </button>
      </form>
      
      {showEndConfirmation && (
        <div className="end-confirmation">
          <p>Are you sure you want to end this chat?</p>
          <div className="end-buttons">
            <button onClick={handleCancelEnd} className="cancel-btn">
              No, Continue
            </button>
            <button onClick={handleEndConversation} className="confirm-btn">
              Yes, End Chat
            </button>
          </div>
        </div>
      )}
      
      <style>
        {`
        .chatbot-container {
          display: flex;
          flex-direction: column;
          height: 500px;
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: relative;
        }
        
        .chatbot-header {
          padding: 10px 15px;
          background-color: #f8f8f8;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .chatbot-header h3 {
          margin: 0;
          color: #333;
        }
        
        .end-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .end-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .message {
          max-width: 80%;
          padding: 10px 15px;
          border-radius: 18px;
          word-break: break-word;
        }
        
        .message.user {
          align-self: flex-end;
          background-color: #007bff;
          color: white;
          border-bottom-right-radius: 0;
        }
        
        .message.assistant {
          align-self: flex-start;
          background-color: #f1f0f0;
          color: #333;
          border-bottom-left-radius: 0;
        }
        
        .message.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 15px;
        }
        
        .dot {
          width: 8px;
          height: 8px;
          background-color: #888;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .dot:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .dot:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .input-form {
          display: flex;
          padding: 10px;
          border-top: 1px solid #eee;
        }
        
        .input-form input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          margin-right: 10px;
          outline: none;
        }
        
        .input-form button {
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          cursor: pointer;
        }
        
        .input-form button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        
        .end-confirmation {
          position: absolute;
          bottom: 70px;
          left: 0;
          right: 0;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 15px;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          border-top: 1px solid #eee;
        }
        
        .end-confirmation p {
          margin: 0 0 10px;
          font-weight: 500;
        }
        
        .end-buttons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        
        .cancel-btn {
          background-color: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .confirm-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
        `}
      </style>
    </div>
  );
};

export default ChatbotContainer;