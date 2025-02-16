import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginRegister from "./LoginRegister";
import Chat from "./Chat";
import LoadingScreen from "./LoadingScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 9000); // Simulate a delay for loading animation
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoading ? (
              <LoadingScreen />
            ) : isLoggedIn ? (
              <Navigate to="/chat" replace />
            ) : (
              <LoginRegister onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <Chat />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
