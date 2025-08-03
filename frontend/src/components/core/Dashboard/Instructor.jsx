import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import Img from './../../common/Img';
import { FaBookOpen, FaUsers, FaRupeeSign, FaChartLine, FaGraduationCap, FaArrowRight } from 'react-icons/fa';

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    (async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) setCourses(result)
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce((acc, curr) => acc + curr.totalAmountGenerated, 0)
  const totalStudents = instructorData?.reduce((acc, curr) => acc + curr.totalStudentsEnrolled, 0)

  // Academic Loading Skeleton
  const SkeletonCard = () => (
    <motion.div 
      className="classic-card p-6 animate-pulse"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-8 w-1/3 bg-academic-slate-200 rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 w-3/4 bg-academic-slate-200 rounded"></div>
        <div className="h-4 w-1/2 bg-academic-slate-200 rounded"></div>
      </div>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Academic Welcome Section */}
      <motion.div 
        className="classic-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-academic-gold-100 rounded-xl">
            <FaGraduationCap className="text-2xl text-academic-gold-600" />
          </div>
          <div>
            <h1 className="elegant-heading text-3xl text-academic-navy-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-academic-slate-600 mt-2">
              Manage your courses and inspire your students
            </p>
          </div>
        </div>
      </motion.div>

      {courses.length > 0 ? (
        <div className="space-y-6">
          {/* Academic Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Courses */}
            <motion.div 
              className="classic-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-academic-navy-100 rounded-xl">
                  <FaBookOpen className="text-2xl text-academic-navy-600" />
                </div>
                <div>
                  <p className="text-sm text-academic-slate-600 font-medium">Total Courses</p>
                  <p className="text-3xl font-bold text-academic-navy-900">{courses.length}</p>
                </div>
              </div>
            </motion.div>

            {/* Total Students */}
            <motion.div 
              className="classic-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-academic-gold-100 rounded-xl">
                  <FaUsers className="text-2xl text-academic-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-academic-slate-600 font-medium">Total Students</p>
                  <p className="text-3xl font-bold text-academic-navy-900">{totalStudents || 0}</p>
                </div>
              </div>
            </motion.div>

            {/* Total Income */}
            <motion.div 
              className="classic-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <FaRupeeSign className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-academic-slate-600 font-medium">Total Income</p>
                  <p className="text-3xl font-bold text-academic-navy-900">₹ {totalAmount || 0}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Academic Chart Section */}
          <motion.div 
            className="classic-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-academic-navy-100 rounded-lg">
                <FaChartLine className="text-xl text-academic-navy-600" />
              </div>
              <h2 className="section-subtitle text-academic-navy-900">Performance Analytics</h2>
            </div>
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="text-center py-12">
                <div className="p-4 bg-academic-slate-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FaChartLine className="text-2xl text-academic-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-academic-navy-900 mb-2">Not Enough Data to Visualize</h3>
                <p className="text-academic-slate-600">Start creating and selling courses to see your performance metrics</p>
              </div>
            )}
          </motion.div>

          {/* Academic Recent Courses */}
          <motion.div 
            className="classic-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-academic-gold-100 rounded-lg">
                  <FaBookOpen className="text-xl text-academic-gold-600" />
                </div>
                <h2 className="section-subtitle text-academic-navy-900">Recent Courses</h2>
              </div>
              <Link 
                to="/dashboard/my-courses"
                className="flex items-center gap-2 text-academic-navy-600 hover:text-academic-navy-800 transition-colors duration-300 font-medium"
              >
                View All
                <FaArrowRight className="text-sm" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course, index) => (
                <motion.div 
                  key={course._id}
                  className="group classic-card p-0 overflow-hidden hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <Img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-48 w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-academic-navy-900 mb-3 line-clamp-2">
                      {course.courseName}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-academic-slate-600">
                        <FaUsers className="text-academic-gold-600" />
                        <span className="font-medium">{course.studentsEnrolled.length} Students</span>
                      </div>
                      <div className="flex items-center gap-1 text-academic-navy-700 font-bold">
                        <FaRupeeSign className="text-sm" />
                        <span>{course.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div 
          className="flex flex-col items-center justify-center py-20 classic-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6 bg-academic-slate-100 rounded-full mb-8">
            <FaBookOpen className="w-16 h-16 text-academic-slate-400" />
          </div>
          <h2 className="elegant-heading text-2xl text-academic-navy-900 mb-4">No Courses Yet</h2>
          <p className="text-academic-slate-600 mb-8 text-center max-w-md leading-relaxed">
            You haven't created any courses yet. Start creating your first course to begin your teaching journey and inspire students worldwide.
          </p>
          <Link 
            to="/dashboard/add-course"
            className="btn-elegant flex items-center gap-2"
          >
            <FaBookOpen />
            Create Your First Course
          </Link>
        </motion.div>
      )}
    </div>
  )
}
