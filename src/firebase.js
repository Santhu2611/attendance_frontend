import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that y
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN-j--c24WDwOj7E-BPlq7KnYBSKQEYkg",
  authDomain: "college-management-19336.firebaseapp.com",
  projectId: "college-management-19336",
  storageBucket: "college-management-19336.appspot.com",
  messagingSenderId: "793585418128",
  appId: "1:793585418128:web:97cac6ff6593e3a7c7bd15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);