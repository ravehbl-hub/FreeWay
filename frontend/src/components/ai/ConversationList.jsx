// ConversationList: saved conversations (from the DB) on the side of the Assistant page
import { Plus, Trash2 } from 'lucide-react';

export default function ConversationList({ conversations, activeId, onSelect, onNew, onDelete }) {
  return (
    <aside className="card conversation-list">
      <button type="button" className="button button-green button-block" onClick={onNew}>
        <Plus size={16} /> New chat
      </button>
      {conversations.length === 0 && <p className="muted small">No saved conversations yet.</p>}
      <ul>
        {conversations.map((conversation) => (
          <li key={conversation.id} className={conversation.id === activeId ? 'active' : ''}>
            <button type="button" className="conversation-title" onClick={() => onSelect(conversation.id)}>
              {conversation.title}
            </button>
            <button type="button" className="icon-link" aria-label="Delete conversation" onClick={() => onDelete(conversation.id)}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
