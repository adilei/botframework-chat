/**
 * Mock DirectLine for demo/simulation mode.
 * Provides the same interface as DirectLine but allows injecting activities programmatically.
 */

import { BehaviorSubject, Subject, Observable } from 'rxjs';

// Connection status constants (matches DirectLine SDK)
export const ConnectionStatus = {
  Uninitialized: 0,
  Connecting: 1,
  Connected: 2,
  FailedToConnect: 4,
};

/**
 * Creates a mock DirectLine instance for demo mode.
 * @returns {Object} Mock DirectLine with activity$, connectionStatus$, postActivity, and demo methods
 */
export function createMockDirectLine() {
  const activitySubject = new Subject();
  const connectionStatusSubject = new BehaviorSubject(ConnectionStatus.Uninitialized);

  // Track posted activities for potential echo/response
  const postedActivityCallbacks = [];

  // Start connection sequence
  setTimeout(() => connectionStatusSubject.next(ConnectionStatus.Connecting), 50);
  setTimeout(() => connectionStatusSubject.next(ConnectionStatus.Connected), 150);

  let activityIdCounter = 1;

  return {
    // Standard DirectLine interface
    activity$: activitySubject.asObservable(),
    connectionStatus$: connectionStatusSubject.asObservable(),

    // Required methods that WebChat may call
    end: () => {},

    getSessionId: () => {
      return new Observable((observer) => {
        observer.next('demo-session');
        observer.complete();
      });
    },

    /**
     * Post activity to the "bot" (captures user messages)
     */
    postActivity: (activity) => {
      return new Observable((observer) => {
        const id = `user-${activityIdCounter++}`;

        setTimeout(() => {
          activitySubject.next({
            ...activity,
            id,
            timestamp: new Date().toISOString(),
            from: { id: 'user', role: 'user' },
          });

          postedActivityCallbacks.forEach((cb) => cb(activity));

          observer.next(id);
          observer.complete();
        }, 10);

        return () => {};
      });
    },

    // Demo-specific methods

    /**
     * Register a callback for when user posts an activity
     */
    onUserActivity: (callback) => {
      postedActivityCallbacks.push(callback);
    },

    /**
     * Emit a bot activity (non-streaming)
     */
    emitActivity: (activity) => {
      activitySubject.next({
        id: `bot-${activityIdCounter++}`,
        timestamp: new Date().toISOString(),
        from: { id: 'bot', role: 'bot' },
        type: 'message',
        ...activity,
      });
    },

    /**
     * Emit a typing indicator
     */
    emitTyping: () => {
      activitySubject.next({
        id: `typing-${activityIdCounter++}`,
        timestamp: new Date().toISOString(),
        from: { id: 'bot', role: 'bot' },
        type: 'typing',
      });
    },

    /**
     * Emit a streaming chunk (delta)
     */
    emitStreamChunk: (streamId, sequence, text) => {
      activitySubject.next({
        type: 'typing',
        timestamp: new Date().toISOString(),
        from: { id: 'bot', role: 'bot' },
        text,
        channelData: {
          streamType: 'streaming',
          streamId,
          streamSequence: sequence,
          chunkType: 'delta',
        },
      });
    },

    /**
     * Emit final message after streaming
     */
    emitFinalMessage: (streamId, text, attachments = null) => {
      const activity = {
        id: `bot-${activityIdCounter++}`,
        type: 'message',
        timestamp: new Date().toISOString(),
        from: { id: 'bot', role: 'bot' },
        text,
        channelData: {
          streamType: 'final',
          streamId,
        },
      };

      if (attachments) {
        activity.attachments = attachments;
      }

      activitySubject.next(activity);
    },

    /**
     * Simulate a user sending a message (for demo auto-play)
     */
    simulateUserMessage: (text) => {
      const id = `user-${activityIdCounter++}`;
      activitySubject.next({
        id,
        type: 'message',
        timestamp: new Date().toISOString(),
        from: { id: 'user', role: 'user' },
        text,
      });
    },
  };
}
