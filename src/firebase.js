import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCMiqJ5Zlso1bGvDy3L5Na49b2eFzQZZC4",
  authDomain: "smit-learning-22.firebaseapp.com",
  projectId: "smit-learning-22",
  storageBucket: "smit-learning-22.appspot.com",
  messagingSenderId: "19440605166",
  appId: "1:19440605166:web:4a4dd7a7a7e087208a20ff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };