"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_model_1 = require("../models/chat.model");
const auth_middleware_1 = require("../middleware/auth.middleware");
const openai_1 = require("openai");
const router = express_1.default.Router();
// Initialize OpenAI
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
// Helper function to interact with ChatGPT
async function getChatGPTResponse(prompt, systemMessage) {
    var _a, _b;
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                ...(systemMessage ? [{ role: "system", content: systemMessage }] : []),
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });
        return ((_b = (_a = response.data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || 'No response generated';
    }
    catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Failed to get response from ChatGPT');
    }
}
// Send a message to ChatGPT
router.post('/', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const { message } = req.body;
        const response = await getChatGPTResponse(message);
        const chatMessage = new chat_model_1.ChatMessage({
            userId: req.user._id,
            message,
            response,
            type: 'chat',
        });
        await chatMessage.save();
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to process chat message' });
    }
});
// Get conversation history
router.get('/history', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const history = await chat_model_1.ChatMessage.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(history);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch chat history' });
    }
});
// Generate research insights
router.post('/research', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const { topic, context } = req.body;
        const systemMessage = "You are a research assistant. Provide detailed, academic insights with citations where possible.";
        const prompt = `Please provide research insights about ${topic}.${context ? ` Consider this context: ${context}` : ''}`;
        const response = await getChatGPTResponse(prompt, systemMessage);
        const chatMessage = new chat_model_1.ChatMessage({
            userId: req.user._id,
            message: prompt,
            response,
            type: 'research',
        });
        await chatMessage.save();
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate research insights' });
    }
});
// Generate references
router.post('/references', auth_middleware_1.authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const systemMessage = "You are a citation expert. Generate academic citations in various formats.";
        const prompt = `Please analyze this text and suggest relevant academic references and citations:\n${text}`;
        const response = await getChatGPTResponse(prompt, systemMessage);
        const chatMessage = new chat_model_1.ChatMessage({
            userId: req.user._id,
            message: prompt,
            response,
            type: 'references',
        });
        await chatMessage.save();
        res.json({ response });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to generate references' });
    }
});
exports.default = router;
