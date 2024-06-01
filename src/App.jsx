// src/App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Header } from './home/Header';
import { Home } from './home/Home';
import Login from './login/Login';
import Admin from './admin/Admin';
import ForgotPassword from './login/ForgotPassword'; // Import ForgotPassword
import AuthProviderWithRouter from './context/AuthProviderWithRouter';

function App() {
  return (
    <AuthProviderWithRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add ForgotPassword route */}
      </Routes>
    </AuthProviderWithRouter>
  );
}

export default App;
