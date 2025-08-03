import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"
import { FiShoppingCart, FiShield, FiZap, FiDollarSign } from "react-icons/fi"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const navigate = useNavigate()

  return (
    <div className="animate-fade-in-up space-y-8 p-6 bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 min-h-screen">
      {/* Academic Header Section */}
      <div className="relative overflow-hidden classic-card p-8 bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-academic-gold-500/10 to-academic-navy-500/10"></div>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold font-playfair text-white">
              Shopping Cart
            </h1>
            <p className="text-academic-slate-200 text-lg">
              Review and manage your selected courses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-academic-gold-500/20 px-4 py-2 rounded-xl border border-academic-gold-500/30 backdrop-blur-sm">
              <span className="text-sm font-semibold text-academic-gold-300">
                {totalItems} {totalItems === 1 ? 'Course' : 'Courses'}
              </span>
            </div>
            <div className="w-12 h-12 bg-academic-gold-500 rounded-xl flex items-center justify-center">
              <FiShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {total > 0 ? (
        <div className="flex flex-col-reverse items-start gap-8 lg:flex-row">
          {/* Course List */}
          <div className="flex-1 w-full space-y-6">
            <div className="classic-card p-6 bg-white border-2 border-academic-slate-200">
              <h2 className="elegant-heading text-academic-navy-900 mb-4 flex items-center gap-3">
                <div className="w-3 h-3 bg-academic-gold-500 rounded-full"></div>
                Course Details
              </h2>
              <RenderCartCourses />
            </div>
          </div>
          
          {/* Total Amount Card */}
          <div className="w-full lg:w-96 lg:sticky lg:top-6">
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 classic-card bg-gradient-to-br from-academic-cream-50 to-white border-2 border-academic-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-academic-navy-50/30 to-academic-gold-50/30"></div>
          <div className="relative text-center">
            <div className="relative w-32 h-32 mb-8 mx-auto">
              <div className="absolute inset-0 bg-academic-gold-200/30 rounded-full animate-ping"></div>
              <div className="relative w-full h-full bg-academic-navy-100 rounded-full flex items-center justify-center">
                <FiShoppingCart className="w-16 h-16 text-academic-navy-600" />
              </div>
            </div>
            <h2 className="classic-heading text-academic-navy-900 mb-4">
              Your cart is empty
            </h2>
            <p className="section-subtitle text-academic-slate-600 mb-10 max-w-md leading-relaxed">
              Discover amazing courses and start your learning journey today. Add courses to your cart and unlock your potential.
            </p>
            <button 
              onClick={() => navigate('/catalog')}
              className="btn-elegant group"
            >
              <span className="flex items-center gap-3">
                Browse Courses
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Academic Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Security Feature */}
        <div className="group classic-card p-6 bg-white border-2 border-academic-slate-200 hover:border-green-300 hover:shadow-elegant transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <FiShield className="w-6 h-6 text-green-700" />
            </div>
            <h3 className="elegant-heading text-academic-navy-900">Secure Payments</h3>
          </div>
          <p className="text-academic-slate-600 leading-relaxed">
            Your transactions are protected with industry-standard encryption and secure payment gateways
          </p>
        </div>

        {/* Money-back Guarantee */}
        <div className="group classic-card p-6 bg-white border-2 border-academic-slate-200 hover:border-blue-300 hover:shadow-elegant transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <FiDollarSign className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="elegant-heading text-academic-navy-900">Money-back Guarantee</h3>
          </div>
          <p className="text-academic-slate-600 leading-relaxed">
            30-day money-back guarantee if you're not completely satisfied with your purchase
          </p>
        </div>

        {/* Instant Access */}
        <div className="group classic-card p-6 bg-white border-2 border-academic-slate-200 hover:border-academic-gold-300 hover:shadow-elegant transition-all duration-300 hover:scale-105 transform">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-academic-gold-100 rounded-xl flex items-center justify-center group-hover:bg-academic-gold-200 transition-colors">
              <FiZap className="w-6 h-6 text-academic-gold-700" />
            </div>
            <h3 className="elegant-heading text-academic-navy-900">Instant Access</h3>
          </div>
          <p className="text-academic-slate-600 leading-relaxed">
            Get immediate access to your courses and start learning right after purchase
          </p>
        </div>
      </div>

      {/* Academic Progress Indicator */}
      {total > 0 && (
        <div className="classic-card p-6 bg-white border-2 border-academic-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="elegant-heading text-academic-navy-900">Checkout Progress</h3>
            <span className="text-sm font-medium text-academic-slate-600 bg-academic-slate-100 px-3 py-1 rounded-full">Step 1 of 3</span>
          </div>
          <div className="w-full bg-academic-slate-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-academic-gold-500 to-academic-gold-600 h-3 rounded-full w-1/3 transition-all duration-500"></div>
          </div>
          <div className="flex justify-between text-sm font-medium text-academic-slate-600 mt-3">
            <span>Review Cart</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
        </div>
      )}
    </div>
  )
}
