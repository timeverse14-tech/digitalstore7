import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const Hero = () => {
  return (
    <div className="hero" style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      overflow: 'hidden',
      paddingTop: '60px' // offset for navbar
    }}>
      {/* Background Elements */}
      <ParticleBackground particleCount={80} />
      
      <div className="blob blob-purple" style={{ top: '20%', left: '10%', width: '300px', height: '300px' }}></div>
      <div className="blob blob-cyan" style={{ bottom: '20%', right: '10%', width: '250px', height: '250px' }}></div>
      <div className="blob blob-pink" style={{ top: '40%', right: '30%', width: '200px', height: '200px', opacity: 0.3 }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)' }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="badge" 
            style={{ 
              background: 'rgba(168, 85, 247, 0.1)', 
              border: '1px solid rgba(168, 85, 247, 0.3)',
              color: 'var(--color-purple)',
              padding: '8px 16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🚀 The Future of Digital Products
          </motion.div>

          <h1 className="heading-1 m-0" style={{ lineHeight: 1.1, fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
            <span style={{ color: 'var(--color-text-primary)' }}>Discover Premium</span><br />
            <span className="gradient-text" style={{ textShadow: '0 0 40px rgba(168,85,247,0.4)' }}>
              Digital Products
            </span>
          </h1>

          <p className="text-body text-muted" style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
            Elevate your creative projects with our curated collection of futuristic UI kits, AI prompts, code templates, and elite digital assets.
          </p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <Link to="/products" className="btn btn-primary btn-lg" style={{ minWidth: '180px' }}>
              Explore Products
            </Link>
            <a href="#trending" className="btn btn-secondary btn-lg" style={{ minWidth: '180px' }}>
              View Trending
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ 
              display: 'flex', 
              gap: 'var(--space-8)', 
              marginTop: 'var(--space-12)',
              paddingTop: 'var(--space-8)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              width: '100%',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            {[
              { value: '1000+', label: 'Premium Assets' },
              { value: '500+', label: 'Elite Creators' },
              { value: '10K+', label: 'Happy Users' }
            ].map((stat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-text-primary)', textShadow: '0 0 20px rgba(6,182,212,0.5)' }}>
                  {stat.value}
                </span>
                <span className="text-small text-muted">{stat.label}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
