import { hooks } from 'botframework-webchat';

const { useActiveTyping } = hooks;

function TypingIndicator() {
  const [activeTyping] = useActiveTyping();

  // Check if bot is typing (filter out user typing)
  const botTyping = Object.values(activeTyping || {}).some(
    typing => typing.role === 'bot'
  );

  if (!botTyping) {
    return null;
  }

  return (
    <div className="typing-indicator">
      <div className="typing-indicator__dots">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </div>
    </div>
  );
}

export default TypingIndicator;
