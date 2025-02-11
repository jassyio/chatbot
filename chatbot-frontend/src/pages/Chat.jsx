"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"

function Chat() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = { text: inputMessage, isUser: true }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInputMessage("")

    try {
      const response = await axios.post("http://localhost:8000/chat/", {
        message: inputMessage,
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      })

      const botMessage = { text: response.data.bot_response, isUser: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (err) {
      console.error("Error communicating with the backend", err)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.isUser ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="bg-gray-200 p-4">
        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
          <input
            type="text"
            className="flex-grow px-4 py-2 focus:outline-none"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 font-semibold hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat

