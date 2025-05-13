import { Restaurant } from '../types';

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