import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import PulseArrow from '../components/PulseArrow';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartItemCount } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart" id="cart-empty-panel">
        <ShoppingBag size={48} className="item-icon-overlay" />
        <h3>Your Cart is Empty</h3>
        <p>You haven't added any technical training kits to your order yet.</p>
        <Link to="/catalog" className="btn-primary">
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Browse Kits
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="cart-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>
          Shopping <span>Cart</span>
        </h1>
        <p>
          Review the experimental hardware kits and training packages you have selected.
        </p>
      </div>

      {/* Main Cart Area */}
      <div className="cart-grid">
        {/* Left Column - Selected items list */}
        <div className="cart-items-column">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item-card">
              <div className="cart-item-image">
                <ShoppingBag className="item-icon-overlay" size={24} />
              </div>

              <div className="cart-item-info">
                <span className="cart-item-category">{item.category}</span>
                <h3>{item.name}</h3>
                <span className="cart-item-unit-price">₹{item.price} each</span>
              </div>

              <div className="cart-item-controls">
                {/* Quantity Editor Controls */}
                <div className="quantity-selector cart-qty">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <span className="cart-item-subtotal">
                  ₹{item.price * item.quantity}
                </span>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="btn-secondary delete-item-btn"
                  title="Remove Item"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          <Link to="/catalog" className="continue-shopping">
            <ArrowLeft size={14} /> Continue Shopping
          </Link>
        </div>

        {/* Right Column - Summary panel details */}
        <div className="cart-summary-column">
          <div className="summary-panel card-panel">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Total Kits:</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cartItemCount} units</span>
            </div>
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span className="success-text">FREE</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span className="total-price">₹{cartTotal}</span>
            </div>

            <p className="tax-notice">
              Free educational laboratory shipping applies. Standard local GST included in all sandbox orders.
            </p>

            <Link to="/checkout" className="btn-primary checkout-action-btn" style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              Proceed to Checkout
              <PulseArrow style={{ marginLeft: '6px', width: '18px', height: '9px' }} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
