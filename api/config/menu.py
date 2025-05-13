from typing import TypedDict, List, Literal

class MenuItem(TypedDict):
    name: str
    category: str
    type: Literal['veg', 'non-veg']
    description: str
    isSpicy: bool

class MenuCategory(TypedDict):
    name: str
    items: List[MenuItem]

class MenuFAQ(TypedDict):
    question: str
    answer: str
    category: str

menu: dict = {
    'veg': [
        {
            'name': "Veg Starter",
            'items': [
                {'name': "Grill Veg", 'category': "starter", 'type': "veg", 'description': "Assorted vegetables grilled to perfection", 'isSpicy': False},
                {'name': "Mushroom", 'category': "starter", 'type': "veg", 'description': "Marinated mushrooms with herbs", 'isSpicy': False},
                {'name': "Paneer", 'category': "starter", 'type': "veg", 'description': "Cottage cheese in special marinade", 'isSpicy': True},
                {'name': "Veg Kebab", 'category': "starter", 'type': "veg", 'description': "Mixed vegetable kebab", 'isSpicy': True},
                {'name': "Cajun Spice Potato", 'category': "starter", 'type': "veg", 'description': "Potatoes with cajun spices", 'isSpicy': True},
                {'name': "Pineapple", 'category': "starter", 'type': "veg", 'description': "Grilled pineapple with honey glaze", 'isSpicy': False}
            ]
        },
        {
            'name': "Veg Main Course",
            'items': [
                {'name': "Noodles", 'category': "main", 'type': "veg", 'description': "Stir-fried vegetable noodles", 'isSpicy': False},
                {'name': "Oriental Veg", 'category': "main", 'type': "veg", 'description': "Mixed vegetables in oriental sauce", 'isSpicy': True},
                {'name': "Paneer Butter Masala", 'category': "main", 'type': "veg", 'description': "Cottage cheese in rich tomato gravy", 'isSpicy': True},
                {'name': "Aloo Gobi", 'category': "main", 'type': "veg", 'description': "Potato and cauliflower curry", 'isSpicy': True},
                {'name': "Veg Kofta", 'category': "main", 'type': "veg", 'description': "Mixed vegetable dumplings in gravy", 'isSpicy': True},
                {'name': "Veg Dry & Gravy", 'category': "main", 'type': "veg", 'description': "Assorted vegetables in dry and gravy preparation", 'isSpicy': True},
                {'name': "Dal Tadka", 'category': "main", 'type': "veg", 'description': "Yellow lentils with tempering", 'isSpicy': True},
                {'name': "Dal Makhani", 'category': "main", 'type': "veg", 'description': "Black lentils in creamy gravy", 'isSpicy': False},
                {'name': "Veg Biryani", 'category': "main", 'type': "veg", 'description': "Fragrant rice with vegetables", 'isSpicy': True},
                {'name': "Rice", 'category': "main", 'type': "veg", 'description': "Steamed rice", 'isSpicy': False}
            ]
        }
    ],
    'nonVeg': [
        {
            'name': "Non-Veg Starter",
            'items': [
                {'name': "Chicken Tangdi", 'category': "starter", 'type': "non-veg", 'description': "Marinated chicken drumsticks", 'isSpicy': True},
                {'name': "Chicken Skewer", 'category': "starter", 'type': "non-veg", 'description': "Grilled chicken on skewers", 'isSpicy': True},
                {'name': "Mutton Seekh", 'category': "starter", 'type': "non-veg", 'description': "Minced mutton kebab", 'isSpicy': True},
                {'name': "Fish Tikka", 'category': "starter", 'type': "non-veg", 'description': "Marinated BASA fish pieces (boneless)", 'isSpicy': True},
                {'name': "Prawns", 'category': "starter", 'type': "non-veg", 'description': "Medium size Zinga prawns with herbs", 'isSpicy': True}
            ]
        },
        {
            'name': "Non-Veg Main Course",
            'items': [
                {'name': "Non Veg Biryani", 'category': "main", 'type': "non-veg", 'description': "Fragrant rice with chicken", 'isSpicy': True},
                {'name': "Mutton Curry", 'category': "main", 'type': "non-veg", 'description': "Traditional mutton curry", 'isSpicy': True},
                {'name': "Chicken Curry", 'category': "main", 'type': "non-veg", 'description': "Chicken in rich gravy", 'isSpicy': True},
                {'name': "Fish Gravy", 'category': "main", 'type': "non-veg", 'description': "Fish in flavorful curry", 'isSpicy': True}
            ]
        }
    ],
    'common': [
        {
            'name': "Soup",
            'items': [
                {'name': "Veg Soup", 'category': "soup", 'type': "veg", 'description': "Vegetable soup", 'isSpicy': False},
                {'name': "Non Veg Soup", 'category': "soup", 'type': "non-veg", 'description': "Chicken soup", 'isSpicy': True}
            ]
        },
        {
            'name': "Salads",
            'items': [
                {'name': "Salad Veg - 4 varieties", 'category': "salad", 'type': "veg", 'description': "Four varieties of fresh vegetable salads", 'isSpicy': False},
                {'name': "Salad Non Veg", 'category': "salad", 'type': "non-veg", 'description': "Non-vegetarian salad", 'isSpicy': False}
            ]
        },
        {
            'name': "Dessert",
            'items': [
                {'name': "Angori Gulab Jamun", 'category': "dessert", 'type': "veg", 'description': "Traditional Indian sweet", 'isSpicy': False},
                {'name': "Phirnee", 'category': "dessert", 'type': "veg", 'description': "Rice pudding with nuts", 'isSpicy': False},
                {'name': "Ice Cream", 'category': "dessert", 'type': "veg", 'description': "Vanilla and strawberry flavors", 'isSpicy': False},
                {'name': "Fruit Tart / Pie", 'category': "dessert", 'type': "veg", 'description': "Fresh fruit tart", 'isSpicy': False},
                {'name': "Fresh Fruits", 'category': "dessert", 'type': "veg", 'description': "Seasonal fresh fruits", 'isSpicy': False},
                {'name': "Pastry", 'category': "dessert", 'type': "veg", 'description': "Assorted pastries", 'isSpicy': False},
                {'name': "Brownie", 'category': "dessert", 'type': "veg", 'description': "Chocolate brownie", 'isSpicy': False},
                {'name': "Pudding/Souffle", 'category': "dessert", 'type': "veg", 'description': "Caramel pudding", 'isSpicy': False}
            ]
        }
    ]
}

