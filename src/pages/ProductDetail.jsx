import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiDownload, FiShoppingCart, FiCreditCard, FiArrowLeft, FiCheck } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (!loading) {
      const p = getProduct(id);
      if (p) setProduct(p);
    }
  }, [id, loading, getProduct]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-4)' }}>
        <h2 className="heading-2 gradient-text">Product Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart({ ...product, quantity });
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)' }}
    >
      <div className="container">
        
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-sm" 
          style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', padding: 0, marginBottom: 'var(--space-6)' }}
        >
          <FiArrowLeft /> Back
        </button>

        <div className="grid-2" style={{ gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left: Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass" 
            style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-cyan-glow)' }}
          >
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              style={{ width: '100%', display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} 
            />
          </motion.div>

          {/* Right: Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: 'var(--color-purple)' }}>{product.category}</span>
                <button 
                  onClick={toggleWishlist}
                  style={{ background: 'none', border: 'none', color: isWishlisted ? 'var(--color-pink)' : 'var(--color-text-muted)', fontSize: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <h1 className="heading-2 mt-4" style={{ marginBottom: 'var(--space-2)' }}>{product.title}</h1>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-warning)' }}>
                  {[...Array(5)].map((_, i) => <FiStar key={i} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />)}
                  <span style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }}>({product.reviewCount} reviews)</span>
                </div>
                <span>|</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiDownload /> {product.downloadType}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">
              {formatPrice(product.price)}
            </div>

            <div className="text-body text-muted" style={{ lineHeight: 1.6 }}>
              {product.description}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.tags.map(tag => (
                <span key={tag} className="tag" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  #{tag}
                </span>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-2) 0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span className="text-muted">Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '4px 8px' }}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >-</button>
                  <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >+</button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
                <button 
                  className="btn btn-secondary btn-lg" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={handleAddToCart}
                >
                  <FiShoppingCart /> Add to Cart
                </button>
                <button 
                  className="btn btn-primary btn-lg" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={handleBuyNow}
                >
                  <FiCreditCard /> Buy Now
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
                  <FiCheck /> Instant Digital Download
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
                  <FiCheck /> Lifetime Access & Updates
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
                  <FiCheck /> Secure UPI Payment
                </div>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 'var(--space-16)' }}>
            <h3 className="heading-3 mb-6">You might also like</h3>
            <div className="grid-4">
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .mt-4 { margin-top: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
      `}</style>
    </motion.div>
  );
};

export default ProductDetail;
