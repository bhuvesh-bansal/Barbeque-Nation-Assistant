export interface LocationDetails {
  name: string;
  address: string;
  timings: {
    [key: string]: {
      lunch: {
        opening: string;
        lastEntry: string;
        closing: string;
        slotRestriction?: string;
      };
      dinner: {
        opening: string;
        lastEntry: string;
        closing: string;
        slotRestriction?: string;
      };
    };
  };
  amenities: {
    bar: boolean;
    valetParking: string;
    babyChair: boolean;
    lift: boolean;
  };
  pdr: {
    availability: boolean;
    capacity?: number;
    minimumPax?: number;
  };
  offers: {
    complimentaryDrinks: string;
    foodFestival: boolean;
    earlyBird: boolean;
    buffetOffer: boolean;
    armyOffer: boolean;
    drinksOffer: boolean;
    kittyPartyOffer?: boolean;
    studentOffer?: boolean;
  };
  nearestOutlets: Array<{
    name: string;
    address: string;
    distance: string;
  }>;
  slots: {
    [key: string]: {
      pax: {
        "2+1": string;
        "3 & Above": string;
      };
    };
  };
  contactNumbers?: string[];
  specialNotes?: string;
  specialOffers?: {
    earlyBird?: string;
    kittyParty?: string;
    student?: string;
  };
}