# FAQ related to menu and restaurant information
faqs: List[MenuFAQ] = [
    {
        "question": "Is Jain food available in BBQ nation?",
        "answer": "Yes, surely assist with information, can I know whether you're looking for lunch or dinner. According to the information given by guests, Yes we have Jain food available but variety will be limited and once you reach to outlet you should inform to outlet team on Jain food, shall I proceed for reservation.",
        "category": "Menu & Drinks"
    },
    {
        "question": "Does Barbeque Nation serve Halal food?",
        "answer": "Sir/Mam, Yes we serve Halal food (Meat) in all the barbeque nation outlets.",
        "category": "Menu & Drinks"
    },
    {
        "question": "Do you have any proof / Certificate for Halal?",
        "answer": "Mam/Sir, We do have certificate in all the barbeque nation outlets.",
        "category": "Menu & Drinks"
    },
    {
        "question": "What is the menu for today?",
        "answer": "Surely Mam/Sir, I will assist with information:- Inform the menu as per status / Menu details in KP",
        "category": "Menu & Drinks"
    },
    {
        "question": "Is outside Alcoholic drink allowed in Barbeque Nation outlet?",
        "answer": "Mam/Sir, I'm sorry to inform outside drinks are not allowed in Barbeque Nation. However we serve drinks in barbeque nation as per ala carte menu",
        "category": "Menu & Drinks"
    },
    {
        "question": "Can I get the drinks details through mail?",
        "answer": "Yes mam/sir, (1.) I would request you to download barbeque nation app and click on menu, you can view the drinks menu (2.)Please provide your mail ID, we will send drinks details",
        "category": "Menu & Drinks"
    },
    {
        "question": "Does Barbeque nation have alcohol?",
        "answer": "Mam/Sir, for dine-in services we serve both domestic & International alcoholic beverages but we do not provide delivery services",
        "category": "Menu & Drinks"
    },
    {
        "question": "Can I get particular dish once kitchen is closed? Can I customize the menu?",
        "answer": "Mam/Sir, if you want any change in menu like taste, spicy or less spicy changes can be made. But if you want additional dish apart from menu need to check with branch as per availability you will get.",
        "category": "Menu & Drinks"
    },
    {
        "question": "Does Menu remain same for all the outlets?",
        "answer": "Yes,mam/sir menu is standard across all branches of barbeque nation",
        "category": "Menu & Drinks"
    },
    {
        "question": "What type of fish do Barbeque nation serve?",
        "answer": "Mam/Sir, We serve BASA fish which is boneless fish",
        "category": "Menu & Drinks"
    },
    {
        "question": "What type of prawns do barbeque nation serve?",
        "answer": "Mam/Sir, we serve Medium size prawns which is called as Zinga prawns",
        "category": "Menu & Drinks"
    },
    {
        "question": "What are the types of Ice-cream do barbeque nation serve?",
        "answer": "Mam/Sir, We serve two flavor of ice cream that is Vanilla and strawberry.",
        "category": "Menu & Drinks"
    }
]

def get_menu_by_type(type: Literal['veg', 'non-veg', 'all']) -> List[MenuCategory]:
    """Get menu items filtered by type."""
    if type == 'veg':
        return [*menu['veg'], *[cat for cat in menu['common'] if any(item['type'] == 'veg' for item in cat['items'])]]
    elif type == 'non-veg':
        return [*menu['nonVeg'], *[cat for cat in menu['common'] if any(item['type'] == 'non-veg' for item in cat['items'])]]
    return [*menu['veg'], *menu['nonVeg'], *menu['common']]

def get_items_by_category(category: str) -> List[MenuItem]:
    """Get items by category name."""
    all_categories = [*menu['veg'], *menu['nonVeg'], *menu['common']]
    found_category = next((cat for cat in all_categories if cat['name'].lower() == category.lower()), None)
    return found_category['items'] if found_category else []

def search_menu(query: str) -> List[MenuItem]:
    """Search menu items by name or category."""
    all_items = []
    for category in [*menu['veg'], *menu['nonVeg'], *menu['common']]:
        all_items.extend(category['items'])
    
    return [
        item for item in all_items
        if query.lower() in item['name'].lower() or
           query.lower() in item['category'].lower() or
           query.lower() in item.get('description', '').lower()
    ]

def get_faq_by_category(category: str) -> List[MenuFAQ]:
    """Get FAQs by category."""
    return [faq for faq in faqs if faq['category'].lower() == category.lower()]

def search_faq(query: str) -> List[MenuFAQ]:
    """Search FAQs by query."""
    return [
        faq for faq in faqs
        if query.lower() in faq['question'].lower() or
           query.lower() in faq['answer'].lower()
    ] 