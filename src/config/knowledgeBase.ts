import { Restaurant } from '../types';
import { KnowledgeBaseEntry } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: 'delhi-cp',
    name: 'Barbeque Nation - Connaught Place',
    city: 'Delhi',
    address: 'N-12, 2nd Floor, Connaught Place, New Delhi',
    timings: {
      open: '12:00',
      close: '23:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    capacity: 120,
    menu: {
      veg: [
        {
          name: 'Paneer Tikka',
          description: 'Marinated cottage cheese grilled to perfection',
          category: 'Starters'
        },
        {
          name: 'Mushroom Galawat',
          description: 'Minced mushroom kebabs with aromatic spices',
          category: 'Starters'
        }
      ],
      nonVeg: [
        {
          name: 'Chicken Tikka',
          description: 'Classic grilled chicken with Indian spices',
          category: 'Starters',
          isSpicy: true
        },
        {
          name: 'Fish Ajwaini',
          description: 'Fish marinated with carom seeds and grilled',
          category: 'Starters'
        }
      ]
    },
    pricing: {
      weekday: 1399,
      weekend: 1599
    }
  },
  {
    id: 'bangalore-koramangala',
    name: 'Barbeque Nation - Koramangala',
    city: 'Bangalore',
    address: '5th Block, Koramangala, Bangalore',
    timings: {
      open: '12:00',
      close: '23:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    capacity: 150,
    menu: {
      veg: [
        {
          name: 'Corn Seekh',
          description: 'Grilled corn patties with Indian spices',
          category: 'Starters'
        },
        {
          name: 'Paneer Malai',
          description: 'Creamy cottage cheese kebabs',
          category: 'Starters'
        }
      ],
      nonVeg: [
        {
          name: 'Andhra Chicken',
          description: 'Spicy chicken in South Indian style',
          category: 'Starters',
          isSpicy: true
        },
        {
          name: 'Prawns Tawa',
          description: 'Grilled prawns with coastal spices',
          category: 'Starters'
        }
      ]
    },
    pricing: {
      weekday: 1299,
      weekend: 1499
    }
  }
];

export const commonFAQs = [
  {
    question: "What is included in the buffet price?",
    answer: "The buffet price includes unlimited starters (both veg and non-veg), main course, and desserts. Soft drinks are charged separately."
  },
  {
    question: "Do you have any ongoing offers?",
    answer: "We have special discounts for early bird bookings (before 7 PM) and group bookings (8+ people). Corporate discounts are also available."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 24 hours before the booking time are fully refunded. Late cancellations may incur a charge."
  },
  {
    question: "Is there a time limit for dining?",
    answer: "Yes, we have a standard dining duration of 90 minutes per table to ensure all our guests can be accommodated comfortably."
  }
];

export const knowledgeBase: KnowledgeBaseEntry[] = [
  // Delhi Location
  {
    id: 'delhi-menu-1',
    location: 'Delhi',
    category: 'menu',
    question: 'What items are available in the buffet?',
    answer: 'Our buffet includes a wide variety of starters, main course, and desserts. Popular items include Tandoori Mushrooms, Cajun Spiced Potato, Fish Tikka, Mutton Seekh Kebab, and our signature BBQ dishes.',
    tags: ['menu', 'buffet', 'food', 'items', 'dishes'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'menu_card'
    }
  },
  {
    id: 'delhi-timing-1',
    location: 'Delhi',
    category: 'timing',
    question: 'What are your operating hours?',
    answer: 'We are open daily. Lunch: 12:00 PM - 3:30 PM (Last entry 3:00 PM). Dinner: 6:30 PM - 11:00 PM (Last entry 10:30 PM).',
    tags: ['timing', 'hours', 'schedule', 'open', 'close'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'store_info'
    }
  },
  {
    id: 'delhi-offers-1',
    location: 'Delhi',
    category: 'offers',
    question: 'What offers are currently available?',
    answer: 'Current offers include: Early Bird Discount (20% off before 7 PM), Student Discount (15% off on weekdays with valid ID), and Complimentary Welcome Drink for all guests.',
    tags: ['offers', 'discounts', 'deals', 'promotions'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'promotions'
    }
  },

  // Bangalore Location
  {
    id: 'bangalore-menu-1',
    location: 'Bangalore',
    category: 'menu',
    question: 'What items are available in the buffet?',
    answer: 'Our buffet features a mix of North Indian, Chinese, and local favorites. Popular items include Paneer Tikka, Corn Seekh, Fish Amritsari, Chicken Tangdi, and our signature grilled dishes.',
    tags: ['menu', 'buffet', 'food', 'items', 'dishes'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'menu_card'
    }
  },
  {
    id: 'bangalore-timing-1',
    location: 'Bangalore',
    category: 'timing',
    question: 'What are your operating hours?',
    answer: 'We are open all days. Lunch: 12:30 PM - 4:00 PM (Last entry 3:30 PM). Dinner: 7:00 PM - 11:30 PM (Last entry 11:00 PM).',
    tags: ['timing', 'hours', 'schedule', 'open', 'close'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'store_info'
    }
  },
  {
    id: 'bangalore-offers-1',
    location: 'Bangalore',
    category: 'offers',
    question: 'What offers are currently available?',
    answer: 'Current offers include: Weekend Family Package (10% off for groups of 4+), Corporate Discount (15% off on weekdays), and Kids Eat Free (under 5 years) with each paying adult.',
    tags: ['offers', 'discounts', 'deals', 'promotions'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'promotions'
    }
  },

  // Common FAQs
  {
    id: 'common-booking-1',
    location: 'Delhi',
    category: 'booking',
    question: 'How can I make a reservation?',
    answer: 'You can make a reservation through our chatbot, by calling our restaurant directly, or through our website. We recommend booking at least 2 hours in advance.',
    tags: ['booking', 'reservation', 'table'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'faq'
    }
  },
  {
    id: 'common-booking-2',
    location: 'Bangalore',
    category: 'booking',
    question: 'What is your cancellation policy?',
    answer: 'Reservations can be cancelled up to 2 hours before the booking time without any charge. Late cancellations may affect future booking privileges.',
    tags: ['booking', 'cancellation', 'policy'],
    metadata: {
      lastUpdated: '2024-05-13',
      source: 'faq'
    }
  }
]; 