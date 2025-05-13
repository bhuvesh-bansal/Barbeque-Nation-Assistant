// State Machine Types
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface BBQLocation {
  name: string;
  address: string;
  timings: {
    [day: string]: {
      lunch: {
        opening: string;
        closing: string;
        lastEntry: string;
      };
      dinner: {
        opening: string;
        closing: string;
        lastEntry: string;
      };
    };
  };
  amenities: string[];
  pdr: boolean;
  offers: {
    complimentaryDrinks?: string;
    foodFestival?: string;
    earlyBird?: string;
    buffetOffer?: string;
    armyOffer?: string;
    drinksOffer?: string;
  };
  specialOffers?: {
    earlyBird?: string;
    kittyParty?: string;
    student?: string;
  };
  nearestOutlets: Array<{
    name: string;
    distance: string;
    address: string;
  }>;
  contactNumbers: string[];
  specialNotes?: string[];
}

export type ActionType = 'new' | 'modify' | 'cancel';

export type ChatStateType = 
  | 'START'
  | 'VERIFY_LOCATION'
  | 'COLLECT_NAME'
  | 'COLLECT_PHONE'
  | 'CONFIRM_DETAILS'
  | 'DISCOVER'
  | 'COLLECT_DATE_TIME'
  | 'COLLECT_NEW_DATE_TIME'
  | 'COLLECT_PAX_SIZE'
  | 'CONFIRM_BOOKING'
  | 'BOOKING_CONFIRMED'
  | 'COLLECT_BOOKING_REF'
  | 'VERIFY_BOOKING'
  | 'CONFIRM_MODIFICATION'
  | 'MODIFICATION_CONFIRMED'
  | 'CONFIRM_CANCELLATION'
  | 'CANCELLATION_CONFIRMED'
  | 'PROVIDE_INFO'
  | 'ASK_MORE_HELP'
  | 'END';

export interface ChatState {
  currentState: ChatStateType;
  location?: string;
  name?: string;
  phoneNumber?: string;
  dateTime?: string;
  newDateTime?: string;
  paxSize?: number;
  bookingRef?: string;
  actionType?: ActionType;
  enquiryType?: string;
  messages: Message[];
}

export interface PostCallAnalysis {
  conversationId: string;
  duration: number;
  location: string;
  customerName?: string;
  phoneNumber?: string;
  bookingRef?: string;
  dateTime?: string;
  paxSize?: number;
  actionType?: string;
  states: {
    name: string;
    duration: number;
    transitions: number;
  }[];
  outcome: {
    type: string;
    success: boolean;
    details?: string;
  };
  questionsAsked: string[];
}

// State Management Types
export interface State {
  id: string;
  name: string;
  prompt: string;
  transitions: StateTransition[];
  validation?: (input: string) => boolean;
  action?: (context: ConversationContext) => Promise<void>;
}

export interface StateTransition {
  condition: string;
  nextState: string;
  action?: (context: ConversationContext) => Promise<void>;
}

// Knowledge Base Types
export interface KnowledgeBaseEntry {
  id: string;
  location: string;
  category: 'menu' | 'timing' | 'offers' | 'location' | 'booking' | 'general';
  question: string;
  answer: string;
  tags: string[];
  metadata: {
    lastUpdated: string;
    source: string;
  };
}

// Conversation Types
export interface ConversationContext {
  id: string;
  currentState: string;
  property?: string;
  userInput?: string;
  entities?: Record<string, any>;
  metadata: Record<string, any>;
  history: ConversationTurn[];
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  state: string;
}

// Post-Call Analysis Types
export interface CallAnalysis {
  conversationId: string;
  duration: number;
  states: StateAnalysis[];
  sentiment: SentimentAnalysis;
  outcomes: CallOutcome[];
  metadata: Record<string, any>;
}

export interface StateAnalysis {
  state: string;
  duration: number;
  transitions: number;
  confidence: number;
}

export interface SentimentAnalysis {
  overall: number;
  byState: Record<string, number>;
}

export interface CallOutcome {
  type: string;
  success: boolean;
  metadata: Record<string, any>;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
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

export interface ScoredEntry {
  entry: KnowledgeBaseEntry;
  score: number;
} 