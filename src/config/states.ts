import { State } from '../types';

export const states: State[] = [
  {
    id: 'START',
    name: 'Initial State',
    prompt: 'Welcome! How can I assist you today?',
    transitions: [
      {
        condition: 'contains:book',
        nextState: 'COLLECT_PROPERTY'
      },
      {
        condition: 'contains:menu',
        nextState: 'MENU_INQUIRY'
      },
      {
        condition: 'contains:location',
        nextState: 'LOCATION_INQUIRY'
      },
      {
        condition: '*',
        nextState: 'GENERAL_INQUIRY'
      }
    ]
  },
  {
    id: 'COLLECT_PROPERTY',
    name: 'Property Selection',
    prompt: 'Which property would you like to book?',
    transitions: [
      {
        condition: '*',
        nextState: 'VERIFY_PROPERTY'
      }
    ],
    validation: (input: string) => input.length > 0
  },
  {
    id: 'VERIFY_PROPERTY',
    name: 'Property Verification',
    prompt: 'You selected {property}. Is this correct? (yes/no)',
    transitions: [
      {
        condition: 'equals:yes',
        nextState: 'COLLECT_DATE'
      },
      {
        condition: 'equals:no',
        nextState: 'COLLECT_PROPERTY'
      },
      {
        condition: '*',
        nextState: 'VERIFY_PROPERTY'
      }
    ],
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  {
    id: 'COLLECT_DATE',
    name: 'Date Collection',
    prompt: 'What date would you like to book for? (YYYY-MM-DD)',
    transitions: [
      {
        condition: 'regex:\\d{4}-\\d{2}-\\d{2}',
        nextState: 'COLLECT_TIME'
      },
      {
        condition: '*',
        nextState: 'COLLECT_DATE'
      }
    ],
    validation: (input: string) => /^\d{4}-\d{2}-\d{2}$/.test(input)
  },
  {
    id: 'COLLECT_TIME',
    name: 'Time Collection',
    prompt: 'What time would you like to book for? (HH:MM)',
    transitions: [
      {
        condition: 'regex:\\d{2}:\\d{2}',
        nextState: 'COLLECT_GUESTS'
      },
      {
        condition: '*',
        nextState: 'COLLECT_TIME'
      }
    ],
    validation: (input: string) => /^\d{2}:\d{2}$/.test(input)
  },
  {
    id: 'COLLECT_GUESTS',
    name: 'Guest Count',
    prompt: 'How many guests will be dining?',
    transitions: [
      {
        condition: 'regex:\\d+',
        nextState: 'CONFIRM_BOOKING'
      },
      {
        condition: '*',
        nextState: 'COLLECT_GUESTS'
      }
    ],
    validation: (input: string) => /^\d+$/.test(input) && parseInt(input) > 0
  },
  {
    id: 'CONFIRM_BOOKING',
    name: 'Booking Confirmation',
    prompt: 'I have a booking for {guests} guests at {property} on {date} at {time}. Would you like to confirm? (yes/no)',
    transitions: [
      {
        condition: 'equals:yes',
        nextState: 'BOOKING_CONFIRMED'
      },
      {
        condition: 'equals:no',
        nextState: 'COLLECT_PROPERTY'
      },
      {
        condition: '*',
        nextState: 'CONFIRM_BOOKING'
      }
    ],
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  {
    id: 'BOOKING_CONFIRMED',
    name: 'Booking Success',
    prompt: 'Your booking has been confirmed! Your reference number is {bookingRef}. Would you like to know about our special offers? (yes/no)',
    transitions: [
      {
        condition: 'equals:yes',
        nextState: 'SPECIAL_OFFERS'
      },
      {
        condition: 'equals:no',
        nextState: 'END'
      },
      {
        condition: '*',
        nextState: 'END'
      }
    ]
  },
  {
    id: 'MENU_INQUIRY',
    name: 'Menu Information',
    prompt: 'What would you like to know about our menu?',
    transitions: [
      {
        condition: '*',
        nextState: 'ASK_MORE_HELP'
      }
    ]
  },
  {
    id: 'LOCATION_INQUIRY',
    name: 'Location Information',
    prompt: 'Which location would you like information about?',
    transitions: [
      {
        condition: '*',
        nextState: 'ASK_MORE_HELP'
      }
    ]
  },
  {
    id: 'GENERAL_INQUIRY',
    name: 'General Information',
    prompt: 'I'll help you with that. What would you like to know?',
    transitions: [
      {
        condition: '*',
        nextState: 'ASK_MORE_HELP'
      }
    ]
  },
  {
    id: 'SPECIAL_OFFERS',
    name: 'Special Offers',
    prompt: 'Here are our current special offers: {offers}',
    transitions: [
      {
        condition: '*',
        nextState: 'ASK_MORE_HELP'
      }
    ]
  },
  {
    id: 'ASK_MORE_HELP',
    name: 'Additional Help',
    prompt: 'Is there anything else I can help you with? (yes/no)',
    transitions: [
      {
        condition: 'equals:yes',
        nextState: 'START'
      },
      {
        condition: 'equals:no',
        nextState: 'END'
      },
      {
        condition: '*',
        nextState: 'ASK_MORE_HELP'
      }
    ],
    validation: (input: string) => ['yes', 'no'].includes(input.toLowerCase())
  },
  {
    id: 'END',
    name: 'End Conversation',
    prompt: 'Thank you for choosing our service. Have a great day!',
    transitions: [
      {
        condition: '*',
        nextState: 'START'
      }
    ]
  }
]; 