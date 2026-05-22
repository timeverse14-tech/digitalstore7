import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail, FiBox } from 'react-icons/fi';

const Footer = () => {
  const categories = [
    'eBooks', 'AI Prompts', 'Presets', 'Templates', 
    'Courses', 'APKs', 'Editing Packs', 'Tools'
  ];

  return (
    <footer className="footer" style={{ 
      background: 'var(--color-bg-secondary)', 
      borderTop: '1px solid var(--color-border)',
      paddingTop: 'var(--space-12)',
      paddingBottom: 'var(--space-6)',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: 'var(--space-10)', gap: 'var(--space-8)' }}>
          {/* Column 1: Brand */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', textDecoration: 'none', color: 'var(--color-text-primary)' }}>
              <FiBox style={{ color: 'var(--color-purple)', fontSize: '1.5rem' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                <span className="gradient-text">Pixel</span>Vault
              </span>
            </Link>
            <p className="text-small text-muted">
              The premier marketplace for futuristic digital products. Elevate your creative workflow with our premium curated assets.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }} className="hover:text-purple transition"><FiTwitter /></a>
              <a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }} className="hover:text-purple transition"><FiInstagram /></a>
              <a href="#" style={{ color: 'var(--color-text-muted)', fontSize: '1.25rem' }} className="hover:text-purple transition"><FiGithub /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <li><Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-cyan">Home</Link></li>
              <li><Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-cyan">Products</Link></li>
              <li><Link to="/cart" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-cyan">Cart</Link></li>
              <li><Link to="/login" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', transition: 'color 0.2s' }} className="hover:text-cyan">Login</Link></li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Categories</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/products?category=${cat}`} style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }} className="hover:text-purple">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', fontSize: '1rem' }}>Stay Updated</h4>
            <p className="text-small text-muted" style={{ marginBottom: 'var(--space-3)' }}>
              Subscribe to get notified about new products and special offers.
            </p>
            <form style={{ display: 'flex', gap: 'var(--space-2)' }} onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="input"
                style={{ flex: 1, padding: '8px 12px', fontSize: 'var(--text-sm)' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px' }}>
                <FiMail />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.05)', 
          paddingTop: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          textAlign: 'center'
        }}>
          <p className="text-small text-muted m-0">
            &copy; {new Date().getFullYear()} PixelVault Store. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', opacity: 0.5 }}>
            <span style={{ fontSize: 'var(--text-xs)' }}>SECURE PAYMENTS VIA UPI</span>
          </div>
        </div>
      </div>
      <style>{`
        .hover\\:text-purple:hover { color: var(--color-purple) !important; }
        .hover\\:text-cyan:hover { color: var(--color-cyan) !important; }
      `}</style>
    </footer>
  );
};

export default Footer;
