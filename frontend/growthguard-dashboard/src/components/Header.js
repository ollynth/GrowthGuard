// src/components/Header.js
import React from 'react';
import './Header.css'; 

const Header = () => {
  return (
    <header className="header">
        <img src="/growthguard_logo-removebg.png" alt="Logo" className="header__logo"/>
        <h1>GrowthGuard Dashboard</h1>
    </header>
  );
};

export default Header;