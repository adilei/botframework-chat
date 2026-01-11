import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { hooks } from 'botframework-webchat';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MessageAttachments from './MessageAttachments';

const { useActivities, useSendMessage } = hooks;

// Convert HTML line breaks to newlines for markdown rendering
function normalizeText(text) {
  return text?.replace(/<br\s*\/?>/gi, '\n') || '';
}

// Debounce helper
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

function ChatTranscript() {
  const [activities] = useActivities();
  const sendMessage = useSendMessage();
  const containerRef = useRef(null);
  const endRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const { messages, streamingText, suggestedActions } = useMemo(() => {
    const finalMessages = [];
    const finalStreamIds = new Set();
    const streamingChunks = new Map(); // streamId -> sorted chunks
    let lastSuggestedActions = null;

    // First pass: identify final messages and collect streaming chunks
    activities.forEach(activity => {
      const streamType = activity.channelData?.streamType;
      const streamId = activity.channelData?.streamId;

      // Track suggested actions from bot messages
      if (activity.from?.role === 'bot' && activity.suggestedActions?.actions?.length) {
        lastSuggestedActions = activity.suggestedActions.actions;
      }

      // Extract citations from entities
      // Copilot Studio sends citations inside a Message entity with a citation array
      let citations = [];
      const messageEntity = (activity.entities || [])
        .find(e => e.type === 'https://schema.org/Message' && e.citation);
      if (messageEntity?.citation) {
        citations = messageEntity.citation
          .filter(c => c.appearance?.url || c.appearance?.name)
          .sort((a, b) => (a.position || 0) - (b.position || 0))
          .map(c => ({
            id: c['@id'],
            name: c.appearance?.name,
            url: c.appearance?.url,
          }));
      }

      // Final bot messages (streaming mode)
      if (activity.type === 'message' && streamType === 'final') {
        finalStreamIds.add(streamId);
        finalMessages.push({
          id: activity.id,
          text: activity.text,
          from: activity.from?.role || 'bot',
          timestamp: activity.timestamp,
          streamId: streamId,
          attachments: activity.attachments || [],
          citations,
        });
      }
      // User messages (no streamType)
      else if (activity.type === 'message' && activity.from?.role === 'user' && activity.text) {
        finalMessages.push({
          id: activity.id,
          text: activity.text,
          from: 'user',
          timestamp: activity.timestamp,
          attachments: activity.attachments || [],
        });
        // Clear suggested actions when user sends a message
        lastSuggestedActions = null;
      }
      // Bot messages without streaming (Direct Line mode)
      else if (
        activity.type === 'message' &&
        activity.from?.role === 'bot' &&
        !streamType &&
        (activity.text || activity.attachments?.length)
      ) {
        finalMessages.push({
          id: activity.id,
          text: activity.text,
          from: 'bot',
          timestamp: activity.timestamp,
          attachments: activity.attachments || [],
          citations,
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
      suggestedActions: lastSuggestedActions,
    };
  }, [activities]);

  // Handle suggested action click
  const handleSuggestedAction = useCallback((action) => {
    if (action.type === 'imBack' || action.type === 'postBack') {
      sendMessage(action.value || action.title);
    }
  }, [sendMessage]);

  // Check if user is at (or near) the bottom of the scroll container
  const checkIfAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const threshold = 100; // px from bottom to consider "at bottom"
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  }, []);

  // Handle scroll events to track if user is at bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsAtBottom(checkIfAtBottom());
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [checkIfAtBottom]);

  // Instant scroll during streaming (no animation to avoid jitter)
  const scrollToBottomInstant = useCallback(() => {
    const container = containerRef.current;
    if (container && isAtBottom) {
      container.scrollTop = container.scrollHeight;
    }
  }, [isAtBottom]);

  const debouncedScroll = useDebounce(scrollToBottomInstant, 50);

  // Auto-scroll during streaming (debounced, instant, only if at bottom)
  useEffect(() => {
    if (streamingText) {
      debouncedScroll();
    }
  }, [streamingText, debouncedScroll]);

  // Always scroll to bottom on new user/bot message (not during streaming)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
    // Reset isAtBottom after scroll animation completes
    const timer = setTimeout(() => setIsAtBottom(true), 300);
    return () => clearTimeout(timer);
  }, [messages.length]);

  return (
    <div className="transcript" ref={containerRef}>
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
                {msg.text && (
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {normalizeText(msg.text)}
                  </Markdown>
                )}
                <MessageAttachments
                  attachments={msg.attachments}
                  activityId={msg.id}
                />
                {msg.citations && msg.citations.length > 0 && (
                  <div className="message__citations">
                    <div className="message__citations-title">Sources</div>
                    <ol className="message__citations-list">
                      {msg.citations.map((citation, index) => (
                        <li key={citation.id || index}>
                          {citation.url ? (
                            <a href={citation.url} target="_blank" rel="noopener noreferrer">
                              {citation.name || citation.url}
                            </a>
                          ) : (
                            <span>{citation.name}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          ))}
          {streamingText && (
            <div className="message message--bot message--streaming">
              <div className="message__bubble">
                <Markdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {normalizeText(streamingText)}
                </Markdown>
                <span className="streaming-cursor" />
              </div>
            </div>
          )}
          {suggestedActions && suggestedActions.length > 0 && !streamingText && (
            <div className="suggested-actions">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  className="suggested-action"
                  onClick={() => handleSuggestedAction(action)}
                >
                  {action.title}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}

export default ChatTranscript;
