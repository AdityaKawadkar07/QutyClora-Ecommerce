import React, { useEffect, useState } from 'react';
import cross_icon from '../../assets/cross_icon.png';
import './UserMessage.css'


const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const UserMessage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${API_BASE_URL}/allusermessage`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      } else {
        console.error('Error fetching messages:', data.message);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete-message`, {
        method: "POST", // Using POST as per your backend setup
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();
      if (data.success) {
        // Remove from frontend state
        setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== id));
      } else {
        console.error("Error deleting message:", data.message);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return ( 

    <div className='usermessagelist'>
        <div className="usermessage-header">
                <p>Name</p>
                <p>Email</p>
                <p>Whatsapp Number</p>
                <p>Message</p>
                <p>Remove</p>
            </div>
            <div className="usermessage-allmessage">        
              {messages.map((msg, index) => (
              <div key={index} className="usermessage-row">
                <p>{msg.name}</p>
                <p>{msg.email}</p>
                <p>{msg.phone}</p>
                <p>{msg.message}</p>
                <img src={cross_icon} className='usermessage-remove-icon' alt="Remove" onClick={() => handleDelete(msg._id)} />
              </div>
            ))}
            </div>  
    </div>
  )
}

export default UserMessage;
