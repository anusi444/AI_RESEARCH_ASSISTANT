import express from 'express';
import { ChatMessage } from '../models/chat.model';
import { authenticateToken } from '../middleware/auth.middleware';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Helper function to interact with ChatGPT
async function getChatGPTResponse(prompt: string, systemMessage?: string) {
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

    return response.data.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get response from ChatGPT');
  }
}

// Send a message to ChatGPT
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    const response = await getChatGPTResponse(message);

    const chatMessage = new ChatMessage({
      userId: req.user._id,
      message,
      response,
      type: 'chat',
    });

    await chatMessage.save();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process chat message' });
  }
});

// Get conversation history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const history = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch chat history' });
  }
});

// Generate research insights
router.post('/research', authenticateToken, async (req, res) => {
  try {
    const { topic, context } = req.body;
    const systemMessage = "You are a research assistant. Provide detailed, academic insights with citations where possible.";
    const prompt = `Please provide research insights about ${topic}.${context ? ` Consider this context: ${context}` : ''}`;
    
    const response = await getChatGPTResponse(prompt, systemMessage);

    const chatMessage = new ChatMessage({
      userId: req.user._id,
      message: prompt,
      response,
      type: 'research',
    });

    await chatMessage.save();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate research insights' });
  }
});

// Generate references
router.post('/references', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const systemMessage = "You are a citation expert. Generate academic citations in various formats.";
    const prompt = `Please analyze this text and suggest relevant academic references and citations:\n${text}`;
    
    const response = await getChatGPTResponse(prompt, systemMessage);

    const chatMessage = new ChatMessage({
      userId: req.user._id,
      message: prompt,
      response,
      type: 'references',
    });

    await chatMessage.save();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate references' });
  }
});

export default router;
