// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyByByuUdrz46s5OHy09Vc3q3bEfz9HAdYU",
    authDomain: "smart-wheel-chair-8574a.firebaseapp.com",
    databaseURL: "https://smart-wheel-chair-8574a-default-rtdb.firebaseio.com",
    projectId: "smart-wheel-chair-8574a",
    storageBucket: "smart-wheel-chair-8574a.appspot.com",
    messagingSenderId: "841133598939",
    appId: "1:841133598939:web:18b3a941b19f7147aa84fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Global Variables
let userId = null;
let isListening = false; // Prevent duplicate recognition starts

// ESP8266 IP Address (Replace with actual IP)
const ESP8266_IP = "http://192.168.1.100";

// Function to send command to ESP8266
function sendCommand(command) {
    fetch(`${ESP8266_IP}/control?cmd=${command}`, { mode: "no-cors" })
        .then(() => console.log("✅ Command sent:", command))
        .catch(error => console.error("❌ Error:", error));
}

// Speech Recognition Setup
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-US";

// Authenticate User & Start Listening
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        document.getElementById("recognized-text").innerText = `Logged in as: ${user.email}`;
        startListening(); // Start voice recognition immediately
    } else {
        window.location.href = "login.html"; // Redirect if not authenticated
    }
});

// Function to continuously listen for commands
function startListening() {
    if (isListening) return; // Prevent multiple instances
    isListening = true;

    try {
        recognition.start();
        console.log("🎤 Speech recognition started...");
    } catch (error) {
        console.error("❌ Speech recognition error:", error);
    }

    recognition.onresult = function (event) {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("🎤 Recognized:", command); // ✅ Log every recognized voice

        document.getElementById("recognized-text").innerText = `Recognized: "${command}"`;

        // Execute command
        if (command.includes("forward")) sendCommand("forward");
        else if (command.includes("backward")) sendCommand("backward");
        else if (command.includes("left")) sendCommand("left");
        else if (command.includes("right")) sendCommand("right");
        else if (command.includes("stop")) sendCommand("stop");

        // Restart recognition only after command execution
        setTimeout(() => {
            isListening = false; // Allow restart
            recognition.stop();
        }, 1000);
    };

    recognition.onend = () => {
        console.log("🎤 Speech recognition stopped. Restarting...");
        isListening = false; // Reset flag when recognition stops
        startListening(); // Restart only after it stops
    };
}

// Add Event Listeners
document.getElementById("speed-slider").addEventListener("input", function () {
    document.getElementById("speed-value").innerText = this.value + "%";
    sendCommand("speed-" + this.value);
});
document.getElementById("forward-btn").addEventListener("click", () => sendCommand("forward"));
document.getElementById("backward-btn").addEventListener("click", () => sendCommand("backward"));
document.getElementById("left-btn").addEventListener("click", () => sendCommand("left"));
document.getElementById("right-btn").addEventListener("click", () => sendCommand("right"));
document.getElementById("stop-btn").addEventListener("click", () => sendCommand("stop"));
document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "index.html";
});
