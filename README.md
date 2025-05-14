# ChatBot

This is an implementation of the ChatBot for building an AI-driven conversational system with knowledge base integration and post-call analysis.

## Features

1. **Knowledge Base API**
   - Add and manage knowledge base entries
   - Semantic search using OpenAI embeddings
   - Context-aware answer generation

2. **Chatbot API**
   - State machine-driven conversation flow
   - AI-powered natural language understanding
   - Dynamic response generation
   - Context preservation

3. **Post-Call Analysis**
   - Conversation state analysis
   - Sentiment analysis
   - Outcome tracking
   - Performance metrics

## Architecture

The system is built using a modular architecture with the following components:

- **State Machine**: Manages conversation flow and transitions
- **Knowledge Base**: Handles information storage and retrieval
- **AI Service**: Provides natural language understanding and generation
- **Post-Call Analysis**: Processes conversation data for insights

## API Endpoints

### Knowledge Base

```
POST /api/knowledge-base/entry
GET /api/knowledge-base/search
```

### Chatbot

```
POST /api/chat/start
POST /api/chat/message
```

### Analysis

```
POST /api/analysis/call
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=3000
   ```

3. Start the server:
   ```bash
   npm start
   ```

## State Flow

The conversation flow is defined in `src/config/states.ts` and includes:

1. Initial greeting and intent detection
2. Property selection and verification
3. Booking flow (date, time, guests)
4. Menu and location inquiries
5. Special offers
6. Confirmation and follow-up

## Development

1. Run in development mode:
   ```bash
   npm run dev
   ```

2. Run tests:
   ```bash
   npm test
   ```

## Post-Call Analysis

The system provides detailed analysis of each conversation:

- Duration tracking
- State transition analysis
- Sentiment scoring
- Outcome tracking
- Performance metrics

## Example Usage

1. Start a conversation:
   ```bash
   curl -X POST http://localhost:3000/api/chat/start \
     -H "Content-Type: application/json" \
     -d '{"property": "sample_property"}'
   ```

2. Send a message:
   ```bash
   curl -X POST http://localhost:3000/api/chat/message \
     -H "Content-Type: application/json" \
     -d '{
       "context": {"id": "123", "currentState": "START", "history": []},
       "input": "I want to make a booking"
     }'
   ```

3. Analyze a conversation:
   ```bash
   curl -X POST http://localhost:3000/api/analysis/call \
     -H "Content-Type: application/json" \
     -d '{"context": {"id": "123", "history": [...]}}'
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT
