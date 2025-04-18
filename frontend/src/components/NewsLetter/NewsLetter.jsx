import React, { useState } from 'react';
import './NewsLetter.css';

const NewsLetter = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // added

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Subscription email sent! 🎉");
        setEmail('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offers On Your Email</h1>
      <p>Subscribe to our newsletter and stay updated</p>
      <div>
        <input
          type="email"
          placeholder='Your Email Id'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>
      {message && <p style={{ marginTop: '10px', color: '#333' }}>{message}</p>}
    </div>
  );
};

export default NewsLetter;
