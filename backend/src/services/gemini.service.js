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

// Gemini sometimes answers 429 (quota) or 503 (overloaded) for a moment.
// This helper runs the request again once after a short pause before giving up.
async function withRetry(request) {
  try {
    return await request();
  } catch (err) {
    if (err.status === 429 || err.status === 503) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return request();
    }
    throw err;
  }
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
  if (err.status === 503) {
    return new AppError(503, 'The AI service is overloaded right now. Please try again in a few seconds.');
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
    const response = await withRetry(() => ai.models.generateContent({
      model: env.geminiModel,
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 800,
        abortSignal: controller.signal,
      },
    }));
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
    const response = await withRetry(() => ai.models.generateContent({
      model: env.geminiModel,
      contents: [{ role: 'user', parts: [{ text: userText }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
        abortSignal: controller.signal,
      },
    }));
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
    const stream = await withRetry(() => ai.models.generateContentStream({
      model: env.geminiModel,
      contents: messages,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.6,
        maxOutputTokens: 800,
        abortSignal: controller.signal,
      },
    }));
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

// Streaming + tools (function calling). Gemini may answer with a "function call" instead of text;
// then we run the tool with runTool(name, args), send the result back to Gemini and let it continue.
// At most MAX_TOOL_ROUNDS rounds, so a confused model can never loop forever.
// Returns { text, actions } - actions is the list of tools that were executed.
const MAX_TOOL_ROUNDS = 3;

export async function streamWithTools(systemPrompt, messages, toolDeclarations, runTool, onChunk) {
  const ai = getClient();
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, env.aiTimeoutMs);

  const contents = [...messages];
  const actions = [];
  let fullText = '';

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const stream = await withRetry(() => ai.models.generateContentStream({
        model: env.geminiModel,
        contents: contents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.4,
          maxOutputTokens: 800,
          tools: [{ functionDeclarations: toolDeclarations }],
          abortSignal: controller.signal,
        },
      }));

      // Collect the model's parts exactly as they arrive. Text parts are streamed to the user,
      // functionCall parts are tool requests. (The parts are sent back as-is in the next round,
      // because Gemini needs its own call parts - including the thought signature - to continue.)
      const modelParts = [];
      const calls = [];
      for await (const chunk of stream) {
        const candidate = chunk.candidates && chunk.candidates[0];
        const parts = candidate && candidate.content && candidate.content.parts ? candidate.content.parts : [];
        for (const part of parts) {
          modelParts.push(part);
          if (part.text && !part.thought) {
            fullText += part.text;
            onChunk(part.text);
          }
          if (part.functionCall) {
            calls.push(part.functionCall);
          }
        }
      }

      // No tool requested -> the text answer is complete
      if (calls.length === 0) {
        break;
      }

      // Run every requested tool and give the results back to Gemini for the next round
      const responseParts = [];
      for (const call of calls) {
        const result = await runTool(call.name, call.args || {});
        actions.push({ name: call.name, args: call.args || {}, result: result });
        responseParts.push({ functionResponse: { name: call.name, response: result } });
      }
      contents.push({ role: 'model', parts: modelParts });
      contents.push({ role: 'user', parts: responseParts });
    }
    return { text: fullText, actions: actions };
  } catch (err) {
    throw toAppError(err, timedOut);
  } finally {
    clearTimeout(timer);
  }
}
