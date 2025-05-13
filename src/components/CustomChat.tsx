import React, { useState, useRef, useEffect } from 'react';
import { StateMachine } from '../lib/stateMachine';
import { Message, ChatState } from '../types';
import { searchFAQs } from '../config/faqs';
import { searchMenu } from '../config/menu';
import { locations } from '../config/locations';

const checkForCityName = (input: string): string | null => {
  const normalizedInput = input.toLowerCase();
  
  // Check for exact matches or partial matches in location names
  for (const [key, location] of Object.entries(locations)) {
    if (
      key.toLowerCase() === normalizedInput ||
      location.name.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(key.toLowerCase())
    ) {
      return key;
    }
  }
  
  return null;
};

export default function CustomChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const stateMachine = useRef<StateMachine>(new StateMachine());

  useEffect(() => {
    // Start the conversation with the initial prompt
    const initialPrompt = stateMachine.current.processInput('START');
    initialPrompt.then((prompt) => {
      addMessage('assistant', prompt);
    });
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  };

  const formatPhoneNumber = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const groups = cleaned.match(/(\d{4})(\d{3})(\d{3})/);
    if (groups) {
      return `${groups[1]}-${groups[2]}-${groups[3]}`;
    }
    return phone;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && /^\d+$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();
    setInput('');
    setIsLoading(true);
    addMessage('user', userInput);

    try {
      const response = await stateMachine.current.processInput(userInput);
      addMessage('assistant', response);
    } catch (error) {
      console.error('Error processing input:', error);
      addMessage('assistant', 'I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-blue-100 text-blue-900'
                  : 'bg-green-100 text-green-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
} 