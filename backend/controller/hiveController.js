const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const hiveChat = require('../model/hiveChat');

const askQuestion = async (req, res) => {
  try {
    const { prompt, chatId } = req.body;
    const userId = req.user.id; // assuming you're using protect middleware

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ message: "Prompt is required and must be a non-empty string." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    let chat;

    // If chatId is provided, update existing chat
    if (chatId) {
      chat = await hiveChat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ message: "Chat not found." });
      }
      chat.messages.push({ question: prompt, answer: [text] });
      await chat.save();
    } else {
      // Create a new chat session
      chat = new hiveChat({
        userid: userId,
        messages: [{ question: prompt, answer: [text] }]
      });
      await chat.save();
    }

    res.status(200).json({ reply: text, chatId: chat._id });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const historyFetch = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await hiveChat.find({ userid: userId });

    const history = chats.map(chat => {
      const firstQuestion = chat.messages[0]?.question || 'Untitled Chat';

      return {
        chatId: chat._id,
        title: firstQuestion,
        messages: chat.messages.flatMap(msg => [
          { type: 'user', message: msg.question },
          ...msg.answer.map(ans => ({ type: 'bot', message: ans }))
        ])
      };
    });

    res.status(200).json({ history });

  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { askQuestion,historyFetch };
