import React, { useState } from "react";
import axios from "axios";
import "./loginModal.css";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

const baseUrl = "https://alvative-backend.onrender.com";

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [buttonMessage, setButtonMessage] = useState("Continue")


  

  if (!isOpen) return null;

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      // STEP 1: Check if user exists
      setButtonMessage("logging in...")
      const response = await axios.get(`${baseUrl}/users/${email}`);
      
      if (response.status === 200) {
        // User exists
        onLoginSuccess(email);
        setError("");
      }
    } catch (err: any) {
      // STEP 2: If 404, create the user
      if (err.response && err.response.status === 404) {
        try {
          const createResponse = await axios.post(`${baseUrl}/users`, { email });
          if (createResponse.status === 200 || createResponse.status === 201) {
            onLoginSuccess(email);
            setError("");
          }
        } catch (createErr: any) {
          setError("Failed to create user. Try again.");
        }
      } else {
        setError("Server error, try again.");
      }
    }finally{

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

          <button type="submit" className="login-btn">{buttonMessage}</button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
