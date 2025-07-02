import React, { useState, useEffect } from "react";
import Login from "./Login";
import EmailForm from "./EmailForm";
import Dashboard from "./Dashboard";
import Register from "./Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const savedUsername = localStorage.getItem("username");
    const savedUserId = localStorage.getItem("userId");
    
    if (loginStatus === "true" && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
      setUserId(savedUserId);
    }
  }, []);

  const handleLogin = (userUsername) => {
    setIsLoggedIn(true);
    setUsername(userUsername);
    setUserId(localStorage.getItem("userId"));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setUserId("");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
  };

  return (
    <div className="App">
      {isLoggedIn ? (
        <div className="app-container">
          <header className="app-header">
            <h1>Email Sender</h1>
          </header>
          <main className="app-main">
            <Dashboard username={username} />
            <EmailForm onLogout={handleLogout} />
          </main>
        </div>
      ) : showRegister ? (
        <>
          <Register onRegisterSuccess={() => setShowRegister(false)} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={() => setShowRegister(false)}>
              Already have an account? Log in
            </button>
          </div>
        </>
      ) : (
        <>
          <Login onLogin={handleLogin} />
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button onClick={() => setShowRegister(true)}>
              Don't have an account? Register
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
