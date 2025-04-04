import React, { useState } from 'react';
import './FloatingButton.css';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="floating-button"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <a
        href="https://wa.me/918767080016" // 🔥 Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-link"
      >
        <FaWhatsapp className="whatsapp-icon" />
      </a>
      {showTooltip && <div className="tooltip">Contact us on WhatsApp</div>}
    </div>
  );
};

export default FloatingButton;
