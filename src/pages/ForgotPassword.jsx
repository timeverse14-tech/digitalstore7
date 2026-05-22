import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      await resetPassword(email);
      toast.success('Password reset link sent! Check your email.');
      setEmail('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="blob blob-pink" style={{ top: '20%', left: '50%', transform: 'translateX(-50%)' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-8)', borderRadius: 'var(--radius-xl)', position: 'relative', zIndex: 10, margin: 'var(--space-4)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 className="heading-3 m-0 mb-2">Reset Password</h1>
          <p className="text-muted m-0">Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="email" 
                className="input" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <p className="text-sm text-muted m-0">
            Remember your password? <Link to="/login" style={{ color: 'var(--color-cyan)', textDecoration: 'none', fontWeight: 'bold' }}>Back to Login</Link>
          </p>
        </div>
      </motion.div>
      <style>{`
        .w-full { width: 100%; }
        .mt-4 { margin-top: 1rem; }
        .mb-2 { margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
