import axios from 'axios';
import { ChatMessage } from '../types';

export class RetellClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.retellai.com/playground-completion';
  }

  public async getCompletion(
    messages: ChatMessage[],
    sessionId: string
  ): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          sessionId,
          model: 'gpt-3.5-turbo' // Can be configured based on needs
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Failed to get completion from Retell:', error);
      throw error;
    }
  }

  public async analyzeCall(
    transcript: string
  ): Promise<{
    summary: string;
    outcome: string;
    nextSteps?: string;
  }> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/analyze`,
        {
          transcript,
          analysisType: 'comprehensive'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        summary: response.data.summary,
        outcome: response.data.outcome,
        nextSteps: response.data.nextSteps
      };
    } catch (error) {
      console.error('Failed to analyze call:', error);
      throw error;
    }
  }
} 