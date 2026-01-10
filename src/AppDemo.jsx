import { useMemo, useEffect } from 'react';
import { Components } from 'botframework-webchat';
import ChatPage from './components/ChatPage';
import { createMockDirectLine } from './demo/createMockDirectLine';
import { runDemoScenario, setupUserMessageHandler } from './demo/demoScenario';
import './styles/global.css';

const { Composer } = Components;

function AppDemo() {
  // Create mock DirectLine once on mount
  const directLine = useMemo(() => createMockDirectLine(), []);

  useEffect(() => {
    setupUserMessageHandler(directLine);
    runDemoScenario(directLine);
  }, [directLine]);

  return (
    <Composer directLine={directLine}>
      <ChatPage />
    </Composer>
  );
}

export default AppDemo;
