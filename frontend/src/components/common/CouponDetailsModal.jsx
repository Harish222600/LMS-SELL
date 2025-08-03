import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTag, FiCalendar, FiUsers, FiPercent, FiDollarSign, FiClock, FiShoppingCart, FiShare2 } from 'react-icons/fi';

const CouponDetailsModal = ({ isOpen, onClose, coupon }) => {
  if (!coupon) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = () => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const expiryDate = new Date(coupon.expiryDate);

    if (!coupon.isActive) {
      return { status: 'Inactive', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300' };
    }
    
    if (now < startDate) {
      return { status: 'Upcoming', color: 'text-academic-gold-700', bgColor: 'bg-academic-gold-50', borderColor: 'border-academic-gold-300' };
    }
    
    if (now > expiryDate) {
      return { status: 'Expired', color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-300' };
    }
    
    return { status: 'Active', color: 'text-green-700', bgColor: 'bg-green-50', borderColor: 'border-green-300' };
  };

  const statusInfo = getStatusInfo();

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
            className="relative classic-card p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-academic-gold-100 rounded-full flex items-center justify-center">
                  <FiTag className="text-academic-gold-600 text-xl" />
                </div>
                <h2 className="classic-heading text-2xl text-academic-navy-900">Coupon Details</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    // Small delay to prevent modal overlap
                    setTimeout(() => {
                      if (typeof window !== 'undefined') {
                        // Create and dispatch a custom event
                        const event = new CustomEvent('shareCoupon', { detail: coupon });
                        window.dispatchEvent(event);
                      }
                    }, 100);
                  }}
                  className="text-academic-slate-500 hover:text-academic-gold-600 transition-colors p-3 hover:bg-academic-slate-100 rounded-lg group"
                  title="Share Coupon"
                >
                  <FiShare2 size={20} className="group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={onClose}
                  className="text-academic-slate-500 hover:text-academic-slate-700 transition-colors p-3 hover:bg-academic-slate-100 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Coupon Code and Status */}
            <div className={`p-8 rounded-xl border-2 ${statusInfo.borderColor} ${statusInfo.bgColor} mb-8 shadow-elegant`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-4xl font-bold text-academic-navy-900 mb-3">{coupon.code}</h3>
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-2 text-sm rounded-full font-bold ${statusInfo.bgColor} ${statusInfo.color} border-2 ${statusInfo.borderColor}`}>
                      {statusInfo.status}
                    </span>
                    <span className="text-xl font-bold text-academic-gold-700">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% OFF` 
                        : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>
                </div>
                <div className="text-right bg-white/50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-academic-slate-600">Usage</p>
                  <p className="text-2xl font-bold text-academic-navy-900">
                    {coupon.usedCount}
                    {coupon.usageLimit > 0 && ` / ${coupon.usageLimit}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Discount Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    {coupon.discountType === 'percentage' ? (
                      <FiPercent className="text-green-600" />
                    ) : (
                      <FiDollarSign className="text-green-600" />
                    )}
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Discount Type</h4>
                </div>
                <p className="text-academic-slate-600 capitalize mb-2">{coupon.discountType}</p>
                <p className="text-2xl font-bold text-green-600">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}%` 
                    : `₹${coupon.discountValue}`}
                </p>
              </div>

              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiShoppingCart className="text-blue-600" />
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Minimum Order</h4>
                </div>
                <p className="text-academic-slate-600 mb-2">Required amount</p>
                <p className="text-2xl font-bold text-blue-600">
                  {coupon.minimumOrderAmount > 0 ? `₹${coupon.minimumOrderAmount}` : 'No minimum'}
                </p>
              </div>
            </div>

            {/* Date Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-academic-gold-100 rounded-full flex items-center justify-center">
                    <FiCalendar className="text-academic-gold-600" />
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Valid From</h4>
                </div>
                <p className="text-academic-slate-700 font-medium">{formatDate(coupon.startDate)}</p>
              </div>

              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <FiClock className="text-red-600" />
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Valid Until</h4>
                </div>
                <p className="text-academic-slate-700 font-medium">{formatDate(coupon.expiryDate)}</p>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiUsers className="text-purple-600" />
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Total Usage Limit</h4>
                </div>
                <p className="text-academic-slate-700 mb-4">
                  {coupon.usageLimit > 0 ? `${coupon.usageLimit} uses` : 'Unlimited'}
                </p>
                <div>
                  <div className="flex justify-between text-sm text-academic-slate-600 mb-2">
                    <span>Used</span>
                    <span>{coupon.usedCount} / {coupon.usageLimit > 0 ? coupon.usageLimit : '∞'}</span>
                  </div>
                  {coupon.usageLimit > 0 && (
                    <div className="w-full bg-academic-slate-200 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <FiUsers className="text-orange-600" />
                  </div>
                  <h4 className="elegant-heading text-lg text-academic-navy-900">Per User Limit</h4>
                </div>
                <p className="text-academic-slate-700">
                  {coupon.perUserLimit > 0 ? `${coupon.perUserLimit} uses per user` : 'Unlimited per user'}
                </p>
              </div>
            </div>

            {/* User Usage Details */}
            {coupon.userUsage && coupon.userUsage.length > 0 && (
              <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200 mb-8">
                <h4 className="elegant-heading text-lg text-academic-navy-900 mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                    <FiUsers className="text-cyan-600" />
                  </div>
                  User Usage History ({coupon.userUsage.length} users)
                </h4>
                <div className="max-h-40 overflow-y-auto bg-white rounded-lg p-4">
                  {coupon.userUsage.slice(0, 5).map((usage, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-academic-slate-100 last:border-b-0">
                      <span className="text-academic-slate-700 font-medium">User ID: {usage.user}</span>
                      <span className="text-academic-slate-600 font-semibold">{usage.usedCount} uses</span>
                    </div>
                  ))}
                  {coupon.userUsage.length > 5 && (
                    <p className="text-sm text-academic-slate-500 mt-3 text-center">
                      ... and {coupon.userUsage.length - 5} more users
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200 mb-8">
              <h4 className="elegant-heading text-lg text-academic-navy-900 mb-4">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-medium text-academic-slate-600 mb-1">Created</p>
                  <p className="text-academic-slate-800 font-semibold">{formatDate(coupon.createdAt)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-sm font-medium text-academic-slate-600 mb-1">Last Updated</p>
                  <p className="text-academic-slate-800 font-semibold">{formatDate(coupon.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="btn-classic-secondary px-8 py-3"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponDetailsModal;
