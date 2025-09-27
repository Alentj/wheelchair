// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase Configuration (Replace with actual credentials)
const firebaseConfig = {
  apiKey: "AIzaS*********************",
  authDomain: "smart-wheel-chair-8574a.firebaseapp.com",
  projectId: "smar***********74a",
  storageBucket: "smart-wheel-chair-8574a.firebasestorage.app",
  messagingSenderId: "84********39",
  appId: "1:84*********9:web:18b3**********87aa84fe"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle Password Reset
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('reset-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Reset link sent! Check your email.");
        } catch (error) {
            alert(error.message);
        }
    });
});

