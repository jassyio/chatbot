import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    // Load session token on app load
    const storedToken = localStorage.getItem('sessionToken');
    if (storedToken) {
      setSessionToken(storedToken);
    } else {
      // Fetch or generate a new session token
      axios.get('http://localhost:8000/api/session/')
        .then(response => {
          const token = response.data.session_token;
          setSessionToken(token);
          localStorage.setItem('sessionToken', token);
        })
        .catch(() => setError('Failed to initialize session.'));
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat box when a new message is added
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    const newMessage = { user: message, bot: '' };
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
        }
      );

      const botMessage = response.data.response;
      setChatHistory((prev) =>
        prev.map((chat, index) =>
          index === prev.length - 1 ? { ...chat, bot: botMessage } : chat
        )
      );
    } catch (error) {
      console.error("Error communicating with the backend", error);
      setError('Failed to get a response from the chatbot. Please try again.');
    } finally {
      setLoading(false);
    }
    setMessage('');
  };

  const handleClearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Chatbot</h1>
      </header>
      <main className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          {chatHistory.map((chat, index) => (
            <div key={index} className="chat-message">
              <p className="user-message"><strong>You:</strong> {chat.user}</p>
              <p className="bot-message"><strong>Bot:</strong> {chat.bot}</p>
            </div>
          ))}
        </div>
        {error && <p className="error">{error}</p>}
        <form className="chat-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Type your message..." 
            className="chat-input"
          />
          <button type="submit" disabled={loading} className="chat-button">
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <button onClick={handleClearChat} className="clear-button">Clear Chat</button>
      </main>
    </div>
  );
}

export default App;