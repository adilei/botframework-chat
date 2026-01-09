import Header from './Header';
import Footer from './Footer';
import ChatTranscript from './ChatTranscript';
import SendBox from './SendBox';
import TypingIndicator from './TypingIndicator';

function ChatPage() {
  return (
    <div className="chat-page">
      <Header />

      <main className="chat-main">
        <div className="chat-container">
          <ChatTranscript />
          <TypingIndicator />
        </div>
      </main>

      <div className="sendbox-wrapper">
        <SendBox placeholder="How can I help? Ask me anything" />
      </div>

      <Footer />
    </div>
  );
}

export default ChatPage;
