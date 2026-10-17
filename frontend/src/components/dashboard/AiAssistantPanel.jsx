// AiAssistantPanel: the "AI Assistant" card on the dashboard.
// The quick-action tiles fill the text box; "Send" opens the Assistant page with the question.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, CalendarDays, Mic, Paperclip, Scale, Send, ShieldCheck, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

// Translation keys of the 4 quick-action tiles
const QUICK_ACTIONS = [
  { icon: CalendarDays, title: 'ai.book', subtitle: 'ai.bookSub', prompt: 'ai.promptBook' },
  { icon: Scale, title: 'ai.compare', subtitle: 'ai.compareSub', prompt: 'ai.promptCompare' },
  { icon: ShieldCheck, title: 'ai.insurance', subtitle: 'ai.insuranceSub', prompt: 'ai.promptInsurance' },
  { icon: Calculator, title: 'ai.estimate', subtitle: 'ai.estimateSub', prompt: 'ai.promptEstimate' },
];

export default function AiAssistantPanel() {
  const { t } = useLanguage();
  const [text, setText] = useState(t('ai.defaultText'));
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    if (text.trim().length === 0) {
      setError('ai.writeFirst');
      return;
    }
    navigate('/assistant', { state: { prompt: text.trim() } });
  }

  return (
    <section className="card ai-panel" aria-label={t('ai.title')}>
      <div className="ai-panel-header">
        <h2>{t('ai.title')}</h2>
        <span className="round-button sparkle" aria-hidden="true">
          <Sparkles size={20} />
        </span>
      </div>
      <p className="muted">{t('ai.how')}</p>

      <div className="quick-actions">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.title} type="button" className="quick-action" onClick={() => setText(t(action.prompt))}>
              <Icon size={24} strokeWidth={1.6} />
              <strong>{t(action.title)}</strong>
              <span>{t(action.subtitle)}</span>
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
          aria-label={t('ai.askLabel')}
        />
        {error && <p className="field-message">{t(error)}</p>}
        <div className="ai-toolbar">
          <button type="button" className="tool-button" title={t('ai.voice')} disabled>
            <Mic size={18} />
          </button>
          <button type="button" className="tool-button" title={t('ai.attach')} disabled>
            <Paperclip size={18} />
          </button>
          <button type="button" className="tool-button" title={t('ai.filters')} onClick={() => navigate('/vehicles')}>
            <SlidersHorizontal size={18} />
          </button>
          <button type="submit" className="button button-dark">
            {t('common.send')} <Send size={16} className="flip-rtl" />
          </button>
        </div>
      </form>
    </section>
  );
}
