// AI chat service: conversations + messages stored in the DB, and the call to Gemini with the user's context.
import { query } from '../config/db.js';
import { notFound } from '../utils/AppError.js';
import { todayISO } from '../utils/dates.js';
import { CHAT_SYSTEM_PROMPT, fillTemplate } from '../ai/prompts.js';
import { INSURANCE_PER_DAY } from './bookings.service.js';
import { getBookingsText, getVehiclesText } from './aiContext.service.js';
import { generateText, streamText } from './gemini.service.js';

const HISTORY_LIMIT = 10; // how many previous messages we send to Gemini

export async function listConversations(userId) {
  const result = await query(
    'SELECT id, title, created_at FROM ai_conversations WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

// Makes sure the conversation exists and belongs to the user
async function getOwnedConversation(conversationId, userId) {
  const result = await query('SELECT * FROM ai_conversations WHERE id = $1 AND user_id = $2', [conversationId, userId]);
  if (result.rows.length === 0) {
    throw notFound('Conversation not found');
  }
  return result.rows[0];
}

export async function getMessages(conversationId, userId) {
  await getOwnedConversation(conversationId, userId);
  const result = await query(
    'SELECT id, role, content, created_at FROM ai_messages WHERE conversation_id = $1 ORDER BY id',
    [conversationId]
  );
  return result.rows;
}

export async function deleteConversation(conversationId, userId) {
  await getOwnedConversation(conversationId, userId);
  await query('DELETE FROM ai_conversations WHERE id = $1', [conversationId]);
}

// Builds the full system prompt with fresh data from the DB.
// language is 'en' or 'he' (the language the app is set to in the browser).
async function buildSystemPrompt(user, language) {
  const bookingsText = await getBookingsText(user.id);
  const vehiclesText = await getVehiclesText();
  return fillTemplate(CHAT_SYSTEM_PROMPT, {
    TODAY: todayISO(),
    USER_NAME: user.name,
    LANGUAGE: language === 'he' ? 'Hebrew' : 'English',
    INSURANCE_PER_DAY: INSURANCE_PER_DAY,
    BOOKINGS: bookingsText,
    VEHICLES: vehiclesText,
  });
}

// Creates a new conversation, titled with the first message
async function createConversation(userId, message) {
  const title = message.slice(0, 60);
  const result = await query(
    'INSERT INTO ai_conversations (user_id, title) VALUES ($1, $2) RETURNING *',
    [userId, title]
  );
  return result.rows[0];
}

// Loads the last messages and converts them to the format Gemini expects
async function getHistoryForGemini(conversationId) {
  const result = await query(
    `SELECT role, content FROM ai_messages WHERE conversation_id = $1 ORDER BY id DESC LIMIT $2`,
    [conversationId, HISTORY_LIMIT]
  );
  const rows = result.rows.reverse();
  return rows.map((m) => {
    let role = 'user';
    if (m.role === 'assistant') {
      role = 'model'; // Gemini calls the assistant "model"
    }
    return { role: role, parts: [{ text: m.content }] };
  });
}

async function saveMessage(conversationId, role, content) {
  const result = await query(
    'INSERT INTO ai_messages (conversation_id, role, content) VALUES ($1, $2, $3) RETURNING id, role, content, created_at',
    [conversationId, role, content]
  );
  return result.rows[0];
}

// Prepares the prompt and the message history for one chat turn
async function prepareChat(user, message, conversationId, language) {
  let history = [];
  if (conversationId) {
    await getOwnedConversation(conversationId, user.id);
    history = await getHistoryForGemini(conversationId);
  }
  history.push({ role: 'user', parts: [{ text: message }] });
  const systemPrompt = await buildSystemPrompt(user, language);
  return { systemPrompt: systemPrompt, history: history };
}

// Saves the question and the answer only after Gemini answered successfully
async function saveTurn(user, message, conversationId, answer) {
  let id = conversationId;
  if (!id) {
    const conversation = await createConversation(user.id, message);
    id = conversation.id;
  }
  await saveMessage(id, 'user', message);
  const reply = await saveMessage(id, 'assistant', answer);
  return { conversationId: id, reply: reply };
}

// Normal (non streaming) chat: returns the full answer at once
export async function sendMessage(user, message, conversationId, language) {
  const chat = await prepareChat(user, message, conversationId, language);
  const answer = await generateText(chat.systemPrompt, chat.history);
  return saveTurn(user, message, conversationId, answer);
}

// Streaming chat: onChunk is called for every piece of text
export async function streamMessage(user, message, conversationId, onChunk, language) {
  const chat = await prepareChat(user, message, conversationId, language);
  const answer = await streamText(chat.systemPrompt, chat.history, onChunk);
  return saveTurn(user, message, conversationId, answer);
}
