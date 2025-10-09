// ai_chat.js
const messagesDiv = document.getElementById("messages");

async function sendMessage() {
    const input = document.getElementById("userInput");
    const userMessage = input.value.trim();
    if (!userMessage) return;

    addMessage("user", userMessage);
    input.value = "";
    addMessage("bot", "Thinking...");

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();
        messagesDiv.lastChild.remove(); // remove "Thinking..."
        addMessage("bot", data.reply);

    } catch (error) {
        messagesDiv.lastChild.textContent = "Bot: Error connecting to AI.";
        console.error(error);
    }
}

function addMessage(role, text) {
    const msg = document.createElement("div");
    msg.className = role;
    msg.textContent = (role === "user" ? "You: " : "AI: ") + text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
