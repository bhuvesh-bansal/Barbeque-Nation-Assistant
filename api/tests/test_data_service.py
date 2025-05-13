import os
import sys
import unittest
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from services.data_service import DataService

class TestDataService(unittest.TestCase):
    """Test cases for DataService class"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.data_service = DataService()
    
    def test_init(self):
        """Test initialization of DataService"""
        self.assertIsNotNone(self.data_service)
        self.assertIsNotNone(self.data_service.data_dir)
    
    def test_load_csv(self):
        """Test loading CSV files"""
        # Test loading existing files
        menu_data = self.data_service.menu_data
        offers_data = self.data_service.offers_data
        timings_data = self.data_service.timings_data
        faqs_data = self.data_service.faqs_data
        
        self.assertIsNotNone(menu_data)
        self.assertIsNotNone(offers_data) 
        self.assertIsNotNone(timings_data)
        self.assertIsNotNone(faqs_data)
    
    def test_get_menu_info(self):
        """Test getting menu information"""
        menu_info = self.data_service.get_menu_info()
        self.assertIsNotNone(menu_info)
        self.assertIn("BBQ Nation Menu", menu_info)
    
    def test_get_offers_info(self):
        """Test getting offers information"""
        offers_info = self.data_service.get_offers_info()
        self.assertIsNotNone(offers_info)
        self.assertIn("Current Offers and Promotions", offers_info)
    
    def test_get_timings_info(self):
        """Test getting timings information"""
        timings_info = self.data_service.get_timings_info()
        self.assertIsNotNone(timings_info)
        self.assertIn("Restaurant Timings", timings_info)
    
    def test_get_faqs(self):
        """Test getting FAQs"""
        faqs_info = self.data_service.get_faqs()
        self.assertIsNotNone(faqs_info)
        self.assertIn("Frequently Asked Questions", faqs_info)
    
    def test_generate_detailed_response(self):
        """Test generating detailed responses"""
        menu_response = self.data_service.generate_detailed_response('1')
        offers_response = self.data_service.generate_detailed_response('2')
        timings_response = self.data_service.generate_detailed_response('3')
        
        self.assertIsNotNone(menu_response)
        self.assertIn("BBQ Nation Menu", menu_response)
        
        self.assertIsNotNone(offers_response)
        self.assertIn("Current Offers and Promotions", offers_response)
        
        self.assertIsNotNone(timings_response)
        self.assertIn("Restaurant Timings", timings_response)

if __name__ == "__main__":
    unittest.main() 