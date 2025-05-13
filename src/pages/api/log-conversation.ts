import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';
import { ConversationLog } from '../../types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const log: ConversationLog = req.body;

    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const sheetName = 'Conversations';

    const row = [
      log.modality,
      log.callTime,
      log.phoneNumber || 'N/A',
      log.callOutcome,
      log.roomName || 'N/A',
      log.bookingDate || 'N/A',
      log.bookingTime || 'N/A',
      log.numberOfGuests?.toString() || 'N/A',
      log.customerName || 'N/A',
      log.callSummary
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:J`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row]
      }
    });

    res.status(200).json({ message: 'Conversation logged successfully' });
  } catch (error) {
    console.error('Failed to log conversation:', error);
    res.status(500).json({ message: 'Failed to log conversation' });
  }
} 