export const locations: { [key: string]: LocationDetails } = {
  "bangalore-indiranagar": {
    name: "Barbeque Nation - Indiranagar",
    address: "No.4005, HAL 2nd stage, 100 feet road, Indiranagar, Bangalore-560038",
    timings: {
      "Monday to Friday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Saturday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Sunday": {
        lunch: {
          opening: "11:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Available",
      babyChair: true,
      lift: true
    },
    pdr: {
      availability: true,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false
    },
    nearestOutlets: [
      {
        name: "Lido Mall Mg Road",
        address: "1/4, Ground Floor, Lido Mall, Swami Vivekananda Road, Halasuru, Bengaluru, Karnataka 560008, India",
        distance: "4.1 km"
      },
      {
        name: "Koramangala 7th block",
        address: "118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru",
        distance: "5.8 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    }
  },
  "bangalore-electronic-city": {
    name: "Barbeque Nation - Electronic City",
    address: "99, 14th Cross Road, Neeladri Nagar, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100, India",
    timings: {
      "Monday to Friday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Saturday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      }
    },
    amenities: {
      bar: false,
      valetParking: "Self / Chargeable",
      babyChair: true,
      lift: true
    },
    pdr: {
      availability: false,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false
    },
    nearestOutlets: [],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    }
  },
  "bangalore-jp-nagar": {
    name: "Barbeque Nation - JP Nagar",
    address: "67, 3rd Floor, 6th B Main, Phase III, J P Nagar, Bengaluru, Karnataka 560078, India",
    timings: {
      "Monday to Friday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Saturday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Parking Assistance",
      babyChair: true,
      lift: true
    },
    pdr: {
      availability: false,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Saturday / 1 Round / Soft drink",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false
    },
    nearestOutlets: [
      {
        name: "Gopalan Mall JP Nagar",
        address: "Gopalan Innovation Mall, 2nd floor,3rd phase,4p nagar, Bennerghatta Road, Bangalore 560076 Karnataka",
        distance: "1.2 km"
      },
      {
        name: "Koramangala 7th block",
        address: "118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru",
        distance: "6.0 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    },
    specialNotes: "2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location."
  },
  "bangalore-koramangala-1st-block": {
    name: "Barbeque Nation - Koramangala 1st Block",
    address: "1st Cross Rd, 1st Block Koramangala, Koramangala, Bengaluru, Karnataka 560034, India",
    timings: {
      "Monday to Friday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "10:30 pm",
          closing: "11:30 pm"
        }
      },
      "Saturday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      },
      "Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "11:55 pm"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Parking Assistance",
      babyChair: true,
      lift: true
    },
    pdr: {
      availability: false,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false
    },
    nearestOutlets: [
      {
        name: "Koramangala 7th block",
        address: "118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru",
        distance: "3.7 km"
      },
      {
        name: "Indiranagar",
        address: "No.4005, HAL 2nd stage, 100 feet road, Indiranagar, Bangalore-560038",
        distance: "5.9 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    },
    specialNotes: "2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location."
  },
  "delhi-connaught-place": {
    name: "Barbeque Nation - Connaught Place",
    address: "Munshilal building 2nd Floor N-19, Block N, Connaught Place, New Delhi, Delhi 110001, India",
    timings: {
      "Monday to Thursday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm",
          slotRestriction: "Flexible"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "12:00 am",
          slotRestriction: "Take till 07:00 pm"
        }
      },
      "Friday to Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm",
          slotRestriction: "Take till 12:30 pm"
        },
        dinner: {
          opening: "06:30 pm",
          lastEntry: "11:00 pm",
          closing: "12:00 am",
          slotRestriction: "Take till 07:00 pm"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Parking Assistance",
      babyChair: false,
      lift: true
    },
    pdr: {
      availability: true,
      capacity: 25,
      minimumPax: 20
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Friday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false,
      kittyPartyOffer: false,
      studentOffer: false
    },
    nearestOutlets: [
      {
        name: "New Friends Colony",
        address: "Shop No 57A, 1st Floor, Community Center, near Modi Enterprises, New Friends Colony, New Delhi, Delhi 110025",
        distance: "13 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    },
    contactNumbers: ["7042698057", "8130244992", "8470015488"]
  },
  "delhi-vasant-kunj": {
    name: "Barbeque Nation - Sector C, Vasant Kunj",
    address: "Plot No. 11, Local Shopping Center, Pyramid Building, Pocket 7, Sector C, Vasant Kunj, New Delhi, Delhi 110070",
    timings: {
      "Monday to Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm",
          slotRestriction: "Flexible"
        },
        dinner: {
          opening: "06:00 pm",
          lastEntry: "11:00 pm",
          closing: "12:00 am",
          slotRestriction: "Take till last entry"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Parking Assistance",
      babyChair: false,
      lift: false
    },
    pdr: {
      availability: false,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Friday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: true,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false,
      kittyPartyOffer: true,
      studentOffer: true
    },
    nearestOutlets: [
      {
        name: "New Friends Colony",
        address: "Shop No 57A, 1st Floor, Community Center, near Modi Enterprises, New Friends Colony, New Delhi, Delhi 110025",
        distance: "13 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    },
    specialNotes: "27th Oct Stop dinner both the slot due to bulk booking suggest near by location.",
    specialOffers: {
      earlyBird: "Early Dinner : Wednesday to Sunday 06.00 pm to 06.30 pm.",
      kittyParty: "Yes / Refer Kitty Offer Tab",
      student: "Yes / Refer Student Offer Tab"
    }
  },
  "delhi-unity-mall-janakpuri": {
    name: "Barbeque Nation - Unity Mall, Janakpuri",
    address: "Unity One, 2nd Floor, Narang Colony, Chander Nagar, Janakpuri, Narang Colony, Chander Nagar, Janakpuri, New Delhi, Delhi 110058",
    timings: {
      "Monday to Friday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm",
          slotRestriction: "Flexible"
        },
        dinner: {
          opening: "06:00 pm",
          lastEntry: "11:00 pm",
          closing: "12:00 am",
          slotRestriction: "Take till last entry"
        }
      },
      "Saturday to Sunday": {
        lunch: {
          opening: "12:00 pm",
          lastEntry: "04:00 pm",
          closing: "05:00 pm",
          slotRestriction: "Flexible"
        },
        dinner: {
          opening: "06:00 pm",
          lastEntry: "11:00 pm",
          closing: "12:00 am",
          slotRestriction: "Take till last entry"
        }
      }
    },
    amenities: {
      bar: true,
      valetParking: "Self / Mall Parking / Chargeable",
      babyChair: false,
      lift: true
    },
    pdr: {
      availability: false,
      capacity: 0,
      minimumPax: 0
    },
    offers: {
      complimentaryDrinks: "Lunch / Monday to Friday / 1 Round / Soft drink or Mocktail",
      foodFestival: false,
      earlyBird: false,
      buffetOffer: false,
      armyOffer: false,
      drinksOffer: false,
      kittyPartyOffer: true,
      studentOffer: true
    },
    nearestOutlets: [
      {
        name: "Rajouri Garden",
        address: "A2/41,3rd Floor, Rajouri Garden New Delhi 110027",
        distance: "6.3 km"
      },
      {
        name: "Paschim Vihar",
        address: "3rd floor, Emaya Mall, New Delhi-110063",
        distance: "7.8 km"
      }
    ],
    slots: {
      "Monday to Sunday": {
        pax: {
          "2+1": "Flexible",
          "3 & Above": "Flexible"
        }
      }
    },
    specialNotes: "14th Mar 2025 lunch closed due to Holi suggest dinner for any booking.",
    specialOffers: {
      kittyParty: "Refer Kitty Offer Tab",
      student: "Refer Student Offer Tab"
    }
  }
}; 