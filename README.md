# BotFramework Chat - Custom Components

A React chat application connecting to Microsoft Power Virtual Agents using the BotFramework WebChat library with **fully custom UI components**.

## Implementation Approach

This project demonstrates how to build a custom chat UI while leveraging BotFramework WebChat's business logic layer. Instead of using the pre-built `<ReactWebChat>` component or `BasicTranscript`/`BasicSendBox`, we build custom React components that consume WebChat's hooks directly.

### Architecture

```
┌─────────────────────────────────────────┐
│            Custom UI Layer              │
│  (ChatTranscript, SendBox, Typing...)   │
├─────────────────────────────────────────┤
│         WebChat Hooks Layer             │
│  (useActivities, useSendMessage, etc.)  │
├─────────────────────────────────────────┤
│           Composer Context              │
│     (Provides hooks to descendants)     │
├─────────────────────────────────────────┤
│            Direct Line SDK              │
│    (Connection to bot via WebSocket)    │
└─────────────────────────────────────────┘
```

### Why Custom Components?

The default WebChat components use dynamically generated class names (e.g., `webchat__send-box__xyz123`) that are:
- Not part of the public API
- Subject to change between versions
- Difficult to override with CSS

By building custom components, we get:
- **Full styling control** - standard CSS classes we define
- **Simpler code** - no fighting with `!important` or attribute selectors
- **Stability** - no breaking changes from internal class name updates

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Initializes Direct Line and wraps app in `<Composer>` |
| `src/components/ChatTranscript.jsx` | Displays messages using `useActivities` hook |
| `src/components/SendBox.jsx` | Text input using `useSendMessage` hook |
| `src/components/TypingIndicator.jsx` | Animated dots using `useActiveTyping` hook |
| `src/styles/global.css` | All styling for custom components |

### Hooks Used

```jsx
import { hooks } from 'botframework-webchat';

const { useActivities } = hooks;      // Get all chat activities/messages
const { useSendMessage } = hooks;     // Send a message to the bot
const { useActiveTyping } = hooks;    // Detect when bot is typing
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file with your token endpoint:
   ```
   VITE_TOKEN_ENDPOINT=https://your-pva-endpoint/directline/token
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Branches

- `main` - Uses WebChat's built-in `BasicTranscript` and `BasicSendBox` components
- `custom-components` - Fully custom React components with hooks (this branch)

## References

- [BotFramework WebChat Recomposing UI Sample](https://github.com/microsoft/BotFramework-WebChat/tree/main/samples/06.recomposing-ui/d.plain-ui)
- [WebChat Hooks Documentation](https://github.com/microsoft/BotFramework-WebChat/blob/main/docs/HOOKS.md)
- [Direct Line API](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-concepts)
