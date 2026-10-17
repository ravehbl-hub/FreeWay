// Gemini service: the ONLY place in the project that talks to Google Gemini.
// Runs on the server only - the API key never reaches the browser.
// Adds a timeout (AbortController) and converts Gemini errors to HTTP errors.
import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

let client = null;

// Creates the Gemini client once (lazy), or throws 503 if the key is missing
function getClient() {
  if (!env.geminiApiKey) {
    throw new AppError(503, 'AI is not configured on the server (missing GEMINI_API_KEY)');
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.geminiApiKey });
  }
  return client;
}

// Turns any Gemini / network error into an AppError with a fitting status code
function toAppError(err, timedOut) {
  if (err instanceof AppError) {
    return err;
  }
  if (timedOut || err.name === 'AbortError') {
    return new AppError(504, 'The AI took too long to answer. Please try again.');
  }
  if (err.status === 429) {
    return new AppError(429, 'The AI service is busy (quota reached). Please try again in a minute.');
  }
  if (err.status === 400 || err.status === 401 || err.status === 403) {
    return new AppError(502, 'The AI service rejected the request (check the API key / model name).');
  }
  return new AppError(502, 'The AI service is unavailable right now. Please try again later.');
}

// Sends a request to Gemini and returns the full text answer
export async function generateText(systemPrompt, messages) {
  const ai = getClient();
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, env.aiTimeoutMs);

  try {
    const response = await ai.models.generateContent({
      model: env.geminiModel,
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 800,
        abortSignal: controller.signal,
      },
    });
    return response.text || '';
  } catch (err) {
    throw toAppError(err, timedOut);
  } finally {
    clearTimeout(timer);
  }
}

// Sends a request and forces a JSON answer that matches the given JSON schema (structured output)
export async function generateJson(systemPrompt, userText, schema) {
  const ai = getClient();
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, env.aiTimeoutMs);

  try {
    const response = await ai.models.generateContent({
      model: env.geminiModel,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
        abortSignal: controller.signal,
      },
    });
    return JSON.parse(response.text);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new AppError(502, 'The AI returned an invalid answer. Please try again.');
    }
    throw toAppError(err, timedOut);
  } finally {
    clearTimeout(timer);
  }
}

// Streaming version: calls onChunk(text) for every piece of the answer, returns the full text at the end
export async function streamText(systemPrompt, messages, onChunk) {
  const ai = getClient();
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, env.aiTimeoutMs);

  try {
    const stream = await ai.models.generateContentStream({
      model: env.geminiModel,
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 800,
        abortSignal: controller.signal,
      },
    });
    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.text || '';
      fullText += text;
      onChunk(text);
    }
    return fullText;
  } catch (err) {
    throw toAppError(err, timedOut);
  } finally {
    clearTimeout(timer);
  }
}
