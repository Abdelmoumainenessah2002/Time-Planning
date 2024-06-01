import {React,useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Levels from './Levels';
import Footer from './Footer';
import HomeSection from './HomeSection';
import '../css/style.css';


function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Home || My-Time";
    const user = localStorage.getItem('user');
    console.log(user);
    if (user) {
      navigate('/admin');
    } 
  }, [navigate]);

  

  return (
    <div>
      <HomeSection />
      <Levels />
      <Footer />
    </div>
  );
}

export { Home };
