// ChatWindow: messages list + input box. The answer appears word by word (streaming).
import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';

const SUGGESTIONS = [
  'Which car is best for a family of 5?',
  'Compare the BMW i4 and the Mercedes C-Class',
  'How much is a compact car for 4 days with insurance?',
  'Recommend an electric car based on my history',
];

export default function ChatWindow({ messages, streamingText, sending, error, onSend }) {
  const [text, setText] = useState('');
  const [inputError, setInputError] = useState('');
  const bottomRef = useRef(null);

  // Scroll to the newest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingText]);

  function handleSubmit(event) {
    event.preventDefault();
    const message = text.trim();
    if (!message) {
      setInputError('Write a message first');
      return;
    }
    if (message.length > 1000) {
      setInputError('Message is too long (max 1000 characters)');
      return;
    }
    onSend(message);
    setText('');
  }

  return (
    <section className="card chat-window">
      <div className="chat-messages">
        {messages.length === 0 && !sending && (
          <div className="chat-empty">
            <Sparkles size={28} />
            <h2>How can I help you today?</h2>
            <p className="muted">I know our whole fleet and your booking history.</p>
            <div className="suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" className="chip chip-button" onClick={() => onSend(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} role={message.role} content={message.content} />
        ))}
        {sending && <ChatMessage role="assistant" content={streamingText || 'Thinking...'} />}
        <div ref={bottomRef} />
      </div>

      <ErrorMessage message={error} />
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setInputError('');
          }}
          placeholder="Ask about vehicles, prices, insurance..."
          aria-label="Message"
          disabled={sending}
        />
        <button type="submit" className="button button-dark" disabled={sending}>
          Send <Send size={16} />
        </button>
      </form>
      {inputError && <p className="field-message">{inputError}</p>}
    </section>
  );
}
