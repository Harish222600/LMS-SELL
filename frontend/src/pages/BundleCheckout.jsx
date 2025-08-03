import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import CouponInput from "../components/core/Dashboard/Cart/CouponInput"
import { useDispatch } from "react-redux"
import { FiArrowLeft, FiShoppingCart, FiCheck, FiStar, FiClock, FiUsers, FiShield, FiGift } from "react-icons/fi"
import RatingStars from "../components/common/RatingStars"
import { apiConnector } from "../services/apiConnector"
import { courseAccessEndpoints } from "../services/apis"
import toast from "react-hot-toast"

function BundleCheckout() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [couponDiscount, setCouponDiscount] = useState(0)

  const handleCouponApply = (discountDetails) => {
    const discountAmount = discountDetails.discountAmount;
    setCouponDiscount(discountAmount);
  }

  const selectedCourses = state?.selectedCourses || []

  if (!selectedCourses.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="text-center classic-card p-12 max-w-md mx-4">
          <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiShoppingCart className="w-10 h-10 text-academic-slate-400" />
          </div>
          <h2 className="classic-heading mb-3">No Courses Selected</h2>
          <p className="text-academic-slate-600 mb-8">Please select courses to create a bundle</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-elegant"
          >
            Go Back to Catalog
          </button>
        </div>
      </div>
    )
  }

  const getOriginalPrice = () => {
    return selectedCourses.reduce((total, course) => {
      return total + (course.courseType === 'Free' ? 0 : course.price)
    }, 0)
  }

  const getBundleDiscount = () => {
    if (selectedCourses.length >= 3) return 0.15 // 15% discount for 3+ courses
    if (selectedCourses.length >= 2) return 0.10 // 10% discount for 2+ courses
    return 0
  }

  const getFinalPrice = () => {
    const originalPrice = getOriginalPrice()
    const discount = getBundleDiscount()
    return Math.round(originalPrice * (1 - discount))
  }

  const getSavings = () => {
    return getOriginalPrice() - getFinalPrice()
  }

  const isAllFree = selectedCourses.every(course => course.courseType === 'Free')
  const freeCourses = selectedCourses.filter(course => course.courseType === 'Free')
  const paidCourses = selectedCourses.filter(course => course.courseType !== 'Free')

  const handleBuyBundle = async () => {
    const finalPrice = Math.max(0, getFinalPrice() - couponDiscount)
    const courseIds = selectedCourses.map(course => course._id)
    const paidCourseIds = paidCourses.map(course => course._id)
    const freeCourseIds = freeCourses.map(course => course._id)
    
    if (isAllFree) {
      // Scenario 1: All courses are free - request access from admin
      try {
        const response = await apiConnector("POST", 
          courseAccessEndpoints.REQUEST_BUNDLE_ACCESS_API,
          { 
            courseIds: freeCourseIds
          },
          { Authorization: `Bearer ${token}` }
        )
        if (response.data.success) {
          toast.success("Bundle access request sent successfully!")
          navigate('/dashboard/enrolled-courses')
        }
      } catch (error) {
        console.error("Error requesting bundle access:", error)
        toast.error("Failed to send bundle access request")
      }
    } else if (paidCourses.length > 0 && freeCourses.length === 0) {
      // Scenario 2: All courses are paid - check payment requirement
      if (finalPrice !== 0 && finalPrice !== null) {
        toast.error("You have to pay first")
        return
      }
      // Proceed with payment for all paid courses
      buyCourse(token, paidCourseIds, user, navigate, dispatch)
    } else if (paidCourses.length > 0 && freeCourses.length > 0) {
      // Scenario 3: Mixed bundle (paid + free courses)
      if (finalPrice !== 0 && finalPrice !== null) {
        toast.error("You have to pay first")
        return
      }
      
      // First, process payment for paid courses
      try {
        const paymentResult = await buyCourse(token, paidCourseIds, user, navigate, dispatch)
        
        // After successful payment, request access for free courses
        if (paymentResult !== false) { // Assuming buyCourse returns false on failure
          try {
            const response = await apiConnector("POST", 
              courseAccessEndpoints.REQUEST_BUNDLE_ACCESS_API,
              { 
                courseIds: freeCourseIds
              },
              { Authorization: `Bearer ${token}` }
            )
            if (response.data.success) {
              toast.success("Payment completed! Free course access request sent to admin.")
            }
          } catch (error) {
            console.error("Error requesting free course access:", error)
            toast.error("Payment successful, but failed to request free course access")
          }
        }
      } catch (error) {
        console.error("Error processing payment:", error)
        toast.error("Failed to process payment")
      }
    }
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
            <span className="hidden sm:inline">Back to Course Selection</span>
            <span className="sm:hidden">Back</span>
          </button>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-academic-gold-100 rounded-2xl flex items-center justify-center">
                <FiShoppingCart className="text-academic-gold-700 text-2xl" />
              </div>
            </div>
            <h1 className="classic-heading text-4xl md:text-5xl mb-3">Bundle Checkout</h1>
            <p className="section-subtitle text-xl">
              Complete your purchase and start your learning journey with {selectedCourses.length} courses
            </p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course List */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="classic-card p-8"
            >
              <h2 className="elegant-heading mb-6 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiCheck className="text-green-700 w-5 h-5" />
                </div>
                <span className="hidden sm:inline">Selected Courses ({selectedCourses.length})</span>
                <span className="sm:hidden">Courses ({selectedCourses.length})</span>
              </h2>
              
              <div className="space-y-6">
                {selectedCourses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col md:flex-row gap-6 bg-academic-cream-50 p-6 rounded-xl border border-academic-cream-200 hover:border-academic-gold-300 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="w-full md:w-40 h-32 md:h-28 rounded-xl object-cover shadow-classic"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-academic-navy-900 mb-2 font-playfair line-clamp-2">
                        {course.courseName}
                      </h3>
                      <p className="text-academic-slate-600 mb-4 font-medium">
                        By {course.instructor?.firstName} {course.instructor?.lastName}
                      </p>
                      
                      {/* Course Stats */}
                      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-academic-slate-200">
                          <FiStar className="text-academic-gold-600 w-4 h-4" />
                          <span className="font-semibold text-academic-slate-700">{course.averageRating?.toFixed(1) || '0.0'}</span>
                          <div className="hidden sm:block">
                            <RatingStars Review_Count={course.averageRating || 0} Star_Size={14} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-academic-slate-200">
                          <FiUsers className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-academic-slate-700">{course.studentsEnrolled?.length || 0} students</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {course.courseType === 'Free' ? (
                            <span className="text-2xl font-bold text-green-700 font-playfair">Free</span>
                          ) : (
                            <span className="text-2xl font-bold text-academic-navy-900 font-playfair">₹{course.price}</span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            course.courseType === 'Free' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-200'
                          }`}>
                            {course.courseType || 'Premium'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="classic-card p-8 lg:sticky lg:top-8"
            >
              <h2 className="elegant-heading mb-6">Order Summary</h2>
              
              <div className="space-y-6 mb-8">
                {/* Coupon Input */}
                <div className="bg-academic-cream-50 p-4 rounded-xl border border-academic-cream-200">
                  <CouponInput 
                    totalAmount={getOriginalPrice()} 
                    onCouponApply={handleCouponApply}
                    checkoutType="bundle"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-academic-slate-600">
                    <span className="font-medium">Total Courses:</span>
                    <span className="font-bold text-academic-navy-900">{selectedCourses.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-academic-slate-600">
                    <span className="font-medium">Original Price:</span>
                    <span className="font-bold text-academic-navy-900">₹{getOriginalPrice()}</span>
                  </div>

                  {getBundleDiscount() > 0 && (
                    <>
                      <div className="flex justify-between text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        <span className="font-medium">Bundle Discount ({Math.round(getBundleDiscount() * 100)}%):</span>
                        <span className="font-bold">-₹{getSavings()}</span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 text-green-800 font-semibold">
                          <div className="w-8 h-8 bg-green-200 rounded-lg flex items-center justify-center">
                            <FiGift className="w-4 h-4 text-green-700" />
                          </div>
                          <span>🎉 You're saving ₹{getSavings()} with this bundle!</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <hr className="border-academic-slate-200" />
                  
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <span className="font-medium">Coupon Discount:</span>
                      <span className="font-bold">-₹{couponDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl font-bold bg-academic-navy-50 px-4 py-3 rounded-xl border border-academic-navy-200">
                    <span className="text-academic-navy-900">Total Amount:</span>
                    <span className="text-academic-gold-700 font-playfair">₹{Math.max(0, getFinalPrice() - couponDiscount)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleBuyBundle}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-elegant hover:shadow-lg flex items-center justify-center gap-3
                    ${isAllFree 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white' 
                      : 'bg-gradient-to-r from-academic-gold-600 to-academic-gold-700 hover:from-academic-gold-700 hover:to-academic-gold-800 text-white'
                    }`}
                >
                  {isAllFree ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      <span className="hidden sm:inline">Request Access</span>
                      <span className="sm:hidden">Request</span>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5" />
                      <span className="hidden sm:inline">Complete Purchase</span>
                      <span className="sm:hidden">Purchase</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="btn-classic-secondary w-full"
                >
                  <span className="hidden sm:inline">Continue Shopping</span>
                  <span className="sm:hidden">Continue</span>
                </button>
              </div>

              {/* Security/Info Badge */}
              <div className="mt-8 p-4 bg-academic-slate-50 rounded-xl border border-academic-slate-200">
                <div className="flex items-start gap-3 text-academic-slate-700 text-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiShield className="text-green-700 w-4 h-4" />
                  </div>
                  <div>
                    {isAllFree ? (
                      <div>
                        <p className="font-semibold">Admin Review Required</p>
                        <p className="text-xs text-academic-slate-500 mt-1">Your request will be reviewed by admin</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">Secure Payment</p>
                        <p className="text-xs text-academic-slate-500 mt-1">Powered by Razorpay</p>
                        {freeCourses.length > 0 && (
                          <p className="text-xs text-academic-gold-700 mt-2 font-medium">
                            Note: Free course access will be requested after payment completion
                          </p>
                        )}
                      </div>
                    )}
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

export default BundleCheckout
