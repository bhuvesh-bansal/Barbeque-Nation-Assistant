import { ChatState, Message, PostCallAnalysis } from '../types';
import { StateMachine } from '../lib/stateMachine';

export class ChatService {
  private messages: Message[];
  private stateMachine: StateMachine;

  constructor() {
    this.messages = [];
    this.stateMachine = new StateMachine();
  }

  private async logToAnalytics(state: ChatState): Promise<void> {
    try {
      const analysis: PostCallAnalysis = {
        outcome: state.currentState,
        call_time: Date.now() - this.messages[0].timestamp,
        call_status: 'completed',
        call_transcript: this.messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        location: state.location || '',
        name: state.name,
        phone_number: state.phoneNumber,
        booking_ref: state.bookingRef,
        date_time: state.dateTime,
        pax_size: state.paxSize,
        action_type: state.actionType,
        metadata: {},
        questions_asked: this.messages
          .filter(m => m.role === 'assistant')
          .map(m => m.content)
      };

      await fetch('/api/log-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(analysis)
      });
    } catch (error) {
      console.error('Failed to log conversation:', error);
    }
  }

  public async processInput(input: string): Promise<string> {
    // Log user input
    this.messages.push({
      role: 'user',
      content: input,
      timestamp: Date.now()
    });

    // Process input through state machine
    const response = await this.stateMachine.processInput(input);
    
    // Log assistant response
    this.messages.push({
      role: 'assistant',
      content: response,
      timestamp: Date.now()
    });

    // If we've reached a final state, log the conversation
    const currentState = this.stateMachine.getCurrentState();
    if (currentState === 'FINAL' || 
        currentState === 'BOOKING_CONFIRMED' || 
        currentState === 'MODIFICATION_CONFIRMED' || 
        currentState === 'CANCELLATION_CONFIRMED') {
      await this.logToAnalytics(this.stateMachine.getState());
    }

    return response;
  }

  public getCurrentState(): string {
    return this.stateMachine.getCurrentState();
  }

  public getMessages(): Message[] {
    return this.messages;
  }

  public reset(): void {
    this.stateMachine.reset();
    this.messages = [];
  }
} 