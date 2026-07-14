import React, { useState } from 'react';
import api from '../utils/api';
import { Send, CheckCircle, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import Toast from '../components/Toast';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setError('Please fill out all fields.');
      setToast({ message: 'Please fill out all fields.', type: 'error' });
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const response = await api.post('/api/contact', { name, email, phone, message });
      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setToast({ message: 'Message sent successfully! Thank you for writing to us.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Connection failure. Please try again.';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '40px 20px' }} id="contact-success-page">
        <div className="success-checkout">
          <CheckCircle size={56} className="success-icon-giant" />
          <h2>Message Sent!</h2>
          <p className="receipt-details">
            Thank you for reaching out to **EduCircuit Labs**. Your message has been successfully recorded.
          </p>
          <p className="receipt-details" style={{ fontSize: '0.8rem' }}>
            Our student assistance team or support engineer will review your inquiry and follow up within 24 hours.
          </p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="contact-page">
      {/* Page Header */}
      <div className="page-header" style={{ textAlign: 'center' }}>
        <h1>
          Contact <span>EduCircuit Labs</span>
        </h1>
        <p>
          Have questions about our laboratory hardware kits? Reach out to us.
        </p>
      </div>

      <div className="inquiry-grid">
        {/* Contact Form panel */}
        <form onSubmit={handleContactSubmit} className="inquiry-form-card card-panel">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare className="logo-icon" size={20} style={{ color: 'var(--accent-indigo)' }} />
            Send Us a Message
          </h3>

          {error && <div className="error-alert">{error}</div>}

          <div className="filter-group-item" style={{ marginBottom: '16px' }}>
            <label className="select-label">Full Name *</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="filter-group-item">
              <label className="select-label">Email Address *</label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="filter-group-item">
              <label className="select-label">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group-item" style={{ marginBottom: '20px' }}>
            <label className="select-label">Message *</label>
            <textarea
              required
              rows="5"
              placeholder="How can we help you? Let us know your requirements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn-primary submit-inquiry-btn"
            style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <>
                <Send size={14} /> Submit Message
              </>
            )}
          </button>
        </form>

        {/* Sidebar Info Column */}
        <div className="inquiry-info-column">
          <div className="info-bullet-panel card-panel">
            <h3>Get in Touch</h3>
            <p className="subtitle-decor">Contact parameters and headquarters location.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="program-feature-row">
                <Mail className="feature-row-icon" size={20} />
                <div>
                  <h4>Email Us</h4>
                  <p>support@educircuit.com</p>
                </div>
              </div>

              <div className="program-feature-row">
                <Phone className="feature-row-icon" size={20} />
                <div>
                  <h4>Call Us</h4>
                  <p>+91 (800) 123-4567</p>
                </div>
              </div>

              <div className="program-feature-row">
                <MapPin className="feature-row-icon" size={20} />
                <div>
                  <h4>Our Address</h4>
                  <p>
                    EduCircuit Labs Headquarters,<br />
                    102 Electronics Tower, Tech Park,<br />
                    Bangalore, Karnataka 560001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Contact;
