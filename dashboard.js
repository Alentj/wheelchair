const ESP8266_IP = "http://192.168.1.100"; // Replace with your actual ESP8266 IP

// Function to send command to ESP8266
/*function sendCommand(command) {
    fetch(`${ESP8266_IP}/control?cmd=${command}`, { mode: "no-cors" })
        .then(() => console.log("Command sent:", command))
        .catch(error => console.error("Error:", error));
}*/

// Voice Recognition Setup
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true; // Keeps listening continuously
recognition.lang = "en-US";

recognition.onresult = function (event) {
    const command = event.results[event.results.length - 1][0].transcript.toLowerCase();
    
    // Display recognized voice text in real-time
    const recognizedTextElement = document.getElementById("recognized-text");
    recognizedTextElement.innerText = `Recognized: "${command}"`;
    recognizedTextElement.style.color = "#007bff"; // Highlight text
    
    // Match voice command and send action
    if (command.includes("forward")) sendCommand("forward");
    else if (command.includes("backward")) sendCommand("backward");
    else if (command.includes("left")) sendCommand("left");
    else if (command.includes("right")) sendCommand("right");
    else if (command.includes("stop")) sendCommand("stop");
    else if (command.includes("slow")) sendCommand("speed-" + document.getElementById("speed-slider").value);
};

// Start voice recognition **only once** and keep it running
document.getElementById("voice-btn").addEventListener("click", () => {
    recognition.start();
    document.getElementById("recognized-text").innerText = "Listening...";
    document.getElementById("recognized-text").style.color = "#FFA500"; // Change color while listening
});

// Speed Control Updates
document.getElementById("speed-slider").addEventListener("input", function () {
    document.getElementById("speed-value").innerText = this.value + "%";
    sendCommand("speed-" + this.value);
});

// Control Buttons
document.getElementById("forward-btn").addEventListener("click", () => sendCommand("forward"));
document.getElementById("backward-btn").addEventListener("click", () => sendCommand("backward"));
document.getElementById("left-btn").addEventListener("click", () => sendCommand("left"));
document.getElementById("right-btn").addEventListener("click", () => sendCommand("right"));
document.getElementById("stop-btn").addEventListener("click", () => sendCommand("stop"));

// Logout Functionality
document.getElementById("logout-btn").addEventListener("click", () => {
    window.location.href = "login.html";
});
