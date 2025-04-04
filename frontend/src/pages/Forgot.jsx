import React, { useState } from 'react';
import './CSS/ForgotPassword.css'; // Import the CSS file

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      // Logic to send the email to the backend for password recovery
      const response = await fetch(`${BACKEND_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.success) {
          alert('If you are a registered user, a recovery email will be sent to your email address.');
          setEmail(''); // Clear the input field after sending the email
        } else {
          alert(data.message || data.errors);
        }
      } else {
        alert('Error: ' + (data.message || 'Something went wrong'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="forgot-password">
      <div className="forgot-password-container">
        <h1>Forgot Password</h1>
        <div className="forgot-password-field">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Recovery Email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
