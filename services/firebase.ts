import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

// =================================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================================================
// This app is configured to load Firebase credentials from environment variables.
// For local development, create a `.env.local` file in the root of your project
// and add your Firebase config values there, prefixed with `VITE_`.
// For production (e.g., on Vercel), set these environment variables in the project settings.
//
// Example `.env.local` file:
// VITE_FIREBASE_API_KEY="AIzaSy..."
// VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
// VITE_FIREBASE_PROJECT_ID="your-project-id"
// VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
// VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
// VITE_FIREBASE_APP_ID="1:12345:web:abcdef"
// =================================================================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

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