import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = { user: message, bot: '' };
    setChatHistory((prev) => [...prev, newMessage]);
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/chatbot/', { message });
      console.log("Backend response:", response.data);
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

  return (
    <div className="App">
      <h1>AI Chatbot</h1>
      <div className="chat-box">
        {chatHistory.map((chat, index) => (
          <div key={index}>
            <p><strong>You:</strong> {chat.user}</p>
            <p><strong>Bot:</strong> {chat.bot}</p>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message..." 
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
    </div>
  );
}

export default App;