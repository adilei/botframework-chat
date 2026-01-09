import { hooks } from 'botframework-webchat';

const { useActivities, useActiveTyping } = hooks;

function TypingIndicator() {
  const [activeTyping] = useActiveTyping();
  const [activities] = useActivities();

  // Check if bot is typing
  const botTyping = Object.values(activeTyping || {}).some(
    typing => typing.role === 'bot'
  );

  // Check if we have streaming content (handled by ChatTranscript)
  const hasStreamingContent = activities.some(activity =>
    activity.type === 'typing' &&
    activity.from?.role === 'bot' &&
    (activity.channelData?.chunks || activity.channelData?.streamingText || activity.text)
  );

  // Only show dots if bot is typing but no streaming content
  if (!botTyping || hasStreamingContent) {
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
