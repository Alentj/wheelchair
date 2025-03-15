const firebaseConfig = {
  apiKey: "AIzaSyByByuUdrz46s5OHy09Vc3q3bEfz9HAdYU",
  authDomain: "smart-wheel-chair-8574a.firebaseapp.com",
  projectId: "smart-wheel-chair-8574a",
  storageBucket: "smart-wheel-chair-8574a.firebasestorage.app",
  messagingSenderId: "841133598939",
  appId: "1:841133598939:web:18b3a941b19f7147aa84fe"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();