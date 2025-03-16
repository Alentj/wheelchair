// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyByByuUdrz46s5OHy09Vc3q3bEfz9HAdYU",
    authDomain: "smart-wheel-chair-8574a.firebaseapp.com",
    projectId: "smart-wheel-chair-8574a",
    storageBucket: "smart-wheel-chair-8574a.appspot.com",
    messagingSenderId: "841133598939",
    appId: "1:841133598939:web:18b3a941b19f7147aa84fe"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const successMessage = document.getElementById('success-message');

    // Check if inputs are empty
    if (!name || !email || !message) {
        alert("Please fill in all fields.");
        return;
    }

    // Push data to Firebase
    push(ref(db, 'messages'), {
        name: name,
        email: email,
        message: message
    }).then(() => {
        console.log("Data stored successfully!");
        document.getElementById('contact-form').reset();
        successMessage.textContent = "Message sent successfully!";
        successMessage.style.display = "block";
        successMessage.style.color = "green";
    
        // Hide message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }).catch(error => {
        console.error("Error submitting message:", error);
        successMessage.textContent = "Error sending message. Please try again.";
        successMessage.style.display = "block";
        successMessage.style.color = "red";
    });
    
});
