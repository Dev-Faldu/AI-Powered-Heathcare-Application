
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfKqWvcoUxvFEGQebE9xylYuvO2dJDvOU",
  authDomain: "apnedoctors.firebaseapp.com",
  databaseURL: "https://apnedoctors-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "apnedoctors",
  storageBucket: "apnedoctors.firebasestorage.app",
  messagingSenderId: "314645706342",
  appId: "1:314645706342:web:c4912d5f4d13c892dc5fa7",
  measurementId: "G-WQTDW1Y7Z5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics conditionally (will only work in browser environment)
const analytics = async () => {
  if (await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

// Initialize services
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Add scopes for Google provider
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile');

// Important: Adding custom parameters to handle domain verification issues
googleProvider.setCustomParameters({
  // This forces user to select account every time, helping with some auth issues
  prompt: 'select_account',
  // Optional: You can add login_hint if you want to suggest a specific account
  // login_hint: 'user@example.com'
});

const db = getFirestore(app);
const storage = getStorage(app);

// Call analytics
analytics();

export { auth, googleProvider, db, storage };
