import OpenAI from 'openai';

interface AnalysisContext {
  currentState: string;
  location?: string;
  previousIntent?: string;
  customerPreferences: string[];
}

interface AnalysisResponse {
  confidence: number;
  entities: {
    city?: string;
    name?: string;
    phone?: string;
    datetime?: string;
    pax?: string;
    suggestedState?: string;
    [key: string]: any;
  };
  suggestedResponse?: string;
}

class AIService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async analyzeQuery(params: { query: string; context: AnalysisContext }): Promise<AnalysisResponse> {
    try {
      const systemPrompt = `You are an AI assistant for a restaurant booking system. 
Current state: ${params.context.currentState}
Location: ${params.context.location || 'not set'}
Previous intent: ${params.context.previousIntent || 'none'}
Customer preferences: ${params.context.customerPreferences.join(', ') || 'none'}

Analyze the user's query and extract relevant information. Return a JSON response with:
- confidence (0-1)
- entities (city, name, phone, datetime, pax, suggestedState)
- suggestedResponse (natural language response)

Focus on understanding booking-related queries, menu inquiries, and location-based questions.`;

      const response = await this.client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: params.query }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');

      return {
        confidence: result.confidence || 0,
        entities: result.entities || {},
        suggestedResponse: result.suggestedResponse
      };
    } catch (error) {
      console.error('Error analyzing query:', error);
      return {
        confidence: 0,
        entities: {},
      };
    }
  }
}

export const aiService = new AIService(); 