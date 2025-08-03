import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { HiUsers } from "react-icons/hi"
import { FaRupeeSign, FaClock, FaGift, FaStar } from "react-icons/fa"

import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';

function Course_Card({ course, Height, bundleMode = false, isSelected = false, onSelect = null, selectionText = "Click to Select" }) {
  // Return null if no course data is provided
  if (!course) {
    return null;
  }

  // Use the averageRating from backend instead of calculating it on frontend
  const avgRating = course?.averageRating || 0
  const totalRatings = course?.totalRatings || 0

  const handleClick = (e) => {
    if (bundleMode && onSelect) {
      e.preventDefault();
      e.stopPropagation();
      onSelect();
    }
  };

  const cardContent = (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl 
      transition-all duration-300 h-full flex flex-col border border-academic-slate-200 hover:border-academic-gold-300 relative ${
      bundleMode ? 'cursor-pointer' : ''
    } ${isSelected ? 'ring-2 ring-academic-gold-500 ring-offset-2 ring-offset-white' : ''}`}>
      {/* Thumbnail Section - Fixed Height */}
      <div className="relative overflow-hidden h-36 xs:h-40 sm:h-44 flex-shrink-0 group">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300 z-10"></div>
        {course?.thumbnail ? (
          <Img
            src={course?.thumbnail}
            alt="course thumbnail"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-academic-slate-100 flex items-center justify-center">
            <span className="text-academic-slate-400 text-sm">No Image</span>
          </div>
        )}
        {/* Course Type Badge */}
        <div className={`absolute top-2 xs:top-3 sm:top-4 left-2 xs:left-3 sm:left-4 z-20 px-2 xs:px-3 py-1 xs:py-1.5 rounded-full font-bold text-[10px] xs:text-xs shadow-md
          ${course?.courseType === 'Free' || course?.adminSetFree
            ? "bg-green-500 text-white flex items-center gap-1" 
            : "bg-academic-navy-600 text-white"}`}>
          {course?.courseType === 'Free' || course?.adminSetFree ? (
            <>
              <FaGift className="w-2 h-2 xs:w-3 xs:h-3" />
              FREE
            </>
          ) : (
            "PREMIUM"
          )}
        </div>
      </div>
      
      {/* Content Section - Flexible Height */}
      <div className="flex flex-col gap-1.5 xs:gap-2 sm:gap-3 p-3 xs:p-4 sm:p-5 flex-grow">
        <h3 className="text-sm xs:text-base sm:text-lg font-bold text-academic-navy-900 line-clamp-2 group-hover:text-academic-gold-600 transition-colors duration-200 leading-tight">
          {course?.courseName}
        </h3>
        
        <p className="text-[10px] xs:text-xs sm:text-sm text-academic-slate-600">
          By <span className="text-academic-navy-700 font-semibold">
            {course?.instructor?.firstName} {course?.instructor?.lastName}
          </span>
        </p>

        {/* Stats Row */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-4 text-[10px] xs:text-xs text-academic-slate-500">
          <div className="flex items-center gap-1">
            <HiUsers className="text-sm text-academic-gold-600" />
            <span>{course?.studentsEnrolled?.length || 0} students</span>
          </div>
          <div className="flex items-center gap-1">
            <FaClock className="text-sm text-academic-gold-600" />
            <span>{course?.totalDuration || 'Self-paced'}</span>
          </div>
        </div>
        
        {/* Rating Row */}
        <div className="flex items-center gap-1.5 xs:gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <FaStar className="text-academic-gold-500 text-xs" />
            <span className="text-academic-navy-900 text-xs xs:text-sm font-semibold">{avgRating.toFixed(1)}</span>
          </div>
          <RatingStars Review_Count={avgRating} />
          <span className="text-academic-slate-500 text-[10px] xs:text-xs sm:text-sm">
            ({totalRatings})
          </span>
        </div>
        
        {/* Price Row */}
        <div className="flex items-center justify-between pt-2 xs:pt-3 mt-auto border-t border-academic-slate-200">
          <div className="flex items-center gap-1.5 xs:gap-2">
            {course?.courseType === 'Free' || course?.adminSetFree ? (
              <div className="flex items-center gap-2">
                <span className="text-base xs:text-lg font-bold text-green-600">FREE</span>
                {(course?.price || course?.originalPrice) && (
                  <span className="text-xs xs:text-sm text-academic-slate-400 line-through">
                    ₹{course?.price || course?.originalPrice}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {course?.originalPrice && course?.originalPrice !== course?.price && (
                  <span className="text-xs xs:text-sm text-academic-slate-400 line-through">
                    ₹{course.originalPrice}
                  </span>
                )}
                <div className="flex items-center text-academic-navy-900 font-bold">
                  <FaRupeeSign className="text-sm" />
                  <span className="text-base xs:text-lg">{course?.price}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Course Level Badge */}
          <div className="bg-academic-gold-100 text-academic-gold-700 px-2 py-1 rounded-md text-[10px] xs:text-xs font-medium">
            {course?.level || 'Beginner'}
          </div>
        </div>
      </div>
      
      {/* Bundle Mode Selection Overlay */}
      {bundleMode && (
        <>
          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-3 right-3 bg-academic-gold-500 text-academic-navy-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-[60] shadow-lg">
              ✓
            </div>
          )}
          {/* Selection Overlay */}
          <div className="absolute inset-0 bg-academic-gold-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-[55] pointer-events-none">
            <div className="bg-academic-navy-900/90 text-white px-4 py-2 rounded-lg font-medium shadow-lg backdrop-blur-sm">
              {isSelected ? 'Selected' : selectionText}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={bundleMode ? {} : { 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`z-50 group transition-all duration-300 w-full xs:w-[280px] sm:w-[330px] h-[380px] xs:h-[400px] sm:h-[420px] ${
        bundleMode ? '' : 'transform hover:-translate-y-2'
      }`}
      onClick={handleClick}
    >
      {bundleMode ? (
        cardContent
      ) : (
        <Link to={course._id ? `/courses/${course._id}` : "#"}>
          {cardContent}
        </Link>
      )}
    </motion.div>
  )
}

export default Course_Card
