// State Machine Types
export interface ChatState {
  currentState: string;
  location?: string;
  name?: string;
  phoneNumber?: string;
  dateTime?: string;
  newDateTime?: string;
  paxSize?: number;
  bookingRef?: string;
  actionType?: 'MODIFY' | 'CANCEL';
  enquiryType?: string;
  history: {
    state: string;
    input: string;
    timestamp: number;
  }[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface PostCallAnalysis {
  outcome: string;
  call_time: number;
  call_status: string;
  call_transcript: string;
  location: string;
  name?: string;
  phone_number?: string;
  booking_ref?: string;
  date_time?: string;
  pax_size?: number;
  action_type?: string;
  metadata: Record<string, any>;
  questions_asked: string[];
}

export interface KnowledgeBaseEntry {
  question: string;
  answer: string;
  category: string;
  metadata: {
    lastUpdated: string;
    source: string;
  };
}

// Booking Types
export type Booking = {
  id: string;
  customerName: string;
  phoneNumber: string;
  numberOfGuests: number;
  date: string;
  time: string;
  location: string;
  occasion?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
};

// Knowledge Base Types
export type Restaurant = {
  id: string;
  name: string;
  city: string;
  address: string;
  timings: {
    open: string;
    close: string;
    days: string[];
  };
  capacity: number;
  menu: {
    veg: MenuItem[];
    nonVeg: MenuItem[];
  };
  pricing: {
    weekday: number;
    weekend: number;
  };
};

export type MenuItem = {
  name: string;
  description: string;
  category: string;
  isSpicy?: boolean;
};

// Conversation Log Types
export type ConversationLog = {
  modality: 'Call' | 'Chatbot';
  callTime: string;
  phoneNumber?: string;
  callOutcome: 'ENQUIRY' | 'ROOM_AVAILABILITY' | 'POST_BOOKING' | 'MISC';
  roomName?: string;
  bookingDate?: string;
  bookingTime?: string;
  numberOfGuests?: number;
  customerName?: string;
  callSummary: string;
}; 