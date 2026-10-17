// ChatMessage: one chat bubble. Links like /vehicles/5 in the AI answer become clickable.
import { Link } from 'react-router-dom';

// Splits the text into normal text and /vehicles/<id> links
function renderText(text) {
  const parts = text.split(/(\/vehicles\/\d+)/g);
  return parts.map((part, index) => {
    if (/^\/vehicles\/\d+$/.test(part)) {
      return (
        <Link key={index} to={part}>
          {part}
        </Link>
      );
    }
    return <span key={index}>{part.replace(/\*\*/g, '')}</span>;
  });
}

export default function ChatMessage({ role, content }) {
  return (
    <div className={'chat-message chat-' + role}>
      <div className="chat-bubble">{renderText(content)}</div>
    </div>
  );
}
