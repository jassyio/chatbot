import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Trash2, Loader, RefreshCw } from 'lucide-react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [setRetryCount] = useState(0);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const initializeSession = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/session/', { timeout: 5000 });
      const token = response.data.session_token;
      setSessionToken(token);
      localStorage.setItem('sessionToken', token);
      setError('');
    } catch {
      console.error("Error initializing session:", error);
      setError('Failed to initialize session. Please check if the backend server is running and try again.');
      throw error;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      setSessionToken(storedToken);
    } else {
      initializeSession().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    if (inputRef.current && !loading) {
      inputRef.current.focus();
    }
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    const newMessage = { user: message, bot: '', timestamp: new Date().toISOString() };
    setChatHistory((prev) => [...prev, newMessage]);
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/chatbot/',
        { message },
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
          timeout: 10000, // 10 seconds timeout
        }
      );

      const botMessage = response.data.response;
      setChatHistory((prev) =>
        prev.map((chat, index) =>
          index === prev.length - 1 ? { ...chat, bot: botMessage, botTimestamp: new Date().toISOString() } : chat
        )
      );
    } catch (error) {
      console.error("Error communicating with the backend", error);
      setError('Failed to get a response from the chatbot. Please try again.');
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  const handleRetry = async () => {
    setRetryCount(prevCount => prevCount + 1);
    try {
      await initializeSession();
    } catch (error) {
      console.error("Error retrying session initialization:", error);
      setError('Failed to retry session initialization. Please check if the backend server is running and try again.');
      // Error is already set in initializeSession

    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="app-title">AI Chatbot</h1>
        <button onClick={handleClearChat} className="clear-button">
          <Trash2 size={18} />
          Clear Chat
        </button>
      </aside>
      <main className="chat-container">
        {error && (
          <div className="error-container">
            <p className="error">{error}</p>
            <button onClick={handleRetry} className="retry-button">
              <RefreshCw size={18} />
              Retry Connection
            </button>
          </div>
        )}
        <div className="chat-box" ref={chatBoxRef}>
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
              <div className="user-message">
                <p>{chat.user}</p>
                <span className="timestamp">{new Date(chat.timestamp).toLocaleTimeString()}</span>
              </div>
              {chat.bot && (
                <div className="bot-message">
                  <p>{chat.bot}</p>
                  <span className="timestamp">{new Date(chat.botTimestamp).toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="bot-message typing">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>
        <form className="chat-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message..." 
            className="chat-input"
            disabled={loading || !sessionToken}
            ref={inputRef}
          />
          <button type="submit" disabled={loading || !sessionToken} className="chat-button">
            {loading ? <Loader className="spin" /> : <Send />}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;

