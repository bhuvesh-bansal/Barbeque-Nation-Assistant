import { ChatState, ConversationLog } from '../types';
import { StateMachine } from '../lib/stateMachine';
import { google } from 'googleapis';
import { GoogleSheetsLogger } from '../lib/googleSheets';

export class ChatService {
  private stateMachine: StateMachine;
  private sheetsLogger: GoogleSheetsLogger | null = null;
  
  constructor() {
    this.stateMachine = new StateMachine();
    this.initializeGoogleSheets();
    
    // Handle window beforeunload event to log conversations when window is closed
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.logConversationOnClose();
      });
    }
  }
  
  private async initializeGoogleSheets(): Promise<void> {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
      const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
      
      if (!credentials || !spreadsheetId) {
        console.warn('Google Sheets credentials or spreadsheet ID not configured');
        return;
      }
      
      this.sheetsLogger = new GoogleSheetsLogger(credentials, spreadsheetId);
      await this.sheetsLogger.initializeSheet();
      console.log('Google Sheets logger initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Google Sheets logger:', error);
      this.sheetsLogger = null;
    }
  }
  
  public async processMessage(userInput: string): Promise<string> {
    // Process the message through the state machine
    return this.stateMachine.processInput(userInput);
  }
  
  public getCurrentState(): ChatState {
    return this.stateMachine.getState();
  }
  
  public reset(): void {
    // Log the conversation before resetting
    this.logConversation();
    this.stateMachine.reset();
  }
  
  // This method will be called when the conversation is over
  public async endConversation(): Promise<void> {
    await this.logConversation();
    this.reset();
  }
  
  // This method logs the conversation when the window is closed
  private logConversationOnClose(): void {
    const state = this.stateMachine.getState();
    
    // Only log if there was an actual conversation (more than just the initial message)
    if (state.messages.length > 1) {
      // Use a synchronous approach for beforeunload
      const log = this.createConversationLog();
      
      // Store temporarily in localStorage for retry on next visit
      try {
        const failedLogs = JSON.parse(localStorage.getItem('pendingLogs') || '[]');
        failedLogs.push({
          log,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingLogs', JSON.stringify(failedLogs));
      } catch (e) {
        console.error('Failed to store pending log:', e);
      }
      
      // Attempt to use the sendBeacon API if available
      if (navigator.sendBeacon) {
        const data = new FormData();
        data.append('log', JSON.stringify(log));
        navigator.sendBeacon('/api/log-conversation', data);
      }
    }
  }
  
  // Check and process any pending logs from previous sessions
  public async processPendingLogs(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const pendingLogsJSON = localStorage.getItem('pendingLogs');
      if (!pendingLogsJSON) return;
      
      const pendingLogs = JSON.parse(pendingLogsJSON);
      if (pendingLogs.length === 0) return;
      
      let successCount = 0;
      const remaining = [];
      
      for (const item of pendingLogs) {
        try {
          await this.logConversationToSheet(item.log);
          successCount++;
        } catch (e) {
          remaining.push(item);
        }
      }
      
      if (remaining.length > 0) {
        localStorage.setItem('pendingLogs', JSON.stringify(remaining));
      } else {
        localStorage.removeItem('pendingLogs');
      }
      
      console.log(`Processed ${successCount} pending logs, ${remaining.length} remaining`);
    } catch (e) {
      console.error('Error processing pending logs:', e);
    }
  }
  
  public async logConversation(phoneNumber?: string): Promise<boolean> {
    const log = this.createConversationLog(phoneNumber);
    return this.logConversationToSheet(log);
  }
  
  private createConversationLog(phoneNumber?: string): ConversationLog {
    const state = this.stateMachine.getState();
    
    // Generate conversation summary
    const summary = this.generateConversationSummary(state);
    
    // Map the chat state to the conversation log
    return {
      modality: 'Chatbot',
      callTime: new Date().toISOString(),
      phoneNumber: phoneNumber || state.phoneNumber || 'NA',
      callOutcome: this.determineCallOutcome(state),
      roomName: state.location || 'NA',
      bookingDate: state.dateTime || 'NA',
      bookingTime: state.dateTime ? '12:00' : 'NA', // Default time if not specified
      numberOfGuests: state.paxSize || 0,
      customerName: state.name || 'NA',
      callSummary: summary
    };
  }
  
  private async logConversationToSheet(log: ConversationLog): Promise<boolean> {
    try {
      if (!this.sheetsLogger) {
        console.warn('Google Sheets logger not initialized');
        return false;
      }
      
      await this.sheetsLogger.logConversation(log);
      return true;
    } catch (error) {
      console.error('Failed to log conversation:', error);
      return false;
    }
  }
  
  private determineCallOutcome(state: ChatState): 'ENQUIRY' | 'ROOM_AVAILABILITY' | 'POST_BOOKING' | 'MISC' {
    if (state.enquiryType === '1' || state.enquiryType === '2' || state.enquiryType === '3' || state.enquiryType === '4') {
      return 'ENQUIRY';
    }
    
    if (state.actionType === 'new') {
      return 'ROOM_AVAILABILITY';
    }
    
    if (state.actionType === 'modify' || state.actionType === 'cancel') {
      return 'POST_BOOKING';
    }
    
    return 'MISC';
  }
  
  private generateConversationSummary(state: ChatState): string {
    const messages = state.messages || [];
    
    if (messages.length === 0) {
      return 'No conversation to summarize.';
    }
    
    // Get last few messages for context
    const recentMessages = messages.slice(-5);
    
    // Build summary based on conversation state
    let summary = '';
    
    if (state.location) {
      summary += `The user was interested in the ${state.location} location. `;
    }
    
    if (state.dateTime) {
      summary += `They were looking for a booking on ${state.dateTime}. `;
    }
    
    if (state.paxSize) {
      summary += `For a party of ${state.paxSize} people. `;
    }
    
    if (state.actionType) {
      switch (state.actionType) {
        case 'new':
          summary += 'They wanted to make a new booking. ';
          break;
        case 'modify':
          summary += 'They wanted to modify an existing booking. ';
          break;
        case 'cancel':
          summary += 'They wanted to cancel an existing booking. ';
          break;
      }
    }
    
    if (state.bookingRef) {
      summary += `Reference: ${state.bookingRef}. `;
    }
    
    // Add outcome
    if (state.currentState === 'BOOKING_CONFIRMED') {
      summary += 'The booking was successfully confirmed.';
    } else if (state.currentState === 'BOOKING_FAILED') {
      summary += 'The booking attempt failed.';
    } else {
      summary += `The conversation ended in the ${state.currentState} state.`;
    }
    
    return summary;
  }
}

// Export a singleton instance
export const chatService = new ChatService(); 