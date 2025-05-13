import { ChatState, PostCallAnalysis, ConversationLog } from '../types';
import { GoogleSheetsLogger } from '../lib/googleSheets';
import axios from 'axios';

// Constants for call outcome types
export const CALL_OUTCOMES = {
  ENQUIRY: 'ENQUIRY',
  ROOM_AVAILABILITY: 'ROOM_AVAILABILITY',
  POST_BOOKING: 'POST_BOOKING',
  MISC: 'MISC'
} as const;

export class PostCallAnalysisService {
  private sheetsLogger: GoogleSheetsLogger | null = null;
  
  constructor() {
    this.initializeGoogleSheets();
  }
  
  private async initializeGoogleSheets(): Promise<void> {
    try {
      if (typeof process === 'undefined' || !process.env) {
        console.warn('Environment variables not available');
        return;
      }
      
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
  
  /**
   * Analyze a completed conversation and create a structured analysis object
   * @param state The final conversation state
   * @returns A structured analysis of the conversation
   */
  public analyzeConversation(state: ChatState): PostCallAnalysis {
    const messages = state.messages || [];
    const startTime = messages.length > 0 ? messages[0].timestamp : Date.now();
    const endTime = messages.length > 0 ? messages[messages.length - 1].timestamp : Date.now();
    const duration = endTime - startTime;
    
    // Map states to durations
    const stateTransitions: Record<string, { count: number, firstSeen: number, lastSeen: number }> = {};
    let previousState = '';
    
    messages.forEach(msg => {
      if (msg.state) {
        if (!stateTransitions[msg.state]) {
          stateTransitions[msg.state] = { 
            count: 0, 
            firstSeen: msg.timestamp,
            lastSeen: msg.timestamp
          };
        }
        
        stateTransitions[msg.state].count++;
        stateTransitions[msg.state].lastSeen = msg.timestamp;
        
        // If this is a new state, record a transition
        if (previousState !== msg.state && previousState) {
          // Could track transitions between specific states here
        }
        
        previousState = msg.state;
      }
    });
    
    // Extract questions asked by the user
    const questionsAsked = messages
      .filter(msg => msg.role === 'user' && 
        (msg.content.endsWith('?') || this.isLikelyQuestion(msg.content)))
      .map(msg => msg.content);
    
    // Determine outcome type and success
    const outcome = this.determineOutcome(state);
    
    // Calculate state durations
    const stateAnalysis = Object.entries(stateTransitions).map(([name, data]) => ({
      name,
      duration: data.lastSeen - data.firstSeen,
      transitions: data.count
    }));
    
    return {
      conversationId: state.id || `convo-${Date.now()}`,
      duration,
      location: state.location || '',
      customerName: state.name,
      phoneNumber: state.phoneNumber,
      bookingRef: state.bookingRef,
      dateTime: state.dateTime,
      paxSize: state.paxSize,
      actionType: state.actionType,
      states: stateAnalysis,
      outcome,
      questionsAsked
    };
  }
  
  /**
   * Create a conversation log entry for Google Sheets
   * @param state The final conversation state
   * @returns A structured log entry
   */
  public createConversationLog(state: ChatState): ConversationLog {
    const analysis = this.analyzeConversation(state);
    const summary = this.generateSummary(state, analysis);
    
    return {
      modality: 'Chatbot',
      callTime: new Date().toISOString(),
      phoneNumber: state.phoneNumber || '',
      callOutcome: this.mapOutcomeType(analysis.outcome.type),
      roomName: state.location || '',
      bookingDate: state.dateTime || '',
      bookingTime: state.dateTime ? this.extractTimeFromDateTime(state.dateTime) : '',
      numberOfGuests: state.paxSize || 0,
      customerName: state.name || '',
      callSummary: summary
    };
  }
  
  /**
   * Log a conversation to Google Sheets
   * @param state The conversation state to log
   * @returns Success status
   */
  public async logConversation(state: ChatState): Promise<boolean> {
    try {
      // Server-side logging using the logger
      if (this.sheetsLogger) {
        const log = this.createConversationLog(state);
        await this.sheetsLogger.logConversation(log);
        return true;
      } 
      // Client-side logging using the API
      else if (typeof window !== 'undefined') {
        const log = this.createConversationLog(state);
        const response = await axios.post('/api/log-conversation', log);
        return response.status === 200;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to log conversation:', error);
      return false;
    }
  }
  
  /**
   * Generate a human-readable summary of the conversation
   */
  private generateSummary(state: ChatState, analysis: PostCallAnalysis): string {
    let summary = '';
    
    // Location info
    if (state.location) {
      summary += `The user was interested in the ${state.location} location. `;
    }
    
    // Booking details
    if (state.dateTime) {
      summary += `They were looking for a booking on ${state.dateTime}. `;
    }
    
    if (state.paxSize) {
      summary += `For a party of ${state.paxSize} people. `;
    }
    
    // Action type
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
    
    // Booking reference
    if (state.bookingRef) {
      summary += `Reference: ${state.bookingRef}. `;
    }
    
    // Outcome
    if (analysis.outcome.success) {
      summary += 'The conversation was successfully completed. ';
    } else {
      summary += 'The conversation did not reach a successful conclusion. ';
    }
    
    // Additional details from outcome
    if (analysis.outcome.details) {
      summary += analysis.outcome.details;
    }
    
    return summary.trim();
  }
  
  /**
   * Determine if text is likely a question even without question mark
   */
  private isLikelyQuestion(text: string): boolean {
    const lowerText = text.toLowerCase();
    const questionStarters = [
      'what', 'when', 'where', 'why', 'how', 'who', 'which',
      'can', 'could', 'would', 'will', 'do', 'does', 'is', 'are'
    ];
    
    return questionStarters.some(starter => 
      lowerText.startsWith(starter + ' ') || lowerText.startsWith(starter + "'")
    );
  }
  
  /**
   * Determine the outcome type and success of the conversation
   */
  private determineOutcome(state: ChatState): {
    type: string;
    success: boolean;
    details?: string;
  } {
    let type = 'general';
    let success = false;
    let details = '';
    
    // Determine type based on the action
    if (state.actionType === 'new') {
      type = 'booking';
      success = state.currentState === 'BOOKING_CONFIRMED';
      details = success 
        ? `Booking confirmed for ${state.dateTime || 'requested date'}`
        : 'Booking attempt was not completed';
    } 
    else if (state.actionType === 'modify') {
      type = 'modification';
      success = state.currentState === 'BOOKING_UPDATED';
      details = success
        ? `Booking ${state.bookingRef || ''} was successfully modified`
        : 'Booking modification was not completed';
    }
    else if (state.actionType === 'cancel') {
      type = 'cancellation';
      success = state.currentState === 'BOOKING_CANCELLED';
      details = success
        ? `Booking ${state.bookingRef || ''} was successfully cancelled`
        : 'Booking cancellation was not completed';
    }
    else if (state.enquiryType) {
      type = 'enquiry';
      success = state.currentState === 'ENQUIRY_COMPLETED';
      
      // Details based on enquiry type
      if (state.enquiryType === '1') {
        details = 'User enquired about menu and pricing';
      } else if (state.enquiryType === '2') {
        details = 'User enquired about offers and promotions';
      } else if (state.enquiryType === '3') {
        details = 'User enquired about restaurant timings';
      } else if (state.enquiryType === '4') {
        details = 'User enquired about location and directions';
      }
    }
    else {
      type = 'general';
      // Consider success if they got past the initial state
      success = state.currentState !== 'START';
      details = 'General conversation without specific action';
    }
    
    return { type, success, details };
  }
  
  /**
   * Map internal outcome type to the required format for logs
   */
  private mapOutcomeType(type: string): 'ENQUIRY' | 'ROOM_AVAILABILITY' | 'POST_BOOKING' | 'MISC' {
    switch (type) {
      case 'booking':
        return 'ROOM_AVAILABILITY';
      case 'enquiry':
        return 'ENQUIRY';
      case 'modification':
      case 'cancellation':
        return 'POST_BOOKING';
      default:
        return 'MISC';
    }
  }
  
  /**
   * Extract time from a date-time string
   */
  private extractTimeFromDateTime(dateTime: string): string {
    // Check if there's a time component (contains :)
    if (dateTime.includes(':')) {
      const timeMatch = dateTime.match(/(\d{1,2}:\d{2})/);
      if (timeMatch) return timeMatch[1];
    }
    
    // Default time if not found
    return '12:00';
  }
}

// Export a singleton instance
export const postCallAnalysisService = new PostCallAnalysisService(); 