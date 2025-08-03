import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllCoupons, toggleCouponStatus } from '../../../services/operations/couponAPI';
import { toast } from 'react-hot-toast';
import CouponDetailsModal from '../../../components/common/CouponDetailsModal';
import { FiTag, FiCalendar, FiUsers, FiDollarSign, FiClock, FiEye, FiSearch, FiX, FiShare2, FiCopy } from 'react-icons/fi';

export default function CouponList() {
  const { token } = useSelector((state) => state.auth);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState({});
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showShareMenu, setShowShareMenu] = useState(null);

  // Admin configurable share options
  const [enabledShareOptions] = useState([
    'copy',
    'native'
  ]);

  const generateCouponShareContent = (coupon) => {
    const websiteUrl = window.location.origin;
    const expiryDate = new Date(coupon.expiryDate).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `🎉 Special Discount Coupon! 🎉

💳 Coupon Code: ${coupon.code}
💰 Discount: ${coupon.discountType === 'percentage' 
      ? `${coupon.discountValue}% OFF` 
      : `₹${coupon.discountValue} OFF`}
🔗 Valid For: ${coupon.linkedTo === 'course' ? 'Individual Courses' : 'Bundle Courses'}
⏰ Valid Until: ${expiryDate}
${coupon.minimumOrderAmount > 0 ? `🛒 Minimum Order: ₹${coupon.minimumOrderAmount}` : ''}

🌐 Visit: ${websiteUrl}

Don't miss out on this amazing offer! 🚀`;
  };

  const handleShare = async (coupon, method) => {
    const shareContent = generateCouponShareContent(coupon);
    const websiteUrl = window.location.origin;

    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(shareContent);
          toast.success('Coupon details copied to clipboard!');
          break;

        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: `${coupon.code} - Special Discount Coupon`,
              text: shareContent,
              url: websiteUrl
            });
          } else {
            // If Web Share API is not supported, show all sharing options
            const shareData = {
              title: `${coupon.code} - Special Discount Coupon`,
              text: shareContent,
              url: websiteUrl
            };
            
            // Create a temporary element to trigger system share
            const shareButton = document.createElement('button');
            shareButton.addEventListener('click', async () => {
              try {
                await navigator.share(shareData);
              } catch (error) {
                if (error.name !== 'AbortError') {
                  // Fallback to clipboard if sharing fails
                  await navigator.clipboard.writeText(shareContent);
                  toast.success('Copied to clipboard (Sharing not supported)');
                }
              }
            });
            shareButton.click();
            shareButton.remove();
          }
          break;

        default:
          await navigator.clipboard.writeText(shareContent);
          toast.success('Copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing coupon:', error);
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(shareContent);
        toast.success('Coupon details copied to clipboard!');
      } catch (copyError) {
        toast.error('Failed to share coupon');
      }
    }
    setShowShareMenu(null);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showShareMenu && !event.target.closest('.share-menu-container')) {
        setShowShareMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await getAllCoupons(token);
      setCoupons(response);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (couponId) => {
    try {
      setToggleLoading(prev => ({ ...prev, [couponId]: true }));
      const updatedCoupon = await toggleCouponStatus(couponId, token);
      
      // Update the coupon in the local state
      setCoupons(prevCoupons => 
        prevCoupons.map(coupon => 
          coupon._id === couponId ? updatedCoupon : coupon
        )
      );
    } catch (error) {
      console.error('Error toggling coupon status:', error);
    } finally {
      setToggleLoading(prev => ({ ...prev, [couponId]: false }));
    }
  };

  const handleCouponClick = (coupon) => {
    setSelectedCoupon(coupon);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusInfo = (coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.startDate);
    const expiryDate = new Date(coupon.expiryDate);

    if (!coupon.isActive) {
      return { 
        status: 'Inactive', 
        color: 'text-red-700', 
        bgColor: 'bg-red-100', 
        borderColor: 'border-red-300',
        icon: '⏸️'
      };
    }
    
    if (now < startDate) {
      return { 
        status: 'Upcoming', 
        color: 'text-orange-700', 
        bgColor: 'bg-orange-100', 
        borderColor: 'border-orange-300',
        icon: '⏰'
      };
    }
    
    if (now > expiryDate) {
      return { 
        status: 'Expired', 
        color: 'text-red-700', 
        bgColor: 'bg-red-100', 
        borderColor: 'border-red-300',
        icon: '❌'
      };
    }
    
    return { 
      status: 'Active', 
      color: 'text-green-700', 
      bgColor: 'bg-green-100', 
      borderColor: 'border-green-300',
      icon: '✅'
    };
  };

  const getUsagePercentage = (coupon) => {
    if (coupon.usageLimit <= 0) return 0;
    return Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100);
  };

  // Filter coupons based on search term and status
  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = searchTerm === "" ||
      coupon.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && coupon.isActive) ||
      (statusFilter === "inactive" && !coupon.isActive) ||
      (statusFilter === "upcoming" && new Date(coupon.startDate) > new Date()) ||
      (statusFilter === "expired" && new Date(coupon.expiryDate) < new Date());
    
    return matchesSearch && matchesStatus;
  });

  const getShareOptionLabel = (option) => {
    const labels = {
      copy: 'Copy to Clipboard',
      native: 'Share via Apps'
    };
    return labels[option] || option;
  };

  const getShareOptionIcon = (option) => {
    const icons = {
      copy: <FiCopy className="text-xs" />,
      native: <FiShare2 className="text-xs" />
    };
    return icons[option] || <FiShare2 className="text-xs" />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="classic-card p-12 max-w-md mx-auto">
          <div className="w-20 h-20 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiTag className="text-4xl text-academic-gold-700" />
          </div>
          <h3 className="elegant-heading mb-3">No coupons created yet</h3>
          <p className="text-academic-slate-600">Click "Create Coupon" to add your first coupon and start offering discounts to your customers</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="classic-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-academic-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search coupons by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="classic-input pl-12 pr-12"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-academic-slate-400 hover:text-academic-slate-600 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="classic-input"
            >
              <option value="all">All Coupons</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="flex items-center gap-2 px-4 py-3 bg-academic-slate-100 text-academic-slate-700 rounded-lg hover:bg-academic-slate-200 transition-colors whitespace-nowrap font-medium"
            >
              <FiX className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid gap-6">
        {filteredCoupons.map((coupon) => {
          const statusInfo = getStatusInfo(coupon);
          const usagePercentage = getUsagePercentage(coupon);
          
          return (
            <div
              key={coupon._id}
              className="elegant-card p-6 hover:shadow-elegant transition-all duration-300"
            >
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4 sm:gap-0">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-academic-gold-100 rounded-lg flex items-center justify-center">
                      <FiTag className="text-academic-gold-700 text-xl" />
                    </div>
                    <h3 
                      className="text-2xl font-bold text-academic-navy-900 cursor-pointer hover:text-academic-navy-700 transition-colors flex items-center gap-2 group font-playfair"
                      onClick={() => handleCouponClick(coupon)}
                    >
                      {coupon.code}
                      <FiEye className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-academic-slate-500" />
                    </h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <span className={`px-4 py-2 text-sm rounded-full font-semibold border ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} flex items-center gap-2 w-fit`}>
                      <span>{statusInfo.icon}</span>
                      {statusInfo.status}
                    </span>
                    <span className="text-lg font-bold text-academic-gold-700 bg-academic-gold-100 px-4 py-2 rounded-full border border-academic-gold-300 w-fit">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% OFF` 
                        : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>

                  <p className="text-sm text-academic-slate-500 cursor-pointer hover:text-academic-slate-700 transition-colors" onClick={() => handleCouponClick(coupon)}>
                    💡 Click coupon code to view detailed information
                  </p>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-6 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-academic-slate-500 mb-2 font-medium">Usage Statistics</p>
                    <p className="text-xl font-bold text-academic-navy-900">
                      {coupon.usedCount}
                      {coupon.usageLimit > 0 && ` / ${coupon.usageLimit}`}
                    </p>
                    {coupon.usageLimit > 0 && (
                      <div className="w-24 bg-academic-slate-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-academic-navy-600 to-academic-gold-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${usagePercentage}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col items-center gap-4">
                    {/* Share Button */}
                    <div className="relative share-menu-container">
                      <button
                        onClick={() => setShowShareMenu(showShareMenu === coupon._id ? null : coupon._id)}
                        className="flex items-center gap-2 px-3 py-2 text-academic-navy-700 hover:text-academic-navy-900 hover:bg-academic-navy-50 rounded-lg transition-all duration-200 font-medium"
                        title="Share Coupon"
                      >
                        <FiShare2 className="text-lg" />
                        <span className="text-sm">Share</span>
                      </button>

                      {/* Share Menu */}
                      {showShareMenu === coupon._id && (
                        <div className="absolute right-0 top-full mt-2 bg-white border border-academic-slate-300 rounded-xl shadow-elegant z-50 min-w-[160px]">
                          <div className="py-2">
                            {enabledShareOptions.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleShare(coupon, option)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-academic-slate-700 hover:bg-academic-slate-50 hover:text-academic-navy-900 transition-colors text-left font-medium"
                              >
                                {getShareOptionIcon(option)}
                                {getShareOptionLabel(option)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex flex-col items-center gap-3">
                      <span className={`text-sm font-semibold ${coupon.isActive ? 'text-green-700' : 'text-red-700'}`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        disabled={toggleLoading[coupon._id]}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                          coupon.isActive
                            ? 'bg-green-600 focus:ring-green-500'
                            : 'bg-academic-slate-300 focus:ring-academic-slate-500'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            coupon.isActive ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      {toggleLoading[coupon._id] && (
                        <div className="w-4 h-4 border-2 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCalendar className="text-blue-600 text-lg" />
                    <p className="text-academic-slate-600 text-sm font-semibold">Valid From</p>
                  </div>
                  <p className="text-academic-navy-900 font-bold text-base">{formatDate(coupon.startDate)}</p>
                </div>

                <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="text-red-600 text-lg" />
                    <p className="text-academic-slate-600 text-sm font-semibold">Valid Until</p>
                  </div>
                  <p className="text-academic-navy-900 font-bold text-base">{formatDate(coupon.expiryDate)}</p>
                </div>

                <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FiDollarSign className="text-green-600 text-lg" />
                    <p className="text-academic-slate-600 text-sm font-semibold">Min. Order</p>
                  </div>
                  <p className="text-academic-navy-900 font-bold text-base">
                    {coupon.minimumOrderAmount > 0 ? `₹${coupon.minimumOrderAmount}` : 'No minimum'}
                  </p>
                </div>

                <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FiUsers className="text-purple-600 text-lg" />
                    <p className="text-academic-slate-600 text-sm font-semibold">Per User Limit</p>
                  </div>
                  <p className="text-academic-navy-900 font-bold text-base">
                    {coupon.perUserLimit > 0 ? `${coupon.perUserLimit} uses` : 'Unlimited'}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              {(coupon.usageLimit > 0 || coupon.perUserLimit > 0) && (
                <div className="pt-4 border-t border-academic-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    {coupon.usageLimit > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-academic-slate-600 font-medium">Total Usage Progress:</span>
                        <span className="text-academic-navy-900 font-bold">
                          {usagePercentage.toFixed(1)}% ({coupon.usedCount}/{coupon.usageLimit})
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-academic-slate-600 font-medium">Created:</span>
                      <span className="text-academic-navy-900 font-semibold">{formatDate(coupon.createdAt)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CouponDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        coupon={selectedCoupon}
      />
    </div>
  );
}
