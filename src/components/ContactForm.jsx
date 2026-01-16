import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mail, Send } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus({ 
          type: 'success', 
          message: data.message || 'Message sent! We\'ll get back to you within 24 hours.' 
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          service: '',
          message: ''
        });
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.message || 'Failed to send message. Please email us directly at contact@1889dev.com' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="contact-form-card glass-card">
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Your name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company" className="form-label">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="form-input"
              placeholder="Your company (optional)"
            />
          </div>
          <div className="form-group">
            <label htmlFor="service" className="form-label">Service Interest</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select a service</option>
              <option value="On-Site Installation">On-Site Installation</option>
              <option value="Systems Engineering">Systems Engineering</option>
              <option value="Web Development">Web Development</option>
              <option value="Ongoing Management">Ongoing Management</option>
              <option value="General Consultation">General Consultation</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">Message *</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="form-input"
            placeholder="Tell us about your project or infrastructure needs..."
          />
        </div>

        {status.message && (
          <div className={`form-status ${status.type}`}>
            {status.message}
          </div>
        )}

        <Button 
          type="submit" 
          className="form-submit-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : (
            <>
              <Send className="mr-2 w-4 h-4" />
              Send Message
            </>
          )}
        </Button>

        <p className="form-note">
          <Mail className="inline w-4 h-4 mr-1" />
          Or email us directly: <a href="mailto:contact@1889dev.com" className="email-link">contact@1889dev.com</a>
        </p>
      </form>
    </Card>
  );
};

export default ContactForm;
