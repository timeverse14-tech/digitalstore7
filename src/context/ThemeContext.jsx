import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pixelvault-theme';
const VALID_THEMES = ['dark', 'light'];

const ThemeContext = createContext(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Load theme from localStorage with validation
function loadThemeFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored)) {
      return stored;
    }
  } catch (error) {
    console.error('[PixelVault Theme] Error reading theme from localStorage:', error);
  }
  return 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => loadThemeFromStorage());

  // Apply the data-theme attribute to the root element and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error('[PixelVault Theme] Error saving theme to localStorage:', error);
    }
  }, [theme]);

  // Toggle between dark and light themes
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
