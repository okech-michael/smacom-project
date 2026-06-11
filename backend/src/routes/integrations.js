import express from 'express';
import upload from '../middleware/upload.js';
import { uploadFile } from '../config/storage.js';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const router = express.Router();
const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

const createChatCompletion = async (client, payload) => {
  if (typeof client.createChatCompletion === 'function') {
    return client.createChatCompletion(payload);
  }
  if (client.chat?.completions?.create) {
    return client.chat.completions.create(payload);
  }
  if (client.responses?.create) {
    return client.responses.create({ model: payload.model, input: payload.messages.map((msg) => `${msg.role}: ${msg.content}`).join('\n') });
  }
  throw new Error('Unsupported OpenAI client API');
};

const extractOpenAIText = (response) => {
  return (
    response?.data?.choices?.[0]?.message?.content ||
    response?.choices?.[0]?.message?.content ||
    response?.output?.[0]?.content?.find((item) => item.type === 'output_text' || item.type === 'message')?.text ||
    response?.output_text ||
    response?.text ||
    'No response from AI.'
  );
};

router.post('/core/upload-file', upload.single('file'), async (req, res) => {
  try {
    const url = await uploadFile(req.file);
    return res.json({ file_url: url });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

router.post('/core/invoke-llm', async (req, res) => {
  const prompt = req.body.prompt || req.body.message || '';
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!openai) {
    return res.json({
      output: `AI is not configured. Received prompt: ${prompt}`,
    });
  }

  try {
    const response = await createChatCompletion(openai, {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI advisor for a sustainable marketplace and waste management platform.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 400,
    });

    const text = extractOpenAIText(response);
    return res.json({ output: text });
  } catch (error) {
    console.error('OpenAI request failed:', error?.message || error);
    return res.status(500).json({ error: error.message || 'AI request failed' });
  }
});

export default router;
