import { ChatState } from '../types';

export interface StateConfig {
  prompt: string;
  transitions: {
    [key: string]: string;
  };
  validation?: (input: string) => boolean;
  action?: (state: ChatState, input: string) => Promise<void>;
}

export const states: { [key: string]: StateConfig } = {
  START: {
    prompt: "Welcome to Barbeque Nation! Which city would you like to dine in - Delhi or Bangalore?",
    transitions: {
      '*': 'VERIFY_LOCATION'
    },
    validation: (input: string) => {
      const lowercaseInput = input.toLowerCase();
      return lowercaseInput.includes('delhi') || lowercaseInput.includes('bangalore');
    }
  },
  
  VERIFY_LOCATION: {
    prompt: "You're looking for a restaurant in {location}, correct?",
    transitions: {
      'yes': 'COLLECT_NAME',
      'no': 'START',
      '*': 'START'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  COLLECT_NAME: {
    prompt: "Please share your name.",
    transitions: {
      'SKIP': 'COLLECT_PHONE',
      'NO': 'COLLECT_PHONE',
      '*': 'COLLECT_PHONE'
    }
  },
  
  COLLECT_PHONE: {
    prompt: "Please provide your 10-digit phone number.",
    transitions: {
      '*': 'CONFIRM_DETAILS'
    },
    validation: (input: string) => /^\d{10}$/.test(input.replace(/\D/g, ''))
  },
  
  CONFIRM_DETAILS: {
    prompt: "{name}, your phone number is '{phone}'. Is this correct?",
    transitions: {
      'yes': 'DISCOVER',
      'no': 'COLLECT_NAME',
      '*': 'COLLECT_NAME'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  DISCOVER: {
    prompt: "How may I assist you today?\n1. Menu and pricing information\n2. Current offers and promotions\n3. Restaurant timings\n4. Location and directions\n5. Make a new booking\n6. Modify existing booking\n7. Cancel booking",
    transitions: {
      '1': 'PROVIDE_INFO',
      '2': 'PROVIDE_INFO',
      '3': 'PROVIDE_INFO',
      '4': 'PROVIDE_INFO',
      '5': 'COLLECT_DATE_TIME',
      '6': 'COLLECT_BOOKING_REF',
      '7': 'COLLECT_BOOKING_REF',
      '*': 'DISCOVER'
    },
    validation: (input: string) => ['1', '2', '3', '4', '5', '6', '7'].includes(input)
  },
  
  COLLECT_DATE_TIME: {
    prompt: "What's your preferred date and time for dining?",
    transitions: {
      '*': 'COLLECT_PAX_SIZE'
    }
  },
  
  COLLECT_PAX_SIZE: {
    prompt: "How many guests will be dining?",
    transitions: {
      '*': 'CONFIRM_BOOKING'
    },
    validation: (input: string) => !isNaN(Number(input)) && Number(input) > 0
  },
  
  CONFIRM_BOOKING: {
    prompt: "Booking details: {paxSize} guests on {dateTime} at {location}. Would you like to confirm?",
    transitions: {
      'YES': 'BOOKING_CONFIRMED',
      'NO': 'COLLECT_DATE_TIME',
      'MODIFY': 'COLLECT_DATE_TIME'
    },
    validation: (input: string) => ['yes', 'no', 'modify'].includes(input.toLowerCase())
  },
  
  BOOKING_CONFIRMED: {
    prompt: "Your booking is confirmed! Reference number: {bookingRef}. Would you like to know about our current offers or menu?",
    transitions: {
      'yes': 'PROVIDE_INFO',
      'no': 'END',
      '*': 'END'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  COLLECT_BOOKING_REF: {
    prompt: "Please provide your booking reference number.",
    transitions: {
      '*': 'VERIFY_BOOKING'
    },
    validation: (input: string) => /^BN\d{6}$/.test(input)
  },
  
  VERIFY_BOOKING: {
    prompt: "Would you like to modify or cancel your booking?",
    transitions: {
      'modify': 'COLLECT_NEW_DATE_TIME',
      'cancel': 'CONFIRM_CANCELLATION',
      '*': 'DISCOVER'
    },
    validation: (input: string) => ['modify', 'cancel'].includes(input.toLowerCase())
  },
  
  COLLECT_NEW_DATE_TIME: {
    prompt: "What's your preferred new date and time?",
    transitions: {
      '*': 'CONFIRM_MODIFICATION'
    }
  },
  
  CONFIRM_MODIFICATION: {
    prompt: "New booking time: {newDateTime}. Would you like to confirm this change?",
    transitions: {
      'yes': 'MODIFICATION_CONFIRMED',
      'no': 'COLLECT_NEW_DATE_TIME',
      '*': 'COLLECT_NEW_DATE_TIME'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  CONFIRM_CANCELLATION: {
    prompt: "Would you like to proceed with canceling your booking?",
    transitions: {
      'yes': 'CANCELLATION_CONFIRMED',
      'no': 'DISCOVER',
      '*': 'DISCOVER'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  PROVIDE_INFO: {
    prompt: "{enquiryResponse}",
    transitions: {
      '*': 'ASK_MORE_HELP'
    }
  },
  
  ASK_MORE_HELP: {
    prompt: "Would you like help with anything else?",
    transitions: {
      'yes': 'DISCOVER',
      'no': 'END',
      '*': 'END'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  
  END: {
    prompt: "Thank you for choosing Barbeque Nation. Have a great day!",
    transitions: {
      '*': 'START'
    }
  }
}; 