import { useState, useCallback } from 'react';
import { hooks } from 'botframework-webchat';

const { useSendMessage } = hooks;

function SendBox({ placeholder = 'Type a message...' }) {
  const [text, setText] = useState('');
  const sendMessage = useSendMessage();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      sendMessage(trimmed);
      setText('');
    }
  }, [text, sendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form className="sendbox" onSubmit={handleSubmit}>
      <input
        type="text"
        className="sendbox__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button
        type="submit"
        className="sendbox__button"
        disabled={!text.trim()}
        aria-label="Send"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  );
}

export default SendBox;
