import os
import csv
import gspread
from oauth2client.service_account import ServiceAccountCredentials

def create_google_sheet(credentials_path: str, spreadsheet_name: str):
    """Create a Google Sheet with data from CSV files"""
    try:
        # Define the scope
        scope = ['https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive']
        
        # Authenticate
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            credentials_path, scope)
        client = gspread.authorize(credentials)
        
        # Check if spreadsheet already exists
        try:
            spreadsheet = client.open(spreadsheet_name)
            print(f"Spreadsheet '{spreadsheet_name}' already exists.")
        except gspread.exceptions.SpreadsheetNotFound:
            # Create a new spreadsheet
            spreadsheet = client.create(spreadsheet_name)
            print(f"Created new spreadsheet: '{spreadsheet_name}'")
        
        # Get data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        
        # Create worksheets for each CSV file
        csv_files = ['menu.csv', 'offers.csv', 'timings.csv', 'faqs.csv']
        
        for csv_file in csv_files:
            worksheet_name = os.path.splitext(csv_file)[0].capitalize()
            
            # Check if worksheet already exists
            try:
                worksheet = spreadsheet.worksheet(worksheet_name)
                print(f"Worksheet '{worksheet_name}' already exists. Updating...")
                # Clear existing data
                worksheet.clear()
            except gspread.exceptions.WorksheetNotFound:
                # Create a new worksheet
                worksheet = spreadsheet.add_worksheet(title=worksheet_name, rows=100, cols=26)
                print(f"Created new worksheet: '{worksheet_name}'")
            
            # Load CSV data
            csv_path = os.path.join(data_dir, csv_file)
            
            with open(csv_path, 'r', encoding='utf-8') as file:
                reader = csv.reader(file)
                data = list(reader)
            
            # Update worksheet
            worksheet.update(data)
            print(f"Updated worksheet '{worksheet_name}' with data from {csv_file}")
        
        # Share the spreadsheet (make it public)
        spreadsheet.share(None, perm_type='anyone', role='reader')
        
        print(f"\nSpreadsheet URL: {spreadsheet.url}")
        print("The spreadsheet is now accessible to anyone with the link.")
        
        return spreadsheet.url
    
    except Exception as e:
        print(f"Error creating Google Sheet: {e}")
        return None

def export_to_csv(spreadsheet_url: str, credentials_path: str):
    """Export data from Google Sheet to CSV files"""
    try:
        # Define the scope
        scope = ['https://spreadsheets.google.com/feeds',
                'https://www.googleapis.com/auth/drive']
        
        # Authenticate
        credentials = ServiceAccountCredentials.from_json_keyfile_name(
            credentials_path, scope)
        client = gspread.authorize(credentials)
        
        # Open the spreadsheet
        spreadsheet = client.open_by_url(spreadsheet_url)
        
        # Get data directory
        data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
        
        # Export each worksheet to CSV
        worksheets = spreadsheet.worksheets()
        
        for worksheet in worksheets:
            worksheet_name = worksheet.title
            csv_file = f"{worksheet_name.lower()}.csv"
            csv_path = os.path.join(data_dir, csv_file)
            
            # Get all data from the worksheet
            data = worksheet.get_all_values()
            
            # Write to CSV
            with open(csv_path, 'w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                writer.writerows(data)
            
            print(f"Exported worksheet '{worksheet_name}' to {csv_file}")
        
        return True
    
    except Exception as e:
        print(f"Error exporting from Google Sheet: {e}")
        return False

if __name__ == "__main__":
    # Check for credentials file
    credentials_path = os.getenv('GOOGLE_CREDENTIALS_PATH')
    
    if not credentials_path:
        print("Warning: GOOGLE_CREDENTIALS_PATH environment variable not set.")
        print("To use Google Sheets, please set the path to your Google API credentials file.")
        print("For now, working with local CSV files only.\n")
    else:
        # Create a Google Sheet with our data
        spreadsheet_url = create_google_sheet(
            credentials_path, 
            "BBQ Nation Chatbot Data"
        )
        
        if spreadsheet_url:
            print("\nYou can now edit the data in Google Sheets.")
            print("To update the local CSV files with changes from Google Sheets, run:")
            print(f"python -c \"from utils.create_sheets import export_to_csv; export_to_csv('{spreadsheet_url}', '{credentials_path}')\"") 