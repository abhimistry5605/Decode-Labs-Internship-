import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Cpu, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Training Kits', path: '/catalog' },
    { label: 'Services', path: '/inquiry' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="navbar" id="app-nav">
      <div className="nav-container container">
        {/* Logo Branding */}
        <Link to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
          <Cpu className="logo-icon" size={20} />
          <span>
            EduCircuit <span className="logo-sub">Labs</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-links-desktop">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          {user && (
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              Dashboard
            </NavLink>
          )}
        </div>

        {/* Desktop Action Buttons */}
        <div className="nav-actions-desktop">
          <Link to="/cart" className="cart-btn" aria-label="Open Shopping Cart">
            <ShoppingCart size={18} />
            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </Link>

          {user ? (
            <div className="user-profile">
              <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogoutClick}
                className="btn-secondary logout-btn"
                title="Log Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/auth" className="btn-primary login-btn">
              <User size={14} style={{ marginRight: '4px' }} />
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Hamburger toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-toggle"
          aria-label={isOpen ? "Close main navigation menu" : "Open main navigation menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {isOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            {navItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
            )}

            <div className="mobile-drawer-actions">
              <Link
                to="/cart"
                onClick={() => setIsOpen(false)}
                className="mobile-cart-btn"
              >
                <ShoppingCart size={16} />
                Cart ({cartItemCount})
              </Link>

              {user ? (
                <button
                  onClick={handleLogoutClick}
                  className="btn-secondary mobile-logout-btn"
                >
                  <LogOut size={14} style={{ marginRight: '6px' }} />
                  Log Out ({user.name.split(' ')[0]})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary mobile-login-btn"
                >
                  <User size={14} style={{ marginRight: '6px' }} />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
