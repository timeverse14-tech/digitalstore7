import { useState, useEffect, useCallback } from 'react';
import { sampleProducts } from '../data/sampleProducts';
import { supabase } from '../config/supabase';

const useProducts = () => {
  const [products, setProducts] = useState([...sampleProducts]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch products from Supabase
      const { data: serverProducts, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      const formattedServerProducts = (serverProducts || []).map(p => ({
        ...p,
        // Ensure price is a number
        price: Number(p.price)
      }));

      // Merge sample products + server products
      // Server products are placed first so newer custom items appear at the top
      const merged = [...formattedServerProducts, ...sampleProducts];
      setProducts(merged);
    } catch (err) {
      console.warn('Supabase fetch failed, using local fallback:', err);
      try {
        const localProducts = JSON.parse(localStorage.getItem('pv_products') || '[]');
        setProducts([...localProducts, ...sampleProducts]);
      } catch {
        setProducts(sampleProducts);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getProduct = useCallback(
    (id) => {
      const found = products.find(
        (p) => p.id === id || p.id === String(id)
      );
      return found || null;
    },
    [products]
  );

  const filterByCategory = useCallback(
    (category) => {
      if (!category || category === 'All') return products;
      return products.filter(
        (product) =>
          product.category &&
          product.category.toLowerCase() === category.toLowerCase()
      );
    },
    [products]
  );

  const searchProducts = useCallback(
    (queryStr) => {
      if (!queryStr || queryStr.trim() === '') return products;
      const searchTerm = queryStr.toLowerCase().trim();
      return products.filter((product) => {
        const titleMatch = product.title && product.title.toLowerCase().includes(searchTerm);
        const descriptionMatch = product.description && product.description.toLowerCase().includes(searchTerm);
        const tagsMatch = product.tags && Array.isArray(product.tags) && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm));
        return titleMatch || descriptionMatch || tagsMatch;
      });
    },
    [products]
  );

  const sortProducts = useCallback(
    (field) => {
      const sorted = [...products];
      switch (field) {
        case 'price-asc': sorted.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
        case 'price-desc': sorted.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
        case 'rating': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
        case 'newest':
          sorted.sort((a, b) => {
            const dateA = a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt).getTime() : 0;
            const dateB = b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        default: break;
      }
      return sorted;
    },
    [products]
  );

  return { products, loading, error, fetchProducts, getProduct, filterByCategory, searchProducts, sortProducts };
};

export { useProducts };
