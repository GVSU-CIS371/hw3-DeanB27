import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCBY-kmWiEtt7FPQphTzDcRL365v6S3vsE",
  authDomain: "webapphw3-6a02e.firebaseapp.com",
  projectId: "webapphw3-6a02e",
  storageBucket: "webapphw3-6a02e.firebasestorage.app",
  messagingSenderId: "293818983971",
  appId: "1:293818983971:web:74a30fcb601addad337396"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
