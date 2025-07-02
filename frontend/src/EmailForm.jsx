import React from "react";
import axios from 'axios';
import { useState } from "react";

export default function EmailForm({ onLogout }){
  const [formData, setFormData] = useState({
    to: '', 
    subject: '', 
    message: ''
  });
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setFormData({...formData, [e.target.name]: e.target.value});
    // Clear response when user starts typing
    if (response) setResponse('');
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/send-email', formData);
      setResponse(res.data.message);
      // Clear form on success
      setFormData({ to: '', subject: '', message: '' });
    } catch (error) {
      setResponse('Error sending email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="email-form-container">
      <div className="email-form-header">
        <h2>Send Email</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="email-form">
        <div className="form-group">
          <label htmlFor="to">Recipient Email</label>
          <input 
            id="to"
            name="to" 
            type="email" 
            placeholder="Enter recipient email address" 
            value={formData.to}
            required 
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input 
            id="subject"
            name="subject"  
            placeholder="Enter email subject" 
            value={formData.subject}
            required 
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea 
            id="message"
            name="message"  
            placeholder="Enter your message here..." 
            value={formData.message}
            required 
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="send-button"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Email"}
          </button>
          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
            style={{ marginLeft: '0.5rem' }}
          >
            Logout
          </button>
        </div>
      </form>
      
      {response && (
        <div className={`response-message ${response.includes('Error') ? 'error' : 'success'}`}>
          {response}
        </div>
      )}
    </div>
  );
}