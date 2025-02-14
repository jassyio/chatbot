import React from "react";
import { Plus, Search, User, Bell, Settings, HelpCircle, X } from "lucide-react";

export default function Sidebar({ sidebarOpen, setSidebarOpen, startNewChat, model, setModel }) {
  const modelOptions = [
    { name: "free", label: "Free" },
    { name: "sourceplus", label: "Source Plus" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full w-72 bg-gray-800 text-white transition-transform flex flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } border-r border-gray-700`}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-lg font-bold">Deepsource</h1>
        <X
          className="w-6 h-6 cursor-pointer hover:text-red-500"
          onClick={() => setSidebarOpen(false)}
        />
      </div>

      <div className="p-4 h-[calc(100%-128px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {/* New Chat Button */}
        <button
          className="flex items-center p-2 w-full bg-gray-700 hover:bg-gray-600 rounded-lg mb-4"
          onClick={startNewChat}
        >
          <Plus className="w-5 h-5 mr-2" />
          New Chat
        </button>

        {/* Search Chats */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 pl-10 bg-gray-700 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        {/* Select Model */}
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-2">Select Model</h3>
          {modelOptions.map((option) => (
            <button
              key={option.name}
              className={`w-full p-2 mb-2 rounded-lg transition-colors duration-200 ${
                model === option.name
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              onClick={() => setModel(option.name)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Other Menu Items */}
        <div>
          {[
            { icon: <User className="w-5 h-5 mr-2" />, label: "Profile" },
            { icon: <Bell className="w-5 h-5 mr-2" />, label: "Notifications" },
            { icon: <Settings className="w-5 h-5 mr-2" />, label: "Settings" },
            { icon: <HelpCircle className="w-5 h-5 mr-2" />, label: "Help" },
          ].map((item, index) => (
            <div key={index} className="flex items-center p-2 hover:bg-gray-700 rounded-lg">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-center text-xs">
        Deepsource 2025 Copyright
        <br />
        <span className="font-bold">Powered by devOS</span>
      </div>
    </div>
  );
}