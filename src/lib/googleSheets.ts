import { google } from 'googleapis';
import { ConversationLog } from '../types';
import fs from 'fs';
import path from 'path';

// Interface for failed logs
interface FailedLogEntry {
  log: ConversationLog;
  timestamp: string;
  retryCount: number;
}

export class GoogleSheetsLogger {
  private failedLogsPath: string;

  constructor(credentials: any, spreadsheetId: string, sheetName: string = 'Conversations') {
    this.failedLogsPath = path.join(process.cwd(), 'failed_logs.json');
    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
  }

  private auth;
  private sheets;
  private spreadsheetId: string;
  private sheetName: string;

  /**
   * Logs a conversation to Google Sheets
   * @param log Conversation data to log
   * @returns Success status and message
   */
  public async logConversation(log: ConversationLog): Promise<void> {
    try {
      const row = this.formatLogToRow(log);
      await this.appendRow(row);
    } catch (error: any) {
      console.error('Failed to log conversation to Google Sheets:', error);
      // Trigger notification or alert for admin
      this.notifyAdminOfFailure(log, error);
      throw error;
    }
  }

  private formatLogToRow(log: ConversationLog): string[] {
    return [
      log.modality,
      log.callTime,
      log.phoneNumber || 'NA',
      log.callOutcome,
      log.roomName || 'NA',
      log.bookingDate || 'NA',
      log.bookingTime || 'NA',
      log.numberOfGuests?.toString() || 'NA',
      log.customerName || 'NA',
      log.callSummary
    ];
  }

  private async appendRow(row: string[]): Promise<void> {
    const request = {
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row]
      }
    };

    try {
      await this.sheets.spreadsheets.values.append(request);
    } catch (error) {
      console.error('Failed to append row:', error);
      throw error;
    }
  }

  /**
   * Creates a new sheet if it doesn't exist
   * @returns Success status
   */
  public async initializeSheet(): Promise<void> {
    const headers = [
      'Modality',
      'Call Time',
      'Phone Number',
      'Call Outcome',
      'Room Name',
      'Booking Date',
      'Booking Time',
      'Number of Guests',
      'Customer Name',
      'Call Summary'
    ];

    try {
      // Check if sheet exists
      const response = await this.sheets.spreadsheets.get({
        spreadsheetId: this.spreadsheetId
      });

      const sheetExists = response.data.sheets?.some(
        (sheet: any) => sheet.properties?.title === this.sheetName
      );

      // Create sheet if it doesn't exist
      if (!sheetExists) {
        await this.sheets.spreadsheets.batchUpdate({
          spreadsheetId: this.spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: this.sheetName
                  }
                }
              }
            ]
          }
        });

        // Add header row
        await this.sheets.spreadsheets.values.update({
          spreadsheetId: this.spreadsheetId,
          range: `${this.sheetName}!A1:J1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });
      }
    } catch (error) {
      console.error('Failed to ensure sheet exists:', error);
      throw error;
    }
  }

  /**
   * Validates the conversation log data
   * @param log Conversation data to validate
   * @returns Validation result and errors if any
   */
  public validateLog(log: ConversationLog): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!log.modality) errors.push('Modality is required');
    if (!log.callTime) errors.push('Call time is required');
    if (!log.callOutcome) errors.push('Call outcome is required');
    if (!log.callSummary) errors.push('Call summary is required');

    // Format validations
    if (log.phoneNumber && !/^\d{10}$/.test(log.phoneNumber)) {
      errors.push('Phone number must be 10 digits');
    }

    if (log.bookingDate && !/^\d{4}-\d{2}-\d{2}$/.test(log.bookingDate)) {
      errors.push('Booking date must be in YYYY-MM-DD format');
    }

    if (log.bookingTime && !/^\d{2}:\d{2}$/.test(log.bookingTime)) {
      errors.push('Booking time must be in HH:MM format');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Notifies admin of logging failures
   * @param log The conversation data that failed to log
   * @param error The error that occurred
   */
  private notifyAdminOfFailure(log: ConversationLog, error: any): void {
    // In a real system, this could send an email, Slack notification, etc.
    console.error(`ALERT: Failed to log conversation at ${new Date().toISOString()}`);
    console.error('Log data:', JSON.stringify(log, null, 2));
    console.error('Error:', error);

    // Store failed logs for retry
    this.storeFailedLog(log);
  }

  /**
   * Stores failed log entries for later retry
   * @param log The conversation log that failed
   */
  private storeFailedLog(log: ConversationLog): void {
    try {
      // Read existing failed logs or initialize with empty array
      let failedLogs: FailedLogEntry[] = [];
      
      if (fs.existsSync(this.failedLogsPath)) {
        const data = fs.readFileSync(this.failedLogsPath, 'utf8');
        failedLogs = JSON.parse(data);
      }
      
      // Add new failed log
      failedLogs.push({
        log,
        timestamp: new Date().toISOString(),
        retryCount: 0
      });
      
      // Write back to file
      fs.writeFileSync(this.failedLogsPath, JSON.stringify(failedLogs, null, 2));
    } catch (e) {
      console.error('Failed to store failed log:', e);
    }
  }

  /**
   * Retries failed log entries
   * @returns Number of successfully retried logs
   */
  public async retryFailedLogs(): Promise<number> {
    try {
      if (!fs.existsSync(this.failedLogsPath)) {
        return 0;
      }
      
      const data = fs.readFileSync(this.failedLogsPath, 'utf8');
      const failedLogs: FailedLogEntry[] = JSON.parse(data);
      
      if (failedLogs.length === 0) return 0;

      let successCount = 0;
      const stillFailed: FailedLogEntry[] = [];

      for (const item of failedLogs) {
        try {
          if (item.retryCount < 3) { // Limit retry attempts
            await this.logConversation(item.log);
            successCount++;
            continue; // Don't add to stillFailed if successful
          }
          // If we've exceeded retry attempts, keep in the list
          stillFailed.push(item);
        } catch (e) {
          item.retryCount++;
          stillFailed.push(item);
        }
      }

      // Update the file with remaining failed logs
      fs.writeFileSync(this.failedLogsPath, JSON.stringify(stillFailed, null, 2));
      return successCount;
    } catch (e) {
      console.error('Error retrying failed logs:', e);
      return 0;
    }
  }
} 