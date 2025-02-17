import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Image, Send, Edit, Copy } from "lucide-react";
import OpenIcon from "./assets/osidebar.png"; // Import the open sidebar icon
import CloseIcon from "./assets/csidebar.png"; // Import the close sidebar icon

export default function ChatWindow({ sidebarOpen, setSidebarOpen, newChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [inputHeight, setInputHeight] = useState("auto"); // Dynamic height for input
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
    setInputHeight("auto"); // Reset input height after sending
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    // Adjust input height dynamically
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    setInputHeight(`${e.target.scrollHeight}px`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line on Enter key
      handleSend(e); // Send message
    }
  };

  useEffect(() => {
    if (newChat) setMessages([]);
  }, [newChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`flex-1 flex flex-col w-full h-full ${sidebarOpen ? "pl-5" : ""}`}>
      {/* Header */}
      <header className="p-4 bg-gray-800 flex justify-between items-center border-b border-gray-700 text-white">
        <div className="flex items-center space-x-3">
          {/* Sidebar Toggle Icon */}
          <img
            src={sidebarOpen ? CloseIcon : OpenIcon}
            alt={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            className="w-7 h-7 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <h1 className="text-lg font-semibold">Deepsource AI</h1>
        </div>
      </header>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white">
        {messages.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center text-sm text-gray-400">
            Start a new chat to begin the conversation!
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 my-2 rounded-lg max-w-full transition-all duration-300 relative group ${
                msg.sender === "user"
                  ? "bg-gray-800 text-white self-end"
                  : "bg-gray-700 text-gray-300 self-start"
              }`}
              style={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                width: "fit-content", // Fit content width
                maxWidth: "90%", // Limit max width to avoid overly wide bubbles
              }}
            >
              <div className="flex items-center justify-between">
                {/* Message Content */}
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {msg.sender === "user" && (
                    <Edit
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => console.log("Edit message:", i)}
                      aria-label="Edit message"
                    />
                  )}
                  {msg.sender === "bot" && (
                    <Copy
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => navigator.clipboard.writeText(msg.content)}
                      aria-label="Copy message"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-4 bg-gray-900" // Match the chat window background
      >
        <div className="flex items-end space-x-3">
          <div className="flex items-center space-x-2">
            <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            <Mic className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            <Image className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
          </div>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-2 bg-gray-700 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none overflow-hidden"
            style={{
              height: inputHeight,
              maxHeight: "200px", // Limit max height to avoid excessive expansion
            }}
            rows={1}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>

      {/* Footer */}
      <footer className="p-2 bg-gray-900 text-xs text-gray-400 text-center ">
        Deepsource can make mistakes. Verify the information.
      </footer>
    </div>
  );
}