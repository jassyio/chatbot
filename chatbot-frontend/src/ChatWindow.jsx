// ChatWindow.js
import React, { useState, useRef, useEffect } from "react";
import { Paperclip, Mic, Image, Send, Edit, Copy } from "lucide-react";
import { getRandomWelcomeMessage } from "./welcomeMessages";
import OpenIcon from "./assets/osidebar.png";
import CloseIcon from "./assets/csidebar.png";

export default function ChatWindow({ sidebarOpen, setSidebarOpen, newChat }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", content: input }]);
    setInput("");
  };

  useEffect(() => {
    if (newChat) {
      setMessages([]);
    }
  }, [newChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleEdit = (index) => {
    console.log("Editing message at index:", index);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    console.log("Copied to clipboard:", content);
  };

  return (
    <div className={`flex-1 flex flex-col w-full h-full ${sidebarOpen ? "pl-5" : ""}`}>
      <div className="p-4 bg-gray-600 flex justify-between items-center border-b border-gray-700 text-white">
        <div className="flex items-center space-x-2">
          {sidebarOpen ? (
            <img
              src={CloseIcon}
              alt="Close Sidebar"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            />
          ) : (
            <img
              src={OpenIcon}
              alt="Open Sidebar"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setSidebarOpen(true)}
            />
          )}
          <h1 className="text-lg font-bold">Deepsource AI</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 bg-gray-900 text-white">
        {messages.length === 0 ? (
          <div className="bg-gray-800 p-4 rounded-lg text-center text-sm text-gray-300">
            {getRandomWelcomeMessage()}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`p-1 my-1 rounded-lg max-w-lg mx-auto ${
                msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-700 text-white"
              }`}
            >
              <div className="flex items-center justify-between">
                {msg.content}
                <div className="flex space-x-1">
                  {msg.sender === "user" && (
                    <Edit
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleEdit(i)}
                    />
                  )}
                  {msg.sender === "bot" && (
                    <Copy
                      className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleCopy(msg.content)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-1.5 bg-gray-800 flex items-center space-x-2">
        <Paperclip className="w-5 h-5 text-gray-400 cursor-pointer" />
        <Mic className="w-5 h-5 text-gray-400 cursor-pointer" />
        <Image className="w-5 h-5 text-gray-400 cursor-pointer" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="w-[calc(100%-200px)] flex-grow p-1 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
        />
        <button type="submit" className="p-1 bg-blue-500 rounded-md hover:bg-blue-600">
          <Send className="w-5 h-5 text-white" />
        </button>
      </form>
      <div className="p-0.5 bg-gray-800 text-xs text-gray-400 text-center">
        Deepsource can make mistakes. Verify the information.
      </div>
    </div>
  );
}

// Chat.js (No changes needed here from the previous version)
// ... (Chat.js code from the previous response)