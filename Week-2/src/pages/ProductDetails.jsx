import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../utils/api';
import { ChevronRight, Cpu, CheckCircle2, ShoppingCart, MessageSquare, Layers } from 'lucide-react';
import { getProductImage } from '../utils/imageMapper';
import PulseArrow from '../components/PulseArrow';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  if (loading) {
    return (
      <div className="loader-container page-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }} id="details-error">
        <Cpu size={48} style={{ color: 'var(--text-muted)' }} />
        <h3 className="total-row">Kit Not Found</h3>
        <p style={{ color: 'var(--text-secondary)' }}>The training kit you are trying to view does not exist.</p>
        <Link to="/catalog" className="btn-primary">
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Parse lists safely
  let components = [];
  let features = [];
  try {
    components = product.componentsList ? JSON.parse(product.componentsList) : [];
  } catch (e) {
    components = typeof product.componentsList === 'string' ? product.componentsList.split(',') : [];
  }

  try {
    features = product.projectsList ? JSON.parse(product.projectsList) : [];
  } catch (e) {
    features = typeof product.projectsList === 'string' ? product.projectsList.split(',') : [];
  }

  const diffClass = product.difficultyLevel ? product.difficultyLevel.toLowerCase() : 'beginner';

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '30px' }} id="details-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={10} />
        <Link to="/catalog">Catalog</Link>
        <ChevronRight size={10} />
        <span>{product.name}</span>
      </div>

      {/* Main product specs grid */}
      <div className="details-grid">
        {/* Left Column - Product Image banner */}
        <div className="details-media-col">
          <div className={`details-image-container ${diffClass}`} style={{ overflow: 'hidden', position: 'relative' }}>
            {getProductImage(product.name) ? (
              <img 
                src={getProductImage(product.name)} 
                alt={product.name} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholderIcon = e.target.parentElement.querySelector('.details-overlay-icon');
                  if (placeholderIcon) placeholderIcon.style.display = 'block';
                }}
              />
            ) : null}
            <Cpu 
              className="details-overlay-icon" 
              size={90} 
              style={{ display: getProductImage(product.name) ? 'none' : 'block' }}
            />
            <span 
              className="details-badge"
              style={{ position: 'absolute', top: '16px', right: '16px', margin: 0 }}
            >
              {product.difficultyLevel} Level
            </span>
          </div>
        </div>

        {/* Right Column - Product details info panel */}
        <div className="details-info-col card-panel">
          <span className="info-category">{product.category}</span>
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>{product.name}</h1>
          <p className="info-desc">{product.description}</p>
          
          <div className="price-stock-row">
            <span className="info-price">₹{product.price}</span>
            <span className={`stock-indicator ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {product.stock > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Quantity Controls */}
                <div className="purchase-controls">
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)', alignSelf: 'center' }}>Quantity:</span>
                  <div className="quantity-selector">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Main CTAs */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleBuyNow}
                    className="btn-primary"
                    style={{ flexGrow: 1, padding: '12px' }}
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className={`btn-secondary ${added ? 'success-btn' : ''}`}
                    style={{ flexGrow: 1, padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <ShoppingCart size={16} />
                    {added ? 'Added to Cart ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-secondary" style={{ cursor: 'not-allowed', color: 'var(--text-muted)', width: '100%', padding: '12px' }} disabled>
                Out of Stock
              </button>
            )}

            {/* Institutional Bulk inquiry promo box */}
            <div className="bulk-inquiry-promo">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <MessageSquare className="logo-icon" size={20} style={{ marginTop: '2px', color: 'var(--accent-indigo)' }} />
                <div>
                  <h4>Institutional Bulk Program</h4>
                  <p>
                    Setting up a college laboratory? Contact our support representatives to get volume discounts and custom PO billing.
                  </p>
                  <Link to="/contact" className="inline-promo-link" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    Contact Us For Custom Quotes <PulseArrow style={{ marginLeft: '6px', width: '16px', height: '8px' }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature lists row */}
      <div className="structured-specs-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Included Hardware components list */}
        <div className="specs-card">
          <h3 className="specs-title">
            <Layers className="specs-title-icon" size={20} />
            Hardware Components Included
          </h3>
          <p className="specs-subtitle">A list of all sensors, cables, and development boards enclosed in the kit box.</p>
          <ul className="specs-list">
            {components.map((comp, idx) => (
              <li key={idx} className="spec-list-item">
                <CheckCircle2 className="check-icon" size={16} />
                <span>{comp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mapped learning projects details */}
        <div className="specs-card">
          <h3 className="specs-title">
            <Cpu className="specs-title-icon" size={20} />
            Key Kit Learning Features
          </h3>
          <p className="specs-subtitle">Curriculum alignment and project-based objectives mapping this hardware kit.</p>
          <ul className="specs-list">
            {features.map((feat, idx) => (
              <li key={idx} className="spec-list-item">
                <CheckCircle2 className="check-icon projects-check" size={16} />
                <span className="project-bold">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
