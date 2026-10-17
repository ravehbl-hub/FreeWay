// AI API calls. The browser only talks to OUR server - the Gemini key stays on the server.
import { API_URL, apiRequest, authHeaders } from './client.js';

export function fetchConversations() {
  return apiRequest('/ai/conversations');
}

export function fetchMessages(conversationId) {
  return apiRequest('/ai/conversations/' + conversationId + '/messages');
}

export function deleteConversation(conversationId) {
  return apiRequest('/ai/conversations/' + conversationId, 'DELETE');
}

export function fetchRecommendations() {
  return apiRequest('/ai/recommendations');
}

export function generateRecommendations() {
  return apiRequest('/ai/recommendations', 'POST');
}

// Streaming chat: reads the Server-Sent Events from the server and calls onChunk(text) for each piece.
// language ('en' / 'he') tells the server in which language the assistant should answer.
// Returns the final { conversationId, reply }.
export async function streamChat(message, conversationId, onChunk, language) {
  let response;
  try {
    response = await fetch(API_URL + '/ai/chat/stream', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ message: message, conversationId: conversationId || null, language: language || 'en' }),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  // Errors before the stream started (validation, rate limit, auth) come back as normal JSON
  if (!response.ok) {
    let text = 'AI request failed (' + response.status + ')';
    try {
      const data = await response.json();
      text = data.error.message;
    } catch {
      // keep the default text
    }
    throw new Error(text);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Every event ends with an empty line
    const events = buffer.split('\n\n');
    buffer = events.pop();

    for (const event of events) {
      if (!event.startsWith('data: ')) continue;
      const data = JSON.parse(event.slice(6));
      if (data.type === 'chunk') {
        onChunk(data.text);
      } else if (data.type === 'done') {
        result = data;
      } else if (data.type === 'error') {
        throw new Error(data.message);
      }
    }
  }
  return result;
}
