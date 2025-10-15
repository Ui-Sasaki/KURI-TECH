const fetch = require('node-fetch');
require('dotenv').config();

(async () => {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello" }]
      })
    });
    const data = await res.json();
    console.log("Test OpenAI:", data);
  } catch (err) {
    console.error(err);
  }
})();
