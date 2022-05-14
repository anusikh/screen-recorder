// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDXNnIuoOox8B3t7qGkHfEowOf-ud3_2cM",
  authDomain: "scorder-f2d58.firebaseapp.com",
  projectId: "scorder-f2d58",
  storageBucket: "scorder-f2d58.appspot.com",
  messagingSenderId: "893059432132",
  appId: "1:893059432132:web:ec620e1780d12d1a019391",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
