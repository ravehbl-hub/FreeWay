// ChatMessage: one chat bubble. Links like /vehicles/5 or /bookings in the AI answer become clickable,
// and every vehicle the assistant mentions gets Details / Book buttons under the bubble.
import { Link } from 'react-router-dom';
import ChatVehicleActions from './ChatVehicleActions.jsx';

// Splits the text into normal text and /vehicles/<id> or /bookings links
function renderText(text) {
  const parts = text.split(/(\/vehicles\/\d+|\/bookings)/g);
  return parts.map((part, index) => {
    if (/^(\/vehicles\/\d+|\/bookings)$/.test(part)) {
      return (
        <Link key={index} to={part}>
          {part}
        </Link>
      );
    }
    return <span key={index}>{part.replace(/\*\*/g, '')}</span>;
  });
}

export default function ChatMessage({ role, content, streaming = false }) {
  return (
    <div className={'chat-message chat-' + role}>
      <div className="chat-bubble">{renderText(content)}</div>
      {role === 'assistant' && !streaming && <ChatVehicleActions text={content} />}
    </div>
  );
}
