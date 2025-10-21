import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, PhoneAuthProvider, RecaptchaVerifier } from "firebase/auth";

// =================================================================================================
// IMPORTANT: FIREBASE CONFIGURATION
// =================================================================================================
// 1. Go to the Firebase console (https://console.firebase.google.com/) and create a new project.
// 2. In your project, go to Project Settings > General tab.
// 3. Under "Your apps", click the web icon (</>) to add a new web app.
// 4. Follow the setup instructions and copy the `firebaseConfig` object provided.
// 5. Paste your `firebaseConfig` object here to replace the placeholder below.
// 6. In the Firebase console, go to Authentication > Sign-in method and enable "Email/Password", "Google", and "Phone".
// =================================================================================================

// Configuration has been populated with the API key you provided.
// Please verify that the other values match your project's settings in the Firebase console.
const firebaseConfig = {
  apiKey: "ArTPBCBBISU2UfgSR1NPLNK9zlo1",
  authDomain: "atlas-intelligence-platform.firebaseapp.com",
  projectId: "atlas-intelligence-platform",
  storageBucket: "atlas-intelligence-platform.appspot.com",
  messagingSenderId: "102938475610",
  appId: "1:102938475610:web:a1b2c3d4e5f6g7h8i9j0k1"
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