// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDHGlnWFxmiMqOuYFwWvusuQ_vLP2kGe7w",
  authDomain: "blog-management-system-718dc.firebaseapp.com",
  projectId: "blog-management-system-718dc",
  storageBucket: "blog-management-system-718dc.appspot.com",
  messagingSenderId: "929325236702",
  appId: "1:929325236702:web:266756e71a3b65739a9d4f",
  measurementId: "G-SR449Y4N0L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage, ref, uploadBytes, getDownloadURL };