import { useEffect, useState, useCallback, useMemo } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"
import { generateCertificate } from "../../../services/operations/certificateAPI"
import Img from './../../common/Img';
import IconBtn from "../../common/IconBtn"
import CertificateModal from "../Certificate/CertificateModal"
import { FaBook, FaClock, FaCertificate, FaPlay, FaGraduationCap, FaExclamationTriangle, FaTrash } from "react-icons/fa"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const [showCertificate, setShowCertificate] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  const getEnrolledCourses = useCallback(async () => {
    if (!token || enrolledCourses !== null) return; // Prevent duplicate calls
    
    setLoading(true);
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    } finally {
      setLoading(false);
    }
  }, [token, enrolledCourses]);

  useEffect(() => {
    getEnrolledCourses();
  }, [getEnrolledCourses])

  // Academic Loading Skeleton
  const SkeletonCard = useMemo(() => (
    <div className="classic-card bg-white p-8 animate-pulse">
      <div className="flex gap-6">
        <div className="h-24 w-24 rounded-xl bg-academic-slate-200"></div>
        <div className="flex-1 space-y-4">
          <div className="h-5 w-3/4 rounded bg-academic-slate-200"></div>
          <div className="h-4 w-1/2 rounded bg-academic-slate-200"></div>
          <div className="h-3 w-full rounded bg-academic-slate-200"></div>
          <div className="flex gap-3">
            <div className="h-8 w-32 rounded bg-academic-slate-200"></div>
            <div className="h-8 w-28 rounded bg-academic-slate-200"></div>
          </div>
        </div>
      </div>
    </div>
  ), [])

  // Memoized navigation handler
  const handleCourseNavigation = useCallback((course) => {
    // Don't navigate if course is deleted/deactivated or order is inactive
    if (course.isDeactivated || course.isOrderInactive) {
      return; // Just return without any action or toast
    }
    
    const firstSection = course.courseContent?.[0];
    const firstSubSection = firstSection?.subSection?.[0];
    if (firstSection && firstSubSection) {
      navigate(`/view-course/${course._id}/section/${firstSection._id}/sub-section/${firstSubSection._id}`);
    }
  }, [navigate]);

  // Memoized certificate handler
  const handleCertificateGeneration = useCallback(async (course) => {
    try {
      const certificateData = await generateCertificate(
        { courseId: course._id },
        token
      )
      if (certificateData) {
        console.log("Certificate data received:", certificateData); // Debug log
        setSelectedCourse({
          courseName: certificateData.courseName || course.courseName,
          categoryName: certificateData.categoryName,
          studentName: certificateData.studentName || `${user?.firstName} ${user?.lastName}`,
          email: certificateData.email || user?.email,
          completionDate: certificateData.completionDate, // Remove fallback to ensure backend date is used
          issuedDate: certificateData.issuedDate, // Add issued date
          certificateId: certificateData.certificateId
        })
        setShowCertificate(true)
      }
    } catch (error) {
      console.error("Error generating certificate:", error)
    }
  }, [token, user]);

  if (enrolledCourses?.length === 0) {
    return (
      <div className="bg-academic-cream-50 min-h-screen">
        <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
          <div className="px-8 py-8">
            <div className="text-sm text-academic-slate-500 mb-4 font-inter">
              <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Enrolled Courses</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaGraduationCap className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  My Learning Journey
                </h1>
                <p className="section-subtitle text-lg">
                  Continue your academic progress and achievements
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-16">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 rounded-xl mb-8">
              <FaBook className="w-16 h-16 text-academic-gold-700 mx-auto" />
            </div>
            <h2 className="classic-heading text-3xl text-academic-navy-900 mb-4">Begin Your Academic Journey</h2>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md">
              You haven't enrolled in any courses yet. Discover our comprehensive academic programs and start learning today.
            </p>
            <button 
              onClick={() => navigate('/courses')}
              className="btn-elegant flex items-center gap-3"
            >
              <FaBook size={16} />
              Explore Courses
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Enrolled Courses</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaGraduationCap className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  My Learning Journey
                </h1>
                <p className="section-subtitle text-lg">
                  Continue your academic progress and achievements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-academic-slate-700 font-inter">
              <span className="flex items-center gap-2 bg-academic-gold-100 px-3 py-2 rounded-lg border border-academic-gold-200">
                <FaBook className="text-academic-gold-600" />
                <span className="font-medium">{enrolledCourses?.length || 0} Courses</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            {SkeletonCard}
            {SkeletonCard}
            {SkeletonCard}
          </div>
        )}

        {/* Academic Course Cards */}
        <div className="space-y-6">
          {enrolledCourses?.map((course, i) => (
            <div
              key={i}
              className={`classic-card transition-all duration-300 ${
                course.isDeactivated 
                  ? 'bg-red-50 border-red-300 shadow-elegant' 
                  : course.isOrderInactive
                  ? 'bg-red-50 border-red-300 shadow-elegant'
                  : 'bg-white hover:shadow-elegant'
              }`}
            >
              {/* Academic Course Status Warning Banners */}
              {course.isDeactivated && (
                <div className="bg-red-100 border-b border-red-200 px-8 py-4 rounded-t-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <FaTrash className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-red-800 font-bold text-sm font-inter">Course Deleted by Administrator</h4>
                      <p className="text-red-700 text-sm mt-1 font-inter">
                        This course has been removed by the administrator. You cannot continue learning until the course is restored. Please contact support for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {course.isOrderInactive && (
                <div className="bg-red-100 border-b border-red-200 px-8 py-4 rounded-t-xl">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-red-800 font-bold text-sm font-inter">Course Access Suspended</h4>
                      <p className="text-red-700 text-sm mt-1 font-inter">
                        Your access to this course has been temporarily suspended. Please contact support to resolve any payment or enrollment issues.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Academic Course Content */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Academic Thumbnail */}
                  <div 
                    className={`relative flex-shrink-0 ${(course.isDeactivated || course.isOrderInactive) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                    onClick={() => handleCourseNavigation(course)}
                  >
                    <div className="relative">
                      <Img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-32 w-32 rounded-xl object-cover border-2 border-academic-slate-200 shadow-classic"
                        width={128}
                        height={128}
                      />
                      {course.isDeactivated && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <FaTrash className="w-8 h-8 text-red-600" />
                        </div>
                      )}
                      {course.isOrderInactive && (
                        <div className="absolute inset-0 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Course Info */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className={`text-2xl font-bold mb-3 transition-colors duration-200 font-playfair ${
                        (course.isDeactivated || course.isOrderInactive)
                          ? 'text-academic-slate-500 cursor-not-allowed' 
                          : 'text-academic-navy-900 cursor-pointer hover:text-academic-gold-700'
                      }`}
                      onClick={() => handleCourseNavigation(course)}
                    >
                      {course.courseName}
                    </h3>
                    <p className="text-academic-slate-600 mb-6 leading-relaxed font-inter">
                      {course.courseDescription}
                    </p>

                    {/* Academic Progress Section */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-academic-slate-700">
                          <FaClock className="w-4 h-4 text-academic-gold-600" />
                          <span className="text-sm font-medium font-inter">{course?.totalDuration}</span>
                        </div>
                        <span className={`text-sm font-bold font-inter ${
                          course.isDeactivated ? 'text-academic-slate-500' 
                          : course.isOrderInactive ? 'text-red-600'
                          : 'text-academic-gold-700'
                        }`}>
                          {course.progressPercentage || 0}% Complete
                        </span>
                      </div>
                      <ProgressBar
                        completed={course.progressPercentage || 0}
                        height="12px"
                        isLabelVisible={false}
                        bgColor={
                          course.isDeactivated ? "#94A3B8" 
                          : course.isOrderInactive ? "#DC2626"
                          : "#D97706"
                        }
                        baseBgColor="#E2E8F0"
                        className="rounded-full"
                      />
                    </div>

                    {/* Academic Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleCourseNavigation(course)}
                        disabled={course.isDeactivated || course.isOrderInactive}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-inter ${
                          course.isDeactivated 
                            ? 'bg-academic-slate-100 text-academic-slate-500 cursor-not-allowed border border-academic-slate-200' 
                            : course.isOrderInactive
                            ? 'bg-red-100 text-red-700 cursor-not-allowed border border-red-200'
                            : 'btn-elegant'
                        }`}
                      >
                        {course.isDeactivated ? (
                          <>
                            <FaTrash size={14} />
                            Course Deleted - Cannot Continue
                          </>
                        ) : course.isOrderInactive ? (
                          <>
                            <FaExclamationTriangle size={14} />
                            Access Suspended - Contact Support
                          </>
                        ) : (
                          <>
                            <FaPlay size={14} />
                            Continue Learning
                          </>
                        )}
                      </button>
                      
                      {course.progressPercentage === 100 && !course.isDeactivated && !course.isOrderInactive && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCertificateGeneration(course)
                          }}
                          className="flex items-center gap-3 px-6 py-3 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium font-inter"
                        >
                          <FaCertificate size={14} />
                          View Certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal
          onClose={() => {
            setShowCertificate(false)
            setSelectedCourse(null)
          }}
          certificateData={selectedCourse}
        />
      )}
    </div>
  )
}
