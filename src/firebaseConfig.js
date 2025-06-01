import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOj03YFtlSSZoGTbAYvs0kBm8gYeJndn0",
  authDomain: "cloud-oel-46c18.firebaseapp.com",
  projectId: "cloud-oel-46c18",
  storageBucket: "cloud-oel-46c18.firebasestorage.app",
  messagingSenderId: "276507109744",
  appId: "1:276507109744:web:1a23c28077b199595647b5",
  measurementId: "G-1Y28S541WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };