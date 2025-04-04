import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CSS/ResetPassword.css'


const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resetToken,
          newPassword: password
        })
      });
      
      const data = await response.json();
      
      if (data.success) {

        setSuccess(true);
        setError('');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      const errorData = await err.json();
      setError(errorData?.message || 'Password reset failed');

    }
  };

  return (
    <div className="reset-password">
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Password reset successfully! Redirecting to login...
        </div>
      )}
      <div className="reset-password-field">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;
