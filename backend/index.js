require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const apiKey = process.env.QWEN_API_KEY;
const isMockMode = !apiKey || apiKey === "your_dashscope_api_key_here";

if (isMockMode) {
  console.warn("⚠️  Warning: QWEN_API_KEY is not set or is using the default placeholder in backend/.env.");
  console.warn("Please set a valid QWEN_API_KEY in backend/.env to use the Qwen API features.");
  console.warn("Running in Demo/Mock Mode. Requests will return simulated responses.");
} else {
  console.log(`ℹ️  OpenAI client initialized targeting Qwen API baseURL: ${process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"}`);
}

const client = new OpenAI({
  apiKey: apiKey || "dummy-key-for-development",
  baseURL: process.env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
});


app.get('/', (req, res) => {
  res.json({ message: "Welcome to the ShopWise Backend API! Use /health to check status." });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date(), service: 'ShopWise Backend' });
});

app.post("/api/qwen/reply", async (req, res) => {
  try {
    let messages = req.body.messages;
    if (!messages && req.body.systemPrompt && req.body.userContent) {
      messages = [
        { role: "system", content: req.body.systemPrompt },
        { role: "user", content: req.body.userContent }
      ];
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array in request body" });
    }

    if (isMockMode) {
      const messagesStr = JSON.stringify(messages).toLowerCase();
      let reply = "Hi, thank you for reaching out! We have received your query and are looking into it. We will get back to you shortly. Best regards, ShopWise Support (Demo Mode)";
      if (messagesStr.includes("shipping") || messagesStr.includes("package") || messagesStr.includes("where")) {
        reply = "Hi, your order has been dispatched from our warehouse. The carrier tracking page should update shortly. Best regards, ShopWise Support (Demo Mode)";
      } else if (messagesStr.includes("bulk") || messagesStr.includes("wholesale") || messagesStr.includes("corporate")) {
        reply = "Hi, thanks for your inquiry! We offer discounted pricing tiers for bulk and wholesale orders. Please let us know the quantity you need, and we will get back to you with a custom quote. Best regards, ShopWise Support (Demo Mode)";
      }
      return res.json({
        reply,
        choices: [{ message: { content: reply } }],
        mock: true
      });
    }

    const completion = await client.chat.completions.create({
      model: "qwen-plus",
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    // Return both 'reply' field for frontend and full completion for standard testing
    res.json({
      reply: reply.trim(),
      ...completion
    });
  } catch (err) {
    console.error("Qwen API Reply error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.post("/api/qwen/compose", async (req, res) => {
  try {
    let messages = req.body.messages;
    if (!messages && req.body.systemPrompt && req.body.userContent) {
      messages = [
        { role: "system", content: req.body.systemPrompt },
        { role: "user", content: req.body.userContent }
      ];
    }

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Missing or invalid 'messages' array in request body" });
    }

    if (isMockMode) {
      const promptStr = JSON.stringify(messages).toLowerCase();
      let reply = "Hi, this is a mock outbound email drafted by the ShopWise Co-Pilot. Configure QWEN_API_KEY in the backend to generate real AI replies. Best regards, ShopWise Support (Demo Mode)";
      if (promptStr.includes("discount") || promptStr.includes("offer") || promptStr.includes("coupon")) {
        reply = "Hi, we appreciate you being a valued customer! Use coupon code LOYAL15 at checkout to receive 15% off your next order. Best regards, ShopWise Support (Demo Mode)";
      } else if (promptStr.includes("feedback") || promptStr.includes("review") || promptStr.includes("survey")) {
        reply = "Hi, we hope you are enjoying your recent purchase! Could you spare 2 minutes to share your feedback with us? It helps us improve our service. Best regards, ShopWise Support (Demo Mode)";
      }
      return res.json({
        reply,
        choices: [{ message: { content: reply } }],
        mock: true
      });
    }

    const completion = await client.chat.completions.create({
      model: "qwen-plus",
      messages,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    res.json({
      reply: reply.trim(),
      ...completion
    });
  } catch (err) {
    console.error("Qwen API Compose error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
