import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

const CategoryCard = ({ category, icon, count, index = 0 }) => {
  const IconComponent = FiIcons[icon] || FiIcons.FiBox;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/products?category=${encodeURIComponent(category)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="card category-card" style={{ 
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-3)',
          transition: 'all 0.3s ease',
          height: '100%'
        }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'rgba(168, 85, 247, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--color-purple)',
            fontSize: '32px',
            marginBottom: 'var(--space-2)',
            transition: 'all 0.3s ease'
          }} className="cat-icon-container">
            <IconComponent />
          </div>
          
          <h3 className="heading-5 m-0">{category}</h3>
          <p className="text-small text-muted m-0">{count} Products</p>
        </div>
      </Link>
      <style>{`
        .category-card:hover {
          transform: translateY(-5px);
          border-color: var(--color-purple);
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.15);
        }
        .category-card:hover .cat-icon-container {
          background: var(--color-purple);
          color: white;
          transform: scale(1.1);
          box-shadow: 0 0 20px var(--color-purple-glow);
        }
      `}</style>
    </motion.div>
  );
};

export default CategoryCard;
