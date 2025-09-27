// Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Your Firebase Configuration (Replace with your actual Firebase project credentials)
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
const db = getFirestore(app);

// Handle Registration
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // Create User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                createdAt: new Date()
            });

            alert("Account created successfully!");
            window.location.href = "login.html";
        } catch (error) {
            alert(error.message);
        }
    });
});

