import React, { useState } from 'react';
import './CSS/ContactUs.css';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const response = await fetch(`${BACKEND_API_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, phone, message }),
    });

    const data = await response.json();
    if (data.success) {
      alert('Message sent successfully!');
      // Clear the form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } else {
      alert('Error sending message: ' + data.message);
    }
  };


  return (
    <div className="contactus">
      <div className="contactus-container">
        <h1>Contact Us</h1>
        <div className="contactus-form">
          <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="number" placeholder="WhatsApp Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <textarea placeholder="Your Message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>

          <button onClick={handleSubmit}>Send Message</button>
        </div>
      </div>

      <div className="contactus-details">
        <div className="contactus-support">
          <h2>Customer Support</h2>
          <p>Email: support@inarcchmart.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        <div className="contactus-hours">
          <h2>Business Hours</h2>
          <p>Monday - Friday: 9 AM - 6 PM</p>
          <p>Saturday: 10 AM - 4 PM</p>
          <p>Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
