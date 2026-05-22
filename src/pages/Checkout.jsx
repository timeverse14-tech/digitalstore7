import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCopy, FiCheck, FiUploadCloud, FiShield, FiX, FiImage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { formatPrice, generateUPIUrl, generateOrderId } from '../utils/helpers';
import toast from 'react-hot-toast';
import { supabase } from '../config/supabase';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const screenshotInputRef = useRef(null);

  const [orderId, setOrderId] = useState('');
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [copied, setCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Screenshot state
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const upiId = '8650285066@ptsbi';

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          toast.error('Payment session expired');
          navigate('/cart');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cartItems, cartTotal, navigate]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle screenshot file selection
  const handleScreenshotSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }

    setScreenshotFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
    toast.success(`Screenshot "${file.name}" uploaded!`);
  };

  // Remove screenshot
  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview('');
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = '';
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!screenshotFile) {
      toast.error('Please upload your payment screenshot');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload screenshot to Supabase Storage
      const fileName = `${Date.now()}_${screenshotFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(fileName, screenshotFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(fileName);

      const screenshotUrl = publicUrlData.publicUrl;

      // 2. Create the order
      const orderData = {
        id: orderId,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: cartTotal,
        transactionId: transactionId || 'Pending Verification',
        userId: user?.uid || 'guest',
        customer: {
          name: user?.displayName || 'Guest',
          email: user?.email || 'guest@pixelvault.com',
          avatar: (user?.displayName || 'G')[0].toUpperCase(),
        },
        paymentScreenshot: screenshotUrl, // Now a valid URL instead of a giant base64 string
        screenshotName: screenshotFile.name,
        status: 'Pending',
        paymentMethod: 'UPI',
        date: new Date().toISOString().split('T')[0],
        products: cartItems.map(item => ({ title: item.title, price: item.price })),
        amount: cartTotal,
        address: 'India',
      };

      await createOrder(orderData);
      clearCart();
      toast.success('Payment submitted for verification!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ paddingTop: '100px', paddingBottom: 'var(--space-16)', minHeight: '100vh' }}
    >
      <div className="container">
        <h1 className="heading-2" style={{ marginBottom: '2rem' }}>Secure Checkout</h1>

        <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
          
          {/* Left: Order Summary */}
          <div>
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h3 className="heading-5" style={{ marginBottom: '1rem' }}>Order Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <img src={item.thumbnail} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 'var(--text-sm)', margin: '0 0 4px 0' }}>{item.title}</h4>
                      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: 'var(--space-6) 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>Total Amount to Pay</span>
                <span className="heading-3 gradient-text" style={{ margin: 0 }}>{formatPrice(cartTotal)}</span>
              </div>
            </div>

            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)' }}>
              <h3 className="heading-6" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiShield color="var(--color-success)" /> Buyer Protection
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
                Your payment is secure. We manually verify all payments within 1-2 hours. Once verified, you'll receive instant download access to your digital products.
              </p>
            </div>
          </div>

          {/* Right: Payment Section */}
          <div>
            <div className="glass" style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', position: 'relative', overflow: 'hidden' }}>
              
              {/* Progress Bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, height: '4px', background: 'var(--color-bg-tertiary)', width: '100%' }}>
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / (15 * 60)) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, var(--color-purple), var(--color-cyan))' }}
                />
              </div>

              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', marginTop: 'var(--space-2)' }}>
                <h2 className="heading-4" style={{ margin: 0 }}>UPI Payment</h2>
                <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Scan QR code with any UPI app</p>
                <div style={{ display: 'inline-block', background: 'rgba(236,72,153,0.1)', color: 'var(--color-pink)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 'bold', marginTop: 'var(--space-2)' }}>
                  Time remaining: {formatTime(timeLeft)}
                </div>
              </div>

              {!showUpload ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  {/* QR Code */}
                  <div style={{ 
                    background: '#ffffff', padding: '12px', 
                    borderRadius: 'var(--radius-lg)', 
                    border: '2px solid var(--color-purple)',
                    boxShadow: '0 0 30px rgba(168,85,247,0.3)',
                    marginBottom: 'var(--space-6)'
                  }}>
                    <img src="/payment-qr.jpg" alt="UPI Payment QR Code" style={{ display: 'block', width: '250px', height: 'auto', borderRadius: '8px' }} />
                  </div>

                  {/* UPI ID Copy */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '12px 20px', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>UPI ID:</span>
                    <span style={{ fontWeight: 'bold' }}>{upiId}</span>
                    <button 
                      onClick={handleCopyUPI}
                      style={{ background: 'none', border: 'none', color: copied ? 'var(--color-success)' : 'var(--color-cyan)', cursor: 'pointer', display: 'flex' }}
                    >
                      {copied ? <FiCheck /> : <FiCopy />}
                    </button>
                  </div>

                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: '1rem' }}>
                    After successful payment, click the button below to upload your screenshot.
                  </p>

                  <button 
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={() => setShowUpload(true)}
                  >
                    I've Made the Payment
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem' }}>
                      <FiUploadCloud />
                    </div>
                    <h3 className="heading-5">Verify Payment</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Upload a screenshot of your successful transaction.</p>
                  </div>

                  <form onSubmit={handleSubmitPayment} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    
                    {/* Screenshot Upload */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        Payment Screenshot *
                      </label>
                      
                      {/* Hidden file input */}
                      <input
                        ref={screenshotInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotSelect}
                        style={{ display: 'none' }}
                      />

                      {screenshotPreview ? (
                        <div style={{
                          border: '2px solid rgba(34,197,94,0.3)',
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          background: 'rgba(34,197,94,0.05)',
                        }}>
                          <img 
                            src={screenshotPreview} 
                            alt="Payment Screenshot" 
                            style={{ 
                              width: '100%', maxHeight: '200px', objectFit: 'contain', 
                              borderRadius: '8px', display: 'block',
                            }} 
                          />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <FiCheck style={{ color: 'var(--color-success)' }} />
                              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', fontWeight: 600 }}>
                                {screenshotFile?.name}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                onClick={() => screenshotInputRef.current?.click()}
                                style={{
                                  background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                                  borderRadius: '6px', color: 'var(--color-purple)',
                                  fontSize: '0.72rem', padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
                                }}
                              >
                                Change
                              </button>
                              <button
                                type="button"
                                onClick={handleRemoveScreenshot}
                                style={{
                                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                  borderRadius: '6px', color: '#ef4444',
                                  fontSize: '0.72rem', padding: '4px 10px', cursor: 'pointer', fontWeight: 600,
                                  display: 'flex', alignItems: 'center', gap: '4px',
                                }}
                              >
                                <FiX size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => screenshotInputRef.current?.click()}
                          style={{ 
                            border: '2px dashed rgba(139,92,246,0.25)', 
                            borderRadius: 'var(--radius-md)', 
                            padding: '2rem', 
                            textAlign: 'center', 
                            cursor: 'pointer', 
                            background: 'rgba(139,92,246,0.03)',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'var(--color-purple)';
                            e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(139,92,246,0.25)';
                            e.currentTarget.style.background = 'rgba(139,92,246,0.03)';
                          }}
                        >
                          <FiImage style={{ fontSize: '2.5rem', color: 'var(--color-purple)', marginBottom: '8px' }} />
                          <p style={{ margin: '0 0 4px 0', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                            Click to upload screenshot
                          </p>
                          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>UPI Transaction ID (Optional)</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. 301234567890" 
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        style={{ flex: 1 }}
                        onClick={() => setShowUpload(false)}
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary" 
                        style={{ flex: 2, opacity: (!screenshotFile || isSubmitting) ? 0.6 : 1 }}
                        disabled={isSubmitting || !screenshotFile}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .grid-2 > div { grid-column: span 2 !important; }
        }
      `}</style>
    </motion.div>
  );
};

export default Checkout;
