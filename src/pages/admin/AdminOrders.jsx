import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiCheck, FiX, FiDownload, FiImage, FiCreditCard, FiUser, FiPackage } from 'react-icons/fi';

const mockOrders = [
  {
    id: 'PV-1042',
    customer: { name: 'Arjun Mehta', email: 'arjun@email.com', avatar: 'A' },
    products: [{ title: 'Pro Lightroom Presets Pack', price: 499 }],
    amount: 499,
    status: 'Pending',
    paymentMethod: 'UPI',
    transactionId: 'UPI-9834762',
    paymentScreenshot: null,
    date: '2026-05-22',
    address: 'Mumbai, India',
  },
  {
    id: 'PV-1041',
    customer: { name: 'Priya Sharma', email: 'priya@email.com', avatar: 'P' },
    products: [{ title: 'AI Prompt Master Collection', price: 299 }],
    amount: 299,
    status: 'Approved',
    paymentMethod: 'UPI',
    transactionId: 'UPI-5621839',
    paymentScreenshot: null,
    date: '2026-05-22',
    address: 'Delhi, India',
  },
  {
    id: 'PV-1040',
    customer: { name: 'Rahul Verma', email: 'rahul@email.com', avatar: 'R' },
    products: [{ title: 'React Dashboard Template', price: 1499 }],
    amount: 1499,
    status: 'Approved',
    paymentMethod: 'UPI',
    transactionId: 'UPI-7194562',
    paymentScreenshot: null,
    date: '2026-05-21',
    address: 'Bangalore, India',
  },
  {
    id: 'PV-1039',
    customer: { name: 'Sneha Patel', email: 'sneha@email.com', avatar: 'S' },
    products: [{ title: 'Video Editing Essentials Pack', price: 799 }],
    amount: 799,
    status: 'Rejected',
    paymentMethod: 'UPI',
    transactionId: 'UPI-3847291',
    paymentScreenshot: null,
    date: '2026-05-21',
    address: 'Pune, India',
  },
  {
    id: 'PV-1038',
    customer: { name: 'Vikram Singh', email: 'vikram@email.com', avatar: 'V' },
    products: [{ title: 'Full Stack Development Course', price: 2999 }],
    amount: 2999,
    status: 'Approved',
    paymentMethod: 'UPI',
    transactionId: 'UPI-8523641',
    paymentScreenshot: null,
    date: '2026-05-20',
    address: 'Hyderabad, India',
  },
  {
    id: 'PV-1037',
    customer: { name: 'Ananya Gupta', email: 'ananya@email.com', avatar: 'A' },
    products: [{ title: 'Logo Design Templates', price: 399 }],
    amount: 399,
    status: 'Pending',
    paymentMethod: 'UPI',
    transactionId: 'UPI-2918374',
    paymentScreenshot: null,
    date: '2026-05-20',
    address: 'Chennai, India',
  },
  {
    id: 'PV-1036',
    customer: { name: 'Deepak Kumar', email: 'deepak@email.com', avatar: 'D' },
    products: [{ title: 'Notion Productivity Templates', price: 299 }],
    amount: 299,
    status: 'Pending',
    paymentMethod: 'UPI',
    transactionId: 'UPI-6748291',
    paymentScreenshot: null,
    date: '2026-05-19',
    address: 'Jaipur, India',
  },
  {
    id: 'PV-1035',
    customer: { name: 'Meera Nair', email: 'meera@email.com', avatar: 'M' },
    products: [{ title: 'Social Media Content Pack', price: 599 }],
    amount: 599,
    status: 'Approved',
    paymentMethod: 'UPI',
    transactionId: 'UPI-1452973',
    paymentScreenshot: null,
    date: '2026-05-19',
    address: 'Kochi, India',
  },
  {
    id: 'PV-1034',
    customer: { name: 'Rohit Joshi', email: 'rohit@email.com', avatar: 'R' },
    products: [{ title: 'Mobile UI Kit Premium', price: 899 }],
    amount: 899,
    status: 'Rejected',
    paymentMethod: 'UPI',
    transactionId: 'UPI-9283746',
    paymentScreenshot: null,
    date: '2026-05-18',
    address: 'Ahmedabad, India',
  },
  {
    id: 'PV-1033',
    customer: { name: 'Kavita Reddy', email: 'kavita@email.com', avatar: 'K' },
    products: [{ title: 'Photography Presets Bundle', price: 649 }],
    amount: 649,
    status: 'Approved',
    paymentMethod: 'UPI',
    transactionId: 'UPI-5739184',
    paymentScreenshot: null,
    date: '2026-05-18',
    address: 'Lucknow, India',
  },
];

