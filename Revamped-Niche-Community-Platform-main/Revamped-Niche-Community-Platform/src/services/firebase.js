import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB9qOaDqh-8ZkNSqEuxIkBangguC9tpgWw",
    authDomain: "revampednichecommunityplatform.firebaseapp.com",
    databaseURL: "https://revampednichecommunity-default-rtdb.firebaseio.com/",
    projectId: "revampednichecommunity",
    storageBucket: "revampednichecommunity.firebasestorage.app",
    messagingSenderId: "209998456918",
    appId: "1:209998456918:web:de64d089e62b0efe35b3f7",
    measurementId: "G-KMHBW5DH9K"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log("Firebase Authentication persistence is set to Local Storage.");
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

export { app, auth, db, rtdb }; 
