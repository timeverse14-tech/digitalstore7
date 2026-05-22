import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialSearch = searchParams.get('q') || '';

  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState(initialSort);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = ['All', 'Sketch Notes', 'eBooks', 'AI Prompts', 'Presets', 'Templates', 'Courses', 'APKs', 'Editing Packs', 'Tools'];

  useEffect(() => {
    // Update URL when filters change
    const params = new URLSearchParams();
    if (category && category !== 'All') params.set('category', category);
    if (sort !== 'newest') params.set('sort', sort);
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  }, [category, sort, searchQuery, setSearchParams]);

  // Sync state with URL if URL changes externally
  useEffect(() => {
    setCategory(searchParams.get('category') || 'All');
    setSort(searchParams.get('sort') || 'newest');
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'trending':
        result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [products, category, sort, searchQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: 'var(--space-16)' }}
    >
      <div className="container">
        
        {/* Header & Search */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h1 className="heading-2 gradient-text mb-4">Explore Products</h1>
          
          <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                className="input" 
                placeholder="Search products, tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', paddingLeft: '44px', height: '48px', borderRadius: 'var(--radius-full)' }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                >
                  <FiX />
                </button>
              )}
            </div>
            
            <button 
              className="btn btn-secondary md:hidden" 
              onClick={() => setIsMobileFilterOpen(true)}
              style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <FiFilter /> Filters
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start' }}>
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="filters-sidebar hidden md:block" style={{ width: '260px', position: 'sticky', top: '100px' }}>
            <div className="glass" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
              
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 className="heading-6" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  {categories.map(cat => (
                    <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: category === cat ? 'var(--color-purple)' : 'var(--color-text-secondary)', transition: 'color 0.2s' }}>
                      <input 
                        type="radio" 
                        name="category" 
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        style={{ accentColor: 'var(--color-purple)' }}
                      />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="heading-6" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Sort By</h3>
                <select 
                  className="select" 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  style={{ width: '100%', fontSize: 'var(--text-sm)' }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="featured">Featured</option>
                  <option value="trending">Trending</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Clear filters */}
              {(category !== 'All' || sort !== 'newest' || searchQuery) && (
                <button 
                  className="btn btn-sm mt-6 w-full"
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-secondary)', border: 'none' }}
                  onClick={() => {
                    setCategory('All');
                    setSort('newest');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div style={{ flex: 1 }}>
            
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted text-sm">{filteredProducts.length} results</span>
            </div>

            {loading ? (
              <div className="grid-3">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton skeleton-card" style={{ height: '350px' }}></div>)}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="glass" style={{ padding: 'var(--space-12)', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                <FiSearch style={{ fontSize: '3rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)', opacity: 0.5 }} />
                <h3 className="heading-4">No products found</h3>
                <p className="text-muted mb-6">Try adjusting your search or filters.</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setCategory('All');
                    setSort('newest');
                    setSearchQuery('');
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid-3">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay"
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1001, background: 'rgba(0,0,0,0.7)' }}
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glass"
              style={{ 
                position: 'fixed', bottom: 0, left: 0, right: 0, 
                maxHeight: '80vh', overflowY: 'auto',
                borderTopLeftRadius: 'var(--radius-xl)', 
                borderTopRightRadius: 'var(--radius-xl)', 
                zIndex: 1002,
                padding: 'var(--space-6)',
                borderTop: '1px solid var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 className="heading-4 m-0">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', fontSize: '1.5rem' }}><FiX /></button>
              </div>

              {/* Duplicate filter logic for mobile */}
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <h3 className="heading-6" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      className={`btn btn-sm ${category === cat ? 'btn-primary' : 'glass'}`}
                      onClick={() => setCategory(cat)}
                      style={{ border: category === cat ? 'none' : '1px solid var(--color-border)' }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h3 className="heading-6" style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>Sort By</h3>
                <select 
                  className="select" 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="featured">Featured</option>
                  <option value="trending">Trending</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              <button className="btn btn-primary w-full" onClick={() => setIsMobileFilterOpen(false)}>
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hidden { display: none; }
        @media (min-width: 768px) {
          .md\\:block { display: block; }
          .md\\:hidden { display: none; }
        }
        .w-full { width: 100%; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mt-2 { margin-top: 0.5rem; }
        .mt-6 { margin-top: 1.5rem; }
      `}</style>
    </motion.div>
  );
};

export default Products;
