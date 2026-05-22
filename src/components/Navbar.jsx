import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiSearch, FiMenu, FiX, FiUser, FiLogOut, FiBox, FiPackage } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const { user, logout, isAdmin } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
  ];

  return (
    <>
      <style>{`
        .navbar-custom {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: var(--space-4) 0;
          border-bottom: 1px solid transparent;
        }
        .navbar-custom.navbar-scrolled {
          background: var(--color-surface);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-3) 0;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: var(--text-2xl);
          text-decoration: none;
        }
        .nav-logo-icon {
          color: var(--color-purple);
          font-size: var(--text-3xl);
        }
        .nav-links {
          display: none;
        }
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
            gap: var(--space-6);
            align-items: center;
          }
        }
        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }
        .icon-btn {
          background: none;
          border: none;
          color: var(--color-text-primary);
          font-size: var(--text-xl);
          cursor: pointer;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .icon-btn:hover {
          color: var(--color-purple);
          transform: translateY(-2px);
        }
        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--color-purple);
          color: white;
          font-size: 0.65rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--color-bg-primary);
        }
        .user-menu {
          position: relative;
        }
        .user-dropdown {
          position: absolute;
          top: 120%;
          right: 0;
          min-width: 200px;
          padding: var(--space-2);
          z-index: 1001;
        }
        .user-dropdown-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          color: var(--color-text-primary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          font-family: var(--font-body);
          font-size: var(--text-sm);
          cursor: pointer;
        }
        .user-dropdown-item:hover {
          background: rgba(168, 85, 247, 0.1);
          color: var(--color-purple);
        }
        .mobile-menu-btn {
          display: block;
        }
        @media (min-width: 768px) {
          .mobile-menu-btn {
            display: none;
          }
        }
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 80%;
          max-width: 320px;
          background: var(--color-bg-secondary);
          z-index: 1002;
          padding: var(--space-6);
          border-left: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
        }
      `}</style>

      <nav className={`navbar-custom ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container flex-between">
          <Link to="/" className="nav-logo">
            <FiBox className="nav-logo-icon" />
            <span><span className="gradient-text">Pixel</span>Vault</span>
          </Link>

          <div className="nav-links">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} className="nav-link text-body">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            
            <Link to="/products" className="icon-btn" aria-label="Search">
              <FiSearch />
            </Link>
            
            <button className="icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </button>

            {user ? (
              <div className="user-menu">
                <button 
                  className="icon-btn" 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <FiUser />
                </button>
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="glass user-dropdown"
                    >
                      <div className="p-3 mb-2 border-b border-gray-700">
                        <p className="text-sm font-bold truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          className="user-dropdown-item"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <FiPackage /> Admin Panel
                        </Link>
                      )}
                      
                      <Link 
                        to="/dashboard" 
                        className="user-dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FiUser /> Dashboard
                      </Link>
                      
                      <button 
                        onClick={handleLogout}
                        className="user-dropdown-item text-red-400 hover:text-red-300"
                      >
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm hidden md:flex">
                Login
              </Link>
            )}

            <button 
              className="icon-btn mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1001, background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-drawer"
            >
              <div className="flex-between mb-8">
                <div className="nav-logo">
                  <FiBox className="nav-logo-icon" />
                  <span className="text-xl">PixelVault</span>
                </div>
                <button 
                  className="icon-btn" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiX />
                </button>
              </div>

              <div className="flex flex-col gap-4 flex-grow">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className="text-lg py-2 border-b border-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {!user && (
                  <Link 
                    to="/login" 
                    className="btn btn-primary mt-4 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
