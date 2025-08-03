import { useEffect, useState } from "react"
import { VscAdd } from "react-icons/vsc"
import { FaBook, FaPlus, FaChartBar, FaUsers, FaClock } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import CoursesTable from "./InstructorCourses/CoursesTable"



export default function MyCourses() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      const result = await fetchInstructorCourses(token, user?.accountType)
      console.log('Instructors all courses  ', result);
      setLoading(false);
      if (result) {
        setCourses(result)
      }
    }
    fetchCourses()
  }, [])

  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  // Calculate course statistics
  const courseStats = {
    totalCourses: courses.length,
    publishedCourses: courses.filter(course => course.status === 'Published').length,
    draftCourses: courses.filter(course => course.status === 'Draft').length,
    totalStudents: courses.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0)
  }

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">My Courses</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaBook className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  My Courses
                </h1>
                <p className="section-subtitle text-lg">
                  Manage and track your academic course portfolio
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/add-course")}
              className="btn-elegant flex items-center gap-3"
            >
              <FaPlus size={16} />
              Create New Course
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Academic Statistics Panel */}
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Course Statistics</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Overview of your course portfolio</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaBook className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.totalCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Courses</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  All your courses
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaChartBar className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.publishedCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Published</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Live courses
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaClock className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.draftCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Drafts</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Work in progress
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaUsers className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.totalStudents}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Students</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Enrolled learners
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Course Table */}
        <div className="classic-card">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="elegant-heading text-academic-navy-900">Course Directory</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Manage your academic courses</p>
              </div>
              <div className="text-sm text-academic-slate-700 font-inter">
                Showing <span className="font-bold text-academic-navy-900">{courses.length}</span> courses
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="w-full overflow-x-auto">
              {courses && <CoursesTable courses={courses} setCourses={setCourses} loading={loading} setLoading={setLoading} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
