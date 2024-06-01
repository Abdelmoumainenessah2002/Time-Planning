// src/components/ForgotPassword.js
import React, { useState } from 'react';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase';
import '../css/login.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent successfully.');
      setMessageColor('green');
    } catch (error) {
      setMessage('Failed to send password reset email.');
      setMessageColor('red');
      console.error('Password reset error:', error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="forgot-password-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="forgot-password-btn">Send Reset Email</button>
          <div className="message" style={{ color: messageColor }}>{message}</div>
        </form>
        <a href="/login" className="back-to-login">Back to Login</a>
      </div>
    </div>
  );
}

export default ForgotPassword;
