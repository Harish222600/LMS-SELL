import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { validateAndApplyCoupon, getAllCoupons } from '../../../../services/operations/couponAPI';
import { toast } from 'react-hot-toast';
import CouponSuccessModal from '../../../common/CouponSuccessModal';

export default function CouponInput({ totalAmount, onCouponApply, checkoutType = 'course' }) {
  const { token } = useSelector((state) => state.auth);
  const [couponCode, setCouponCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [pricePreview, setPricePreview] = useState(null);

  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        // Use null for token to force using the frontend endpoint, pass checkoutType as linkedTo
        const coupons = await getAllCoupons(null, checkoutType);
        
        // Additional safety check to ensure only coupons with matching linkedTo are shown
        const filteredCoupons = coupons.filter(coupon => coupon.linkedTo === checkoutType);
        
        setAvailableCoupons(filteredCoupons);
      } catch (error) {
        // Silently handle error - coupons will just not be displayed
      }
    };

    fetchAvailableCoupons();
  }, [checkoutType]);

  const handleCouponValidation = async (code) => {
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }

    // Check if user is authenticated
    if (!token) {
      toast.error('Please login to apply coupons');
      return;
    }

    setLoading(true);
    setPricePreview(null);
    
    try {
      // Use the new combined endpoint to validate and apply in one call
      const result = await validateAndApplyCoupon(
        {
          code,
          totalAmount,
          checkoutType
        },
        token
      );

      if (result.success) {
        // Store the applied coupon details
        setAppliedCoupon({
          code,
          discountAmount: result.data.discountAmount,
          finalAmount: result.data.finalAmount
        });
        
        // Call the parent component's callback with discount details
        onCouponApply(result.data);
        
        // Show success modal
        setShowSuccessModal(true);
        
        // Clear any price preview
        setPricePreview(null);
      }
    } catch (error) {
      // Handle authentication errors specifically
      if (error.message && error.message.includes('Token is Missing')) {
        toast.error('Please login to apply coupons');
      } else if (error.message && error.message.includes('Too many coupon attempts')) {
        toast.error('Too many attempts. Please wait before trying again.');
      } else if (error.message && error.message.includes('not applicable for this checkout type')) {
        toast.error('This coupon cannot be used for this type of purchase.');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Invalid coupon code. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleApplyCoupon = () => handleCouponValidation(couponCode);
  const handleApplyCouponWithCode = (code) => handleCouponValidation(code);

  const handleCancelCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setPricePreview(null);
    onCouponApply({ discountAmount: 0 });
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-6 border-2 border-academic-slate-200 rounded-xl bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 shadow-elegant">
        {/* Available Coupons Section - Above input field */}
        {availableCoupons.length > 0 && !appliedCoupon && (
          <div className="mb-4">
            <p className="text-sm text-academic-gold-300 font-semibold mb-4">Available Coupons:</p>
            <div className="flex flex-wrap gap-3">
              {availableCoupons.map((coupon) => (
                <button
                  key={coupon._id}
                  onClick={async () => {
                    setCouponCode(coupon.code);
                    // Apply coupon directly with the coupon code
                    await handleApplyCouponWithCode(coupon.code);
                  }}
                  className="px-4 py-3 text-sm bg-gradient-to-r from-academic-gold-600 to-academic-gold-700 
                    text-white rounded-lg hover:from-academic-gold-700 hover:to-academic-gold-800 
                    transition-all duration-200 flex items-center gap-3 group border border-academic-gold-500
                    hover:border-academic-gold-400 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col items-start">
                    <span className="text-white font-bold">{coupon.code}</span>
                    <span className="text-xs text-academic-gold-100 group-hover:text-white">
                      {coupon.discountType === 'percentage' 
                        ? `${coupon.discountValue}% off` 
                        : `₹${coupon.discountValue} off`}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-full border border-white/30">
                    Click to apply
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-lg font-semibold text-white">Have a coupon?</p>
          <div className="flex gap-4">
            <input
              type="text"
              value={appliedCoupon ? appliedCoupon.code : couponCode}
              onChange={(e) => !appliedCoupon && setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className={`classic-input flex-1 ${
                appliedCoupon ? 'bg-academic-slate-100 text-academic-slate-600' : ''
              }`}
              disabled={loading || appliedCoupon}
            />
            <button
              onClick={appliedCoupon ? handleCancelCoupon : handleApplyCoupon}
              disabled={loading}
              className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${
                appliedCoupon 
                  ? 'bg-academic-slate-600 text-white hover:bg-academic-slate-700 border border-academic-slate-500' 
                  : 'btn-elegant disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-academic-navy-900 border-t-transparent rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : appliedCoupon ? (
                'Cancel Coupon'
              ) : (
                'Apply'
              )}
            </button>
          </div>
        </div>

        {appliedCoupon && (
          <div className="flex items-center gap-3 text-sm bg-green-100 text-green-800 p-3 rounded-lg border border-green-200">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-semibold">Coupon applied successfully!</span>
            </span>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <CouponSuccessModal 
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        discountAmount={appliedCoupon?.discountAmount || 0}
      />
    </>
  );
}
