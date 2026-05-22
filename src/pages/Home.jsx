import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import ReviewCard from '../components/ReviewCard';
import Newsletter from '../components/Newsletter';
import { useProducts } from '../hooks/useProducts';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  const { products, loading } = useProducts();

  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const trendingProducts = products.filter(p => p.trending).slice(0, 4);

  const categories = [
    { name: 'Sketch Notes', icon: 'FiEdit3', count: 6 },
    { name: 'eBooks', icon: 'FiBook', count: 124 },
    { name: 'AI Prompts', icon: 'FiTerminal', count: 86 },
    { name: 'Presets', icon: 'FiImage', count: 215 },
    { name: 'Templates', icon: 'FiLayout', count: 142 },
    { name: 'Courses', icon: 'FiVideo', count: 58 },
    { name: 'APKs', icon: 'FiSmartphone', count: 34 },
    { name: 'Editing Packs', icon: 'FiSliders', count: 91 },
    { name: 'Tools', icon: 'FiTool', count: 47 }
  ];

  const reviews = [
    { name: 'Alex Johnson', rating: 5, comment: 'The UI templates here saved me weeks of work. Incredible quality and attention to detail!', avatar: '', date: '2 days ago' },
    { name: 'Sarah Miller', rating: 5, comment: 'Best AI prompts I\'ve found anywhere. My workflow is completely transformed.', avatar: '', date: '1 week ago' },
    { name: 'David Chen', rating: 4.5, comment: 'Great presets for Lightroom. Only wish there were more cyberpunk styles available.', avatar: '', date: '2 weeks ago' },
  ];

  return (
    <div>
      <Hero />

      {/* Featured Products */}
      <section style={{ padding: 'var(--space-16) 0', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 className="heading-2 m-0 gradient-text">Featured Products</h2>
              <p className="text-muted mt-2">Handpicked premium assets for your next big project.</p>
            </div>
            <Link to="/products?sort=featured" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-cyan)', textDecoration: 'none', fontWeight: 600 }} className="hover:text-purple transition">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-card" style={{ height: '350px' }}></div>)}
            </div>
          ) : (
            <div className="grid-4">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: 'var(--space-16) 0', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
        <div className="blob blob-purple" style={{ top: '20%', left: '0', width: '400px', height: '400px', opacity: 0.15 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="heading-2 text-center" style={{ marginBottom: 'var(--space-12)' }}>Browse Categories</h2>
          <div className="grid-4">
            {categories.map((cat, index) => (
              <CategoryCard key={cat.name} category={cat.name} icon={cat.icon} count={cat.count} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section id="trending" style={{ padding: 'var(--space-16) 0', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 className="heading-2 m-0 gradient-text">Trending Now</h2>
              <p className="text-muted mt-2">The most popular assets downloaded this week.</p>
            </div>
            <Link to="/products?sort=trending" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-pink)', textDecoration: 'none', fontWeight: 600 }} className="hover:text-purple transition">
              View All <FiArrowRight />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton skeleton-card" style={{ height: '350px' }}></div>)}
            </div>
          ) : (
            <div className="grid-4">
              {trendingProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: 'var(--space-16) 0', position: 'relative', background: 'rgba(255,255,255,0.02)' }}>
        <div className="blob blob-cyan" style={{ bottom: '0', right: '0', width: '500px', height: '500px', opacity: 0.1 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="heading-2 text-center gradient-text" style={{ marginBottom: 'var(--space-12)' }}>What Our Customers Say</h2>
          <div className="grid-3">
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      
      <style>{`
        .hover\\:text-purple:hover { color: var(--color-purple) !important; }
      `}</style>
    </div>
  );
};

export default Home;
