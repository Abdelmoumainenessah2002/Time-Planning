// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import '../css/forgot.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Login || My-Time";
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      setMessage('Login success');
      setMessageColor('green');

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        localStorage.setItem('user', JSON.stringify(userDoc.data()));
        navigate('/admin');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      setMessage('Failed to login. Please check your credentials.');
      setMessageColor('red');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container pd-y">
      <div className="login">
        <h2>Login Page</h2>
        <p><b>Note:</b> This Page is only for admins</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            className='login-input email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className='login-input password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className='login-btn'>Login</button>
          <div className="err" style={{ color: messageColor }}>{message}</div>
        </form>
        <a href="/forgot-password" className='forgot'>Forgot Password?</a> {/* Update link */}
      </div>
    </div>
  );
}

export default Login;
