import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    cartTotal 
  } = useCart();
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overlay"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1001, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass"
            style={{ 
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '400px', 
              zIndex: 1002, display: 'flex', flexDirection: 'column', 
              borderLeft: '1px solid var(--color-border)', borderRadius: '0' 
            }}
          >
            {/* Header */}
            <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="heading-4 m-0 flex items-center gap-2">
                <FiShoppingBag /> Your Cart
                <span className="badge" style={{ background: 'var(--color-purple)', color: 'white', marginLeft: '8px' }}>
                  {cartItems.length}
                </span>
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', fontSize: '1.5rem', cursor: 'pointer', display: 'flex' }}
              >
                <FiX />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
              {cartItems.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)', gap: 'var(--space-4)' }}>
                  <FiShoppingBag style={{ fontSize: '4rem', opacity: 0.2 }} />
                  <p>Your cart is empty.</p>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setIsCartOpen(false)}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {cartItems.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={item.id} 
                      className="glass-card"
                      style={{ padding: 'var(--space-3)', display: 'flex', gap: 'var(--space-3)' }}
                    >
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                      />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ margin: '0 0 var(--space-1) 0', fontSize: 'var(--text-sm)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {item.title}
                          </h4>
                          <span className="gradient-text font-bold text-sm">{formatPrice(item.price)}</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', padding: '2px 4px' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            >
                              <FiMinus size={14} />
                            </button>
                            <span style={{ fontSize: 'var(--text-sm)', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', display: 'flex', padding: '4px', opacity: 0.8 }}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding: 'var(--space-5)', borderTop: '1px solid var(--color-border)', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>
                  <span>Total</span>
                  <span className="gradient-text">{formatPrice(cartTotal)}</span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 'var(--space-2)' }}
                  onClick={handleCheckout}
                >
                  Checkout <FiArrowRight />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
