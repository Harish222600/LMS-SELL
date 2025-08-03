import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiShare2, FiCopy, FiMail, FiMessageCircle, FiCheck } from 'react-icons/fi';
import { FaWhatsapp, FaTwitter, FaFacebook, FaTelegram } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const CouponShareModal = ({ isOpen, onClose, coupon }) => {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const generateShareText = () => {
    const discountText = coupon.discountType === 'percentage' 
      ? `${coupon.discountValue}% OFF` 
      : `₹${coupon.discountValue} OFF`;
    
    const minOrderText = coupon.minimumOrderAmount > 0 
      ? ` (Min order: ₹${coupon.minimumOrderAmount})` 
      : '';

    return `🎉 Exclusive Coupon Alert! 🎉\n\nUse code: ${coupon.code}\nGet ${discountText}${minOrderText}\n\nValid until: ${new Date(coupon.expiryDate).toLocaleDateString('en-IN')}\n\nDon't miss out on this amazing deal! 🛒✨`;
  };

  const generateShareUrl = () => {
    // You can customize this URL to point to your checkout page with the coupon pre-applied
    const baseUrl = window.location.origin;
    return `${baseUrl}/courses?coupon=${coupon.code}`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success('Coupon code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy coupon code');
    }
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      toast.success('Share text copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy share text');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generateShareUrl());
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy share link');
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="text-green-600" />,
      action: () => {
        const text = encodeURIComponent(generateShareText());
        window.open(`https://wa.me/?text=${text}`, '_blank');
      },
      bgColor: 'hover:bg-green-50',
      borderColor: 'hover:border-green-300'
    },
    {
      name: 'Telegram',
      icon: <FaTelegram className="text-blue-500" />,
      action: () => {
        const text = encodeURIComponent(generateShareText());
        window.open(`https://t.me/share/url?text=${text}`, '_blank');
      },
      bgColor: 'hover:bg-blue-50',
      borderColor: 'hover:border-blue-300'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="text-blue-400" />,
      action: () => {
        const text = encodeURIComponent(generateShareText());
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
      },
      bgColor: 'hover:bg-blue-50',
      borderColor: 'hover:border-blue-300'
    },
    {
      name: 'Facebook',
      icon: <FaFacebook className="text-blue-600" />,
      action: () => {
        const url = encodeURIComponent(generateShareUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      },
      bgColor: 'hover:bg-blue-50',
      borderColor: 'hover:border-blue-300'
    },
    {
      name: 'Email',
      icon: <FiMail className="text-academic-gold-600" />,
      action: () => {
        const subject = encodeURIComponent(`Exclusive Coupon: ${coupon.code}`);
        const body = encodeURIComponent(generateShareText());
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
      },
      bgColor: 'hover:bg-academic-gold-50',
      borderColor: 'hover:border-academic-gold-300'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative classic-card p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-academic-gold-100 rounded-full flex items-center justify-center">
                  <FiShare2 className="text-academic-gold-600 text-xl" />
                </div>
                <h2 className="classic-heading text-2xl text-academic-navy-900">Share Coupon</h2>
              </div>
              <button
                onClick={onClose}
                className="text-academic-slate-500 hover:text-academic-slate-700 transition-colors p-3 hover:bg-academic-slate-100 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Coupon Info */}
            <div className="bg-gradient-to-r from-academic-gold-50 to-academic-gold-100 border-2 border-academic-gold-300 rounded-xl p-6 mb-8 shadow-elegant">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-academic-navy-900 mb-3">{coupon.code}</h3>
                <p className="text-xl font-bold text-academic-gold-700 mb-2">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% OFF` 
                    : `₹${coupon.discountValue} OFF`}
                </p>
                {coupon.minimumOrderAmount > 0 && (
                  <p className="text-sm text-academic-slate-700 mb-2">
                    Min order: ₹{coupon.minimumOrderAmount}
                  </p>
                )}
                <p className="text-sm text-academic-slate-600">
                  Valid until: {new Date(coupon.expiryDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 mb-8">
              <button
                onClick={handleCopyCode}
                className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg font-semibold transition-all duration-300 ${
                  copied 
                    ? 'bg-green-100 border-2 border-green-300 text-green-700'
                    : 'bg-academic-slate-50 hover:bg-academic-slate-100 border-2 border-academic-slate-200 hover:border-academic-slate-300 text-academic-navy-900'
                }`}
              >
                {copied ? <FiCheck className="text-green-600" /> : <FiCopy className="text-academic-slate-600" />}
                <span className="font-medium">
                  {copied ? 'Copied!' : 'Copy Coupon Code'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCopyShareText}
                  className="flex items-center justify-center gap-2 p-4 bg-academic-slate-50 hover:bg-academic-slate-100 border-2 border-academic-slate-200 hover:border-academic-slate-300 rounded-lg transition-all duration-300"
                >
                  <FiCopy className="text-academic-slate-600" />
                  <span className="text-academic-navy-900 font-medium">Copy Text</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 p-4 bg-academic-slate-50 hover:bg-academic-slate-100 border-2 border-academic-slate-200 hover:border-academic-slate-300 rounded-lg transition-all duration-300"
                >
                  <FiCopy className="text-academic-slate-600" />
                  <span className="text-academic-navy-900 font-medium">Copy Link</span>
                </button>
              </div>
            </div>

            {/* Share Options */}
            <div>
              <h4 className="elegant-heading text-lg text-academic-navy-900 mb-4">Share via:</h4>
              <div className="grid grid-cols-3 gap-4">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={`flex flex-col items-center gap-3 p-4 bg-white border-2 border-academic-slate-200 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md ${option.bgColor} ${option.borderColor} transform hover:scale-105`}
                  >
                    <div className="text-2xl">{option.icon}</div>
                    <span className="text-sm text-academic-slate-700 font-medium">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-academic-slate-200">
              <p className="text-sm text-academic-slate-600 text-center">
                Share this coupon to help others save money! 💰
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponShareModal;
