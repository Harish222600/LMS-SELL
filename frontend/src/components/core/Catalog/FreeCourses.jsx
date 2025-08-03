import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaStar,
  FaClock,
  FaChevronRight,
  FaFilter,
  FaSearch,
  FaGift,
  FaRocket,
  FaLightbulb,
  FaHeart,
  FaPlay,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa'

import { getFreeCourses, requestCourseAccess, getUserAccessRequests } from '../../../services/operations/courseAccessAPI'
import { ACCOUNT_TYPE } from '../../../utils/constants'
import { toast } from 'react-hot-toast'
import HighlightText from '../HomePage/HighlightText'
import ImprovedFooter from '../../common/ImprovedFooter'
import RatingStars from '../../common/RatingStars'

const categories = [
  { id: 'all', name: 'All Courses', icon: FaBookOpen },
  { id: 'web-development', name: 'Web Development', icon: FaRocket },
  { id: 'data-science', name: 'Data Science', icon: FaLightbulb },
  { id: 'design', name: 'Design', icon: FaHeart },
  { id: 'programming', name: 'Programming', icon: FaGraduationCap },
]

const benefits = [
  {
    icon: FaGift,
    title: "Completely Free",
    description: "Access high-quality courses without any cost"
  },
  {
    icon: FaGraduationCap,
    title: "Expert Instructors",
    description: "Learn from industry professionals and experts"
  },
  {
    icon: FaCheckCircle,
    title: "Certificates",
    description: "Earn certificates upon successful completion"
  },
  {
    icon: FaUsers,
    title: "Community Support",
    description: "Join a community of learners and get help"
  }
]

