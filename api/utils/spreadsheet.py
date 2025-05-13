import os
import pandas as pd
import gspread
from oauth2client.service_account import ServiceAccountCredentials
from typing import List, Dict, Any, Optional

class SpreadsheetManager:
    """Class to manage spreadsheet operations"""
    
    def __init__(self, credentials_path: str = None):
        """Initialize the spreadsheet manager with Google credentials"""
        self.credentials_path = credentials_path or os.environ.get('GOOGLE_CREDENTIALS_PATH')
        self.client = None
        self.spreadsheet = None
        
    def connect(self, spreadsheet_name: str) -> bool:
        """Connect to the specified Google spreadsheet"""
        try:
            # Define the scope
            scope = ['https://spreadsheets.google.com/feeds',
                    'https://www.googleapis.com/auth/drive']
            
            # Authenticate
            if self.credentials_path:
                credentials = ServiceAccountCredentials.from_json_keyfile_name(
                    self.credentials_path, scope)
                self.client = gspread.authorize(credentials)
                
                # Open the spreadsheet
                self.spreadsheet = self.client.open(spreadsheet_name)
                return True
            else:
                print("Credentials path not provided")
                return False
        except Exception as e:
            print(f"Error connecting to spreadsheet: {e}")
            return False
    
    def get_worksheet_as_df(self, worksheet_name: str) -> Optional[pd.DataFrame]:
        """Get worksheet data as a pandas DataFrame"""
        if not self.spreadsheet:
            print("Not connected to spreadsheet")
            return None
        
        try:
            # Open the worksheet
            worksheet = self.spreadsheet.worksheet(worksheet_name)
            
            # Get all data
            data = worksheet.get_all_records()
            
            # Convert to DataFrame
            return pd.DataFrame(data)
        except Exception as e:
            print(f"Error getting worksheet data: {e}")
            return None
    
    def update_worksheet(self, worksheet_name: str, data: List[Dict[str, Any]]) -> bool:
        """Update worksheet with data"""
        if not self.spreadsheet:
            print("Not connected to spreadsheet")
            return False
        
        try:
            # Open the worksheet
            worksheet = self.spreadsheet.worksheet(worksheet_name)
            
            # Convert data to DataFrame
            df = pd.DataFrame(data)
            
            # Get headers and values
            headers = df.columns.tolist()
            values = df.values.tolist()
            
            # Update worksheet
            worksheet.update([headers] + values)
            return True
        except Exception as e:
            print(f"Error updating worksheet: {e}")
            return False
    
    # CSV fallback methods for local development without Google credentials
    
    def load_from_csv(self, file_path: str) -> Optional[pd.DataFrame]:
        """Load data from a CSV file"""
        try:
            return pd.read_csv(file_path)
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return None
    
    def save_to_csv(self, df: pd.DataFrame, file_path: str) -> bool:
        """Save data to a CSV file"""
        try:
            df.to_csv(file_path, index=False)
            return True
        except Exception as e:
            print(f"Error saving CSV: {e}")
            return False 