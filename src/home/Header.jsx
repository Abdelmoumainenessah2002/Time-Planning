import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/style.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isLoggedIn = !!localStorage.getItem('user');

  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2 onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              My-Time
            </h2>
          </div>
          <div className="start">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="start-btn">Logout</button>
            ) : (
              location.pathname !== '/login' && (
                <Link to="/login" className="start-btn">Login Now</Link>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
