// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "-",
  authDomain: "senja-website.firebaseapp.com",
  projectId: "senja-website",
  storageBucket: "senja-website.appspot.com",
  messagingSenderId: "866908253628",
  appId: "1:866908253628:web:cc0c9b0f8f01673b03cfb9",
  measurementId: "G-4VXVQGV0ZT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the app
export { app };
