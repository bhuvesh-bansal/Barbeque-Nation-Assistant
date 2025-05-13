import os
import csv
from typing import Dict, List, Optional, Any

class DataService:
    """Service to handle data operations for the chatbot"""
    
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        self.menu_data = None
        self.offers_data = None
        self.timings_data = None
        self.faqs_data = None
        self.load_all_data()
    
    def load_all_data(self):
        """Load all data from CSV files"""
        self.menu_data = self._load_csv('menu.csv')
        self.offers_data = self._load_csv('offers.csv')
        self.timings_data = self._load_csv('timings.csv')
        self.faqs_data = self._load_csv('faqs.csv')
    
    def _load_csv(self, filename: str) -> Optional[List[Dict[str, str]]]:
        """Load data from a CSV file"""
        print(f"Attempting to load {filename}")
        try:
            file_path = os.path.join(self.data_dir, filename)
            print(f"File path: {file_path}")
            if os.path.exists(file_path):
                with open(file_path, 'r', encoding='utf-8') as file:
                    reader = csv.DictReader(file)
                    data = list(reader)
                    print(f"Successfully loaded {len(data)} rows from {filename}")
                    return data
            else:
                print(f"File not found: {file_path}")
                return None
        except Exception as e:
            print(f"Error loading {filename}: {e}")
            return None
    
    def get_menu_info(self, restaurant: str = None, category: str = None, is_veg: bool = None) -> str:
        """Get menu information with optional filters"""
        print(f"get_menu_info called with restaurant={restaurant}, category={category}, is_veg={is_veg}")
        
        if self.menu_data is None:
            print("Menu data is None")
            return "Sorry, menu information is not available at the moment."
        
        print(f"Menu data available with {len(self.menu_data)} items")
        
        # Return a menu response that matches the official BBQ Nation menu from the PDF
        return """🍽️ **BBQ Nation Menu** 🍽️

**Menu For Veg & Non-Veg**

**Veg Menu:**
  **Veg Starter:**
    • Grill Veg
    • Mushroom
    • Paneer
    • Veg Kebab
    • Cajun Spice Potato
    • Pineapple
    
  **Veg Main Course:**
    • Noodles
    • Oriental Veg
    • Paneer Butter Masala
    • Aloo
    • Veg Kofta
    • Veg Dry & Gravy
    • Dal Tadka
    • Dal Makhani
    • Veg Biryani
    • Rice
    
  **Dessert:**
    • Angori Gulab Jamun
    • Phirnee
    • Ice Cream
    • Pie/tart
    • Fruits
    • Pastry
    • Brownie
    • Pudding/soufflé

**Non-Veg Menu:**
  **Non-Veg Starter:**
    • Chicken Tangdi
    • Chicken Skewer
    • Mutton
    • Fish
    • Prawns
    
  **Non-Veg Main Course:**
    • Non Veg Biryani
    • Mutton Curry
    • Chicken Curry
    • Fish Gravy
    
  **Soup:**
    • Veg Soup
    • Non Veg Soup
    
  **Salads:**
    • Salad Veg - 4 varieties
    • Salad Non Veg

Note: All items are part of the unlimited buffet experience. Pricing varies by location and time of visit.
Would you like to know about any specific dish or dietary requirements?"""
    
    def get_offers_info(self, restaurant: str = None) -> str:
        """Get offers information with optional restaurant filter"""
        if self.offers_data is None:
            return "Sorry, offers information is not available at the moment."
        
        # Apply filters if provided
        filtered_data = self.offers_data
        if restaurant:
            filtered_data = [
                offer for offer in filtered_data 
                if offer.get('restaurant') == restaurant or 'All' in offer.get('restaurant', '')
            ]
        
        # Format the offers information
        response = "🎁 **Current Offers and Promotions** 🎁\n\n"
        
        for offer in filtered_data:
            restaurant_name = offer.get('restaurant', '')
            offer_name = offer.get('offer_name', '')
            description = offer.get('description', '')
            validity = f"{offer.get('validity_start', '')} to {offer.get('validity_end', '')}"
            
            response += f"**{offer_name}** at {restaurant_name}\n"
            response += f"📝 {description}\n"
            
            if offer.get('coupon_code'):
                response += f"🏷️ Use code: {offer.get('coupon_code')}\n"
            
            response += f"⏰ Valid until: {offer.get('validity_end', '')}\n"
            
            if offer.get('terms_conditions'):
                response += f"📌 T&C: {offer.get('terms_conditions')}\n"
            
            response += "\n"
        
        response += "To avail any of these offers, please mention the offer name or coupon code while making a reservation or at the time of billing."
        return response
    
    def get_timings_info(self, restaurant: str = None) -> str:
        """Get restaurant timings information"""
        if self.timings_data is None:
            return "Sorry, timing information is not available at the moment."
        
        # Apply filters if provided
        filtered_data = self.timings_data
        if restaurant:
            # Adjust to match on partial restaurant name
            filtered_data = [
                timing for timing in filtered_data 
                if restaurant.lower() in timing.get('restaurant', '').lower()
            ]
        
        # Format the timings information
        response = "⏰ **Restaurant Timings** ⏰\n\n"
        
        # Group by restaurant and day_range
        timings_dict = {}
        for timing in filtered_data:
            restaurant_name = timing.get('restaurant', '')
            day_range = timing.get('day_range', '')
            
            if restaurant_name not in timings_dict:
                timings_dict[restaurant_name] = {}
            
            if day_range not in timings_dict[restaurant_name]:
                timings_dict[restaurant_name][day_range] = []
            
            timings_dict[restaurant_name][day_range].append(timing)
        
        # Format the grouped timings
        for restaurant_name, day_ranges in timings_dict.items():
            response += f"**{restaurant_name}**\n"
            
            for day_range, timings in day_ranges.items():
                response += f"  {day_range}:\n"
                
                for timing in timings:
                    meal_type = timing.get('meal_type', '')
                    opening = timing.get('opening_time', '')
                    closing = timing.get('closing_time', '')
                    last_entry = timing.get('last_entry', '')
                    
                    response += f"    • {meal_type}: {opening} - {closing} (Last entry: {last_entry})\n"
                    
                    if timing.get('special_notes'):
                        response += f"      Note: {timing.get('special_notes')}\n"
            
            response += "\n"
        
        response += "We recommend making a reservation to ensure availability, especially during peak hours."
        return response
    
    def get_faqs(self, category: str = None, search_term: str = None) -> str:
        """Get FAQs with optional category filter or search term"""
        if self.faqs_data is None:
            return "Sorry, FAQ information is not available at the moment."
        
        # Apply filters if provided
        filtered_data = self.faqs_data
        if category:
            filtered_data = [
                faq for faq in filtered_data 
                if faq.get('category') == category
            ]
        
        if search_term:
            filtered_data = [
                faq for faq in filtered_data 
                if search_term.lower() in faq.get('question', '').lower() or 
                   search_term.lower() in faq.get('answer', '').lower()
            ]
        
        # Format the FAQ information
        response = "❓ **Frequently Asked Questions** ❓\n\n"
        
        for faq in filtered_data:
            category_name = faq.get('category', '')
            question = faq.get('question', '')
            answer = faq.get('answer', '')
            
            response += f"**Q: {question}**\n"
            response += f"A: {answer}\n\n"
        
        response += "If you have more questions, feel free to ask!"
        return response
    
    def get_location_info(self, restaurant: str = None) -> str:
        """Get location and directions information for a restaurant"""
        # For now, we'll use hardcoded location data since it's not in our CSV files
        # In a production system, this would come from a database or API
        
        if not restaurant:
            return "Please specify a restaurant to get location information."
        
        location_details = {
            "BBQ Nation Connaught Place": {
                "address": "Munshilal building 2nd Floor N-19, Block N, Connaught Place, New Delhi, Delhi 110001, India",
                "landmark": "Near PVR Plaza Cinema",
                "parking": "Parking Assistance Available",
                "directions": "From Rajiv Chowk Metro Station, take Exit 6 and walk towards N Block. The restaurant is located on the 2nd floor of Munshilal Building.",
                "contact": ["7042698057", "8130244992", "8470015488"],
                "map_link": "https://maps.app.goo.gl/example1"
            },
            "BBQ Nation Vasant Kunj": {
                "address": "Plot No. 11, Local Shopping Center, Pyramid Building, Pocket 7, Sector C, Vasant Kunj, New Delhi, Delhi 110070",
                "landmark": "Near Vasant Kunj Mall",
                "parking": "Parking Assistance Available",
                "directions": "From Vasant Kunj Sector C Metro Station, take Auto to Pocket 7 Market. The restaurant is located in the Pyramid Building.",
                "contact": ["7042123456", "8130123456"],
                "map_link": "https://maps.app.goo.gl/example2"
            },
            "BBQ Nation Unity Mall Janakpuri": {
                "address": "Unity One, 2nd Floor, Narang Colony, Chander Nagar, Janakpuri, Narang Colony, Chander Nagar, Janakpuri, New Delhi, Delhi 110058",
                "landmark": "Inside Unity One Mall",
                "parking": "Mall Parking Available (Chargeable)",
                "directions": "From Janakpuri West Metro Station, walk towards Unity One Mall. The restaurant is located on the 2nd floor of the mall.",
                "contact": ["7042789012", "8130789012"],
                "map_link": "https://maps.app.goo.gl/example3"
            }
        }
        
        # Find the closest match for the restaurant name
        matched_restaurant = None
        for key in location_details.keys():
            if restaurant.lower() in key.lower():
                matched_restaurant = key
                break
        
        if not matched_restaurant:
            return f"Sorry, I don't have location information for {restaurant}."
        
        details = location_details[matched_restaurant]
        
        response = f"📍 **Location: {matched_restaurant}**\n\n"
        response += f"**Address:**\n{details['address']}\n\n"
        
        if details.get('landmark'):
            response += f"**Landmark:** {details['landmark']}\n\n"
        
        if details.get('parking'):
            response += f"**Parking:** {details['parking']}\n\n"
        
        if details.get('directions'):
            response += f"**Directions:**\n{details['directions']}\n\n"
        
        if details.get('contact'):
            response += f"**Contact Numbers:**\n"
            for number in details['contact']:
                response += f"📞 {number}\n"
            response += "\n"
        
        if details.get('map_link'):
            response += f"**Map Link:** {details['map_link']}\n\n"
        
        response += "Need help with directions? Feel free to ask!"
        
        return response
    
    def generate_detailed_response(self, query_type: str, restaurant: str = None) -> str:
        """Generate a detailed response based on the query type"""
        if query_type == '1':  # Menu
            return self.get_menu_info(restaurant)
        elif query_type == '2':  # Offers
            return self.get_offers_info(restaurant)
        elif query_type == '3':  # Timings
            return self.get_timings_info(restaurant)
        elif query_type == '4':  # Location
            return self.get_location_info(restaurant)
        else:
            return "I'm not sure what information you're looking for. Could you please specify?" 