import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import { Lock, ArrowLeft, CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !phone || !cardName || !cardNumber || !cardExpiry || !cardCvv) {
      setError('Please complete all shipping and simulated payment fields.');
      return;
    }
    setError('');
    setPlacingOrder(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: cartTotal,
        shippingAddress: address,
        contactPhone: phone,
      };

      const response = await api.post('/api/orders', orderPayload);
      setOrderSuccess(response.data);
      clearCart();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  // Guest redirect view
  if (!user) {
    return (
      <div className="empty-cart" style={{ maxWidth: '460px' }} id="checkout-guest-panel">
        <Lock size={48} className="item-icon-overlay" />
        <h3>Sign In Required</h3>
        <p>Please sign in or register an account to complete your technical training kit purchase.</p>
        <div className="success-actions" style={{ marginTop: '16px' }}>
          <Link to="/auth?redirect=checkout" className="btn-primary">
            Sign In / Sign Up
          </Link>
          <Link to="/cart" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={14} /> Return to Cart
          </Link>
        </div>
      </div>
    );
  }

  // Cart empty fallback
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="empty-cart" style={{ maxWidth: '460px' }} id="checkout-empty-panel">
        <ShoppingBag size={48} className="item-icon-overlay" />
        <h3>Nothing to Check Out</h3>
        <p>Your shopping cart is currently empty.</p>
        <Link to="/catalog" className="btn-primary">
          Go to Catalog
        </Link>
      </div>
    );
  }

  // Success Confirmation View
  if (orderSuccess) {
    return (
      <div className="container" style={{ padding: '40px 20px' }} id="checkout-success-page">
        <div className="success-checkout">
          <CheckCircle size={56} className="success-icon-giant" />
          <h2>Order Confirmed!</h2>
          <p className="order-id-highlight">
            Order Reference: <span>{orderSuccess.id}</span>
          </p>
          <div className="receipt-details">
            <p>Thank you for choosing EduCircuit Labs, <strong>{user.name}</strong>.</p>
            <p>We are pre-sorting your experimental kits. All reference manual links and invoice sheets have been emailed to: <strong>{user.email}</strong>.</p>
            <div className="receipt-summary">
              <div><span>Shipping Destination:</span> {orderSuccess.shippingAddress}</div>
              <div><span>Simulated Charge:</span> ₹{orderSuccess.totalAmount}</div>
            </div>
          </div>
          <div className="success-actions">
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link to="/catalog" className="btn-secondary">
              Browse More Kits
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="checkout-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          Secure <span>Checkout</span>
        </h1>
        <p>
          Verify your shipping details and submit your sandbox credit payment.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-grid">
        {/* Left Column - Shipping & simulated payment cards */}
        <div className="checkout-forms-column">
          {error && <div className="error-alert">{error}</div>}

          {/* Shipping Form Card */}
          <div className="form-section-card card-panel">
            <h3>1. Shipping Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="filter-group-item">
                <label className="select-label">Full Name</label>
                <input type="text" value={user.name} disabled />
              </div>
              <div className="filter-group-item">
                <label className="select-label">College / Institution</label>
                <input type="text" value={user.institutionName || 'Self-Learner'} disabled />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
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
                <label className="select-label">Shipping Address *</label>
                <input
                  type="text"
                  required
                  placeholder="123 Labs Rd, Tech Center"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Card Simulator */}
          <div className="form-section-card card-panel">
            <h3>2. Simulated Payment Card</h3>
            <div className="payment-notice">
              <Lock className="lock-icon-inline" size={14} />
              <span>Sandbox mode. Do not enter authentic credit cards.</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="filter-group-item">
                <label className="select-label">Cardholder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Jane Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>

              <div className="filter-group-item">
                <label className="select-label">Card Number *</label>
                <div className="input-with-icon">
                  <CreditCard className="input-icon-decor" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    className="input-padded-left"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="filter-group-item">
                  <label className="select-label">Expiry (MM/YY) *</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="filter-group-item">
                  <label className="select-label">CVV *</label>
                  <input
                    type="password"
                    required
                    maxLength="4"
                    placeholder="***"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Review order details panel */}
        <div className="cart-summary-column">
          <div className="summary-panel card-panel">
            <h3>Review Order</h3>
            
            <div className="review-items-list">
              {cartItems.map((item) => (
                <div key={item.productId} className="review-item-row">
                  <div className="review-item-name">
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>{item.name}</span>
                    <span className="qty-tag">x{item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span className="total-price">₹{cartTotal}</span>
            </div>

            <button 
              type="submit" 
              disabled={placingOrder}
              className="btn-primary submit-order-btn"
              style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            >
              {placingOrder ? 'Processing...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
