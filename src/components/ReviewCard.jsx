import React from 'react';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const ReviewCard = ({ review, index = 0 }) => {
  if (!review) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card"
      style={{ 
        padding: 'var(--space-6)', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        height: '100%'
      }}
    >
      {/* Decorative Quote */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '3rem', color: 'rgba(168, 85, 247, 0.1)', fontFamily: 'serif', lineHeight: 1 }}>
        "
      </div>

      <div style={{ display: 'flex', gap: '4px', color: 'var(--color-warning)' }}>
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} fill={i < Math.floor(review.rating) ? 'currentColor' : 'none'} />
        ))}
      </div>

      <p className="text-body text-muted" style={{ flexGrow: 1, fontStyle: 'italic', lineHeight: 1.6 }}>
        "{review.comment}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <img 
          src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=13131a&color=a855f7`} 
          alt={review.name}
          style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-purple-glow)' }}
        />
        <div>
          <h4 className="heading-6 m-0" style={{ fontSize: '1rem' }}>{review.name}</h4>
          <span className="text-xs text-muted">{review.date}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
