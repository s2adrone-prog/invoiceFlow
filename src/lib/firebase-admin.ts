
import * as admin from 'firebase-admin';

// This is a server-side only file.
// It is used by API routes to interact with Firebase services.

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountString) {
  // In a real application, you might want to throw an error here.
  // For this context, we will log a warning.
  console.warn('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK will not be initialized. API routes using it will fail.');
}

if (!admin.apps.length && serviceAccountString) {
  try {
    const serviceAccount = JSON.parse(serviceAccountString);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch(e) {
    console.error("Failed to parse or initialize Firebase Admin SDK", e);
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