export default function FreeCourses() {
  const { token, user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [freeCourses, setFreeCourses] = useState([])
  const [userRequests, setUserRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchFreeCourses()
    if (token) {
      fetchUserRequests()
    }
  }, [currentPage])

  const fetchFreeCourses = async () => {
    setLoading(true)
    const result = await getFreeCourses(currentPage)
    if (result?.data) {
      setFreeCourses(result.data)
      setTotalPages(result.pagination?.totalPages || 1)
    } else {
      setFreeCourses([])
      setTotalPages(1)
    }
    setLoading(false)
  }

  const fetchUserRequests = async () => {
    const result = await getUserAccessRequests(token)
    if (result) {
      setUserRequests(result)
    }
  }

  const handleRequestAccess = async (courseId, courseName) => {
    if (!courseId) {
      toast.error('Course information not available')
      return
    }

    if (!token) {
      toast.error('Please login to request access')
      return
    }

    const requestMessage = `I would like to request access to the course "${courseName}".`
    
    const result = await requestCourseAccess(
      { 
        courseId, 
        requestMessage 
      }, 
      `Bearer ${token}`
    )
    if (result) {
      fetchUserRequests()
    }
  }

  const getRequestStatus = (courseId) => {
    const request = userRequests.find(req => req?.course?._id === courseId)
    return request ? request.status : null
  }

  const isEnrolled = (courseId) => {
    return user?.courses?.includes(courseId)
  }

  const filteredCourses = freeCourses.filter(course => {
    if (!course) return false
    
    const categoryName = course.category?.name || course.category || ''
    const matchesCategory = activeCategory === 'all' || 
      (categoryName && categoryName.toLowerCase().includes(activeCategory.toLowerCase()))
    
    const matchesSearch = !searchTerm || 
      (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.courseDescription && course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const CourseCard = ({ course }) => {
    const requestStatus = getRequestStatus(course._id)
    const enrolled = isEnrolled(course._id)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl overflow-hidden shadow-elegant hover:shadow-xl transition-all duration-300 group border border-academic-slate-200"
      >
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={course?.thumbnail || '/api/placeholder/400/200'}
            alt={course?.courseName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <FaGift className="w-3 h-3" />
              FREE
            </span>
          </div>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-academic-gold-600 font-semibold bg-academic-gold-100 px-2 py-1 rounded">
              {course?.category?.name || course?.category || 'General'}
            </span>
            <div className="flex items-center gap-1">
              <RatingStars rating={course?.averageRating || 0} />
              <span className="text-sm text-academic-slate-500">
                ({course?.totalRatings || 0})
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold text-academic-navy-900 mb-2 line-clamp-2 group-hover:text-academic-gold-600 transition-colors duration-300">
            {course?.courseName}
          </h3>

          <p className="text-academic-slate-600 text-sm mb-4 line-clamp-2">
            {course?.courseDescription}
          </p>

          <div className="flex items-center gap-4 text-sm text-academic-slate-500 mb-4">
            <div className="flex items-center gap-1">
              <FaUsers className="w-4 h-4" />
              <span>{course?.studentsEnrolled?.length || 0} students</span>
            </div>
            <div className="flex items-center gap-1">
              <FaClock className="w-4 h-4" />
              <span>{course?.totalDuration || "Self-paced"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-academic-slate-600">
              By <span className="font-semibold text-academic-navy-900">
                {course?.instructor?.firstName} {course?.instructor?.lastName}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6">
            {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
              <button
                onClick={() => navigate('/admin')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Manage Course
              </button>
            ) : user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && course?.instructor?._id === user?._id ? (
              <button
                onClick={() => navigate('/dashboard/my-courses')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300"
              >
                Manage Course
              </button>
            ) : enrolled ? (
              <button
                onClick={() => navigate(`/view-course/${course._id}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaPlay className="w-4 h-4" />
                Continue Learning
              </button>
            ) : requestStatus ? (
              <div className={`w-full px-4 py-3 rounded-lg text-center font-semibold ${
                requestStatus === 'Pending' 
                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  : requestStatus === 'Approved'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    requestStatus === 'Pending'
                      ? 'bg-yellow-500'
                      : requestStatus === 'Approved'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }`}></div>
                  <span>{requestStatus}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleRequestAccess(course._id, course.courseName)}
                className="w-full bg-academic-gold-500 hover:bg-academic-gold-600 text-academic-navy-900 px-4 py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaGraduationCap className="w-4 h-4" />
                Request Access
              </button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full text-green-400 text-sm font-medium">
                <FaGift className="w-4 h-4" />
                100% Free Courses
              </div>
              
              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Free
                <HighlightText text=" Learning" variant="gold" />
                <br />
                Opportunities
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl max-w-3xl mx-auto">
                Discover our collection of completely free courses designed to help you 
                build new skills and advance your career without any cost.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <div className="flex items-center gap-2 text-academic-slate-300">
                  <FaUsers className="w-4 h-4 text-academic-gold-400" />
                  <span>Join 25K+ learners</span>
                </div>
                <div className="flex items-center gap-2 text-academic-slate-300">
                  <FaCheckCircle className="w-4 h-4 text-academic-gold-400" />
                  <span>Get certified</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Why Choose Our
              <HighlightText text=" Free Courses?" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-2xl mx-auto">
              Experience the same quality education as our premium courses, completely free
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-academic-gold-500/20 rounded-full mb-4 group-hover:bg-academic-gold-500/30 transition-colors duration-300">
                  <benefit.icon className="w-8 h-8 text-academic-gold-600" />
                </div>
                <h3 className="text-xl font-bold text-academic-navy-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-academic-slate-600">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-academic-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Explore Our
              <HighlightText text=" Free Courses" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              Choose from a variety of subjects and start learning today
            </p>
          </motion.div>


          {/* Courses Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="w-8 h-8 text-academic-gold-500 animate-spin" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <FaBookOpen className="w-16 h-16 text-academic-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-academic-slate-600 mb-2">
                No courses found
              </h3>
              <p className="text-academic-slate-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredCourses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-academic-slate-300 rounded-lg text-academic-slate-600 hover:bg-academic-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Previous
                  </button>
                  <span className="text-academic-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-academic-slate-300 rounded-lg text-academic-slate-600 hover:bg-academic-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-academic-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-white">
              Ready to Start Your
              <HighlightText text=" Free Learning" variant="gold" />
              Journey?
            </h2>
            <p className="section-subtitle text-academic-slate-300 text-lg">
              Join thousands of learners who are building their skills with our free courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => !token && navigate('/signup')}
                className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-semibold hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
              >
                {token ? 'Browse Courses Above' : 'Sign Up Free'}
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-academic-navy-900 transition-colors duration-300"
              >
                View All Courses
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <ImprovedFooter />
    </div>
  )
}
