import React, { useState } from 'react';
import './UtilityBox.css';
import Reviews from '../Reviews/Reviews';

const UtilityBox = ({product}) => {
  const [activeTab, setActiveTab] = useState('description');

  return (
    <div className="descriptionbox">
      <div className="descriptionbox-navigator">
        <div
          className={`descriptionbox-nav-box ${activeTab === 'description' ? '' : 'fade'}`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </div>
        <div
          className={`descriptionbox-nav-box ${activeTab === 'reviews' ? '' : 'fade'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </div>
      </div>

      {activeTab === 'description' ? (
        <div className="descriptionbox-description">
          <h2>QutyClora - Your Destination for Beauty & Wellness ✨🌿</h2>
          <p>
            Welcome to <b>QutyClora</b>, where beauty meets innovation! Explore our handpicked
            collection of hair and skincare products designed to nourish, hydrate, and rejuvenate...
          </p>
          <p>
            From clarifying hair cleansers to brightening soaps, every formulation delivers salon-quality
            results for radiant, healthy hair and glowing skin...
          </p>
        </div>
      ) : (
        <div className="descriptionbox-reviews">
        <Reviews product={product}/>
      </div>
      )}
    </div>
  );
};

export default UtilityBox;
