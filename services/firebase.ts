import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

// Securely load Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase config is loaded
if (!firebaseConfig.apiKey) {
    console.error("Firebase configuration is missing. Please check your .env.local file or hosting provider's environment variables.");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// IMPORTANT: Enable Google and Phone Sign-In in your Firebase Console
// Go to Authentication > Sign-in method and enable both providers.
// For Phone auth, you may need to configure domains for reCAPTCHA verification.
export const googleProvider = new GoogleAuthProvider();

// The RecaptchaVerifier is instantiated in the component where it's used
// as it needs a DOM element to render into.
export { RecaptchaVerifier };