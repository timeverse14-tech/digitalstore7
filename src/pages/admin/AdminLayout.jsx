import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiSettings, FiLogOut, FiMenu, FiX, FiBell, FiSearch, FiChevronRight } from 'react-icons/fi';

const sidebarLinks = [
  { label: 'Dashboard', icon: FiGrid, path: '/admin/dashboard' },
  { label: 'Products', icon: FiPackage, path: '/admin/products' },
  { label: 'Orders', icon: FiShoppingBag, path: '/admin/orders' },
  { label: 'Users', icon: FiUsers, path: '/admin/users' },
  { label: 'Settings', icon: FiSettings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3);

  // Get session from localStorage
  const [adminSession, setAdminSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pv_session') || 'null');
    } catch { return null; }
  });

  // Redirect if not admin
  useEffect(() => {
    if (!adminSession || adminSession.role !== 'admin') {
      navigate('/admin/login');
    }
  }, [adminSession, navigate]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('pv_session');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const getPageTitle = () => {
    const current = sidebarLinks.find(link => location.pathname.startsWith(link.path));
    return current ? current.label : 'Admin';
  };

  // Use adminSession as user data
  const user = adminSession;

  if (!adminSession || adminSession.role !== 'admin') return null;

  return (
    <div style={styles.layout}>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.overlay}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarOpen : {}),
        }}
        initial={false}
      >
        {/* Logo */}
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <span style={styles.logoEmoji}>⚡</span>
            </div>
            <div>
              <h2 style={styles.logoText}>PixelVault</h2>
              <span style={styles.logoSub}>Admin Panel</span>
            </div>
          </div>
          <button
            style={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={styles.nav}>
          {sidebarLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
              >
                <div style={{
                  ...styles.navIconWrap,
                  ...(isActive ? styles.navIconWrapActive : {}),
                }}>
                  <Icon size={18} />
                </div>
                <span style={styles.navLabel}>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    style={styles.activeIndicator}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && <FiChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={styles.sidebarFooter}>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>
              {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div style={styles.adminDetails}>
              <span style={styles.adminName}>{user?.displayName || 'Admin'}</span>
              <span style={styles.adminEmail}>{user?.email || 'admin@pixelvault.com'}</span>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button
              style={styles.menuBtn}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>
            <div>
              <h1 style={styles.pageTitle}>{getPageTitle()}</h1>
              <p style={styles.pageBreadcrumb}>Admin / {getPageTitle()}</p>
            </div>
          </div>

          <div style={styles.headerRight}>
            <div style={styles.searchBox}>
              <FiSearch size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button style={styles.notifBtn}>
              <FiBell size={18} />
              {notifications > 0 && (
                <span style={styles.notifBadge}>{notifications}</span>
              )}
            </button>
            <div style={styles.headerAvatar}>
              {user?.displayName?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={styles.contentArea}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .admin-sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: 'var(--bg-primary, #0a0a0f)',
  },
  loadingScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'var(--bg-primary, #0a0a0f)',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(139, 92, 246, 0.2)',
    borderTopColor: 'var(--primary, #8b5cf6)',
    borderRadius: '50%',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(4px)',
    zIndex: 998,
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 260,
    background: 'rgba(15, 15, 25, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(139, 92, 246, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 999,
    transition: 'transform 0.3s ease',
  },
  sidebarOpen: {},
  sidebarHeader: {
    padding: '1.5rem 1.25rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
  },
  logoEmoji: {
    fontSize: '1.2rem',
  },
  logoText: {
    fontSize: '1.1rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: '0.65rem',
    color: 'var(--text-muted, #64748b)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  closeBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary, #94a3b8)',
    cursor: 'pointer',
    padding: 4,
  },
  nav: {
    flex: 1,
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflowY: 'auto',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.85rem',
    borderRadius: 10,
    color: 'var(--text-secondary, #94a3b8)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 500,
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  navLinkActive: {
    color: '#fff',
    background: 'rgba(139, 92, 246, 0.12)',
  },
  navIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.04)',
    transition: 'all 0.2s ease',
  },
  navIconWrapActive: {
    background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
  },
  navLabel: {
    flex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 20,
    borderRadius: 4,
    background: 'linear-gradient(180deg, #8b5cf6, #06b6d4)',
    boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
  },
  sidebarFooter: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.85rem',
  },
  adminDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  adminName: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  adminEmail: {
    fontSize: '0.65rem',
    color: 'var(--text-muted, #64748b)',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.55rem 0.75rem',
    borderRadius: 8,
    border: '1px solid rgba(239, 68, 68, 0.2)',
    background: 'rgba(239, 68, 68, 0.08)',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mainContent: {
    flex: 1,
    marginLeft: 260,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.85rem 1.5rem',
    background: 'rgba(10, 10, 15, 0.8)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: 4,
  },
  pageTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    lineHeight: 1.2,
  },
  pageBreadcrumb: {
    fontSize: '0.7rem',
    color: 'var(--text-muted, #64748b)',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.85rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    minWidth: 200,
  },
  searchInput: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.8rem',
    width: '100%',
  },
  notifBtn: {
    position: 'relative',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    color: 'var(--text-secondary, #94a3b8)',
    cursor: 'pointer',
    padding: '0.45rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#ef4444',
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.8rem',
    cursor: 'pointer',
  },
  contentArea: {
    flex: 1,
    padding: '1.5rem',
    overflowY: 'auto',
  },
};

// Add responsive styles via media query
const responsiveStyles = document.createElement('style');
responsiveStyles.textContent = `
  @media (max-width: 768px) {
    [data-admin-layout] .admin-main {
      margin-left: 0 !important;
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('admin-layout-responsive')) {
  responsiveStyles.id = 'admin-layout-responsive';
  document.head.appendChild(responsiveStyles);
}

export default AdminLayout;
