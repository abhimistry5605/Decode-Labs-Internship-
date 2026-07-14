import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Send, CheckCircle, Landmark, Truck, FileText } from 'lucide-react';
import api from '../utils/api';
import Toast from '../components/Toast';

const Inquiry = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [kitName, setKitName] = useState(searchParams.get('kit') || '');
  const [quantity, setQuantity] = useState(10);
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        console.error('Failed to load products for dropdown:', err);
      }
    };
    fetchKits();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !institutionName || !kitName || !quantity) {
      setError('Please fill in all mandatory fields.');
      setToast({ message: 'Please fill in all mandatory fields.', type: 'error' });
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone,
        institutionName,
        kitName,
        quantity,
        message,
      };

      await api.post('/api/inquiries', payload);
      setSubmitted(true);
      setToast({ message: 'Quote inquiry registered successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Connection failed. Please retry.';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container" style={{ padding: '40px 20px' }} id="inquiry-success-page">
        <div className="success-checkout">
          <CheckCircle size={56} className="success-icon-giant" />
          <h2>Request Received</h2>
          <p className="receipt-details">
            Thank you for contacting EduCircuit Labs. Your inquiry details have been saved in our files.
          </p>
          <div className="receipt-details" style={{ fontSize: '0.85rem' }}>
            An academic procurement representative will evaluate your requirements for <strong>{institutionName}</strong> and contact you at <strong>{email}</strong> within 1 business day.
          </div>
          <div className="success-actions" style={{ marginTop: '20px' }}>
            <Link to="/catalog" className="btn-primary">
              Return to Catalog
            </Link>
            <Link to="/" className="btn-secondary">
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="inquiry-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          Institutional <span>Inquiry & Quote Program</span>
        </h1>
        <p>
          Request bulk price sheets, PO invoicing accounts, or customized curriculum packages for engineering labs.
        </p>
      </div>

      <div className="inquiry-grid">
        {/* Main form panel */}
        <form onSubmit={handleInquirySubmit} className="inquiry-form-card card-panel">
          <h3>Request Custom Quotation</h3>
          {error && <div className="error-alert">{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="filter-group-item">
              <label className="select-label">Representative Name *</label>
              <input
                type="text"
                required
                placeholder="Dr. Robert Carter"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="filter-group-item">
              <label className="select-label">Academic Email *</label>
              <input
                type="email"
                required
                placeholder="robert.carter@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="filter-group-item">
              <label className="select-label">Contact Phone *</label>
              <input
                type="text"
                required
                placeholder="+91 (800) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="filter-group-item">
              <label className="select-label">University / College *</label>
              <input
                type="text"
                required
                placeholder="MIT School of Engineering"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="filter-group-item">
              <label className="select-label">Target Training Kit *</label>
              <select
                className="select-box"
                required
                value={kitName}
                onChange={(e) => setKitName(e.target.value)}
              >
                <option value="" disabled>-- Select a Kit --</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.name}>
                    {prod.name} ({prod.category})
                  </option>
                ))}
                <option value="Custom Syllabus Package">Custom Syllabus Package (Multiple Kits)</option>
              </select>
            </div>
            <div className="filter-group-item">
              <label className="select-label">Target Quantity * (Min: 5)</label>
              <input
                type="number"
                required
                min="5"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="filter-group-item" style={{ marginBottom: '20px' }}>
            <label className="select-label">Lab Requirements or Message</label>
            <textarea
              className="text-area-input"
              rows="4"
              placeholder="Detail your ECE/CS course alignment requirements..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={submitting} 
            className="btn-primary submit-inquiry-btn"
            style={{ padding: '12px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Inquiry Request'}
          </button>
        </form>

        {/* Side Panel procurement descriptions */}
        <div className="inquiry-info-column">
          <div className="info-bullet-panel card-panel">
            <h3>Procurement Program</h3>
            <p className="subtitle-decor">Academic buying guidelines and laboratory terms.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="program-feature-row">
                <Landmark className="feature-row-icon" size={20} />
                <div>
                  <h4>PO Billing Accounts</h4>
                  <p>
                    We accept institution PO orders and support flexible Net-30 invoice billing terms.
                  </p>
                </div>
              </div>

              <div className="program-feature-row">
                <FileText className="feature-row-icon" size={20} />
                <div>
                  <h4>Custom Packaging</h4>
                  <p>
                    Our technical staff can pre-solder custom headers, swap specific sensors, and print customized lab manuals.
                  </p>
                </div>
              </div>

              <div className="program-feature-row">
                <Truck className="feature-row-icon" size={20} />
                <div>
                  <h4>Campus Delivery</h4>
                  <p>
                    All bulk shipments are fully insured and include replacements for any damaged lab components.
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

export default Inquiry;
