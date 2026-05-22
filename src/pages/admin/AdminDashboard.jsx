import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiShoppingBag, FiDollarSign, FiUsers, FiTrendingUp, FiTrendingDown, FiArrowUpRight, FiMoreVertical } from 'react-icons/fi';
import { sampleProducts } from '../../data/sampleProducts';

const mockOrders = [
  { id: 'PV-1042', customer: 'Arjun Mehta', email: 'arjun@email.com', product: 'Pro Lightroom Presets', amount: 499, status: 'Approved', date: '2026-05-22' },
  { id: 'PV-1041', customer: 'Priya Sharma', email: 'priya@email.com', product: 'AI Prompt Collection', amount: 299, status: 'Pending', date: '2026-05-22' },
  { id: 'PV-1040', customer: 'Rahul Verma', email: 'rahul@email.com', product: 'React Dashboard Template', amount: 1499, status: 'Approved', date: '2026-05-21' },
  { id: 'PV-1039', customer: 'Sneha Patel', email: 'sneha@email.com', product: 'Video Editing Pack', amount: 799, status: 'Rejected', date: '2026-05-21' },
  { id: 'PV-1038', customer: 'Vikram Singh', email: 'vikram@email.com', product: 'Full Stack Course', amount: 2999, status: 'Approved', date: '2026-05-20' },
  { id: 'PV-1037', customer: 'Ananya Gupta', email: 'ananya@email.com', product: 'Logo Design Templates', amount: 399, status: 'Pending', date: '2026-05-20' },
];

const revenueData = [
  { day: 'Mon', value: 65, amount: '₹12.4K' },
  { day: 'Tue', value: 45, amount: '₹8.6K' },
  { day: 'Wed', value: 85, amount: '₹16.2K' },
  { day: 'Thu', value: 55, amount: '₹10.5K' },
  { day: 'Fri', value: 90, amount: '₹17.1K' },
  { day: 'Sat', value: 70, amount: '₹13.3K' },
  { day: 'Sun', value: 40, amount: '₹7.6K' },
];

const topProducts = [
  { title: 'Pro Lightroom Presets Pack', sales: 234, revenue: '₹1,16,766', growth: '+18%' },
  { title: 'AI Prompt Master Collection', sales: 189, revenue: '₹56,511', growth: '+24%' },
  { title: 'Full Stack React Course', sales: 156, revenue: '₹4,67,244', growth: '+12%' },
  { title: 'Video Editing Essentials', sales: 134, revenue: '₹1,07,066', growth: '+8%' },
  { title: 'Notion Productivity Templates', sales: 112, revenue: '₹33,488', growth: '+31%' },
];

const statCards = [
  {
    label: 'Total Products',
    getValue: () => sampleProducts?.length || 24,
    change: '+4.5%',
    positive: true,
    icon: FiPackage,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(139,92,246,0.05))',
    borderColor: 'rgba(139,92,246,0.2)',
  },
  {
    label: 'Total Orders',
    getValue: () => 156,
    change: '+12.5%',
    positive: true,
    icon: FiShoppingBag,
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
    borderColor: 'rgba(6,182,212,0.2)',
  },
  {
    label: 'Total Revenue',
    getValue: () => '₹2,45,000',
    change: '+8.2%',
    positive: true,
    icon: FiDollarSign,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
    borderColor: 'rgba(16,185,129,0.2)',
  },
  {
    label: 'Total Users',
    getValue: () => '1,240',
    change: '+22.4%',
    positive: true,
    icon: FiUsers,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
    borderColor: 'rgba(245,158,11,0.2)',
  },
];

