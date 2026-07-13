import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer" id="app-footer">
      <div className="container">
        <div className="footer-grid">
          
          {/* Brand Info Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <Cpu className="logo-icon" size={20} style={{ color: 'var(--accent-cyan)' }} />
              <span>
                EduCircuit <span style={{ color: 'var(--accent-cyan)' }}>Labs</span>
              </span>
            </div>
            <p className="brand-description">
              Empowering the next generation of engineers and college labs with high-performance, industry-aligned learning kits in Arduino, IoT, Robotics, and Embedded Systems.
            </p>
            <div className="social-links">
              <a href="#linkedin" className="social-icon" aria-label="Visit our LinkedIn Profile"><Linkedin size={14} /></a>
              <a href="#github" className="social-icon" aria-label="Visit our GitHub Profile"><Github size={14} /></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/catalog">Kits Catalog</Link></li>
              <li><Link to="/inquiry">Bulk Quotes</Link></li>
              <li><Link to="/auth">Sign In / Sign Up</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="footer-links">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/catalog?category=Arduino Kits">Arduino Kits</Link></li>
              <li><Link to="/catalog?category=IoT Kits">IoT Kits</Link></li>
              <li><Link to="/catalog?category=Robotics Kits">Robotics Kits</Link></li>
              <li><Link to="/catalog?category=Embedded Systems Kits">Embedded Systems</Link></li>
            </ul>
          </div>

          {/* Contact Details Section */}
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <MapPin size={16} className="contact-icon" />
                <span>102 Electronics Tower, Tech Park, Bangalore, KA 560001</span>
              </li>
              <li>
                <Phone size={16} className="contact-icon" />
                <span>+91 (800) 123-4567</span>
              </li>
              <li>
                <Mail size={16} className="contact-icon" />
                <span>support@educircuit.com</span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      {/* Footer Bottom copyright bar */}
      <div className="footer-bottom">
        <div className="bottom-container container">
          <p>&copy; {new Date().getFullYear()} EduCircuit Labs. All rights reserved.</p>
          <p className="footer-tagline">Built for hands-on technical excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