const TABS = ['All', 'Pending', 'Approved', 'Rejected'];

const statusColors = {
  Approved: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  Pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  Rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (activeTab !== 'All') {
      filtered = filtered.filter(o => o.status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [orders, activeTab, searchQuery]);

  const openDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} ${newStatus.toLowerCase()}`);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const tabCounts = useMemo(() => ({
    All: orders.length,
    Pending: orders.filter(o => o.status === 'Pending').length,
    Approved: orders.filter(o => o.status === 'Approved').length,
    Rejected: orders.filter(o => o.status === 'Rejected').length,
  }), [orders]);

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
          <h2 style={styles.pageTitle}>Orders</h2>
          <p style={styles.pageSubtitle}>{orders.length} total orders</p>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div variants={itemVariants} style={styles.tabsRow}>
        <div style={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              <span style={{
                ...styles.tabCount,
                background: activeTab === tab ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.06)',
                color: activeTab === tab ? '#8b5cf6' : 'var(--text-muted)',
              }}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>
        <div style={styles.searchBar}>
          <FiSearch size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={itemVariants} style={styles.tableCard}>
        {filteredOrders.length === 0 ? (
          <div style={styles.emptyState}>
            <FiPackage size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-secondary, #94a3b8)' }}>No orders found</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Products</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const sc = statusColors[order.status];
                  return (
                    <tr key={order.id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.customerCell}>
                          <div style={styles.customerAvatar}>{order.customer.avatar}</div>
                          <div>
                            <div style={styles.customerName}>{order.customer.name}</div>
                            <div style={styles.customerEmail}>{order.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.productName}>{order.products[0]?.title}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.amount}>₹{order.amount}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          background: sc.bg,
                          color: sc.color,
                          borderColor: sc.border,
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.date}>{order.date}</span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actions}>
                          <button
                            style={styles.actionBtn}
                            onClick={() => openDetail(order)}
                            title="View Details"
                          >
                            <FiEye size={15} />
                          </button>
                          {order.status === 'Pending' && (
                            <>
                              <button
                                style={{ ...styles.actionBtn, borderColor: 'rgba(16,185,129,0.2)', color: '#10b981' }}
                                onClick={() => updateOrderStatus(order.id, 'Approved')}
                                title="Approve"
                              >
                                <FiCheck size={15} />
                              </button>
                              <button
                                style={{ ...styles.actionBtn, borderColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                                onClick={() => updateOrderStatus(order.id, 'Rejected')}
                                title="Reject"
                              >
                                <FiX size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedOrder && (
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
                <h3 style={styles.modalTitle}>Order {selectedOrder.id}</h3>
                <button style={styles.modalClose} onClick={() => setShowDetailModal(false)}>
                  <FiX size={18} />
                </button>
              </div>

              <div style={styles.modalBody}>
                {/* Status */}
                <div style={styles.detailStatusRow}>
                  <span style={{
                    ...styles.statusBadge,
                    ...(() => {
                      const sc = statusColors[selectedOrder.status];
                      return { background: sc.bg, color: sc.color, borderColor: sc.border };
                    })(),
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.82rem',
                  }}>
                    {selectedOrder.status}
                  </span>
                  <span style={styles.detailDate}>{selectedOrder.date}</span>
                </div>

                {/* Sections */}
                <div style={styles.detailSection}>
                  <div style={styles.sectionHeader}>
                    <FiUser size={15} />
                    <span>Customer Info</span>
                  </div>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Name</span>
                      <span style={styles.detailValue}>{selectedOrder.customer.name}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Email</span>
                      <span style={styles.detailValue}>{selectedOrder.customer.email}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Location</span>
                      <span style={styles.detailValue}>{selectedOrder.address}</span>
                    </div>
                  </div>
                </div>

                <div style={styles.detailSection}>
                  <div style={styles.sectionHeader}>
                    <FiPackage size={15} />
                    <span>Products</span>
                  </div>
                  {selectedOrder.products.map((product, i) => (
                    <div key={i} style={styles.productRow}>
                      <div style={styles.productThumb}>
                        <FiImage size={16} />
                      </div>
                      <span style={styles.productRowTitle}>{product.title}</span>
                      <span style={styles.productRowPrice}>₹{product.price}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.detailSection}>
                  <div style={styles.sectionHeader}>
                    <FiCreditCard size={15} />
                    <span>Payment Info</span>
                  </div>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Method</span>
                      <span style={styles.detailValue}>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Transaction ID</span>
                      <span style={{ ...styles.detailValue, fontFamily: "'SF Mono', monospace", color: '#8b5cf6' }}>
                        {selectedOrder.transactionId}
                      </span>
                    </div>
                    <div style={styles.detailItem}>
                      <span style={styles.detailLabel}>Amount</span>
                      <span style={{ ...styles.detailValue, color: '#10b981', fontWeight: 700 }}>
                        ₹{selectedOrder.amount}
                      </span>
                    </div>
                  </div>

                  {/* Payment Screenshot */}
                  <div style={styles.screenshotSection}>
                    <span style={styles.detailLabel}>Payment Screenshot</span>
                    <div style={styles.screenshotPlaceholder}>
                      <FiImage size={32} style={{ color: 'var(--text-muted)' }} />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>No screenshot uploaded</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                {selectedOrder.status === 'Approved' && (
                  <button
                    style={styles.downloadLinkBtn}
                    onClick={() => toast.success('Download link sent!')}
                  >
                    <FiDownload size={15} />
                    Send Download Link
                  </button>
                )}
                {selectedOrder.status === 'Pending' && (
                  <>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'Rejected');
                        setShowDetailModal(false);
                      }}
                    >
                      <FiX size={15} />
                      Reject
                    </button>
                    <button
                      style={styles.approveBtn}
                      onClick={() => {
                        updateOrderStatus(selectedOrder.id, 'Approved');
                        setShowDetailModal(false);
                      }}
                    >
                      <FiCheck size={15} />
                      Approve
                    </button>
                  </>
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
  tabsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tabs: {
    display: 'flex',
    gap: '0.35rem',
    padding: '0.3rem',
    borderRadius: 10,
    background: 'rgba(15,15,25,0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.85rem',
    borderRadius: 8,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary, #94a3b8)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'rgba(139,92,246,0.12)',
    color: '#fff',
  },
  tabCount: {
    padding: '0.1rem 0.4rem',
    borderRadius: 5,
    fontSize: '0.68rem',
    fontWeight: 700,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.85rem',
    borderRadius: 8,
    background: 'rgba(15,15,25,0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    minWidth: 200,
  },
  searchInput: {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: '0.82rem',
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
  orderId: {
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    fontSize: '0.78rem',
    color: '#8b5cf6',
    fontWeight: 600,
  },
  customerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  customerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  customerName: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.82rem',
  },
  customerEmail: {
    color: 'var(--text-muted, #64748b)',
    fontSize: '0.68rem',
  },
  productName: {
    color: 'var(--text-secondary, #94a3b8)',
    fontSize: '0.82rem',
    maxWidth: 200,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'block',
  },
  amount: {
    color: '#10b981',
    fontWeight: 600,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.65rem',
    borderRadius: 6,
    fontSize: '0.72rem',
    fontWeight: 600,
    border: '1px solid',
  },
  date: {
    color: 'var(--text-muted, #64748b)',
    fontSize: '0.78rem',
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
    maxWidth: 560,
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
  detailStatusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  detailDate: {
    fontSize: '0.8rem',
    color: 'var(--text-muted, #64748b)',
  },
  detailSection: {
    padding: '1rem 0',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  detailLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    color: 'var(--text-muted, #64748b)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  detailValue: {
    fontSize: '0.85rem',
    color: '#fff',
    fontWeight: 500,
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.03)',
    marginBottom: '0.35rem',
  },
  productThumb: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: 'rgba(139,92,246,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8b5cf6',
    flexShrink: 0,
  },
  productRowTitle: {
    flex: 1,
    fontSize: '0.82rem',
    color: '#fff',
    fontWeight: 500,
  },
  productRowPrice: {
    fontSize: '0.85rem',
    color: '#10b981',
    fontWeight: 600,
  },
  screenshotSection: {
    marginTop: '0.85rem',
  },
  screenshotPlaceholder: {
    marginTop: '0.5rem',
    padding: '2rem',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.03)',
    border: '1px dashed rgba(255,255,255,0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.65rem',
    padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  approveBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1.1rem',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(16,185,129,0.2)',
  },
  rejectBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1.1rem',
    borderRadius: 8,
    border: '1px solid rgba(239,68,68,0.2)',
    background: 'rgba(239,68,68,0.08)',
    color: '#ef4444',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  downloadLinkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.55rem 1.1rem',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    color: '#fff',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 15px rgba(139,92,246,0.2)',
  },
};

export default AdminOrders;
