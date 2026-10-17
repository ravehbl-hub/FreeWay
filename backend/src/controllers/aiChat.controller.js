// AI chat controller: normal chat, streaming chat (Server-Sent Events) and saved conversations.
import * as aiChatService from '../services/aiChat.service.js';

export async function chat(req, res, next) {
  try {
    const result = await aiChatService.sendMessage(req.user, req.body.message, req.body.conversationId, req.body.language);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Streaming: the answer is sent piece by piece as "data: {...}" lines (Server-Sent Events)
export async function chatStream(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  function send(data) {
    res.write('data: ' + JSON.stringify(data) + '\n\n');
  }

  try {
    const result = await aiChatService.streamMessage(
      req.user,
      req.body.message,
      req.body.conversationId,
      (text) => send({ type: 'chunk', text: text }),
      req.body.language
    );
    send({ type: 'done', conversationId: result.conversationId, reply: result.reply });
  } catch (err) {
    // Headers were already sent, so the error is sent as an event with its status code
    send({ type: 'error', status: err.statusCode || 500, message: err.statusCode ? err.message : 'AI error' });
  }
  res.end();
}

export async function listConversations(req, res, next) {
  try {
    const conversations = await aiChatService.listConversations(req.user.id);
    res.json({ conversations: conversations });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(req, res, next) {
  try {
    const messages = await aiChatService.getMessages(req.params.id, req.user.id);
    res.json({ messages: messages });
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req, res, next) {
  try {
    await aiChatService.deleteConversation(req.params.id, req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
