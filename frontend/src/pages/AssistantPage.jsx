// AssistantPage: full AI chat. Conversations and messages are saved in the DB by the server.
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteConversation, fetchConversations, fetchMessages, streamChat } from '../api/ai.api.js';
import ChatWindow from '../components/ai/ChatWindow.jsx';
import ConversationList from '../components/ai/ConversationList.jsx';
import ErrorMessage from '../components/ui/ErrorMessage.jsx';

export default function AssistantPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [listError, setListError] = useState('');
  const startedFromDashboard = useRef(false);

  async function loadConversations() {
    try {
      const data = await fetchConversations();
      setConversations(data.conversations);
    } catch (err) {
      setListError(err.message);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  // A question typed on the dashboard arrives in location.state - send it once
  useEffect(() => {
    if (location.state && location.state.prompt && !startedFromDashboard.current) {
      startedFromDashboard.current = true;
      const prompt = location.state.prompt;
      navigate('.', { replace: true, state: null });
      handleSend(prompt);
    }
  }, []);

  async function selectConversation(id) {
    setActiveId(id);
    setError('');
    try {
      const data = await fetchMessages(id);
      setMessages(data.messages);
    } catch (err) {
      setError(err.message);
    }
  }

  function startNewChat() {
    setActiveId(null);
    setMessages([]);
    setError('');
  }

  async function handleDelete(id) {
    try {
      await deleteConversation(id);
      if (id === activeId) startNewChat();
      loadConversations();
    } catch (err) {
      setListError(err.message);
    }
  }

  async function handleSend(text) {
    setError('');
    setSending(true);
    setStreamingText('');
    setMessages((old) => [...old, { role: 'user', content: text }]);

    try {
      let fullText = '';
      const result = await streamChat(text, activeId, (chunk) => {
        fullText += chunk;
        setStreamingText(fullText);
      });
      setMessages((old) => [...old, result.reply]);
      if (!activeId) {
        setActiveId(result.conversationId);
        loadConversations();
      }
    } catch (err) {
      setError(err.message);
      // Remove the question that failed, so the user can send it again
      setMessages((old) => old.slice(0, -1));
    }
    setSending(false);
    setStreamingText('');
  }

  return (
    <div>
      <h1 className="page-title">AI Assistant</h1>
      <p className="page-subtitle">Powered by Google Gemini · answers use the FreeWay catalog and your bookings.</p>
      <ErrorMessage message={listError} />
      <div className="assistant-layout">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={selectConversation}
          onNew={startNewChat}
          onDelete={handleDelete}
        />
        <ChatWindow messages={messages} streamingText={streamingText} sending={sending} error={error} onSend={handleSend} />
      </div>
    </div>
  );
}
