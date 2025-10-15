import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlUBTE6VDDDCwQz3RoCB3qcPy0WdbBajU",
  authDomain: "tutorial-85b21.firebaseapp.com",
  projectId: "tutorial-85b21",
  storageBucket: "tutorial-85b21.appspot.com",
  messagingSenderId: "968839138284",
  appId: "1:968839138284:web:c9f44fb56561cccbab8ec9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);