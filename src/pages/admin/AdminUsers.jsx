import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiShield, FiX, FiUser, FiMail, FiCalendar, FiShoppingBag, FiDollarSign, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { useOrders } from '../../hooks/useOrders';

const mockUsers = [
  {
    id: 'u1',
    name: 'Arjun Mehta',
    email: 'arjun@email.com',
    avatar: 'A',
    role: 'Customer',
    ordersCount: 8,
    totalSpent: 12450,
    joinedDate: '2026-01-15',
    status: 'Active',
    lastActive: '2 hours ago',
    orders: [
      { id: 'PV-1042', product: 'Pro Lightroom Presets', amount: 499, date: '2026-05-22' },
      { id: 'PV-1035', product: 'React Template', amount: 1499, date: '2026-04-10' },
    ],
  },
  {
    id: 'u2',
    name: 'Priya Sharma',
    email: 'priya@email.com',
    avatar: 'P',
    role: 'Customer',
    ordersCount: 5,
    totalSpent: 8720,
    joinedDate: '2026-02-08',
    status: 'Active',
    lastActive: '1 day ago',
    orders: [
      { id: 'PV-1041', product: 'AI Prompt Collection', amount: 299, date: '2026-05-22' },
    ],
  },
  {
    id: 'u3',
    name: 'Rahul Verma',
    email: 'rahul@email.com',
    avatar: 'R',
    role: 'Customer',
    ordersCount: 12,
    totalSpent: 24500,
    joinedDate: '2025-11-20',
    status: 'Active',
    lastActive: '3 hours ago',
    orders: [
      { id: 'PV-1040', product: 'React Dashboard', amount: 1499, date: '2026-05-21' },
    ],
  },
  {
    id: 'u4',
    name: 'Sneha Patel',
    email: 'sneha@email.com',
    avatar: 'S',
    role: 'Customer',
    ordersCount: 3,
    totalSpent: 2397,
    joinedDate: '2026-03-14',
    status: 'Disabled',
    lastActive: '2 weeks ago',
    orders: [
      { id: 'PV-1039', product: 'Video Editing Pack', amount: 799, date: '2026-05-21' },
    ],
  },
  {
    id: 'u5',
    name: 'Vikram Singh',
    email: 'vikram@email.com',
    avatar: 'V',
    role: 'Customer',
    ordersCount: 7,
    totalSpent: 15800,
    joinedDate: '2025-12-05',
    status: 'Active',
    lastActive: '5 hours ago',
    orders: [
      { id: 'PV-1038', product: 'Full Stack Course', amount: 2999, date: '2026-05-20' },
    ],
  },
  {
    id: 'u6',
    name: 'Ananya Gupta',
    email: 'ananya@email.com',
    avatar: 'A',
    role: 'Customer',
    ordersCount: 2,
    totalSpent: 798,
    joinedDate: '2026-04-22',
    status: 'Active',
    lastActive: '1 day ago',
    orders: [
      { id: 'PV-1037', product: 'Logo Templates', amount: 399, date: '2026-05-20' },
    ],
  },
  {
    id: 'u7',
    name: 'Deepak Kumar',
    email: 'deepak@email.com',
    avatar: 'D',
    role: 'Customer',
    ordersCount: 4,
    totalSpent: 3196,
    joinedDate: '2026-02-28',
    status: 'Active',
    lastActive: '6 hours ago',
    orders: [],
  },
  {
    id: 'u8',
    name: 'Meera Nair',
    email: 'meera@email.com',
    avatar: 'M',
    role: 'Customer',
    ordersCount: 6,
    totalSpent: 9540,
    joinedDate: '2025-10-18',
    status: 'Active',
    lastActive: '30 minutes ago',
    orders: [],
  },
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@pixelvault.com',
    avatar: 'A',
    role: 'Admin',
    ordersCount: 0,
    totalSpent: 0,
    joinedDate: '2025-08-01',
    status: 'Active',
    lastActive: 'Online now',
    orders: [],
  },
  {
    id: 'u9',
    name: 'Kavita Reddy',
    email: 'kavita@email.com',
    avatar: 'K',
    role: 'Customer',
    ordersCount: 9,
    totalSpent: 18200,
    joinedDate: '2025-09-30',
    status: 'Active',
    lastActive: '4 hours ago',
    orders: [
      { id: 'PV-1033', product: 'Photography Presets', amount: 649, date: '2026-05-18' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const AdminUsers = () => {
  const { orders: rawOrders, getAllOrders } = useOrders();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  useEffect(() => {
    const userMap = new Map();
    
    // Add default admin
    userMap.set('admin@pixelvault.com', {
      id: 'admin',
      name: 'Admin User',
      email: 'admin@pixelvault.com',
      avatar: 'A',
      role: 'Admin',
      ordersCount: 0,
      totalSpent: 0,
      joinedDate: '2026-05-01',
      status: 'Active',
      lastActive: 'Online now',
      orders: [],
    });

    rawOrders.forEach(order => {
      const email = order.customer?.email || 'guest@pixelvault.com';
      if (!userMap.has(email)) {
        userMap.set(email, {
          id: order.user_id || `guest-${order.id}`,
          name: order.customer?.name || 'Guest',
          email: email,
          avatar: order.customer?.avatar || 'G',
          role: 'Customer',
          ordersCount: 0,
          totalSpent: 0,
          joinedDate: order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent',
          status: 'Active',
          lastActive: 'Active recently',
          orders: [],
        });
      }
      
      const u = userMap.get(email);
      u.ordersCount += 1;
      u.totalSpent += (order.total || 0);
      u.orders.push({
        id: order.order_number || order.id,
        product: order.items?.[0]?.title || 'Product',
        amount: order.total || 0,
        date: order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent',
      });
    });

    setUsers(Array.from(userMap.values()));
  }, [rawOrders]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  const openDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === 'Active' ? 'Disabled' : 'Active';
        toast.success(`User ${u.name} ${newStatus === 'Active' ? 'enabled' : 'disabled'}`);
        return { ...u, status: newStatus };
      }
      return u;
    }));
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => ({
        ...prev,
        status: prev.status === 'Active' ? 'Disabled' : 'Active',
      }));
    }
  };

  const activeCount = users.filter(u => u.status === 'Active').length;
  const adminCount = users.filter(u => u.role === 'Admin').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={styles.page}
    >
      {/* Header */}
      <motion.div variants={itemVariants} style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>Users</h2>
          <p style={styles.pageSubtitle}>
            {users.length} total &middot; {activeCount} active &middot; {adminCount} admin
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} style={styles.searchBar}>
        <FiSearch size={16} style={{ color: 'var(--text-muted, #64748b)', flexShrink: 0 }} />
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={styles.clearBtn}>
            <FiX size={14} />
          </button>
        )}
      </motion.div>

      {/* Users Table */}
      <motion.div variants={itemVariants} style={styles.tableCard}>
        {filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <FiUser size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary, #94a3b8)' }}>No users found</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Orders</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.userCell}>
                        <div style={{
                          ...styles.userAvatar,
                          background: user.role === 'Admin'
                            ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                            : 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
                        }}>
                          {user.avatar}
                        </div>
                        <div>
                          <div style={styles.userName}>{user.name}</div>
                          <div style={styles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        background: user.role === 'Admin' ? 'rgba(245,158,11,0.12)' : 'rgba(139,92,246,0.1)',
                        color: user.role === 'Admin' ? '#f59e0b' : '#8b5cf6',
                        borderColor: user.role === 'Admin' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.15)',
                      }}>
                        {user.role === 'Admin' && <FiShield size={11} />}
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.ordersCount}>{user.ordersCount}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.date}>{user.joinedDate}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: user.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: user.status === 'Active' ? '#10b981' : '#ef4444',
                        borderColor: user.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      }}>
                        {user.status}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={styles.actions}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => openDetail(user)}
                          title="View Profile"
                        >
                          <FiEye size={15} />
                        </button>
                        {user.role !== 'Admin' && (
                          <button
                            style={{
                              ...styles.actionBtn,
                              borderColor: user.status === 'Active' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                              color: user.status === 'Active' ? '#ef4444' : '#10b981',
                            }}
                            onClick={() => toggleUserStatus(user.id)}
                            title={user.status === 'Active' ? 'Disable' : 'Enable'}
                          >
                            {user.status === 'Active' ? <FiToggleRight size={15} /> : <FiToggleLeft size={15} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* User Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={styles.modal}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>User Profile</h3>
                <button style={styles.modalClose} onClick={() => setShowDetailModal(false)}>
                  <FiX size={18} />
                </button>
              </div>

              <div style={styles.modalBody}>
                {/* User Header */}
                <div style={styles.userProfile}>
                  <div style={{
                    ...styles.profileAvatar,
                    background: selectedUser.role === 'Admin'
                      ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                  }}>
                    {selectedUser.avatar}
                  </div>
                  <div style={styles.profileInfo}>
                    <h4 style={styles.profileName}>{selectedUser.name}</h4>
                    <p style={styles.profileEmail}>{selectedUser.email}</p>
                    <div style={styles.profileBadges}>
                      <span style={{
                        ...styles.roleBadge,
                        background: selectedUser.role === 'Admin' ? 'rgba(245,158,11,0.12)' : 'rgba(139,92,246,0.1)',
                        color: selectedUser.role === 'Admin' ? '#f59e0b' : '#8b5cf6',
                        borderColor: selectedUser.role === 'Admin' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.15)',
                      }}>
                        {selectedUser.role === 'Admin' && <FiShield size={11} />}
                        {selectedUser.role}
                      </span>
                      <span style={{
                        ...styles.statusBadge,
                        background: selectedUser.status === 'Active' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: selectedUser.status === 'Active' ? '#10b981' : '#ef4444',
                        borderColor: selectedUser.status === 'Active' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                      }}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div style={styles.userStats}>
                  <div style={styles.userStatItem}>
                    <FiShoppingBag size={16} style={{ color: '#8b5cf6' }} />
                    <div>
                      <div style={styles.userStatValue}>{selectedUser.ordersCount}</div>
                      <div style={styles.userStatLabel}>Total Orders</div>
                    </div>
                  </div>
                  <div style={styles.userStatItem}>
                    <FiDollarSign size={16} style={{ color: '#10b981' }} />
                    <div>
                      <div style={styles.userStatValue}>₹{selectedUser.totalSpent.toLocaleString()}</div>
                      <div style={styles.userStatLabel}>Total Spent</div>
                    </div>
                  </div>
                  <div style={styles.userStatItem}>
                    <FiCalendar size={16} style={{ color: '#06b6d4' }} />
                    <div>
                      <div style={styles.userStatValue}>{selectedUser.joinedDate}</div>
                      <div style={styles.userStatLabel}>Joined</div>
                    </div>
                  </div>
                </div>

                {/* Last Active */}
                <div style={styles.lastActive}>
                  <span style={styles.detailLabel}>Last Active</span>
                  <span style={styles.lastActiveValue}>{selectedUser.lastActive}</span>
                </div>

                {/* Recent Orders */}
                {selectedUser.orders && selectedUser.orders.length > 0 && (
                  <div style={styles.detailSection}>
                    <h4 style={styles.sectionTitle}>Recent Orders</h4>
                    {selectedUser.orders.map((order) => (
                      <div key={order.id} style={styles.orderRow}>
                        <div style={styles.orderIdSmall}>{order.id}</div>
                        <div style={styles.orderProduct}>{order.product}</div>
                        <div style={styles.orderAmount}>₹{order.amount}</div>
                        <div style={styles.orderDate}>{order.date}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Account Toggle */}
                {selectedUser.role !== 'Admin' && (
                  <div style={styles.accountToggle}>
                    <div>
                      <span style={styles.toggleTitle}>Account Status</span>
                      <span style={styles.toggleDesc}>
                        {selectedUser.status === 'Active' ? 'User can access the platform' : 'User is blocked from the platform'}
                      </span>
                    </div>
                    <button
                      style={{
                        ...styles.toggleBtn,
                        background: selectedUser.status === 'Active'
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'rgba(239,68,68,0.15)',
                        color: selectedUser.status === 'Active' ? '#fff' : '#ef4444',
                      }}
                      onClick={() => toggleUserStatus(selectedUser.id)}
                    >
                      {selectedUser.status === 'Active' ? (
                        <><FiToggleRight size={16} /> Active</>
                      ) : (
                        <><FiToggleLeft size={16} /> Disabled</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  pageTitle: {
    fontSize: '1.35rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-muted, #64748b)',
    margin: 0,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.65rem 1rem',
    borderRadius: 10,
    background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.85rem',
  },
  clearBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    borderRadius: 6,
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableCard: {
    borderRadius: 14,
    background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '0.85rem 1rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-muted, #64748b)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  tr: {
    transition: 'background 0.2s ease',
  },
  td: {
    padding: '0.7rem 1rem',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    verticalAlign: 'middle',
  },
  userCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  userName: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.84rem',
  },
  userEmail: {
    color: 'var(--text-muted, #64748b)',
    fontSize: '0.68rem',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.2rem 0.55rem',
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    border: '1px solid',
  },
  ordersCount: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.84rem',
  },
  date: {
    color: 'var(--text-muted, #64748b)',
    fontSize: '0.78rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.2rem 0.55rem',
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    border: '1px solid',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 7,
    color: 'var(--text-secondary, #94a3b8)',
    cursor: 'pointer',
    padding: '0.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  // Modal
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '1rem',
  },
  modal: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    borderRadius: 16,
    background: 'rgba(15, 15, 25, 0.97)',
    border: '1px solid rgba(139,92,246,0.15)',
    boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 25px 50px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  modalClose: {
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    borderRadius: 8,
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.35rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: '1.5rem',
    overflowY: 'auto',
    flex: 1,
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.3rem',
    flexShrink: 0,
    boxShadow: '0 0 20px rgba(139,92,246,0.2)',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  profileName: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
  },
  profileEmail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted, #64748b)',
    margin: '0.15rem 0 0.5rem',
  },
  profileBadges: {
    display: 'flex',
    gap: '0.5rem',
  },
  userStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.65rem',
    marginBottom: '1.25rem',
  },
  userStatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  userStatValue: {
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
  },
  userStatLabel: {
    fontSize: '0.62rem',
    color: 'var(--text-muted, #64748b)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  lastActive: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.65rem 0.85rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    marginBottom: '1rem',
  },
  detailLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted, #64748b)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  lastActiveValue: {
    fontSize: '0.82rem',
    color: '#10b981',
    fontWeight: 600,
  },
  detailSection: {
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '1rem',
    marginTop: '0.5rem',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 0.75rem',
  },
  orderRow: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto',
    gap: '0.75rem',
    alignItems: 'center',
    padding: '0.55rem 0.65rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.02)',
    marginBottom: '0.35rem',
    fontSize: '0.78rem',
  },
  orderIdSmall: {
    fontFamily: "'SF Mono', monospace",
    color: '#8b5cf6',
    fontWeight: 600,
    fontSize: '0.72rem',
  },
  orderProduct: {
    color: 'var(--text-secondary, #94a3b8)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  orderAmount: {
    color: '#10b981',
    fontWeight: 600,
  },
  orderDate: {
    color: 'var(--text-muted, #64748b)',
    fontSize: '0.72rem',
  },
  accountToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '1rem',
    padding: '1rem',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  toggleTitle: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#fff',
    marginBottom: '0.2rem',
  },
  toggleDesc: {
    fontSize: '0.7rem',
    color: 'var(--text-muted, #64748b)',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.45rem 0.85rem',
    borderRadius: 8,
    border: 'none',
    fontSize: '0.78rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
};

export default AdminUsers;
