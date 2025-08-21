
'use server';

import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const SERVICE_ACCOUNT_CREDENTIALS = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

async function getGoogleSheetsClient() {
    if (!SERVICE_ACCOUNT_CREDENTIALS) {
        throw new Error("Google service account credentials are not set in environment variables.");
    }
    const credentials = JSON.parse(SERVICE_ACCOUNT_CREDENTIALS);
  
    const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
}

export async function appendToSheet(row: any[]) {
    if (!SHEET_ID) {
        console.warn("Google Sheet ID is not configured. Skipping sheet update.");
        return;
    }
  try {
    const sheets = await getGoogleSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1', // Assumes data is appended to 'Sheet1'
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
    // Depending on requirements, you might want to re-throw the error
    // or handle it silently. For now, we log the detailed error and continue.
  }
}