const statusColors = {
  Approved: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.2)' },
  Pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  Rejected: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const AdminDashboard = () => {
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={styles.page}
    >
      {/* Stats Row */}
      <div style={styles.statsGrid}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              variants={itemVariants}
              style={{
                ...styles.statCard,
                background: card.gradient,
                borderColor: card.borderColor,
              }}
              whileHover={{ y: -2, boxShadow: `0 0 30px ${card.color}15` }}
            >
              <div style={styles.statTop}>
                <div style={{ ...styles.statIconWrap, background: `${card.color}18`, boxShadow: `0 0 20px ${card.color}15` }}>
                  <Icon size={20} color={card.color} />
                </div>
                <div style={{
                  ...styles.changeBadge,
                  background: card.positive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  color: card.positive ? '#10b981' : '#ef4444',
                }}>
                  {card.positive ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                  <span>{card.change}</span>
                </div>
              </div>
              <div style={styles.statValue}>{card.getValue()}</div>
              <div style={styles.statLabel}>{card.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Middle Row: Chart + Top Products */}
      <div style={styles.middleGrid}>
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Revenue Overview</h3>
              <p style={styles.cardSubtitle}>Last 7 days performance</p>
            </div>
            <div style={styles.chartTotal}>
              <span style={styles.chartTotalValue}>₹85,700</span>
              <span style={styles.chartTotalChange}>
                <FiTrendingUp size={12} /> +14.2%
              </span>
            </div>
          </div>
          <div style={styles.chartContainer}>
            <div style={styles.chartBars}>
              {revenueData.map((item, i) => (
                <div
                  key={item.day}
                  style={styles.chartBarCol}
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {hoveredBar === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={styles.chartTooltip}
                    >
                      {item.amount}
                    </motion.div>
                  )}
                  <motion.div
                    style={{
                      ...styles.chartBar,
                      height: `${item.value}%`,
                      background: hoveredBar === i
                        ? 'linear-gradient(180deg, #8b5cf6, #06b6d4)'
                        : 'linear-gradient(180deg, rgba(139,92,246,0.6), rgba(6,182,212,0.3))',
                      boxShadow: hoveredBar === i ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${item.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span style={styles.chartLabel}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={itemVariants} style={styles.topProductsCard}>
          <div style={styles.cardHeader}>
            <div>
              <h3 style={styles.cardTitle}>Top Products</h3>
              <p style={styles.cardSubtitle}>By sales volume</p>
            </div>
          </div>
          <div style={styles.topProductsList}>
            {topProducts.map((product, i) => (
              <motion.div
                key={product.title}
                style={styles.topProductItem}
                whileHover={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div style={styles.topProductRank}>
                  <span style={{
                    ...styles.rankBadge,
                    background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                                i === 2 ? 'linear-gradient(135deg, #b45309, #92400e)' :
                                'rgba(255,255,255,0.06)',
                    color: i < 3 ? '#fff' : 'var(--text-muted, #64748b)',
                  }}>
                    {i + 1}
                  </span>
                </div>
                <div style={styles.topProductInfo}>
                  <span style={styles.topProductTitle}>{product.title}</span>
                  <span style={styles.topProductSales}>{product.sales} sales</span>
                </div>
                <div style={styles.topProductRight}>
                  <span style={styles.topProductRevenue}>{product.revenue}</span>
                  <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600 }}>{product.growth}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants} style={styles.ordersCard}>
        <div style={styles.cardHeader}>
          <div>
            <h3 style={styles.cardTitle}>Recent Orders</h3>
            <p style={styles.cardSubtitle}>Latest transactions</p>
          </div>
          <button style={styles.viewAllBtn}>
            View All <FiArrowUpRight size={14} />
          </button>
        </div>
        <div style={styles.tableWrapper}>
          <table className="data-table" style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Product</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => {
                const statusStyle = statusColors[order.status];
                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.orderId}>{order.id}</span>
                    </td>
                    <td style={styles.td}>
                      <div>
                        <div style={styles.customerName}>{order.customer}</div>
                        <div style={styles.customerEmail}>{order.email}</div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.productName}>{order.product}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.amount}>₹{order.amount}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border,
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.date}>{order.date}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  statCard: {
    padding: '1.25rem',
    borderRadius: 14,
    border: '1px solid',
    transition: 'all 0.3s ease',
    cursor: 'default',
  },
  statTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  statIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.2rem 0.5rem',
    borderRadius: 6,
    fontSize: '0.7rem',
    fontWeight: 600,
  },
  statValue: {
    fontSize: '1.6rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.2rem',
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-muted, #64748b)',
    fontWeight: 500,
  },
  middleGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '1rem',
  },
  chartCard: {
    padding: '1.25rem',
    borderRadius: 14,
    background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#fff',
    margin: 0,
    lineHeight: 1.3,
  },
  cardSubtitle: {
    fontSize: '0.72rem',
    color: 'var(--text-muted, #64748b)',
    margin: 0,
  },
  chartTotal: {
    textAlign: 'right',
  },
  chartTotalValue: {
    display: 'block',
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
  },
  chartTotalChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.2rem',
    color: '#10b981',
    fontSize: '0.72rem',
    fontWeight: 600,
    justifyContent: 'flex-end',
  },
  chartContainer: {
    height: 200,
    display: 'flex',
    alignItems: 'flex-end',
  },
  chartBars: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '0.6rem',
    width: '100%',
    height: '100%',
    paddingBottom: '1.5rem',
    position: 'relative',
  },
  chartBarCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    position: 'relative',
    cursor: 'pointer',
  },
  chartBar: {
    width: '100%',
    maxWidth: 40,
    borderRadius: '6px 6px 2px 2px',
    transition: 'all 0.2s ease',
  },
  chartLabel: {
    position: 'absolute',
    bottom: -20,
    fontSize: '0.68rem',
    color: 'var(--text-muted, #64748b)',
    fontWeight: 500,
  },
  chartTooltip: {
    position: 'absolute',
    top: -8,
    background: 'rgba(20, 20, 35, 0.95)',
    border: '1px solid rgba(139,92,246,0.3)',
    color: '#fff',
    padding: '0.3rem 0.55rem',
    borderRadius: 6,
    fontSize: '0.7rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    zIndex: 10,
  },
  topProductsCard: {
    padding: '1.25rem',
    borderRadius: 14,
    background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
  },
  topProductsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
  },
  topProductItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.65rem 0.5rem',
    borderRadius: 8,
    transition: 'background 0.2s ease',
  },
  topProductRank: {},
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
  },
  topProductInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topProductTitle: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  topProductSales: {
    fontSize: '0.68rem',
    color: 'var(--text-muted, #64748b)',
  },
  topProductRight: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  topProductRevenue: {
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#fff',
  },
  ordersCard: {
    padding: '1.25rem',
    borderRadius: 14,
    background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)',
  },
  viewAllBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: 'rgba(139,92,246,0.1)',
    border: '1px solid rgba(139,92,246,0.2)',
    color: '#8b5cf6',
    padding: '0.4rem 0.85rem',
    borderRadius: 8,
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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
    padding: '0.75rem 0.85rem',
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
    padding: '0.75rem 0.85rem',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: '0.84rem',
    verticalAlign: 'middle',
  },
  orderId: {
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    fontSize: '0.78rem',
    color: '#8b5cf6',
    fontWeight: 600,
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
};

// Add responsive media query
const dashboardResponsive = document.createElement('style');
dashboardResponsive.id = 'admin-dashboard-responsive';
dashboardResponsive.textContent = `
  @media (max-width: 1024px) {
    .admin-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
    .admin-middle-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 640px) {
    .admin-stats-grid { grid-template-columns: 1fr !important; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('admin-dashboard-responsive')) {
  document.head.appendChild(dashboardResponsive);
}

export default AdminDashboard;
