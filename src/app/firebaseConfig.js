
  import {getFirestore} from "firebase/firestore";
  import { initializeApp } from "firebase/app";
  const firebaseConfig = {
    apiKey: "AIzaSyCEb16ixeOneCQg4NHGhqwuQo3XjTg1LLA",
    authDomain: "invoiceflow-ru3dl.firebaseapp.com",
    projectId: "invoiceflow-ru3dl",
    storageBucket: "invoiceflow-ru3dl.firebasestorage.app",
    messagingSenderId: "358337464280",
    appId: "1:358337464280:web:33ec1f469c0f4365b754ad"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  export {db};
