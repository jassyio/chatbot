import { useState } from "react";
import { CheckCircle, ThumbsUp } from "lucide-react"; // Import icons for success feedback

export default function LoginRegister({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track success state

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setIsSuccess(false); // Reset success state when toggling modes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isLoginMode && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!username.trim() || !password.trim() || (!isLoginMode && !name.trim())) {
      setError("All fields are required.");
      return;
    }

    // Simulate successful registration/login
    setIsSuccess(true);
    setTimeout(() => {
      onLogin({ name, username }); // Call the onLogin callback
    }, 1500); // Delay to show success message
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
      <div className="w-full max-w-lg bg-gray-700 p-10 rounded-xl shadow-2xl">
        {/* Success Message */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center mb-6">
            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-green-500 text-center">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-300 text-center mt-2">
              {isLoginMode
                ? "You've successfully logged in."
                : "You've successfully registered."}
            </p>
          </div>
        )}

        {/* Intro/Directions */}
        {!isSuccess && (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-center mb-2 text-white">
              {isLoginMode ? "Welcome Back!" : "Create an Account"}
            </h1>
            <p className="text-gray-400 text-center">
              {isLoginMode
                ? "Please log in to continue."
                : "Join us to get started."}
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && !isSuccess && (
          <p className="text-red-500 mb-4 text-center">{error}</p>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-white font-medium mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-500 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="block text-white font-medium mb-1">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                className="w-full p-3 border border-gray-500 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-500 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {!isLoginMode && (
              <div>
                <label className="block text-white font-medium mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  className="w-full p-3 border border-gray-500 rounded-md bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition flex items-center justify-center"
            >
              {isLoginMode ? "Log In" : "Sign Up"}
              {isSuccess && <ThumbsUp className="w-5 h-5 ml-2" />}
            </button>
          </form>
        )}

        {/* Toggle Mode */}
        {!isSuccess && (
          <div className="text-center mt-6">
            <p className="text-gray-400">
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={toggleMode}
                className="text-green-500 hover:underline font-medium"
              >
                {isLoginMode ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}