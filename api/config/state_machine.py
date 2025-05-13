from typing import Dict, Any, Callable
import re

def validate_location(input: str) -> bool:
    """Validate if the input is either Delhi or Bangalore."""
    return input.lower() in ['delhi', 'bangalore']

def validate_name(input: str) -> bool:
    """Validate if the input is a valid name."""
    return bool(re.match(r'^[A-Za-z\s]{2,50}$', input))

def validate_phone(input: str) -> bool:
    """Validate if the input is a 10-digit phone number."""
    return bool(re.match(r'^\d{10}$', input))

def validate_yes_no(input: str) -> bool:
    """Validate if the input is yes or no."""
    return input.lower() in ['yes', 'no']

def validate_discover_options(input: str) -> bool:
    """Validate if the input is a valid discover option."""
    valid_inputs = ['1', '2', '3', '4', '5', '6', '7']
    return input in valid_inputs

def validate_time_slot(input: str) -> bool:
    """Validate if the input is a valid time slot."""
    valid_slots = ['lunch', 'dinner']
    return input.lower() in valid_slots

def validate_pax(input: str) -> bool:
    """Validate if the input is a valid number of people."""
    try:
        pax = int(input)
        return 1 <= pax <= 20
    except ValueError:
        return False

def validate_date(input: str) -> bool:
    """Validate if the input is a valid date."""
    # This is a simple validation, you might want to add more sophisticated date validation
    return bool(re.match(r'^\d{2}/\d{2}/\d{4}$', input))

def validate_edit_option(input: str) -> bool:
    """Validate if the input is a valid edit option."""
    return input in ['1', '2', '3']

def validate_confirmation(input: str) -> bool:
    """Validate if the input is a valid confirmation."""
    return input.lower() in ['confirm', 'edit']

states: Dict[str, Dict[str, Any]] = {
    'START': {
        'prompt': "Welcome to Barbeque Nation! Which city would you like to dine in - Delhi or Bangalore?",
        'validation': validate_location,
        'transitions': {
            '*': 'SELECT_RESTAURANT'
        }
    },
    'SELECT_RESTAURANT': {
        'prompt': "",  # This will be filled dynamically with restaurant list
        'transitions': {
            '*': 'CONFIRM_RESTAURANT'
        }
    },
    'CONFIRM_RESTAURANT': {
        'prompt': "",  # This will be filled dynamically with restaurant details
        'validation': validate_yes_no,
        'transitions': {
            'yes': 'COLLECT_NAME',
            'no': 'SELECT_RESTAURANT',
            '*': 'CONFIRM_RESTAURANT'
        }
    },
    'COLLECT_NAME': {
        'prompt': "Great! Please tell me your name.",
        'validation': validate_name,
        'transitions': {
            '*': 'COLLECT_PHONE'
        }
    },
    'COLLECT_PHONE': {
        'prompt': "Hello {name}! Please share your 10-digit phone number.",
        'validation': validate_phone,
        'transitions': {
            '*': 'DISCOVER'
        }
    },
    'DISCOVER': {
        'prompt': """How can I assist you today? Please choose from the following options:
1. Menu and pricing information
2. Current offers and promotions
3. Restaurant timings
4. Location and directions
5. Make a new booking
6. Modify existing booking
7. Cancel booking""",
        'validation': validate_discover_options,
        'transitions': {
            '1': 'PROVIDE_INFO',
            '2': 'PROVIDE_INFO',
            '3': 'PROVIDE_INFO',
            '4': 'PROVIDE_INFO',
            '5': 'SELECT_TIME_SLOT',
            '6': 'VERIFY_BOOKING',
            '7': 'VERIFY_BOOKING',
            '*': 'DISCOVER'
        }
    },
    'PROVIDE_INFO': {
        'prompt': "",  # This will be filled dynamically
        'transitions': {
            '*': 'ASK_MORE_HELP'
        }
    },
    'SELECT_TIME_SLOT': {
        'prompt': "Would you prefer lunch or dinner?",
        'validation': validate_time_slot,
        'transitions': {
            '*': 'SELECT_DATE'
        }
    },
    'SELECT_DATE': {
        'prompt': "Please enter your preferred date (DD/MM/YYYY):",
        'validation': validate_date,
        'transitions': {
            '*': 'SELECT_PAX'
        }
    },
    'SELECT_PAX': {
        'prompt': "How many people would be dining?",
        'validation': validate_pax,
        'transitions': {
            '*': 'CONFIRM_DETAILS'
        }
    },
    'CONFIRM_DETAILS': {
        'prompt': """Please confirm your booking details:
Location: {restaurant_name}
Date: {date}
Time: {time_slot}
Number of people: {pax}

Type 'confirm' to proceed with the booking or 'edit' to modify details.""",
        'validation': validate_confirmation,
        'transitions': {
            'confirm': 'BOOKING_CONFIRMED',
            'edit': 'EDIT_BOOKING',
            '*': 'CONFIRM_DETAILS'
        }
    },
    'EDIT_BOOKING': {
        'prompt': """What would you like to edit?
1. Date
2. Time slot
3. Number of people""",
        'validation': validate_edit_option,
        'transitions': {
            '1': 'SELECT_DATE',
            '2': 'SELECT_TIME_SLOT',
            '3': 'SELECT_PAX',
            '*': 'EDIT_BOOKING'
        }
    },
    'BOOKING_CONFIRMED': {
        'prompt': "Great! Your booking has been confirmed. You will receive a confirmation SMS shortly. Would you like help with anything else?",
        'validation': validate_yes_no,
        'transitions': {
            'yes': 'DISCOVER',
            'no': 'END',
            '*': 'END'
        }
    },
    'VERIFY_BOOKING': {
        'prompt': "Please enter your booking ID or phone number:",
        'validation': lambda x: validate_phone(x) or bool(re.match(r'^[A-Z0-9]{8}$', x)),
        'transitions': {
            '*': 'CONFIRM_MODIFICATION'
        }
    },
    'CONFIRM_MODIFICATION': {
        'prompt': "I found your booking. Would you like to proceed with the modification/cancellation?",
        'validation': validate_yes_no,
        'transitions': {
            'yes': 'BOOKING_MODIFIED',
            'no': 'DISCOVER',
            '*': 'DISCOVER'
        }
    },
    'BOOKING_MODIFIED': {
        'prompt': "Your booking has been updated. You will receive a confirmation SMS shortly. Would you like help with anything else?",
        'validation': validate_yes_no,
        'transitions': {
            'yes': 'DISCOVER',
            'no': 'END',
            '*': 'END'
        }
    },
    'ASK_MORE_HELP': {
        'prompt': "Would you like help with anything else?",
        'validation': validate_yes_no,
        'transitions': {
            'yes': 'DISCOVER',
            'no': 'END',
            '*': 'END'
        }
    },
    'END': {
        'prompt': "Thank you for choosing Barbeque Nation! Have a great day!",
        'transitions': {
            '*': 'START'
        }
    }
} 