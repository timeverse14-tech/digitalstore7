import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ isLoading }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loading-content">
            <h1 className="gradient-text glow-animation">PixelVault</h1>
            <div className="loading-bar">
              <div className="loading-bar-fill" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
