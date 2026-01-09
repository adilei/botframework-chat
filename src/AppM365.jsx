import { useState, useEffect } from 'react';
import { CopilotStudioClient, CopilotStudioWebChat } from '@microsoft/agents-copilotstudio-client';
import { Components } from 'botframework-webchat';
import { acquireToken, getConnectionSettings } from './utils/auth';
import ChatPage from './components/ChatPage';
import './styles/global.css';

const { Composer } = Components;

// Module-level singleton to prevent double initialization
let connectionPromise = null;

async function getConnection() {
  if (connectionPromise) return connectionPromise;

  connectionPromise = (async () => {
    const token = await acquireToken();
    const settings = getConnectionSettings();
    const client = new CopilotStudioClient(settings, token);
    return CopilotStudioWebChat.createConnection(client, {
      typingIndicator: true
    });
  })();

  return connectionPromise;
}

function AppM365() {
  const [directLine, setDirectLine] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    getConnection()
      .then(dl => {
        setDirectLine(dl);
        setStatus(null);
      })
      .catch(err => {
        console.error('Failed to initialize:', err);
        setError(err.message || 'Failed to connect');
      });
  }, []);

  if (error) {
    return (
      <div className="chat-page">
        <div className="error-container">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!directLine) {
    return (
      <div className="chat-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>{status}</p>
        </div>
      </div>
    );
  }

  return (
    <Composer directLine={directLine}>
      <ChatPage />
    </Composer>
  );
}

export default AppM365;
