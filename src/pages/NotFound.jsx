import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background glitch blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 20, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
        className="blob blob-purple" 
        style={{ top: '30%', left: '30%', width: '300px', height: '300px' }} 
      />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
          y: [0, -30, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        className="blob blob-cyan" 
        style={{ bottom: '20%', right: '30%', width: '400px', height: '400px' }} 
      />

      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <FiAlertTriangle style={{ fontSize: '4rem', color: 'var(--color-pink)', marginBottom: 'var(--space-6)' }} />
          
          <h1 
            style={{ 
              fontSize: 'clamp(6rem, 20vw, 12rem)', 
              fontWeight: 900, 
              lineHeight: 1, 
              margin: 0,
              textShadow: '0 0 40px rgba(236,72,153,0.5)',
              background: 'linear-gradient(to right, var(--color-pink), var(--color-purple))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.05em'
            }}
          >
            404
          </h1>
          
          <h2 className="heading-3 mb-4" style={{ marginTop: 'var(--space-2)' }}>System Glitch: Sector Not Found</h2>
          
          <p className="text-body text-muted mb-8" style={{ maxWidth: '500px', margin: '0 auto var(--space-8)' }}>
            The digital asset or page you are looking for has been moved, deleted, or never existed in this timeline.
          </p>
          
          <Link to="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <FiHome /> Return to Base
          </Link>
        </motion.div>
      </div>
      
      <style>{`
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
      `}</style>
    </div>
  );
};

export default NotFound;
