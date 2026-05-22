import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiEye, FiStar, FiDownload } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    navigate('/checkout');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Added to wishlist!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/products/${product.id}`} className="card product-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
        
        {/* Thumbnail Area */}
        <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden' }}>
            <img 
              src={product.thumbnail} 
              alt={product.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              className="product-img"
            />
          </div>
          
          {/* Badges */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {product.featured && (
              <span className="badge" style={{ background: 'var(--color-purple)' }}>Featured</span>
            )}
            {product.trending && (
              <span className="badge" style={{ background: 'var(--color-pink)' }}>Trending</span>
            )}
          </div>

          {/* Quick Actions (visible on hover via CSS) */}
          <div className="quick-actions" style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className="icon-btn glass" 
              style={{ width: '36px', height: '36px', borderRadius: '50%' }}
              onClick={handleWishlist}
              title="Add to Wishlist"
            >
              <FiHeart />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-cyan)', fontWeight: 600 }}>
              {product.category}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-warning)' }}>
              <FiStar fill="currentColor" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 style={{ margin: '0 0 var(--space-3) 0', fontSize: '1.1rem', fontWeight: 600, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.3 }}>
            {product.title}
          </h3>

          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-4)' }}>
            <div>
              <span className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Price</span>
              <span className="gradient-text font-bold" style={{ fontSize: '1.25rem' }}>
                {formatPrice(product.price)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>
              <FiDownload />
              {product.downloadType || 'ZIP'}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ flex: 1, padding: '8px 0' }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className="btn btn-primary btn-sm" 
              style={{ flex: 1, padding: '8px 0' }}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </Link>
      <style>{`
        .product-card:hover .product-img { transform: scale(1.05); }
        .quick-actions { opacity: 0; transform: translateX(10px); transition: all 0.3s ease; }
        .product-card:hover .quick-actions { opacity: 1; transform: translateX(0); }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;
