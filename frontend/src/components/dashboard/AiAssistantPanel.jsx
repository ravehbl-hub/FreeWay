// AiAssistantPanel: the "AI Assistant" card on the dashboard.
// The quick-action tiles fill the text box; "Send" opens the Assistant page with the question.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CalendarDays, Mic, Paperclip, Scale, Send, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';

const QUICK_ACTIONS = [
  { icon: CalendarDays, title: 'Book', subtitle: 'a vehicle', prompt: 'Help me book a vehicle for next weekend.' },
  { icon: Scale, title: 'Compare', subtitle: 'models', prompt: 'Compare your SUV models for a family trip.' },
  { icon: ShieldCheck, title: 'Insurance', subtitle: 'See options', prompt: 'What insurance options do I have and how much do they cost?' },
  { icon: Calculator, title: 'Estimate', subtitle: 'the price', prompt: 'Estimate the price of a compact car for 3 days.' },
];

export default function AiAssistantPanel() {
  const [text, setText] = useState('Plan a rental for next weekend');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim().length === 0) {
      setError('Write a question first');
      return;
    }
    navigate('/assistant', { state: { prompt: text.trim() } });
  }

  return (
    <section className="card ai-panel" aria-label="AI Assistant">
      <div className="ai-panel-header">
        <h2>AI Assistant</h2>
        <span className="round-button sparkle" aria-hidden="true">
          <Sparkles size={20} />
        </span>
      </div>
      <p className="muted">How can I help you today?</p>

      <div className="quick-actions">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.title} type="button" className="quick-action" onClick={() => setText(action.prompt)}>
              <Icon size={24} strokeWidth={1.6} />
              <strong>{action.title}</strong>
              <span>{action.subtitle}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="ai-input"
          rows={3}
          value={text}
          maxLength={1000}
          onChange={(event) => {
            setText(event.target.value);
            setError('');
          }}
          aria-label="Ask the AI assistant"
        />
        {error && <p className="field-message">{error}</p>}
        <div className="ai-toolbar">
          <button type="button" className="tool-button" title="Voice input (coming soon)" disabled>
            <Mic size={18} />
          </button>
          <button type="button" className="tool-button" title="Attach (coming soon)" disabled>
            <Paperclip size={18} />
          </button>
          <button type="button" className="tool-button" title="Filters" onClick={() => navigate('/vehicles')}>
            <SlidersHorizontal size={18} />
          </button>
          <button type="submit" className="button button-dark">
            Send <Send size={16} />
          </button>
        </div>
      </form>
    </section>
  );
}
