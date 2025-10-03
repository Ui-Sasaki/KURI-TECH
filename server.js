// server.js
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

console.log("Starting server...");
console.log("OPENAI_API_KEY loaded:", !!process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    console.log("Incoming message from frontend:", message);

    if (!message) {
        return res.status(400).json({ reply: "No message provided" });
    }

    try {
        // Call OpenAI Responses API
        const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-5-mini", // ✅ use a real model
                input: message,
            })
        });

        const data = await response.json();
        console.log("OpenAI response:", JSON.stringify(data, null, 2));

        if (data.output && data.output[0] && data.output[0].content[0].text) {
            res.json({ reply: data.output[0].content[0].text });
        } else {
            console.log("Invalid response from OpenAI API");
            res.status(500).json({ reply: "Error connecting to AI." });
        }
    } catch (err) {
        console.error("Fetch error when calling OpenAI API:", err);
        res.status(500).json({ reply: "Error connecting to AI." });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
