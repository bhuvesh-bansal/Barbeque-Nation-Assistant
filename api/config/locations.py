from typing import TypedDict, List, Dict, Optional

class Timing(TypedDict):
    opening: str
    closing: str
    lastEntry: str
    slotRestriction: Optional[str]

class DayTiming(TypedDict):
    lunch: Timing
    dinner: Timing

class PDR(TypedDict):
    availability: bool
    capacity: Optional[int]
    minimumPax: Optional[int]

class Amenities(TypedDict):
    bar: bool
    valetParking: str
    babyChair: bool
    lift: bool

class Offers(TypedDict):
    earlyBird: bool
    buffetOffer: bool
    armyOffer: bool
    studentOffer: bool
    kittyPartyOffer: bool
    complimentaryDrinks: str

class SpecialOffers(TypedDict):
    earlyBird: Optional[str]
    student: Optional[str]
    kittyParty: Optional[str]

class NearestOutlet(TypedDict):
    name: str
    distance: str
    address: str

class Location(TypedDict):
    name: str
    address: str
    timings: Dict[str, DayTiming]
    pdr: PDR
    amenities: Amenities
    offers: Offers
    specialOffers: SpecialOffers
    nearestOutlets: List[NearestOutlet]
    contactNumbers: List[str]
    specialNotes: Optional[str]

