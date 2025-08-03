import React, { useEffect, useRef, useState } from "react"
import { AiOutlineDown } from "react-icons/ai"
import { HiOutlineVideoCamera } from "react-icons/hi"

function CourseSubSectionAccordion({ subSec }) {
  return (
    <div data-course-component className="border-l-4 border-academic-gold-300 pl-4 py-3 hover:bg-academic-cream-50 transition-all duration-200 rounded-r-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-academic-gold-600 bg-academic-gold-100 p-2 rounded-full">
            <HiOutlineVideoCamera size={16} />
          </span>
          <p className="text-academic-navy-800 font-medium hover:text-academic-navy-900 transition-colors duration-200">
            {subSec?.title}
          </p>
        </div>
        
        {/* Optional duration or additional info could go here */}
        {subSec?.duration && (
          <span className="text-xs text-academic-slate-500 bg-academic-slate-100 px-2 py-1 rounded-full">
            {subSec.duration}
          </span>
        )}
      </div>
    </div>
  )
}

export default CourseSubSectionAccordion
