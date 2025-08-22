
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "invoiceflow-ru3dl",
  "appId": "1:358337464280:web:a0380fe0a04c6bfbb754ad",
  "storageBucket": "invoiceflow-ru3dl.firebasestorage.app",
  "apiKey": "AIzaSyCEb16ixeOneCQg4NHGhqwuQo3XjTg1LLA",
  "authDomain": "invoiceflow-ru3dl.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "358337464280"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
