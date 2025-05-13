import { locations } from './locations';

export interface StateConfig {
  prompt: string;
  transitions: {
    [key: string]: string;
  };
  validation?: (input: string) => boolean;
}

export const states: { [key: string]: StateConfig } = {
  START: {
    prompt: "Hi! I'm your Barbeque Nation Assistant. Which city would you like to explore our restaurants in?",
    transitions: {
      '*': 'VERIFY_LOCATION'
    }
  },
  VERIFY_LOCATION: {
    prompt: "Great! Let me check the availability in {location}.",
    transitions: {
      'AVAILABLE': 'COLLECT_NAME',
      'NOT_AVAILABLE': 'START'
    }
  },
  COLLECT_NAME: {
    prompt: "I'd be happy to help you with information about our {location} outlet. Could you please share your name?",
    transitions: {
      '*': 'COLLECT_PHONE'
    }
  },
  COLLECT_PHONE: {
    prompt: "Thank you, {name}! Could you please share your phone number?",
    transitions: {
      '*': 'CONFIRM_DETAILS'
    },
    validation: (input: string) => /^\d{10}$/.test(input)
  },
  CONFIRM_DETAILS: {
    prompt: "Perfect! Just to confirm - your name is {name} and phone number is {phone}. Is this correct? (Yes/No)",
    transitions: {
      'YES': 'DISCOVER',
      'NO': 'COLLECT_NAME'
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
      '5': 'COLLECT_DATE',
      '6': 'COLLECT_BOOKING_REF',
      '7': 'COLLECT_BOOKING_REF',
      '*': 'DISCOVER'
    },
    validation: (input: string) => ['1', '2', '3', '4', '5', '6', '7'].includes(input)
  },
  PROVIDE_INFO: {
    prompt: "{enquiry_response}",
    transitions: {
      '*': 'ASK_MORE_HELP'
    }
  },
  ASK_MORE_HELP: {
    prompt: "Is there anything else you would like to know? (Yes/No)",
    transitions: {
      'YES': 'DISCOVER',
      'NO': 'END'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  COLLECT_DATE: {
    prompt: "Please let me know your preferred date and time for dining (e.g., 25th May, 7:30 PM).",
    transitions: {
      '*': 'COLLECT_PAX'
    }
  },
  COLLECT_PAX: {
    prompt: "How many guests will be dining?",
    transitions: {
      '*': 'CONFIRM_BOOKING'
    },
    validation: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0
  },
  CONFIRM_BOOKING: {
    prompt: "I've found a table for {pax_size} guests on {date_time} at our {location} outlet. Would you like me to proceed with the booking? (Yes/No)",
    transitions: {
      'YES': 'BOOKING_CONFIRMED',
      'NO': 'ASK_MORE_HELP'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  BOOKING_CONFIRMED: {
    prompt: "Great! Your booking is confirmed. Your booking reference is {booking_ref}. We look forward to serving you!",
    transitions: {
      '*': 'ASK_MORE_HELP'
    }
  },
  COLLECT_BOOKING_REF: {
    prompt: "Please provide your booking reference number.",
    transitions: {
      '*': 'VERIFY_BOOKING'
    }
  },
  VERIFY_BOOKING: {
    prompt: "I've found your booking. What would you like to do?\n1. Modify date/time\n2. Change number of guests\n3. Cancel booking",
    transitions: {
      '1': 'COLLECT_NEW_DATE',
      '2': 'COLLECT_NEW_PAX',
      '3': 'CONFIRM_CANCELLATION',
      '*': 'VERIFY_BOOKING'
    },
    validation: (input: string) => ['1', '2', '3'].includes(input)
  },
  COLLECT_NEW_DATE: {
    prompt: "Please provide your preferred new date and time.",
    transitions: {
      '*': 'CONFIRM_MODIFICATION'
    }
  },
  COLLECT_NEW_PAX: {
    prompt: "Please provide the new number of guests.",
    transitions: {
      '*': 'CONFIRM_MODIFICATION'
    },
    validation: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0
  },
  CONFIRM_MODIFICATION: {
    prompt: "I can modify your booking to {new_date_time}{new_pax_size}. Would you like to proceed? (Yes/No)",
    transitions: {
      'YES': 'MODIFICATION_CONFIRMED',
      'NO': 'ASK_MORE_HELP'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  MODIFICATION_CONFIRMED: {
    prompt: "Your booking has been successfully modified. Your updated booking reference is {booking_ref}.",
    transitions: {
      '*': 'ASK_MORE_HELP'
    }
  },
  CONFIRM_CANCELLATION: {
    prompt: "Are you sure you want to cancel your booking for {date_time}? (Yes/No)",
    transitions: {
      'YES': 'CANCELLATION_CONFIRMED',
      'NO': 'ASK_MORE_HELP'
    },
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  CANCELLATION_CONFIRMED: {
    prompt: "Your booking has been cancelled. We hope to serve you again soon!",
    transitions: {
      '*': 'ASK_MORE_HELP'
    }
  },
  END: {
    prompt: "Thank you for choosing Barbeque Nation! Have a great day!",
    transitions: {
      '*': 'START'
    }
  }
}; 