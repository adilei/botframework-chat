import { useEffect, useRef, useMemo } from 'react';
import { hooks } from 'botframework-webchat';
import Markdown from 'react-markdown';

const { useActivities } = hooks;

function ChatTranscript() {
  const [activities] = useActivities();
  const endRef = useRef(null);

  const { messages, streamingText } = useMemo(() => {
    const finalMessages = [];
    const finalStreamIds = new Set();
    const streamingChunks = new Map(); // streamId -> sorted chunks

    // First pass: identify final messages and collect streaming chunks
    activities.forEach(activity => {
      const streamType = activity.channelData?.streamType;
      const streamId = activity.channelData?.streamId;

      // Final bot messages
      if (activity.type === 'message' && streamType === 'final') {
        finalStreamIds.add(streamId);
        finalMessages.push({
          id: activity.id,
          text: activity.text,
          from: activity.from?.role || 'bot',
          timestamp: activity.timestamp,
          streamId: streamId,
        });
      }
      // User messages (no streamType)
      else if (activity.type === 'message' && activity.from?.role === 'user' && activity.text) {
        finalMessages.push({
          id: activity.id,
          text: activity.text,
          from: 'user',
          timestamp: activity.timestamp,
        });
      }
      // Streaming delta chunks (type: typing)
      else if (activity.type === 'typing' &&
               activity.channelData?.chunkType === 'delta' &&
               streamId) {
        if (!streamingChunks.has(streamId)) {
          streamingChunks.set(streamId, []);
        }
        streamingChunks.get(streamId).push({
          sequence: activity.channelData?.streamSequence || 0,
          text: activity.text || '',
        });
      }
    });

    // Sort messages by timestamp
    finalMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Build accumulated streaming text for non-finalized streams
    let currentStreamingText = null;
    streamingChunks.forEach((chunks, streamId) => {
      if (!finalStreamIds.has(streamId)) {
        // Sort by sequence and accumulate
        chunks.sort((a, b) => a.sequence - b.sequence);
        currentStreamingText = chunks.map(c => c.text).join('');
      }
    });

    return {
      messages: finalMessages,
      streamingText: currentStreamingText,
    };
  }, [activities]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, streamingText]);

  return (
    <div className="transcript">
      {messages.length === 0 && !streamingText ? (
        <div className="transcript-empty">
          <p>Start a conversation...</p>
        </div>
      ) : (
        <>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`message message--${msg.from}`}
            >
              <div className="message__bubble">
                <Markdown
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.text}
                </Markdown>
              </div>
            </div>
          ))}
          {streamingText && (
            <div className="message message--bot message--streaming">
              <div className="message__bubble">
                <Markdown
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {streamingText}
                </Markdown>
                <span className="streaming-cursor" />
              </div>
            </div>
          )}
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatTranscript;
