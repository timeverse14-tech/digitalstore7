import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Successfully subscribed to the newsletter!');
    setEmail('');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ padding: 'var(--space-16) 0' }}
    >
      <div className="container">
        <div className="glass" style={{ 
          position: 'relative',
          padding: 'var(--space-12) var(--space-6)', 
          textAlign: 'center',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1px solid var(--color-cyan-glow)'
        }}>
          {/* Background decoration */}
          <div className="blob blob-cyan" style={{ top: '-50%', right: '-10%', width: '300px', height: '300px', opacity: 0.2 }}></div>
          <div className="blob blob-purple" style={{ bottom: '-50%', left: '-10%', width: '300px', height: '300px', opacity: 0.2 }}></div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="heading-2 gradient-text" style={{ marginBottom: 'var(--space-4)' }}>
              Join the Cyberpunk Creative Network
            </h2>
            <p className="text-body text-muted" style={{ marginBottom: 'var(--space-8)' }}>
              Get exclusive access to new drops, premium tools, and special discounts delivered straight to your inbox. No spam, just pure signal.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: '400px', margin: '0 auto', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 'var(--space-2)', width: '100%' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input 
                    type="email" 
                    className="input" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ paddingLeft: '44px', width: '100%', height: '48px' }}
                  />
                </div>
                <button type="submit" className="btn btn-cyan btn-lg" style={{ height: '48px', padding: '0 24px' }}>
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Newsletter;
