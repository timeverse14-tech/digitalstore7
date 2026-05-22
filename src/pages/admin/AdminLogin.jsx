import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiShield, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already logged in as admin, redirect
  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem('pv_session') || 'null');
      if (session && session.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch {}
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setSubmitting(true);

    // Admin credentials
    const ADMIN_EMAIL = 'admin@pixelvault.com';
    const ADMIN_PASS = 'admin123';

    if (trimmedEmail !== ADMIN_EMAIL || trimmedPass !== ADMIN_PASS) {
      toast.error('Invalid admin credentials');
      setSubmitting(false);
      return;
    }

    // Create/update admin user in localStorage
    let users = [];
    try { users = JSON.parse(localStorage.getItem('pv_users') || '[]'); } catch { users = []; }
    
    let adminUser = users.find(u => u.email === ADMIN_EMAIL);
    if (!adminUser) {
      adminUser = {
        uid: 'admin_001',
        email: ADMIN_EMAIL,
        displayName: 'PixelVault Admin',
        password: ADMIN_PASS,
        role: 'admin',
        createdAt: new Date().toISOString(),
        wishlist: [],
      };
      users.push(adminUser);
      localStorage.setItem('pv_users', JSON.stringify(users));
    }

    // Create admin session
    const session = {
      uid: adminUser.uid,
      email: adminUser.email,
      displayName: adminUser.displayName,
      role: 'admin',
      createdAt: adminUser.createdAt,
    };
    localStorage.setItem('pv_session', JSON.stringify(session));

    toast.success('Welcome back, Admin!');
    setSubmitting(false);
    
    // Navigate to admin dashboard
    window.location.href = '/admin/dashboard';
  };

  return (
    <div style={styles.wrapper}>
      {/* Animated Background Blobs */}
      <div style={styles.blobContainer}>
        <motion.div
          style={{ ...styles.blob, ...styles.blob1 }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ ...styles.blob, ...styles.blob2 }}
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 50, -30, 0],
            scale: [1, 0.85, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          style={{ ...styles.blob, ...styles.blob3 }}
          animate={{
            x: [0, 40, -60, 0],
            y: [0, -40, 60, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid Overlay */}
      <div style={styles.gridOverlay} />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={styles.card}
      >
        {/* Shield Icon */}
        <motion.div
          style={styles.shieldContainer}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div style={styles.shieldIcon}>
            <FiShield size={28} />
          </div>
        </motion.div>

        <motion.h1
          style={styles.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Admin Access
        </motion.h1>
        <motion.p
          style={styles.subtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Sign in to PixelVault admin dashboard
        </motion.p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <FiMail size={16} style={styles.inputIcon} />
              <input
                type="text"
                placeholder="admin@pixelvault.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="off"
              />
            </div>
          </motion.div>

          <motion.div
            style={styles.inputGroup}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FiLock size={16} style={styles.inputIcon} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            style={styles.submitBtn}
            disabled={submitting}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
          >
            {submitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={styles.btnSpinner}
              />
            ) : (
              <>
                Sign In
                <FiArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <motion.div
          style={styles.demoHint}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div style={styles.demoLabel}>Demo Credentials</div>
          <div style={styles.demoCredentials}>
            <span>admin@pixelvault.com</span>
            <span style={styles.demoDivider}>|</span>
            <span>admin123</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.p
        style={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        PixelVault Store &copy; {new Date().getFullYear()}
      </motion.p>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    background: '#0a0a0f',
    padding: '2rem 1rem',
  },
  blobContainer: {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.4,
  },
  blob1: {
    width: 400,
    height: 400,
    background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
    top: '10%',
    left: '15%',
  },
  blob2: {
    width: 350,
    height: 350,
    background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
    top: '50%',
    right: '10%',
  },
  blob3: {
    width: 300,
    height: 300,
    background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
    bottom: '10%',
    left: '40%',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    padding: '2.5rem 2rem',
    borderRadius: 20,
    background: 'rgba(15, 15, 25, 0.85)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(139, 92, 246, 0.15)',
    boxShadow: '0 0 60px rgba(139, 92, 246, 0.1), 0 25px 50px rgba(0,0,0,0.4)',
    textAlign: 'center',
  },
  shieldContainer: {
    marginBottom: '1.25rem',
  },
  shieldIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.15))',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8b5cf6',
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 0.35rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted, #64748b)',
    margin: '0 0 1.75rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    textAlign: 'left',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-secondary, #94a3b8)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.7rem 0.9rem',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    transition: 'all 0.2s ease',
  },
  inputIcon: {
    color: 'var(--text-muted, #64748b)',
    flexShrink: 0,
  },
  input: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.9rem',
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted, #64748b)',
    cursor: 'pointer',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.85rem',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.5rem',
    boxShadow: '0 0 25px rgba(139, 92, 246, 0.25)',
    transition: 'all 0.2s ease',
  },
  btnSpinner: {
    width: 20,
    height: 20,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
  },
  demoHint: {
    marginTop: '1.5rem',
    padding: '0.85rem',
    borderRadius: 10,
    background: 'rgba(139, 92, 246, 0.06)',
    border: '1px solid rgba(139, 92, 246, 0.12)',
  },
  demoLabel: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#8b5cf6',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.35rem',
  },
  demoCredentials: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary, #94a3b8)',
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  demoDivider: {
    color: 'rgba(255,255,255,0.15)',
  },
  footer: {
    position: 'relative',
    marginTop: '2rem',
    fontSize: '0.7rem',
    color: 'var(--text-muted, #64748b)',
  },
};

export default AdminLogin;
