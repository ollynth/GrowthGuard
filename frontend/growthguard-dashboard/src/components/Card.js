// src/components/Card.js
import React from 'react';
import './Card.css'; // Import the CSS file

const Card = ({ title, value, icon, iconRight }) => {
  return (
    <div className="card">
      {/* Left side: Title and Value */}
      <div>
        <p className="card__title">{title}</p>
        <p className="card__value">{value}</p>
      </div>

      {/* Centered Icon (if provided) */}
      {icon && <span className="card__icon">{icon}</span>}

      {/* Right side: Icon (if provided) */}
      {iconRight && <span className="card__icon-right">{iconRight}</span>}
    </div>
  );
};

export default Card;