// Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Document loaded, initializing Firebase...");

    // Firebase Config   (CONFIG YOUR FIRE BASE  HERE >>>>>>>)

    
    const firebaseConfig = {
        apiKey: "   ",
        authDomain: "smart-wheel-chair-8574a.firebaseapp.com",
        databaseURL: "  ",
        projectId: " ",
        storageBucket: " ",
        messagingSenderId: "",
        appId: "   "
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);

    // Global Variables
    let userId = null;

    // **Authenticate User & Allow Control**
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userId = user.uid;
            const recognizedText = document.getElementById("recognized-text");
            if (recognizedText) {
                recognizedText.innerText = `✅ Logged in as: ${user.email}`;
            } else {
                console.warn("⚠️ Element 'recognized-text' not found.");
            }
            listenBatteryStatus(); // Start listening to battery updates
        } else {
            window.location.href = "login.html"; // Redirect if not authenticated
        }
    });

    // **Function to send wheelchair command**
    function sendCommand(command) {
        if (!userId) {
            console.log("❌ User not authenticated");
            return;
        }
        set(ref(db, "wheelchair/command"), command)
            .then(() => {
                console.log(`✅ Command sent: ${command}`);
                
                // Speak the command response (with faster voice)
                const utterance = new SpeechSynthesisUtterance("Command received: " + command);
                utterance.rate = 1.5;  // Increase this value to make speech faster
                utterance.pitch = 1.0; // Normal pitch
                utterance.volume = 1.0; // Maximum volume
                window.speechSynthesis.speak(utterance);
            })
            .catch(error => console.error("❌ Error:", error));
    }

    // **Listen to Battery Updates from Firebase**  
    // WORK AYITT ELLA BUT LOOKING FORWARD TO CORRECT IT //
    function listenBatteryStatus() {
        const batteryRef = ref(db, "wheelchair/battery");
        onValue(batteryRef, (snapshot) => {
            const batteryLevel = snapshot.val();
            const batteryText = `🔋 Battery: ${batteryLevel ? batteryLevel.toFixed(1) : "N/A"}%`;
            
            const batteryElement = document.getElementById("battery-status");
            if (batteryElement) {
                batteryElement.innerText = batteryText;
            } else {
                console.warn("⚠️ Element 'battery-status' not found.");
            }
        });
    }

    // **Speech Recognition Setup**
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;  // Set to false to only process final results

    recognition.start();  // Start recognition immediately on page load

    // **Handle Speech Recognition**
    recognition.onresult = function (event) {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log("🎤 Recognized:", command);

        const recognizedText = document.getElementById("recognized-text");
        if (recognizedText) {
            recognizedText.innerText = `🎤 Recognized: "${command}"`;
        }

        // Check for command in recognized speech
        if (command.includes("forward")) sendCommand("forward");
        else if (command.includes("backward")) sendCommand("backward");
        else if (command.includes("left")) sendCommand("left");
        else if (command.includes("right")) sendCommand("right");
        else if (command.includes("stop")) sendCommand("stop");
    };

    // **Listen for errors in speech recognition**
    recognition.onerror = function (event) {
        console.error("❌ Speech Recognition Error:", event.error);
    };

    // **Listen for end of speech recognition session**
    recognition.onend = function () {
        console.log("🎤 Speech recognition ended. Restarting...");
        recognition.start();  // Automatically restart speech recognition
    };

    // **Button Controls for Physical Button Commands**
    function setupButton(id, command) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", () => {
                sendCommand(command);  // Send command to Firebase when button is clicked
            });
        } else {
            console.warn(`⚠️ Button '${id}' not found.`);
        }
    }

    // Setup the buttons for manual control
    // MANAUL CONTROLL
    setupButton("forward-btn", "forward");
    setupButton("backward-btn", "backward");
    setupButton("left-btn", "left");
    setupButton("right-btn", "right");
    setupButton("stop-btn", "stop");

    // **Logout Button**
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                console.log("✅ Logged out");
                window.location.href = "index.html";
            }).catch((error) => {
                console.error("❌ Logout failed:", error);
            });
        });
    } else {
        console.warn("⚠️ Logout button not found.");
    }
});

