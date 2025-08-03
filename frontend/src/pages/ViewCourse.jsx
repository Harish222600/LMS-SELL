import { useEffect, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
  setCompletedQuizzes,
  setPassedQuizzes,
} from "../slices/viewCourseSlice"

import { setCourseViewSidebar } from "../slices/sidebarSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [reviewModal, setReviewModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Memoized function to calculate total lectures
  const calculateTotalLectures = useCallback((courseContent) => {
    return courseContent?.reduce((total, section) => total + section.subSection.length, 0) || 0
  }, [])

  // Memoized function to reset course state
  const resetCourseState = useCallback(() => {
    dispatch(setCourseSectionData([]))
    dispatch(setEntireCourseData({}))
    dispatch(setCompletedLectures([]))
    dispatch(setCompletedQuizzes([]))
    dispatch(setPassedQuizzes([]))
    dispatch(setTotalNoOfLectures(0))
  }, [dispatch])

  // Get current course data from Redux store
  const currentCourseData = useSelector(state => state.viewCourse.courseEntireData)

  // Memoized course data fetching
  const fetchCourseDetails = useCallback(async () => {
    if (!courseId || !token) return
    
    // Prevent duplicate fetches if we already have the data
    if (currentCourseData?._id === courseId) return
    
    setLoading(true)
    try {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      
      if (courseData?.courseDetails) {
        // Check if course is deleted/deactivated or order is inactive
        if (courseData.courseDetails.isDeactivated || courseData.courseDetails.isOrderInactive) {
          console.error("Course access is restricted")
          resetCourseState()
          navigate('/dashboard/enrolled-courses')
          return
        }

        const totalLectures = calculateTotalLectures(courseData.courseDetails.courseContent)
        
        // Batch dispatch to reduce re-renders
        dispatch((dispatch) => {
          dispatch(setCourseSectionData(courseData.courseDetails.courseContent))
          dispatch(setEntireCourseData(courseData.courseDetails))
          dispatch(setCompletedLectures(courseData.completedVideos || []))
          dispatch(setCompletedQuizzes(courseData.completedQuizzes || []))
          dispatch(setPassedQuizzes(courseData.passedQuizzes || []))
          dispatch(setTotalNoOfLectures(totalLectures))
        })
      } else {
        console.error("Course data not found or invalid response")
        resetCourseState()
        navigate('/dashboard/enrolled-courses')
        toast.error("Unable to access this course")
      }
    } catch (error) {
      console.error("Error fetching course details:", error)
      resetCourseState()
      navigate('/dashboard/enrolled-courses')
      toast.error(error?.response?.data?.message || "Error loading course")
    } finally {
      setLoading(false)
    }
  }, [courseId, token, navigate, dispatch, calculateTotalLectures, resetCourseState, currentCourseData])

  useEffect(() => {
    fetchCourseDetails()
  }, [fetchCourseDetails])

  // Memoized sidebar handling for small devices
  const { courseViewSidebar } = useSelector(state => state.sidebar)
  const [screenSize, setScreenSize] = useState(window.innerWidth)

  // Optimized resize handler with RAF for better performance
  useEffect(() => {
    let rafId;
    let lastWidth = window.innerWidth;

    const handleScreenSize = () => {
      rafId = requestAnimationFrame(() => {
        const currentWidth = window.innerWidth;
        // Only update if width actually changed
        if (currentWidth !== lastWidth) {
          lastWidth = currentWidth;
          setScreenSize(currentWidth);
        }
      });
    };

    window.addEventListener('resize', handleScreenSize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleScreenSize);
    };
  }, []);

  // Memoized sidebar visibility update
  const updateSidebarVisibility = useCallback(() => {
    dispatch(setCourseViewSidebar(screenSize > 640));
  }, [screenSize, dispatch]);

  useEffect(() => {
    updateSidebarVisibility();
  }, [updateSidebarVisibility])

  // Memoized components
  const SidebarComponent = useMemo(() => (
    courseViewSidebar && (
      <motion.div 
        className="w-[320px] bg-gradient-to-b from-academic-cream-50 to-academic-slate-50 border-r border-academic-slate-200"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <VideoDetailsSidebar setReviewModal={setReviewModal} />
      </motion.div>
    )
  ), [courseViewSidebar, setReviewModal]);

  const MainContent = useMemo(() => (
    <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto mt-14 bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="mx-6 py-6">
        <Outlet />
      </div>
    </div>
  ), []);

  const ReviewModalComponent = useMemo(() => (
    reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />
  ), [reviewModal, setReviewModal]);

  // Loading state with academic theme
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-academic-gold-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-academic-gold-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="elegant-heading text-lg text-academic-navy-900 mb-2">Loading Course</h3>
            <p className="text-academic-slate-600">Please wait while we prepare your learning experience...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <motion.div 
        className="relative flex min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {SidebarComponent}
        {MainContent}
      </motion.div>
      {ReviewModalComponent}
    </>
  )
}
