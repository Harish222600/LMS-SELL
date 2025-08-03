import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import IconBtn from "../../../common/IconBtn"
import CouponInput from "./CouponInput"
import { FiCreditCard, FiShield, FiZap, FiGift, FiShoppingCart } from "react-icons/fi"
import { buyCourse } from "../../../../services/operations/studentFeaturesAPI"

export default function RenderTotalAmount() {
  const { total, cart } = useSelector((state) => state.cart)
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)

  const finalAmount = total - discountAmount

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData)
    setDiscountAmount(couponData.discountAmount)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setDiscountAmount(0)
  }

  const handleBuyCourse = async () => {
    // Check if total amount is not zero - prevent purchase and show message
    if (finalAmount !== 0 && finalAmount !== null) {
      toast.error("You have to pay first")
      return
    }
    
    const courses = cart.map((course) => course._id)
    await buyCourse(token, courses, user, navigate, dispatch)
  }

  const savings = Math.round(total * 0.3)
  const originalPrice = total + savings

  return (
    <div className="classic-card p-6 bg-white border-2 border-academic-slate-200 sticky top-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-academic-slate-200">
        <div className="w-10 h-10 bg-academic-gold-100 rounded-xl flex items-center justify-center">
          <FiShoppingCart className="w-5 h-5 text-academic-gold-700" />
        </div>
        <h3 className="elegant-heading text-academic-navy-900">Order Summary</h3>
      </div>

      {/* Subtotal */}
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-academic-slate-600">Subtotal:</p>
          <p className="text-lg font-semibold text-academic-navy-900">₹ {total}</p>
        </div>
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FiGift className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-green-800">Coupon Applied</p>
              </div>
              <p className="text-sm font-bold text-green-700">
                {appliedCoupon.discountType === 'percentage' 
                  ? `${appliedCoupon.discountValue}% OFF` 
                  : `₹${appliedCoupon.discountValue} OFF`}
              </p>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Remove
            </button>
          </div>
          <p className="text-sm text-green-600 mt-2 font-medium">
            Discount: -₹{discountAmount}
          </p>
        </div>
      )}

      {/* Coupon Input */}
      {!appliedCoupon && (
        <div className="mb-6">
          <CouponInput totalAmount={total} onCouponApply={handleCouponApply} />
        </div>
      )}

      {/* Total */}
      <div className="mb-6 p-4 bg-academic-navy-50 rounded-xl border border-academic-navy-200">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-academic-navy-900">Total Amount:</p>
          <p className="text-2xl font-bold text-academic-gold-700 font-playfair">₹ {finalAmount}</p>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={handleBuyCourse}
        className="w-full btn-elegant flex items-center justify-center gap-3 py-4 text-lg font-semibold"
      >
        <FiCreditCard className="w-5 h-5" />
        {finalAmount === 0 ? 'Enroll for Free' : 'Buy Now'}
      </button>

      {/* Security Badge */}
      <div className="mt-4 p-3 bg-academic-slate-50 rounded-lg border border-academic-slate-200">
        <div className="flex items-center gap-3 text-academic-slate-700">
          <FiShield className="w-4 h-4 text-green-600" />
          <div className="text-sm">
            <p className="font-semibold">Secure Payment</p>
            <p className="text-xs text-academic-slate-500">SSL encrypted & protected</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-academic-slate-600">
          <FiZap className="w-4 h-4 text-academic-gold-600" />
          <span>Instant access after purchase</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-academic-slate-600">
          <FiShield className="w-4 h-4 text-green-600" />
          <span>30-day money-back guarantee</span>
        </div>
      </div>
    </div>
  )
}
