import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiClock, FiUsers, FiBookOpen } from "react-icons/fi"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart } from "../../../../slices/cartSlice"
import Img from './../../../common/Img';

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart)
  const dispatch = useDispatch()

  return (
    <div className="space-y-6">
      {cart.map((course, indx) => (
        <div
          key={course._id}
          className="group classic-card p-6 bg-white border-2 border-academic-slate-200 hover:border-academic-gold-300 hover:shadow-elegant transition-all duration-300"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Course thumbnail */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-academic-gold-400 to-academic-navy-400 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                <Img
                  src={course?.thumbnail}
                  alt={course?.courseName}
                  className="h-32 w-full lg:w-48 rounded-xl object-cover shadow-classic"
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="space-y-4">
                <h3 className="elegant-heading text-academic-navy-900 line-clamp-2">
                  {course?.courseName}
                </h3>
                
                <div className="flex items-center gap-2">
                  <span className="bg-academic-gold-100 text-academic-gold-800 px-3 py-1 rounded-full text-xs font-semibold border border-academic-gold-200">
                    {course?.category?.name}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-academic-gold-600 font-bold">4.5</span>
                    <ReactStars
                      count={5}
                      value={4.5}
                      size={16}
                      edit={false}
                      activeColor="#d97706"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                  <span className="text-academic-slate-600 text-sm">
                    ({course?.ratingAndReviews?.length || 0} reviews)
                  </span>
                </div>

                {/* Course Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-academic-slate-600">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-green-600" />
                    <span>2.5k students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiBookOpen className="w-4 h-4 text-academic-navy-600" />
                    <span>24 lessons</span>
                  </div>
                </div>

                <p className="text-academic-slate-600 text-sm line-clamp-2 leading-relaxed">
                  {course?.courseDescription || "Comprehensive course designed to help you master the fundamentals and advanced concepts."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-academic-slate-200">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-academic-gold-700 font-playfair">
                    ₹ {course?.price}
                  </div>
                  <div className="text-sm text-academic-slate-500 line-through">
                    ₹ {Math.round(course?.price * 1.5)}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => dispatch(removeFromCart(course._id))}
                    className="group/btn flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 transition-all duration-300 hover:scale-105 transform"
                  >
                    <RiDeleteBin6Line className="text-lg group-hover/btn:animate-bounce" />
                    <span className="font-medium">Remove</span>
                  </button>
                  
                  <div className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">
                    In Cart
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-4 pt-4 border-t border-academic-slate-200">
                <div className="flex items-center justify-between text-sm text-academic-slate-600 mb-2">
                  <span className="font-medium">Course Progress</span>
                  <span className="font-semibold">0%</span>
                </div>
                <div className="w-full bg-academic-slate-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-academic-gold-500 to-academic-gold-600 h-2 rounded-full w-0 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
