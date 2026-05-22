import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiDownload, FiClock, FiSettings, FiHeart, FiLogOut, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { formatPrice } from '../utils/helpers';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('purchases');
  const { user, logout } = useAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();

  // Protect route
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const tabs = [
    { id: 'purchases', label: 'My Purchases', icon: FiPackage },
    { id: 'downloads', label: 'Downloads', icon: FiDownload },
    { id: 'orders', label: 'Order History', icon: FiClock },
    { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
    { id: 'profile', label: 'Profile Settings', icon: FiSettings },
  ];

  if (!user) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)', minHeight: '100vh' }}
    >
      <div className="container">
        <h1 className="heading-2 mb-8">User Dashboard</h1>

        <div className="grid-4" style={{ gap: 'var(--space-8)' }}>
          
          {/* Sidebar */}
          <div style={{ gridColumn: 'span 1' }} className="hidden md:block">
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.displayName || user.displayName || 'User')}&background=13131a&color=a855f7&size=80`} 
                  alt="Profile" 
                  style={{ borderRadius: '50%', border: '2px solid var(--color-purple)', marginBottom: 'var(--space-4)' }}
                />
                <h3 className="heading-6 m-0">{user?.user_metadata?.displayName || user.displayName || 'PixelVault User'}</h3>
                <p className="text-xs text-muted mt-1 m-0">{user.email}</p>
              </div>

              <nav style={{ padding: 'var(--space-4)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {tabs.map(tab => (
                    <li key={tab.id}>
                      <button 
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn w-full ${activeTab === tab.id ? 'btn-primary' : 'glass'}`}
                        style={{ 
                          justifyContent: 'flex-start', 
                          border: activeTab === tab.id ? 'none' : '1px solid transparent',
                          background: activeTab === tab.id ? '' : 'transparent'
                        }}
                      >
                        <tab.icon style={{ marginRight: '12px' }} /> {tab.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="btn w-full glass mt-4"
                      style={{ justifyContent: 'flex-start', color: 'var(--color-error)', background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                    >
                      <FiLogOut style={{ marginRight: '12px' }} /> Logout
                    </button>
                  </li>
                </ul>
              </nav>

            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden" style={{ gridColumn: 'span 4', marginBottom: 'var(--space-6)', display: 'flex', overflowX: 'auto', gap: 'var(--space-2)', paddingBottom: 'var(--space-2)' }}>
             {tabs.map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'glass'}`}
                 style={{ whiteSpace: 'nowrap', border: activeTab === tab.id ? 'none' : '1px solid var(--color-border)' }}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Content Area */}
          <div style={{ gridColumn: 'span 3' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="glass"
                style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', minHeight: '400px' }}
              >
                
                {/* PURCHASES TAB */}
                {activeTab === 'purchases' && (
                  <div>
                    <h2 className="heading-4 mb-6">My Purchases</h2>
                    <div className="grid-2">
                      {/* Empty State Mock */}
                      <div className="glass-card" style={{ padding: 'var(--space-6)', gridColumn: 'span 2', textAlign: 'center', border: '1px dashed var(--color-border)' }}>
                        <FiPackage style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                        <h4 className="heading-5">No purchases yet</h4>
                        <p className="text-muted mb-4">Start exploring our premium digital assets.</p>
                        <Link to="/products" className="btn btn-primary">Browse Products</Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div>
                    <h2 className="heading-4 mb-6">Order History</h2>
                    {orders.length === 0 ? (
                      <p className="text-muted">You haven't placed any orders yet.</p>
                    ) : (
                      <div className="data-table-wrapper" style={{ overflowX: 'auto' }}>
                        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                              <th style={{ padding: '12px' }}>Order ID</th>
                              <th style={{ padding: '12px' }}>Date</th>
                              <th style={{ padding: '12px' }}>Amount</th>
                              <th style={{ padding: '12px' }}>Status</th>
                              <th style={{ padding: '12px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{order.id}</td>
                                <td style={{ padding: '12px', color: 'var(--color-text-muted)' }}>
                                  {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                                </td>
                                <td style={{ padding: '12px' }}>{formatPrice(order.total)}</td>
                                <td style={{ padding: '12px' }}>
                                  <span className="badge" style={{ 
                                    background: order.status === 'approved' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                    color: order.status === 'approved' ? 'var(--color-success)' : 'var(--color-warning)'
                                  }}>
                                    {order.status}
                                  </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                  <button className="btn btn-sm glass">View</button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <div style={{ maxWidth: '500px' }}>
                    <h2 className="heading-4 mb-6">Profile Settings</h2>
                    <form onSubmit={(e) => { e.preventDefault(); toast.success('Profile updated successfully!'); }}>
                      <div className="input-group mb-4">
                        <label className="text-sm text-muted mb-2 block">Full Name</label>
                        <input type="text" className="input w-full" defaultValue={user.displayName} />
                      </div>
                      <div className="input-group mb-6">
                        <label className="text-sm text-muted mb-2 block">Email Address (Cannot be changed)</label>
                        <input type="email" className="input w-full" value={user.email} disabled style={{ opacity: 0.5 }} />
                      </div>
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                    </form>
                  </div>
                )}

                {/* OTHER TABS */}
                {(activeTab === 'downloads' || activeTab === 'wishlist') && (
                  <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                    <h2 className="heading-4 mb-4 text-muted">Coming Soon</h2>
                    <p className="text-muted">This feature is currently under development.</p>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
      <style>{`
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\\:block { display: block; }
          .md\\:hidden { display: none; }
          .grid-4 > div:nth-child(3) { grid-column: span 3 !important; }
        }
        @media (max-width: 768px) {
          .grid-4 > div { grid-column: span 4 !important; }
        }
        .w-full { width: 100%; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-1 { margin-top: 0.25rem; }
        .mt-4 { margin-top: 1rem; }
        .block { display: block; }
      `}</style>
    </motion.div>
  );
};

export default Dashboard;
