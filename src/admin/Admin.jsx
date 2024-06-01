import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSelect from './AdminSelect';
import Footer from '../home/Footer';
import '../css/style.css';

function Admin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by looking for the user key in localStorage
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/'); // Redirect to home page if user is not found
    } else {
      document.title = "Admin"; // Set document title to "Admin"
    }
  }, [navigate]);

  return (
    <div id='admin'>
      <AdminSelect/>
      <Footer />
    </div>
  );
}

export default Admin;

