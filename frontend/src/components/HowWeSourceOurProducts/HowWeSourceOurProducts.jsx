import React from 'react';
import './HowWeSourceOurProducts.css';
import nature_source from '../assets/nature_source.png';
import certified_product from '../assets/certified_products.png';
import sustainable from '../assets/sustainable.png';
import { Link } from 'react-router-dom';

const HowWeSourceOurProducts = () => {
  return (
    <div className="how-we-source-section">
      <h2>How We Source Our Products</h2>
      <p>Our sourcing process ensures that each product we offer is natural, herbal, and Ayurvedic, directly extracted from nature’s best sources.</p>
      
      <div className="how-we-source-grid">
        <div className="how-we-source-item">
          <img src={nature_source} alt="Sourcing from Nature" />
          <h3>Direct from Nature</h3>
          <p>We source ingredients directly from nature, ensuring they are fresh, pure, and high in quality for our products.</p>
        </div>
        
        <div className="how-we-source-item">
          <img src={sustainable} alt="Sustainable Practices" />
          <h3>Sustainable Practices</h3>
          <p>Our practices are sustainable, ensuring minimal environmental impact while providing top-quality herbal products.</p>
        </div>
        
        <div className="how-we-source-item">
          <img src={certified_product} alt="Certified Ingredients" />
          <h3>Certified Ingredients</h3>
          <p>We only use certified, organically grown ingredients to maintain the integrity and authenticity of our products.</p>
        </div>
      </div>
    <Link style={{textDecoration:'none'}} to='/shop'>
      <button className="how-we-source-button">Explore Our Products</button>
      </Link>
    </div>
  );
};

export default HowWeSourceOurProducts;
