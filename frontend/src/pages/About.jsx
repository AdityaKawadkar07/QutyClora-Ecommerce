import React from "react";
import "./CSS/About.css";
import about_1 from '../components/assets/about-1.jpg'
import about_2 from '../components/assets/about-2.jpg'
import about_3 from '../components/assets/about-3.jpg'
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate =useNavigate()
  return (
    <div className="about-us-section">
      <h2>About Us | QutyClora </h2>
      <p>
        Welcome to <span className="highlighted">QutyClora</span> — where ancient herbal wisdom meets modern beauty care. We believe that beauty is best when it comes from nature, which is why our entire range is crafted using <strong>botanical ingredients</strong>, rich in nutrients that care for your hair and skin from within.
      </p>

      <p>
        At QutyClora, we’re more than just a beauty brand — we’re your <span className="highlighted">natural self-care companion</span>. Our mission is to help you rediscover your natural glow with <strong>gentle, effective, and toxin-free</strong> formulations that work in harmony with your body.
      </p>

      <h3>Why Choose QutyClora?</h3>
      <ul>
        <li>🌿 <strong>Herbal Goodness in Every Drop</strong> – Formulated with natural herbs, essential oils, and active botanicals.</li>
        <li>💧 <strong>Toxin-Free, Paraben-Free, Cruelty-Free</strong> – No harsh chemicals, no animal testing.</li>
        <li>🌟 <strong>Inspired by Nature, Backed by Science</strong> – Expertly crafted for visible and lasting results.</li>
      </ul>

      <div className="difference-section">
        <h2>Our Product Line</h2>

        <h3>✨ QutyClora Hair Cleanser</h3>
        <p>
          A herbal hair wash that deeply cleanses without stripping away natural oils.
          Infused with <strong>Aloe Vera</strong> and <strong>Vitamin B5</strong>, it restores scalp pH, reduces dandruff, and leaves hair soft, manageable, and tangle-free.
        </p>
        <p className="tip">💡 Did you know? A pH-balanced hair cleanser helps prevent scalp irritation and keeps your hair healthier over time.</p>

        <h3>✨ QutyClora Hair Conditioner</h3>
        <p>
          Powered with a unique blend of <strong>hydrating plant extracts</strong> that nourish each strand, reduce breakage, and leave hair smooth, shiny, and silky soft.
        </p>
        <p className="tip">💡 Natural conditioners with plant oils and proteins help repair cuticles and lock in moisture.</p>

        <h3>✨ QutyClora Face Purifier</h3>
        <p>
          Fight black spots, pigmentation, and acne with this deep-cleansing face wash made with <strong>Turmeric, Neem, and Tea Tree</strong>.
          It purifies pores and reduces inflammation for fresh, glowing skin.
        </p>
        <p className="tip">💡 Neem and Tea Tree naturally combat bacteria and reduce breakouts.</p>

        <h3>✨ QutyClora Skin Brightening Soap</h3>
        <p>
          Packed with <strong>Licorice Extract, Vitamin C, and Goat Milk</strong>, this soap fades dark spots, nourishes the skin, and enhances natural radiance.
        </p>
        <p className="tip">💡 Vitamin C boosts collagen and reduces pigmentation for a youthful glow.</p>
      </div>

      <div className="how-we-source-section">
        <h2>The QutyClora Promise 💚</h2>
        <p>We are committed to helping you feel confident in your skin and hair every single day. Our products are:</p>

        <div className="how-we-source-grid">
          <div className="how-we-source-item">
            <img src={about_1} alt="Dermatologically Tested" />
            <h3>Dermatologically Tested</h3>
            <p>Every formulation is rigorously tested to ensure it’s safe and effective for all skin types.</p>
          </div>
          <div className="how-we-source-item">
            <img src={about_2} alt="Premium Herbs" />
            <h3>Premium Herbal Ingredients</h3>
            <p>We source only the finest herbs and plant extracts to deliver purity and potency in every product.</p>
          </div>
          <div className="how-we-source-item">
            <img src={about_3} alt="Visible Results" />
            <h3>Visible Results, Naturally</h3>
            <p>Our customers see and feel the difference — healthier skin, stronger hair, and renewed confidence.</p>
          </div>
        </div>

        <button className="how-we-source-button">Explore Products</button>
      </div>

      <div className="cta-section">
        <h2>Ready to Try the Herbal Difference?</h2>
        <p>
          Thousands have already switched to <span className="highlighted">QutyClora’s clean and conscious beauty care</span> — and now it’s your turn.
        </p>
        <p>
          ✨ Whether you're looking to detox your skincare, repair your hair naturally, or simply glow from within, there's something here for you.
        </p>
        <p className="highlighted"><strong>Experience the power of herbs. Try QutyClora today — your skin and hair will thank you. 🌿💛</strong></p>
        <button className="cta-button" onClick={()=>navigate('/shop')}>Shop Now</button>
      </div>
    </div>
  );
};

export default About;
