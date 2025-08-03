import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import CouponInput from "../components/core/Dashboard/Cart/CouponInput"
import { useDispatch } from "react-redux"
import { FiArrowLeft, FiShoppingCart, FiCheck, FiStar, FiUsers, FiShield } from "react-icons/fi"
import RatingStars from "../components/common/RatingStars"
import toast from "react-hot-toast"

function CourseCheckout() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const handleCouponApply = (discountDetails) => {
    const discountAmount = discountDetails.discountAmount;
    setCouponDiscount(discountAmount);
    setAppliedCoupon(discountDetails);
  }

  const course = state?.course

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="text-center classic-card p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="w-10 h-10 text-academic-slate-400" />
          </div>
          <h2 className="classic-heading mb-3">No Course Selected</h2>
          <p className="text-academic-slate-600 mb-8">Please select a course to checkout</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-elegant"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const getOriginalPrice = () => {
    return course.courseType === 'Free' ? 0 : course.price
  }

  const getFinalPrice = () => {
    return Math.max(0, getOriginalPrice() - couponDiscount)
  }

  const handleBuyCourse = () => {
    const finalPrice = getFinalPrice()
    
    // Check if total amount is not zero - prevent purchase and show message
    if (finalPrice !== 0 && finalPrice !== null) {
      toast.error("You have to pay first")
      return
    }
    
    const coursesId = [course._id]
    
    // Only proceed if total amount is 0 or null
    buyCourse(token, coursesId, user, navigate, dispatch, appliedCoupon)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-academic-slate-600 hover:text-academic-navy-700 mb-6 transition-colors font-medium"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Course Details
          </button>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-academic-gold-100 rounded-2xl flex items-center justify-center">
                <FiShoppingCart className="text-academic-gold-700 text-2xl" />
              </div>
            </div>
            <h1 className="classic-heading text-4xl md:text-5xl mb-3">Course Checkout</h1>
            <p className="section-subtitle text-xl">
              Complete your purchase and start your learning journey
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="classic-card p-8"
            >
              <h2 className="elegant-heading mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="text-green-700 w-5 h-5" />
                </div>
                Course Details
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6 bg-academic-cream-50 p-6 rounded-xl border border-academic-cream-200">
                <div className="flex-shrink-0">
                  <img 
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="w-full md:w-48 h-32 rounded-xl object-cover shadow-classic"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-academic-navy-900 mb-3 font-playfair line-clamp-2">
                    {course.courseName}
                  </h3>
                  <p className="text-academic-slate-600 mb-4 font-medium">
                    By {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  
                  {/* Course Stats */}
                  <div className="flex flex-wrap items-center gap-6 mb-6 text-sm">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-academic-slate-200">
                      <FiStar className="text-academic-gold-600 w-4 h-4" />
                      <span className="font-semibold text-academic-slate-700">{course.averageRating?.toFixed(1) || '0.0'}</span>
                      <RatingStars Review_Count={course.averageRating || 0} Star_Size={14} />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-academic-slate-200">
                      <FiUsers className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-academic-slate-700">{course.studentsEnrolled?.length || 0} students</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {course.courseType === 'Free' ? (
                        <span className="text-3xl font-bold text-green-700 font-playfair">Free</span>
                      ) : (
                        <span className="text-3xl font-bold text-academic-navy-900 font-playfair">₹{course.price}</span>
                      )}
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        course.courseType === 'Free' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-200'
                      }`}>
                        {course.courseType || 'Premium'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Summary */}
          <div className="xl:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="classic-card p-8 sticky top-8"
            >
              <h2 className="elegant-heading mb-6">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {/* Coupon Input - Only show for paid courses */}
                {course.courseType !== 'Free' && (
                  <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                    <CouponInput 
                      totalAmount={getOriginalPrice()} 
                      onCouponApply={handleCouponApply}
                      checkoutType="course"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between text-academic-slate-600">
                    <span className="font-medium">Course:</span>
                    <span className="font-semibold text-academic-navy-900 text-right max-w-48 truncate">{course.courseName}</span>
                  </div>
                  
                  <div className="flex justify-between text-academic-slate-600">
                    <span className="font-medium">Original Price:</span>
                    <span className="font-bold text-academic-navy-900">₹{getOriginalPrice()}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <span className="font-medium">Coupon Discount:</span>
                      <span className="font-bold">-₹{couponDiscount}</span>
                    </div>
                  )}
                  
                  <hr className="border-academic-slate-200" />
                  
                  <div className="flex justify-between text-xl font-bold bg-academic-navy-50 px-4 py-3 rounded-xl border border-academic-navy-200">
                    <span className="text-academic-navy-900">Total Amount:</span>
                    <span className="text-academic-gold-700 font-playfair">₹{getFinalPrice()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBuyCourse}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-elegant hover:shadow-lg flex items-center justify-center gap-3 bg-gradient-to-r from-academic-gold-600 to-academic-gold-700 hover:from-academic-gold-700 hover:to-academic-gold-800 text-white"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {getFinalPrice() === 0 ? 'Enroll for Free' : 'Complete Purchase'}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="btn-classic-secondary w-full"
                >
                  Back to Course
                </button>
              </div>

              {/* Security/Info Badge */}
              <div className="mt-8 p-4 bg-academic-slate-50 rounded-xl border border-academic-slate-200">
                <div className="flex items-center gap-3 text-academic-slate-700 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiShield className="text-green-700 w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Secure Payment</p>
                    <p className="text-xs text-academic-slate-500">Powered by Razorpay</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCheckout
