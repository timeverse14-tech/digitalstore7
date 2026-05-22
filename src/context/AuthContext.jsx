import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          // Check role from user metadata, or fallback to checking the admin email directly
          const role = session.user.user_metadata?.role || (session.user.email === 'admin@pixelvault.com' ? 'admin' : 'user');
          setIsAdmin(role === 'admin');
        } else {
          // Fallback check for local storage admin (demo mode)
          const localAdmin = JSON.parse(localStorage.getItem('pv_session') || 'null');
          if (localAdmin && localAdmin.role === 'admin') {
            setUser(localAdmin);
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const role = session.user.user_metadata?.role || (session.user.email === 'admin@pixelvault.com' ? 'admin' : 'user');
        setIsAdmin(role === 'admin');
      } else {
        // Don't wipe local admin session if it exists during unauth
        const localAdmin = JSON.parse(localStorage.getItem('pv_session') || 'null');
        if (localAdmin && localAdmin.role === 'admin') {
          setUser(localAdmin);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Sign up
  const signup = useCallback(async (email, password, displayName) => {
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      throw new Error('Password too short');
    }

    const role = email.toLowerCase() === 'admin@pixelvault.com' ? 'admin' : 'user';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName,
          role,
        }
      }
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success(`Welcome to PixelVault, ${displayName}!`);
    return data.user;
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    // Special case: Admin Demo Login bypass
    if (email === 'admin@pixelvault.com' && password === 'admin123') {
      const demoAdmin = {
        uid: 'admin_001',
        email: 'admin@pixelvault.com',
        displayName: 'PixelVault Admin',
        role: 'admin',
        user_metadata: { role: 'admin', displayName: 'PixelVault Admin' }
      };
      localStorage.setItem('pv_session', JSON.stringify(demoAdmin));
      setUser(demoAdmin);
      setIsAdmin(true);
      toast.success('Welcome back, Admin!');
      return demoAdmin;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success(`Welcome back, ${data.user?.user_metadata?.displayName || 'User'}!`);
    return data.user;
  }, []);

  // Logout
  const logout = useCallback(async () => {
    localStorage.removeItem('pv_session');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    }
    setUser(null);
    setIsAdmin(false);
    toast.success('Signed out successfully');
  }, []);

  // Password reset
  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Password reset link sent to your email!');
  }, []);

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
