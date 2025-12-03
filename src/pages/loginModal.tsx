import React, { useState } from "react";
import "./loginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // STEP 1: Try to get user (existing)
      
      // If successful
      onLoginSuccess(email);
      setError("");
      return;
    } catch (err: any) {
      // STEP 2: If 404, create new user
      if (err.response && err.response.status === 404) {
        try {
          onLoginSuccess(email);
          setError("");
          return;
        } catch (createErr) {
          setError("Failed to create user");
        }
      } else {
        setError("Server error, try again");
      }
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <h2>Login</h2>
        <p>Enter your email to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <span className="error">{error}</span>}

          <button type="submit" className="login-btn">Continue</button>

          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
