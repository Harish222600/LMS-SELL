import { useEffect, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from './../../common/IconBtn';
import { setCourseViewSidebar } from "../../../slices/sidebarSlice"
import { checkSectionAccess } from "../../../services/operations/courseProgressAPI"
import ChatButton from '../Chat/ChatButton';

import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FaLock } from "react-icons/fa"
import { HiOutlineClipboardCheck } from "react-icons/hi"
import { RiQuestionAnswerLine } from "react-icons/ri"

import { IoMdClose } from 'react-icons/io'
import { HiMenuAlt1 } from 'react-icons/hi'

export default function VideoDetailsSidebar({ setReviewModal }) {

  const [activeStatus, setActiveStatus] = useState("") // store curr section id
  const [videoBarActive, setVideoBarActive] = useState("") // store curr SubSection Id
  const [sectionAccess, setSectionAccess] = useState({}) // store section access status
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();

  const { sectionId, subSectionId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
    completedQuizzes,
    passedQuizzes,
  } = useSelector((state) => state.viewCourse)

  const { courseViewSidebar } = useSelector(state => state.sidebar)

  // set which section - subSection is selected 
  useEffect(() => {
    ; (() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex((data) => data._id === sectionId)
      const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection.findIndex((data) => data._id === subSectionId)
      const activeSubSectionId = courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // Check section access for all sections with optimized logic
  useEffect(() => {
    const checkAllSectionAccess = async () => {
      if (!courseSectionData.length || !courseEntireData?._id || !token) return
      
      const accessStatus = {}
      
      // First section is always accessible
      if (courseSectionData.length > 0) {
        accessStatus[courseSectionData[0]._id] = true
      }
      
      // For subsequent sections, check if previous section is completed
      for (let i = 1; i < courseSectionData.length; i++) {
        const currentSection = courseSectionData[i]
        const previousSection = courseSectionData[i - 1]
        
        // Check if all subsections in previous section are completed
        const previousSectionCompleted = previousSection.subSection.every(subSec => {
          const videoCompleted = completedLectures.includes(subSec._id)
          // If there's a quiz, it should also be completed
          const quizCompleted = subSec.quiz ? completedQuizzes.includes(subSec._id) : true
          return videoCompleted && quizCompleted
        })
        
        // Use client-side check as primary source of truth
        accessStatus[currentSection._id] = previousSectionCompleted
      }
      
      setSectionAccess(accessStatus)
    }

    checkAllSectionAccess()
  }, [courseSectionData, courseEntireData, completedLectures, completedQuizzes, token])

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-2 border-academic-slate-200 bg-gradient-to-b from-white to-academic-cream-50">
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b-2 border-academic-slate-200 py-5 text-lg font-bold text-academic-navy-900">
          <div className="flex w-full items-center justify-between gap-2">

            {/* open - close side bar icons */}
            <div
              className="sm:hidden text-academic-navy-700 cursor-pointer hover:text-academic-navy-900 transition-colors"
              onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
            >
              {courseViewSidebar ? <IoMdClose size={33} /> : <HiMenuAlt1 size={33} />}
            </div>

            {/* go back dashboard */}
            <button
              onClick={() => { navigate(`/dashboard/enrolled-courses`) }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-academic-navy-100 p-1 text-academic-navy-700 hover:bg-academic-navy-200 hover:scale-95 transition-all duration-200 flex-shrink-0 ml-auto shadow-sm"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </button>
          </div>

          {/* Add Review button as separate row for better visibility */}
          <div className="w-full">
            <button
              onClick={() => setReviewModal(true)}
              className="btn-elegant w-full flex items-center justify-center gap-2 text-sm py-3"
              title="Add Review for this Course"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
              Add Course Review
            </button>
          </div>

          {/* course Name - total No Of Lectures*/}
          <div className="flex flex-col">
            <p className="elegant-heading text-academic-navy-900">{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-academic-slate-600">
              {completedLectures?.length} / {totalNoOfLectures}
            </p>
          </div>

          {/* Chat with Instructor Button */}
          <div className="mt-3 w-full">
            <ChatButton 
              courseId={courseEntireData?._id}
              courseName={courseEntireData?.courseName}
              instructorName={courseEntireData?.instructor ? 
                `${courseEntireData.instructor.firstName} ${courseEntireData.instructor.lastName}` : 
                'Instructor'
              }
            />
          </div>
        </div>

        {/* render all section -subSection */}
        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
          {courseSectionData.map((section, index) => (
            <div
              className="mt-2 cursor-pointer text-sm text-academic-navy-900"
              onClick={() => setActiveStatus(section?._id)}
              key={index}
            >
              {/* Section */}
              <div className="flex justify-between bg-gradient-to-r from-academic-navy-100 to-academic-slate-100 px-5 py-4 hover:from-academic-navy-200 hover:to-academic-slate-200 transition-all duration-200">
                <div className="w-[70%] font-semibold flex items-center gap-2 text-academic-navy-900">
                  {section?.sectionName}
                  {index > 0 && !sectionAccess[section._id] && (
                    <div className="relative group">
                      <FaLock size={12} className="text-academic-gold-600" />
                      <div className="absolute left-0 -top-8 hidden group-hover:block bg-academic-navy-900 text-xs text-white p-2 rounded-md whitespace-nowrap z-10">
                        Complete Section {index} to unlock
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12px] font-medium text-academic-slate-600">
                    {section.subSection.filter(subSec => {
                      // Count video completion
                      if (subSec.videoUrl) {
                        return completedLectures.includes(subSec._id)
                      }
                      // Count quiz completion - give full credit for passed quizzes, half for attempted
                      if (subSec.quiz) {
                        if (passedQuizzes.includes(subSec._id)) return true
                        if (completedQuizzes.includes(subSec._id)) return 0.5
                        return false
                      }
                      return false
                    }).length}/{section?.subSection.length} Completed
                  </span>
                  <span
                    className={`text-academic-navy-700 ${activeStatus === section?._id
                      ? "rotate-0 transition-all duration-500"
                      : "rotate-180"
                      } `}
                  >
                    <BsChevronDown />
                  </span>
                </div>
              </div>

              {/* Sub Sections */}
              {activeStatus === section?._id && (
                <div className="transition-[height] duration-500 ease-in-out bg-white">
                  {section.subSection.map((topic, i) => {
                    // Check if this section should be locked using the sectionAccess state
                    let isLocked = false
                    
                    if (index > 0) {
                      // Use the sectionAccess state if available, otherwise fall back to client-side check
                      if (sectionAccess.hasOwnProperty(section._id)) {
                        isLocked = !sectionAccess[section._id]
                      } else {
                        // Fallback: check if previous section is completed
                        const previousSection = courseSectionData[index - 1]
                        const previousSectionCompleted = previousSection.subSection.every(subSec => {
                          const videoCompleted = completedLectures.includes(subSec._id)
                          const quizCompleted = subSec.quiz ? completedQuizzes.includes(subSec._id) : true
                          return videoCompleted && quizCompleted
                        })
                        isLocked = !previousSectionCompleted
                      }
                    }
                    
                    return (
                      <div className="flex flex-col" key={`topic-${topic._id}`}>
                        <div
                          className={`flex gap-3 px-5 py-3 border-l-4 transition-all duration-200 ${
                            isLocked 
                              ? "opacity-50 cursor-not-allowed border-academic-slate-300 bg-academic-slate-50" 
                              : videoBarActive === topic._id
                                ? "bg-academic-gold-100 font-semibold text-academic-navy-900 border-academic-gold-500"
                                : "hover:bg-academic-cream-50 cursor-pointer border-transparent hover:border-academic-gold-300"
                          }`}
                          onClick={() => {
                            if (isLocked) {
                              return // Don't navigate if locked
                            }
                            navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                            setVideoBarActive(topic._id)
                            courseViewSidebar && window.innerWidth <= 640 ? dispatch(setCourseViewSidebar(false)) : null;
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={completedLectures.includes(topic?._id)}
                            onChange={() => { }}
                            disabled={isLocked}
                            className="w-4 h-4 text-academic-gold-600 bg-white border-2 border-academic-slate-300 rounded focus:ring-academic-gold-500 focus:ring-2"
                          />
                          <span className="flex items-center gap-2 flex-1 text-academic-navy-800">
                            {isLocked && (
                              <div className="relative group">
                                <FaLock size={12} className="text-academic-gold-600" />
                                <div className="absolute left-0 -top-12 hidden group-hover:block bg-academic-navy-900 text-xs text-white p-2 rounded-md whitespace-nowrap z-10">
                                  Complete previous section to unlock
                                </div>
                              </div>
                            )}
                            {topic.title}
                            {topic.quiz && (
                              <div className="relative group ml-auto">
                                <RiQuestionAnswerLine 
                                  size={16} 
                                  className={`${completedLectures.includes(topic?._id) ? 'text-academic-gold-600' : 'text-academic-slate-400'}`}
                                />
                                <div className="absolute right-0 -top-8 hidden group-hover:block bg-academic-navy-900 text-xs text-white p-2 rounded-md whitespace-nowrap z-10">
                                  Quiz available
                                </div>
                              </div>
                            )}
                          </span>
                        </div>
                        
                        {/* Quiz Button - Show based on quiz status */}
                        {topic.quiz && (
                          <button
                            onClick={() => navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}/quiz`)}
                            className={`ml-11 mr-5 mt-1 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                              passedQuizzes.includes(topic._id)
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : completedQuizzes.includes(topic._id)
                                ? 'bg-academic-gold-500 text-white hover:bg-academic-gold-600 shadow-sm'
                                : completedLectures.includes(topic._id)
                                ? 'bg-academic-navy-600 text-white hover:bg-academic-navy-700 shadow-sm'
                                : 'bg-academic-slate-200 text-academic-slate-500 cursor-not-allowed opacity-50'
                            }`}
                            disabled={!completedLectures.includes(topic._id)}
                          >
                            <HiOutlineClipboardCheck size={16} />
                            {passedQuizzes.includes(topic._id)
                              ? 'Quiz Passed'
                              : completedQuizzes.includes(topic._id)
                              ? 'Retake Quiz'
                              : 'Take Quiz'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
