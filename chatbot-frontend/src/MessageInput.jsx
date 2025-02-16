import { useState } from "react";

export default function MessageInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-300 flex">
      <input
        type="text"
        placeholder="Type a message..."
        className="w-[calc(100%-100px)] flex-1 p-2 border rounded-md" // Reduced width
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <button
        onClick={handleSend}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Send
      </button>
    </div>
  );
}