import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)', minHeight: '100vh' }}
    >
      <div className="container">
        <h1 className="heading-2 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="glass" style={{ padding: 'var(--space-16)', textAlign: 'center', borderRadius: 'var(--radius-xl)' }}>
            <FiShoppingBag style={{ fontSize: '5rem', color: 'var(--color-text-muted)', opacity: 0.2, marginBottom: 'var(--space-4)' }} />
            <h2 className="heading-3 mb-4">Your cart is empty</h2>
            <p className="text-muted mb-8">Looks like you haven't added any digital products yet.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: 'var(--space-8)' }}>
            
            {/* Cart Items List */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 className="heading-5 m-0">Products ({cartItems.length})</h3>
                  <button 
                    onClick={clearCart}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: 'var(--text-sm)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    className="hover:text-pink transition"
                  >
                    <FiTrash2 /> Clear All
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {cartItems.map((item, index) => (
                    <div key={item.id} style={{ 
                      padding: 'var(--space-6)', 
                      display: 'flex', 
                      gap: 'var(--space-6)',
                      borderBottom: index < cartItems.length - 1 ? '1px solid var(--color-border)' : 'none',
                      alignItems: 'center'
                    }}>
                      <Link to={`/products/${item.id}`} style={{ display: 'block', width: '120px', flexShrink: 0 }}>
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </Link>
                      
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'var(--color-text-primary)' }}>
                            <h4 className="heading-6 m-0 hover:text-purple transition">{item.title}</h4>
                          </Link>
                          <span className="font-bold gradient-text" style={{ fontSize: '1.2rem' }}>
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                        
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', alignSelf: 'flex-start' }}>{item.category}</span>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px' }}
                            ><FiMinus /></button>
                            <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', padding: '4px' }}
                            ><FiPlus /></button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            className="hover:text-pink transition"
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div style={{ gridColumn: 'span 1' }}>
              <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', position: 'sticky', top: '100px' }}>
                <h3 className="heading-5 mb-6">Order Summary</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Tax (0%)</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: 800 }}>
                    <span>Total</span>
                    <span className="gradient-text">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <div style={{ position: 'relative' }}>
                    <FiTag style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                    <input type="text" className="input" placeholder="Coupon Code" style={{ paddingLeft: '36px', paddingRight: '80px', width: '100%' }} />
                    <button 
                      style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', background: 'var(--color-purple)', border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', padding: '0 12px', cursor: 'pointer' }}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <button 
                  className="btn btn-primary btn-lg w-full"
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <FiArrowRight />
                </button>
                
                <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                  <Link to="/products" style={{ color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: 'var(--text-sm)' }} className="hover:text-cyan transition">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
      <style>{`
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .w-full { width: 100%; }
        .hover\\:text-purple:hover { color: var(--color-purple) !important; }
        .hover\\:text-pink:hover { color: var(--color-pink) !important; }
        .hover\\:text-cyan:hover { color: var(--color-cyan) !important; }
        @media (max-width: 768px) {
          .grid-3 > div { grid-column: span 3 !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Cart;
