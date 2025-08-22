
import * as admin from 'firebase-admin';

// This is a server-side only file.
// It is used by API routes to interact with Firebase services.

let app: admin.app.App;

if (!admin.apps.length) {
  const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountString) {
    try {
      const serviceAccount = JSON.parse(serviceAccountString);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch(e) {
      console.error("Failed to parse or initialize Firebase Admin SDK", e);
    }
  } else {
    console.warn('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK will not be initialized. API routes using it will fail.');
  }
} else {
    app = admin.app();
}

const auth = app ? app.auth() : null;
const db = app ? app.firestore() : null;

// A helper function to check if the admin app is initialized
const isAdminAppInitialized = () => !!app && !!auth;

export { auth, db, isAdminAppInitialized };
export default admin;
