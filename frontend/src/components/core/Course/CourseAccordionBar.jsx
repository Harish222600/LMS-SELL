import { useEffect, useRef, useState } from "react"
import CourseSubSectionAccordion from "./CourseSubSectionAccordion"
import { IoMdArrowDropdown } from "react-icons/io"

export default function CourseAccordionBar({ course, isActive, handleActive }) {

  const contentEl = useRef(null)
  const [active, setActive] = useState(false)  // Accordian state
  const [sectionHeight, setSectionHeight] = useState(0)

  useEffect(() => {
    setActive(isActive?.includes(course._id))
  }, [isActive])

  useEffect(() => {
    setSectionHeight(active ? contentEl.current.scrollHeight : 0)
  }, [active])

  return (
    <div 
      data-course-component 
      className='overflow-hidden border-2 border-academic-slate-200 bg-white hover:bg-academic-cream-50 text-academic-navy-900 last:mb-0 duration-300 rounded-lg shadow-sm hover:shadow-md transition-all mb-3'
    >
      <div>
        <div
          className={`flex cursor-pointer items-start justify-between px-6 py-5 transition-all duration-300 ${
            isActive.includes(course._id) 
              ? 'bg-gradient-to-r from-academic-navy-50 to-academic-gold-50 border-b-2 border-academic-gold-200' 
              : 'hover:bg-academic-cream-50'
          }`}
          onClick={() => { handleActive(course._id) }}
        >
          <div className="flex items-center gap-3">
            <i
              className={`transition-transform duration-300 ${
                isActive.includes(course._id) ? "rotate-180" : "rotate-0"
              } text-academic-gold-600`}
            >
              <IoMdArrowDropdown size={24} />
            </i>
            <p className="elegant-heading text-lg font-semibold text-academic-navy-900">
              {course?.sectionName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-academic-gold-100 text-academic-gold-800 px-3 py-1 rounded-full text-sm font-medium border border-academic-gold-200">
              {`${course.subSection.length || 0} lecture${course.subSection.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>

      <div
        ref={contentEl}
        className={`relative h-0 overflow-hidden bg-gradient-to-b from-academic-cream-50 to-white transition-all duration-500 ease-in-out`}
        style={{ height: sectionHeight }}
      >
        <div className="flex flex-col gap-2 px-6 py-4">
          {course?.subSection?.map((subSec, i) => {
            return <CourseSubSectionAccordion subSec={subSec} key={i} />
          })}
        </div>
      </div>
    </div>
  )
}