locations: Dict[str, Location] = {
    # Delhi Locations
    'delhi-connaught-place': {
        'name': 'BBQ Nation Connaught Place',
        'address': 'Munshilal building 2nd Floor N-19, Block N, Connaught Place, New Delhi, Delhi 110001, India',
        'timings': {
            'Monday-Thursday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '4:00 PM',
                    'lastEntry': '3:00 PM',
                    'slotRestriction': '2 hours per group'
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:00 PM',
                    'lastEntry': '10:00 PM',
                    'slotRestriction': '2 hours per group'
                }
            },
            'Friday-Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '4:00 PM',
                    'lastEntry': '3:00 PM',
                    'slotRestriction': '2 hours per group'
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:30 PM',
                    'lastEntry': '10:30 PM',
                    'slotRestriction': '2 hours per group'
                }
            }
        },
        'pdr': {
            'availability': True,
            'capacity': 25,
            'minimumPax': 20
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Parking Assistance',
            'babyChair': False,
            'lift': True
        },
        'offers': {
            'earlyBird': False,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': False,
            'kittyPartyOffer': False,
            'complimentaryDrinks': 'Lunch: Monday to Friday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': None,
            'student': None,
            'kittyParty': None
        },
        'nearestOutlets': [
            {
                'name': 'New Friends Colony',
                'distance': '13 km',
                'address': 'Shop No 57A, 1st Floor, Community Center, near Modi Enterprises, New Friends Colony, New Delhi, Delhi 110025'
            }
        ],
        'contactNumbers': ['7042698057', '8130244992', '8470015488'],
        'specialNotes': None
    },
    'delhi-vasant-kunj': {
        'name': 'BBQ Nation Vasant Kunj',
        'address': 'Plot No. 11, Local Shopping Center, Pyramid Building, Pocket 7, Sector C, Vasant Kunj, New Delhi, Delhi 110070',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:00 PM',
                    'closing': '12:00 AM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Saturday-Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:00 PM',
                    'closing': '12:00 AM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': False,
            'capacity': None,
            'minimumPax': None
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Parking Assistance',
            'babyChair': False,
            'lift': False
        },
        'offers': {
            'earlyBird': True,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': True,
            'kittyPartyOffer': True,
            'complimentaryDrinks': 'Lunch: Monday to Friday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': 'Early Dinner: Wednesday to Sunday 06.00 pm to 06.30 pm',
            'student': 'Refer Student Offer Tab',
            'kittyParty': 'Refer Kitty Offer Tab'
        },
        'nearestOutlets': [
            {
                'name': 'New Friends Colony',
                'distance': '13 km',
                'address': 'Shop No 57A, 1st Floor, Community Center, near Modi Enterprises, New Friends Colony, New Delhi, Delhi 110025'
            }
        ],
        'contactNumbers': [],
        'specialNotes': '27th Oct Stop dinner both the slot due to bulk booking suggest near by location.'
    },
    'delhi-janakpuri': {
        'name': 'BBQ Nation Unity Mall, Janakpuri',
        'address': 'Unity One, 2nd Floor, Narang Colony, Chander Nagar, Janakpuri, Narang Colony, Chander Nagar, Janakpuri, New Delhi, Delhi 110058',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:00 PM',
                    'closing': '12:00 AM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Saturday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:00 PM',
                    'closing': '12:00 AM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:00 PM',
                    'closing': '12:00 AM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': False,
            'capacity': None,
            'minimumPax': None
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Self / Mall Parking / Chargeable',
            'babyChair': False,
            'lift': True
        },
        'offers': {
            'earlyBird': False,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': True,
            'kittyPartyOffer': True,
            'complimentaryDrinks': 'Lunch: Monday to Friday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': None,
            'student': 'Refer Student Offer Tab',
            'kittyParty': 'Refer Kitty Offer Tab'
        },
        'nearestOutlets': [
            {
                'name': 'Rajouri Garden',
                'distance': '6.3 km',
                'address': 'A2/41,3rd Floor, Rajouri Garden New Delhi 110027'
            },
            {
                'name': 'Paschim Vihar',
                'distance': '7.8 km',
                'address': '3rd floor, Emaya Mall, New Delhi-110063'
            }
        ],
        'contactNumbers': [],
        'specialNotes': '14th Mar 2025 lunch closed due to Holi suggest dinner for any booking.'
    },
    
    # Bangalore Locations
    'bangalore-electronic-city': {
        'name': 'BBQ Nation Electronic City',
        'address': '99, 14th Cross Road, Neeladri Nagar, Electronics City Phase 1, Electronic City, Bengaluru, Karnataka 560100, India',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Saturday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': False,
            'capacity': None,
            'minimumPax': None
        },
        'amenities': {
            'bar': False,
            'valetParking': 'Self / Chargeable',
            'babyChair': True,
            'lift': True
        },
        'offers': {
            'earlyBird': False,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': False,
            'kittyPartyOffer': False,
            'complimentaryDrinks': 'Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': None,
            'student': None,
            'kittyParty': None
        },
        'nearestOutlets': [],
        'contactNumbers': [],
        'specialNotes': '2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location.'
    },
    'bangalore-koramangala': {
        'name': 'BBQ Nation Koramangala 1st Block',
        'address': '1st Cross Rd, 1st Block Koramangala, Koramangala, Bengaluru, Karnataka 560034, India',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:30 PM',
                    'lastEntry': '10:30 PM',
                    'slotRestriction': None
                }
            },
            'Saturday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': True,
            'capacity': None,
            'minimumPax': None
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Parking Assistance',
            'babyChair': True,
            'lift': True
        },
        'offers': {
            'earlyBird': False,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': False,
            'kittyPartyOffer': False,
            'complimentaryDrinks': 'Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': None,
            'student': None,
            'kittyParty': None
        },
        'nearestOutlets': [
            {
                'name': 'Koramangala 7th block',
                'distance': '3.7 km',
                'address': '118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru'
            }
        ],
        'contactNumbers': [],
        'specialNotes': '2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location.'
    },
    'bangalore-indiranagar': {
        'name': 'BBQ Nation Indiranagar',
        'address': 'No.4005, HAL 2nd stage, 100 feet road, Indiranagar, Bangalore-560038',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Saturday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Sunday': {
                'lunch': {
                    'opening': '11:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': True,
            'capacity': 30,
            'minimumPax': 20
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Yes',
            'babyChair': True,
            'lift': True
        },
        'offers': {
            'earlyBird': True,
            'buffetOffer': True,
            'armyOffer': False,
            'studentOffer': False,
            'kittyPartyOffer': False,
            'complimentaryDrinks': 'Lunch / Monday to Saturday / 1 Round / Soft drink or Mocktail'
        },
        'specialOffers': {
            'earlyBird': '15% off on lunch buffet before 1 PM',
            'student': '10% off on weekdays with valid ID',
            'kittyParty': 'Complimentary cake for group bookings'
        },
        'nearestOutlets': [
            {
                'name': 'Lido Mall Mg Road',
                'distance': '4.1 km',
                'address': '1/4, Ground Floor, Lido Mall, Swami Vivekananda Road, Halasuru, Bengaluru, Karnataka 560008, India'
            },
            {
                'name': 'Koramangala 7th block',
                'distance': '5.8 km',
                'address': '118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru'
            }
        ],
        'contactNumbers': ['080-12345678', '080-87654321'],
        'specialNotes': '2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location.'
    },
    'bangalore-jp-nagar': {
        'name': 'BBQ Nation JP Nagar',
        'address': '67, 3rd Floor, 6th B Main, Phase III, J P Nagar, Bengaluru, Karnataka 560078, India',
        'timings': {
            'Monday-Friday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Saturday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            },
            'Sunday': {
                'lunch': {
                    'opening': '12:00 PM',
                    'closing': '5:00 PM',
                    'lastEntry': '4:00 PM',
                    'slotRestriction': None
                },
                'dinner': {
                    'opening': '6:30 PM',
                    'closing': '11:55 PM',
                    'lastEntry': '11:00 PM',
                    'slotRestriction': None
                }
            }
        },
        'pdr': {
            'availability': True,
            'capacity': None,
            'minimumPax': None
        },
        'amenities': {
            'bar': True,
            'valetParking': 'Parking Assistance',
            'babyChair': True,
            'lift': True
        },
        'offers': {
            'earlyBird': False,
            'buffetOffer': False,
            'armyOffer': False,
            'studentOffer': False,
            'kittyPartyOffer': False,
            'complimentaryDrinks': 'Lunch / Monday to Saturday / 1 Round / Soft drink'
        },
        'specialOffers': {
            'earlyBird': None,
            'student': None,
            'kittyParty': None
        },
        'nearestOutlets': [
            {
                'name': 'Gopalan Mall JP Nagar',
                'distance': '1.2 km',
                'address': 'Gopalan Innovation Mall, 2nd floor,3rd phas,e Jp nagar, Bennerghatta Road, Bangalore 560076 Karnataka'
            },
            {
                'name': 'Koramangala 7th block',
                'distance': '6.0 km',
                'address': '118, 1st Floor ,80 Feet Rd, KHB Colony, 7th Block, Koramangala, Bengaluru'
            }
        ],
        'contactNumbers': [],
        'specialNotes': '2nd Oct outlet close for full day due to Gandhi Jayanthi suggest near by location.'
    }
} 