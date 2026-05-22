import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await signup(email, password, name);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div className="blob blob-cyan" style={{ top: '20%', left: '10%' }}></div>
      <div className="blob blob-pink" style={{ bottom: '20%', right: '10%' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-8)', borderRadius: 'var(--radius-xl)', position: 'relative', zIndex: 10, margin: 'var(--space-4)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h1 className="heading-3 gradient-text m-0 mb-2">Create Account</h1>
          <p className="text-muted m-0">Join PixelVault and get instant access</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

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

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '44px' }}
                disabled={loading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                className="input" 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px', paddingRight: '44px' }}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <p className="text-sm text-muted m-0">
            Already have an account? <Link to="/login" style={{ color: 'var(--color-cyan)', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
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

export default Signup;
