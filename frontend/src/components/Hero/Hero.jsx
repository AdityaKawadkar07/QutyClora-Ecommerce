import React, { useEffect, useState } from "react";
import "./Hero.css";
import hero_image from "../assets/hero_image.png";
import hand_icon from '../assets/hand_icon.png';
import arrow_icon from '../assets/arrow.png'

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 200);
  }, []);

  return (
    <div className="hero">
      {/* Left Section */}
      <div className={`hero-left ${animate ? "fade-in-left" : ""}`}>
        <h2>Luxury Beauty Awaits</h2>

        <div className="hero-text">
          <p>Glow & Elegance</p>
        </div>

        <div className="hero-sparkle">
          <p>Radiance Like Never Before</p>
          {/* <img src={hand_icon} alt="Sparkle Icon" /> */}
        </div>

        <div className="hero-shop-btn">
          <span>Shop Now</span>
          <img src={arrow_icon} alt="Arrow Icon" />
        </div>
      </div>

      {/* Right Section */}
      <div className={`hero-right ${animate ? "fade-in-right" : ""}`}>
        <img src={hero_image} alt="Luxury Beauty Product" />
      </div>
    </div>
  );
};

export default Hero;
