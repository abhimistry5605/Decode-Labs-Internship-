import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, ChevronRight, Cpu, Layers } from 'lucide-react';
import { getProductImage } from '../utils/imageMapper';
import PulseArrow from '../components/PulseArrow';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategoryFilter(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch catalog kits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchKits();
  }, []);

  const handleCategoryChange = (cat) => {
    setCategoryFilter(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Filter logic
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || prod.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'All' || prod.difficultyLevel === difficultyFilter;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    return 0;
  });

  const categories = ['All', 'Arduino Kits', 'IoT Kits', 'Robotics Kits', 'Embedded Systems Kits', 'Combo Packs'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const getComboSavings = (name) => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('zero to hero')) return 'Save ₹1,500';
    if (lowercase.includes('smart home')) return 'Save ₹1,500';
    if (lowercase.includes('autonomous ai')) return 'Save ₹3,000';
    if (lowercase.includes('academic lab')) return 'Save ₹5,000';
    return null;
  };

  return (
    <div className="container" style={{ padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }} id="catalog-page">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={10} />
        <span>Kits Catalog</span>
      </div>

      {/* Page Header */}
      <div className="page-header">
        <h1>
          Training <span>Kits Catalog</span>
        </h1>
        <p>
          Browse practical learning kits designed for electronics, IoT, robotics, and embedded systems.
        </p>
      </div>

      {/* Category Pills Container */}
      <div className="category-pills-container" id="catalog-category-filters">
        <div className="category-pills-scroll">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`category-pill-btn ${isActive ? 'active' : ''}`}
              >
                {cat === 'All' && '⚡ '}
                {cat === 'Arduino Kits' && '📟 '}
                {cat === 'IoT Kits' && '🌐 '}
                {cat === 'Robotics Kits' && '🤖 '}
                {cat === 'Embedded Systems Kits' && '🔬 '}
                {cat === 'Combo Packs' && '📦 '}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Section */}
      <div className="catalog-controls">
        <div className="filters-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
          {/* Search */}
          <div className="filter-group-item">
            <label className="select-label">Search Kits</label>
            <div className="search-bar-wrapper">
              <Search className="search-icon" size={16} />
              <input
                type="text"
                className="search-input"
                placeholder="Search kits or microcontrollers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="filter-group-item">
            <label className="select-label">Difficulty</label>
            <select
              className="select-box"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              {difficulties.map((diff, i) => (
                <option key={i} value={diff}>{diff} Level</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Results Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <span>Showing {sortedProducts.length} kits</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Sort by:</span>
          <select
            className="select-box"
            style={{ width: 'auto', padding: '4px 24px 4px 10px', fontSize: '0.8rem' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="alphabetical">A - Z</option>
          </select>
        </div>
      </div>

      {/* Catalog Grid Section */}
      {loading ? (
        <div className="spinner"></div>
      ) : sortedProducts.length === 0 ? (
        <div className="empty-catalog">
          <Cpu className="empty-icon" size={48} style={{ opacity: 0.3 }} />
          <h3>No Kits Found</h3>
          <p>We couldn't find any training kits matching your active criteria.</p>
          <button 
            className="btn-secondary reset-btn" 
            onClick={() => {
              setSearchTerm('');
              handleCategoryChange('All');
              setDifficultyFilter('All');
              setSortBy('featured');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {sortedProducts.map((kit) => {
            let features = [];
            try {
              features = kit.componentsList ? JSON.parse(kit.componentsList) : [];
            } catch (e) {
              features = typeof kit.componentsList === 'string' ? kit.componentsList.split(',') : [];
            }

            return (
              <article 
                key={kit.id} 
                className={`product-card ${kit.category === 'Combo Packs' ? 'combo-card' : ''}`}
              >
                {/* Media Image Banner */}
                <div className="card-media" style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  {kit.category === 'Combo Packs' && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'linear-gradient(135deg, #D1824B 0%, #B8524D 100%)',
                      color: 'white',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 8px rgba(209, 130, 75, 0.4)',
                      letterSpacing: '0.05em',
                      zIndex: 2
                    }}>
                      🔥 Combo Bundle
                    </span>
                  )}
                  {getProductImage(kit.name) ? (
                    <img 
                      src={getProductImage(kit.name)} 
                      alt={kit.name} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderTopLeftRadius: '16px',
                        borderTopRightRadius: '16px',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const placeholder = e.target.parentElement.querySelector('.card-img-placeholder');
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`card-img-placeholder ${kit.difficultyLevel.toLowerCase()}`}
                    style={{ 
                      display: getProductImage(kit.name) ? 'none' : 'flex',
                      height: '100%',
                      width: '100%'
                    }}
                  >
                    <Cpu className="placeholder-overlay-icon" size={48} />
                  </div>
                  <span className="badge">
                    {kit.difficultyLevel}
                  </span>
                </div>

                {/* Content Block */}
                <div className="card-content" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <span className="card-category">{kit.category}</span>
                    <h3 style={{ marginTop: '2px', marginBottom: '6px' }}>{kit.name}</h3>
                    {getComboSavings(kit.name) && (
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(77, 138, 100, 0.1)',
                        color: 'var(--success)',
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid rgba(77, 138, 100, 0.2)'
                      }}>
                        🎉 {getComboSavings(kit.name)} Special Discount
                      </div>
                    )}
                    <p className="card-desc" style={{ marginBottom: '8px' }}>{kit.description}</p>
                  </div>

                  {/* Included Features List details */}
                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', flexGrow: 1 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Layers size={12} className="logo-icon" /> {kit.category === 'Combo Packs' ? '📦 Bundled Learning Kits:' : 'Included Components:'}
                    </span>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {features.slice(0, 4).map((feat, idx) => (
                        <li key={idx} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ height: '4px', width: '4px', borderRadius: '50%', backgroundColor: 'var(--accent-indigo)', flexShrink: 0 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action footer */}
                  <div className="card-footer" style={{ marginTop: 'auto' }}>
                    <span className="card-price">₹{kit.price}</span>
                    <Link to={`/catalog/${kit.id}`} className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      View Details
                      <PulseArrow style={{ marginLeft: '4px', width: '16px', height: '8px' }} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Catalog;
