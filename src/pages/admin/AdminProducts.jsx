import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiUploadCloud, FiPackage, FiFilter, FiFile, FiCheck, FiLoader } from 'react-icons/fi';
import { sampleProducts } from '../../data/sampleProducts';
import toast from 'react-hot-toast';

const PRODUCTS_KEY = 'pv_products';
const API_URL = '/.netlify/functions/products';
const CATEGORIES = ['Sketch Notes', 'eBooks', 'AI Prompts', 'Presets', 'Templates', 'Courses', 'APKs', 'Editing Packs', 'Tools'];

import { supabase } from '../../config/supabase';

// Helper to generate a safe file name
const getSafeFileName = (name) => {
  return `${Date.now()}_${name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
};

// API helpers using Supabase
const apiGet = async () => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return { ok: true, data: data || [] };
  } catch (err) {
    console.error('API GET error:', err);
    return { ok: false, data: [] };
  }
};

const apiPost = async (product, fileObj) => {
  try {
    let fileUrl = '#';
    let pdfFileName = '';
    
    // Upload file to Supabase Storage if provided
    if (fileObj) {
      const fileName = getSafeFileName(fileObj.name);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(fileName, fileObj);
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('product-files')
        .getPublicUrl(fileName);
        
      fileUrl = publicUrlData.publicUrl;
      pdfFileName = fileObj.name;
    }

    const { data, error } = await supabase.from('products').insert([{
      title: product.title,
      description: product.description,
      price: product.price,
      category: product.category,
      tags: product.tags,
      thumbnail: product.thumbnail,
      fileUrl,
      downloadType: product.downloadType,
      featured: product.featured,
      trending: product.trending,
      pdfFileName
    }]).select().single();

    if (error) throw error;
    return { ok: true, data };
  } catch (err) {
    console.error('API POST error:', err);
    return { ok: false };
  }
};

const apiPut = async (product, fileObj) => {
  try {
    let updateData = { ...product };
    delete updateData.id;

    // Upload new file to Supabase Storage if provided
    if (fileObj) {
      const fileName = getSafeFileName(fileObj.name);
      const { error: uploadError } = await supabase.storage
        .from('product-files')
        .upload(fileName, fileObj);
        
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage
        .from('product-files')
        .getPublicUrl(fileName);
        
      updateData.fileUrl = publicUrlData.publicUrl;
      updateData.pdfFileName = fileObj.name;
    }

    const { error } = await supabase.from('products').update(updateData).eq('id', product.id);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error('API PUT error:', err);
    return { ok: false };
  }
};

const apiDelete = async (id) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error('API DELETE error:', err);
    return { ok: false };
  }
};

const emptyForm = {
  title: '',
  description: '',
  price: '',
  category: 'Sketch Notes',
  tags: '',
  thumbnail: '',
  downloadType: 'PDF',
  featured: false,
  trending: false,
  pdfFileName: '',
  pdfFileObj: null,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const AdminProducts = () => {
  const [customProducts, setCustomProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch custom products on mount (API or localStorage fallback)
  useEffect(() => {
    (async () => {
      const result = await apiGet();
      setCustomProducts(result.data);
    })();
  }, []);

  // All products = sample + custom
  const allProducts = [...sampleProducts, ...customProducts];

  // Filtered
  const filtered = allProducts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const isCustomProduct = (id) => customProducts.some(p => p.id === id);

  // Open add modal
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  // Open edit modal
  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || 'Sketch Notes',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      thumbnail: product.thumbnail || '',
      downloadType: product.downloadType || 'PDF',
      featured: product.featured || false,
      trending: product.trending || false,
      pdfFileName: product.pdfFileName || '',
      pdfFileObj: null,
    });
    setShowModal(true);
  };

  // Handle PDF upload
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF file must be under 10MB');
      return;
    }
    setForm(prev => ({
      ...prev,
      pdfFileName: file.name,
      pdfFileObj: file,
    }));
    toast.success(`PDF "${file.name}" selected ready for upload`);
  };

  // Handle form change
  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      // Auto set downloadType for Sketch Notes
      if (field === 'category' && value === 'Sketch Notes') {
        updated.downloadType = 'PDF';
      }
      return updated;
    });
  };

  // Save product (API + localStorage fallback)
  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Valid price is required'); return; }
    if (!form.category) { toast.error('Category is required'); return; }

    setSaving(true);
    const tags = form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
    const thumbnail = form.thumbnail || `https://placehold.co/400x300/1a1a2e/a855f7?text=${encodeURIComponent(form.title)}`;

    if (editingId) {
      const productData = {
        id: editingId,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        tags, thumbnail,
        downloadType: form.downloadType,
        featured: form.featured,
        trending: form.trending,
      };

      const result = await apiPut(productData, form.pdfFileObj);
      if (result.ok) {
        const fresh = await apiGet();
        setCustomProducts(fresh.data);
        toast.success('Product updated!');
      } else {
        toast.error('Failed to update product');
      }
    } else {
      const newProduct = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        tags, thumbnail,
        downloadType: form.downloadType,
        featured: form.featured,
        trending: form.trending,
      };

      const result = await apiPost(newProduct, form.pdfFileObj);
      if (result.ok) {
        const fresh = await apiGet();
        setCustomProducts(fresh.data);
        toast.success('Product added! Visible to all users 🎉');
      } else {
        toast.error('Failed to add product');
      }
    }
    setSaving(false);
    setShowModal(false);
    setForm({ ...emptyForm });
    setEditingId(null);
  };

  // Delete product (API + localStorage fallback)
  const handleDelete = async (id) => {
    if (!isCustomProduct(id)) {
      toast.error('Cannot delete sample products');
      return;
    }
    const result = await apiDelete(id);
    if (result.ok) {
      const fresh = await apiGet();
      setCustomProducts(fresh.data);
      toast.success('Product deleted');
    } else {
      toast.error('Failed to delete product');
    }
    setDeleteConfirm(null);
    toast.success('Product deleted');
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" style={styles.page}>
      {/* Header */}
      <motion.div variants={itemVariants} style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}>Products</h2>
          <p style={styles.pageSubtitle}>{allProducts.length} total products · {customProducts.length} custom added</p>
        </div>
        <button style={styles.addBtn} onClick={openAdd}>
          <FiPlus size={18} />
          Add Product
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} style={styles.filtersRow}>
        <div style={styles.searchBar}>
          <FiSearch size={15} style={{ color: '#64748b', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          {search && (
            <button style={styles.clearSearch} onClick={() => setSearch('')}>
              <FiX size={14} />
            </button>
          )}
        </div>
        <div style={styles.catFilter}>
          <FiFilter size={14} style={{ color: '#64748b' }} />
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={styles.catSelect}
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div variants={itemVariants} style={styles.tableCard}>
        {filtered.length === 0 ? (
          <div style={styles.emptyState}>
            <FiPackage size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
            <p style={{ color: '#94a3b8' }}>No products found</p>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Source</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.productCell}>
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={styles.productThumb}
                          onError={e => { e.target.src = `https://placehold.co/48x36/1a1a2e/a855f7?text=PV`; }}
                        />
                        <div style={styles.productInfo}>
                          <span style={styles.productTitle}>{product.title}</span>
                          {product.pdfFileName && (
                            <span style={styles.pdfBadge}>
                              <FiFile size={10} /> {product.pdfFileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.categoryBadge,
                        background: product.category === 'Sketch Notes'
                          ? 'rgba(245,158,11,0.12)'
                          : 'rgba(139,92,246,0.12)',
                        color: product.category === 'Sketch Notes' ? '#f59e0b' : '#8b5cf6',
                        borderColor: product.category === 'Sketch Notes'
                          ? 'rgba(245,158,11,0.2)'
                          : 'rgba(139,92,246,0.2)',
                      }}>
                        {product.category}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.price}>₹{product.price}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.typeBadge}>{product.downloadType || 'Digital'}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.sourceBadge,
                        background: isCustomProduct(product.id) ? 'rgba(6,182,212,0.12)' : 'rgba(255,255,255,0.04)',
                        color: isCustomProduct(product.id) ? '#06b6d4' : '#64748b',
                      }}>
                        {isCustomProduct(product.id) ? 'Custom' : 'Sample'}
                      </span>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={styles.actions}>
                        {isCustomProduct(product.id) && (
                          <>
                            <button style={styles.actionBtn} onClick={() => openEdit(product)} title="Edit">
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              style={{ ...styles.actionBtn, borderColor: 'rgba(239,68,68,0.15)', color: '#ef4444' }}
                              onClick={() => setDeleteConfirm(product.id)}
                              title="Delete"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </>
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

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={styles.modal}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button style={styles.modalClose} onClick={() => setShowModal(false)}>
                  <FiX size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={styles.modalBody}>
                {/* Title */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. Physics Chapter 1 — Sketch Notes"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    style={styles.input}
                  />
                </div>

                {/* Description */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    placeholder="Describe the product..."
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    style={{ ...styles.input, minHeight: 80, resize: 'vertical' }}
                    rows={3}
                  />
                </div>

                {/* Price + Category Row */}
                <div style={styles.formRow}>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="20"
                      value={form.price}
                      onChange={e => handleChange('price', e.target.value)}
                      style={styles.input}
                      min="1"
                    />
                  </div>
                  <div style={{ ...styles.formGroup, flex: 1 }}>
                    <label style={styles.label}>Category *</label>
                    <select
                      value={form.category}
                      onChange={e => handleChange('category', e.target.value)}
                      style={styles.input}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="sketch notes, physics, revision"
                    value={form.tags}
                    onChange={e => handleChange('tags', e.target.value)}
                    style={styles.input}
                  />
                </div>

                {/* Thumbnail URL */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Thumbnail URL</label>
                  <input
                    type="text"
                    placeholder="https://example.com/image.jpg (optional)"
                    value={form.thumbnail}
                    onChange={e => handleChange('thumbnail', e.target.value)}
                    style={styles.input}
                  />
                </div>

                {/* Download Type */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Download Type</label>
                  <select
                    value={form.downloadType}
                    onChange={e => handleChange('downloadType', e.target.value)}
                    style={styles.input}
                  >
                    <option value="PDF">PDF</option>
                    <option value="ZIP">ZIP</option>
                    <option value="APK">APK</option>
                    <option value="MP4">MP4</option>
                    <option value="PNG">PNG</option>
                    <option value="Video Course">Video Course</option>
                  </select>
                </div>

                {/* PDF File Upload */}
                <div style={styles.formGroup}>
                  <label style={styles.label}>Upload PDF File</label>
                  <div
                    style={styles.uploadArea}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      style={{ display: 'none' }}
                    />
                    {form.pdfFileName ? (
                      <div style={styles.uploadedFile}>
                        <FiFile size={20} style={{ color: '#8b5cf6' }} />
                        <div>
                          <div style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{form.pdfFileName}</div>
                          <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Click to change</div>
                        </div>
                        <FiCheck size={16} style={{ color: '#10b981', marginLeft: 'auto' }} />
                      </div>
                    ) : (
                      <div style={styles.uploadPlaceholder}>
                        <FiUploadCloud size={28} style={{ color: '#8b5cf6' }} />
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Click to upload PDF (max 10MB)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Toggles */}
                <div style={styles.formRow}>
                  <label style={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => handleChange('featured', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>Featured</span>
                  </label>
                  <label style={styles.toggleLabel}>
                    <input
                      type="checkbox"
                      checked={form.trending}
                      onChange={e => handleChange('trending', e.target.checked)}
                      style={styles.checkbox}
                    />
                    <span>Trending</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={styles.modalFooter}>
                <button style={styles.cancelBtn} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ ...styles.modal, maxWidth: 400, textAlign: 'center' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '2rem' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <FiTrash2 size={24} color="#ef4444" />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>Delete Product?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 1.5rem' }}>
                  This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button style={styles.cancelBtn} onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button
                    style={{ ...styles.saveBtn, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                    onClick={() => handleDelete(deleteConfirm)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const styles = {
  page: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: '1rem',
  },
  pageTitle: { fontSize: '1.35rem', fontWeight: 700, color: '#fff', margin: 0 },
  pageSubtitle: { fontSize: '0.78rem', color: '#64748b', margin: 0 },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.6rem 1.25rem', borderRadius: 10,
    border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    color: '#fff', fontSize: '0.85rem', fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 0 25px rgba(139,92,246,0.25)',
    transition: 'all 0.2s ease',
  },
  filtersRow: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
  },
  searchBar: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 0.85rem', borderRadius: 8,
    background: 'rgba(15,15,25,0.6)', border: '1px solid rgba(255,255,255,0.06)',
    flex: 1, minWidth: 200,
  },
  searchInput: {
    flex: 1, background: 'none', border: 'none', outline: 'none',
    color: '#fff', fontSize: '0.82rem',
  },
  clearSearch: {
    background: 'none', border: 'none', color: '#64748b',
    cursor: 'pointer', padding: 2, display: 'flex',
  },
  catFilter: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.5rem 0.85rem', borderRadius: 8,
    background: 'rgba(15,15,25,0.6)', border: '1px solid rgba(255,255,255,0.06)',
  },
  catSelect: {
    background: 'none', border: 'none', outline: 'none',
    color: '#fff', fontSize: '0.82rem', cursor: 'pointer',
  },
  tableCard: {
    borderRadius: 14, background: 'rgba(15, 15, 25, 0.6)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(12px)', overflow: 'hidden',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '3rem',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.7rem',
    fontWeight: 600, color: '#64748b', textTransform: 'uppercase',
    letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)',
    whiteSpace: 'nowrap',
  },
  tr: { transition: 'background 0.2s ease' },
  td: {
    padding: '0.7rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.03)',
    verticalAlign: 'middle',
  },
  productCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  productThumb: {
    width: 48, height: 36, borderRadius: 6, objectFit: 'cover',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  productInfo: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  productTitle: {
    color: '#fff', fontWeight: 600, fontSize: '0.82rem',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 250,
  },
  pdfBadge: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    fontSize: '0.65rem', color: '#8b5cf6', marginTop: 2,
  },
  categoryBadge: {
    display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: 6,
    fontSize: '0.72rem', fontWeight: 600, border: '1px solid',
  },
  price: { color: '#10b981', fontWeight: 600, fontSize: '0.85rem' },
  typeBadge: {
    display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: 5,
    fontSize: '0.68rem', fontWeight: 600,
    background: 'rgba(255,255,255,0.04)', color: '#94a3b8',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  sourceBadge: {
    display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: 5,
    fontSize: '0.68rem', fontWeight: 600,
    border: '1px solid rgba(255,255,255,0.06)',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end' },
  actionBtn: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 7, color: '#94a3b8', cursor: 'pointer',
    padding: '0.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  // Modal
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 9999, padding: '1rem',
  },
  modal: {
    width: '100%', maxWidth: 580, maxHeight: '92vh',
    borderRadius: 16, background: 'rgba(15, 15, 25, 0.98)',
    border: '1px solid rgba(139,92,246,0.15)',
    boxShadow: '0 0 60px rgba(139,92,246,0.1), 0 25px 50px rgba(0,0,0,0.5)',
    display: 'flex', flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 },
  modalClose: {
    background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8,
    color: '#94a3b8', cursor: 'pointer', padding: '0.35rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modalBody: {
    padding: '1.5rem', overflowY: 'auto', flex: 1,
    display: 'flex', flexDirection: 'column', gap: '1rem',
  },
  modalFooter: {
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
    gap: '0.75rem', padding: '1rem 1.5rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '0.35rem' },
  formRow: { display: 'flex', gap: '0.75rem', alignItems: 'flex-end' },
  label: {
    fontSize: '0.72rem', fontWeight: 600, color: '#94a3b8',
    textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  input: {
    padding: '0.65rem 0.85rem', borderRadius: 8,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#fff', fontSize: '0.85rem', outline: 'none',
    transition: 'border-color 0.2s ease', width: '100%',
    fontFamily: 'inherit',
  },
  uploadArea: {
    padding: '1.25rem', borderRadius: 10,
    border: '2px dashed rgba(139,92,246,0.25)',
    background: 'rgba(139,92,246,0.04)',
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  uploadedFile: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  uploadPlaceholder: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: '0.5rem',
  },
  toggleLabel: {
    display: 'flex', alignItems: 'center', gap: '0.5rem',
    cursor: 'pointer', color: '#94a3b8', fontSize: '0.85rem',
    padding: '0.5rem 0',
  },
  checkbox: { accentColor: '#8b5cf6', width: 16, height: 16, cursor: 'pointer' },
  cancelBtn: {
    padding: '0.55rem 1.15rem', borderRadius: 8,
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s ease',
  },
  saveBtn: {
    padding: '0.55rem 1.25rem', borderRadius: 8,
    border: 'none', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    color: '#fff', fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', boxShadow: '0 0 20px rgba(139,92,246,0.2)',
    transition: 'all 0.2s ease',
  },
};

export default AdminProducts;
