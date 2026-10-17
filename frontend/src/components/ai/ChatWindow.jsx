// ChatWindow: messages list + input box. The answer appears word by word (streaming).
import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

// Translation keys of the example questions
const SUGGESTIONS = ['assistant.s1', 'assistant.s2', 'assistant.s3', 'assistant.s4'];

export default function ChatWindow({ messages, streamingText, sending, error, onSend }) {
  const { t } = useLanguage();
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
      setInputError('assistant.writeFirst');
      return;
    }
    if (message.length > 1000) {
      setInputError('assistant.tooLong');
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
            <h2>{t('assistant.emptyTitle')}</h2>
            <p className="muted">{t('assistant.emptyText')}</p>
            <div className="suggestions">
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} type="button" className="chip chip-button" onClick={() => onSend(t(suggestion))}>
                  {t(suggestion)}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} role={message.role} content={message.content} />
        ))}
        {sending && <ChatMessage role="assistant" content={streamingText || t('common.thinking')} streaming />}
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
          placeholder={t('assistant.placeholder')}
          aria-label={t('assistant.messageLabel')}
          disabled={sending}
        />
        <button type="submit" className="button button-dark" disabled={sending}>
          {t('common.send')} <Send size={16} className="flip-rtl" />
        </button>
      </form>
      {inputError && <p className="field-message">{t(inputError)}</p>}
    </section>
  );
}
