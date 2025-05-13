import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleSheetsLogger } from '../../lib/googleSheets';
import { ConversationLog } from '../../types';

// API handler for logging conversations to Google Sheets
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Get the conversation log from the request body
    const log: ConversationLog = req.body.log ? JSON.parse(req.body.log) : req.body;

    // Validate required fields
    if (!log.modality || !log.callTime || !log.callOutcome || !log.callSummary) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Initialize Google Sheets logger
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}');
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!credentials || !Object.keys(credentials).length || !spreadsheetId) {
      return res.status(500).json({
        success: false,
        message: 'Google Sheets configuration missing'
      });
    }

    const sheetsLogger = new GoogleSheetsLogger(credentials, spreadsheetId);
    
    // Initialize sheet if needed
    await sheetsLogger.initializeSheet();

    // Log the conversation
    await sheetsLogger.logConversation(log);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Conversation logged successfully'
    });
  } catch (error: any) {
    console.error('Error logging conversation:', error);
    
    // Return error response
    return res.status(500).json({
      success: false,
      message: `Failed to log conversation: ${error.message}`
    });
  }
} 