import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newChat, setNewChat] = useState(false);

  const startNewChat = () => {
    setNewChat(true);
    setTimeout(() => setNewChat(false), 0); // Reset `newChat` to ensure ChatWindow updates
  };

  const chatAreaStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    marginLeft: sidebarOpen ? "260px" : "0",
    transition: "margin-left 0.3s ease",
    overflow: "hidden",
  };

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} startNewChat={startNewChat} />
      <div style={chatAreaStyle}>
        <ChatWindow sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} newChat={newChat} />
      </div>
    </div>
  );
}
