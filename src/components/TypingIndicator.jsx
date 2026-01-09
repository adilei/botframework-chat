import { useMemo } from 'react';
import { hooks } from 'botframework-webchat';

const { useActivities, useActiveTyping } = hooks;

function TypingIndicator() {
  const [activeTyping] = useActiveTyping();
  const [activities] = useActivities();

  const showTyping = useMemo(() => {
    // Check if bot is actively typing
    const botTyping = Object.values(activeTyping || {}).some(
      typing => typing.role === 'bot'
    );

    if (!botTyping) return false;

    // Check if there's active streaming (don't show dots during streaming)
    const finalStreamIds = new Set();
    activities.forEach(activity => {
      if (activity.type === 'message' && activity.channelData?.streamType === 'final') {
        finalStreamIds.add(activity.channelData.streamId);
      }
    });

    const hasActiveStreaming = activities.some(activity =>
      activity.type === 'typing' &&
      activity.channelData?.chunkType === 'delta' &&
      activity.channelData?.streamId &&
      !finalStreamIds.has(activity.channelData.streamId)
    );

    return !hasActiveStreaming;
  }, [activeTyping, activities]);

  if (!showTyping) {
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
