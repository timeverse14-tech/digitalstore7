import { useState, useCallback } from 'react';
import { supabase } from '../config/supabase';

// Fallback localStorage helpers for demo mode
const ORDERS_KEY = 'pv_orders';
const getLocalOrders = () => {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
};
const saveLocalOrders = (orders) => localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setOrders(data || []);
      return data || [];
    } catch (err) {
      console.warn("Supabase orders fetch failed, falling back to local:", err);
      const local = getLocalOrders();
      setOrders(local);
      return local;
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          order_number: orderData.id || 'PV-' + Date.now(),
          user_id: orderData.userId !== 'guest' ? orderData.userId : null,
          customer: orderData.customer,
          items: orderData.items,
          total: orderData.total,
          transactionId: orderData.transactionId,
          paymentScreenshot: orderData.paymentScreenshot,
          screenshotName: orderData.screenshotName,
          status: orderData.status || 'Pending',
          paymentMethod: orderData.paymentMethod || 'UPI',
        }])
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.warn("Supabase order creation failed, falling back to local:", err);
      const newOrder = {
        ...orderData,
        id: orderData.id || 'PV-' + Date.now(),
        order_number: orderData.id || 'PV-' + Date.now(),
        status: orderData.status || 'Pending',
        created_at: new Date().toISOString(),
      };
      const updated = [newOrder, ...getLocalOrders()];
      saveLocalOrders(updated);
      setOrders(updated);
      return newOrder;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserOrders = useCallback(async (userId) => {
    setLoading(true);
    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      
      if (userId && userId !== 'guest') {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      
      setOrders(data || []);
      return data || [];
    } catch (err) {
      const allOrders = getLocalOrders();
      const userOrders = userId && userId !== 'guest' ? allOrders.filter(o => o.userId === userId || o.user_id === userId) : allOrders;
      setOrders(userOrders);
      return userOrders;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      return data;
    } catch (err) {
      const allOrders = getLocalOrders();
      const updated = allOrders.map(o => (o.id === orderId || o.order_number === orderId) ? { ...o, status, updatedAt: new Date().toISOString() } : o);
      saveLocalOrders(updated);
      setOrders(updated);
      return { id: orderId, status };
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, createOrder, getUserOrders, updateOrderStatus, getAllOrders };
};

export { useOrders };
