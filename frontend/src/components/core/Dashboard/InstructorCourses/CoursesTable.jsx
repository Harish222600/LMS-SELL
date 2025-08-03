import { useDispatch, useSelector } from "react-redux"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useState } from "react"
import { FaCheck, FaStar, FaEdit, FaTrash, FaBook, FaClock, FaRupeeSign, FaPlus } from "react-icons/fa"
import { FiEdit2 } from "react-icons/fi"
import { HiClock } from "react-icons/hi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { formatDate } from "../../../../services/formatDate"
import { deleteCourse, fetchInstructorCourses, } from "../../../../services/operations/courseDetailsAPI"
import { COURSE_STATUS } from "../../../../utils/constants"
import Img from './../../../common/Img';
import toast from 'react-hot-toast'





export default function CoursesTable({ courses, setCourses, loading, setLoading }) {

  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)

  const TRUNCATE_LENGTH = 25

  // Get course duration from the API response
  const getCourseDuration = (course) => {
    return course.totalDuration || "0s"
  }

  // delete course
  const handleCourseDelete = async (courseId) => {
    try {
      setLoading(true)
      const toastId = toast.loading('Deleting course...');
      
      await deleteCourse({ courseId: courseId }, token)
      const result = await fetchInstructorCourses(token)
      
      if (result) {
        setCourses(result)
        toast.success("Course deleted successfully")
      }
      
      toast.dismiss(toastId)
    } catch (error) {
      console.log("Course deletion error:", error)
      toast.error("Failed to delete course")
    } finally {
      setLoading(false)
    }
  }


  // Academic Loading Skeleton - Card Format
  const skItem = () => {
    return (
      <div className="classic-card bg-academic-cream-50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-16 h-12 rounded-xl bg-academic-slate-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-5 w-3/4 rounded-xl bg-academic-slate-200 animate-pulse mb-2"></div>
              <div className="h-4 w-1/2 rounded-xl bg-academic-slate-200 animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg bg-academic-slate-200 animate-pulse"></div>
            <div className="w-8 h-8 rounded-lg bg-academic-slate-200 animate-pulse"></div>
          </div>
        </div>
        <div className="mb-4">
          <div className="h-4 w-full rounded-xl bg-academic-slate-200 animate-pulse mb-2"></div>
          <div className="h-4 w-4/5 rounded-xl bg-academic-slate-200 animate-pulse mb-2"></div>
          <div className="h-4 w-3/5 rounded-xl bg-academic-slate-200 animate-pulse"></div>
        </div>
        <div className="mb-4">
          <div className="flex justify-between">
            <div className="h-4 w-20 rounded-xl bg-academic-slate-200 animate-pulse"></div>
            <div className="h-6 w-16 rounded-full bg-academic-slate-200 animate-pulse"></div>
          </div>
        </div>
        <div className="pt-4 border-t border-academic-slate-200">
          <div className="flex justify-between">
            <div>
              <div className="h-3 w-24 rounded-xl bg-academic-slate-200 animate-pulse mb-1"></div>
              <div className="h-3 w-24 rounded-xl bg-academic-slate-200 animate-pulse"></div>
            </div>
            <div className="h-3 w-16 rounded-xl bg-academic-slate-200 animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Academic loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skItem()}
          {skItem()}
          {skItem()}
        </div>
      )}

      {/* Academic Empty State */}
      {!loading && courses?.length === 0 && (
        <div className="p-16 text-center">
          <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
            <FaBook className="text-5xl text-academic-gold-700" />
          </div>
          <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Courses Found</h3>
          <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
            Create your first course to get started with building your academic portfolio.
          </p>
          <button
            onClick={() => navigate("/dashboard/add-course")}
            className="btn-elegant flex items-center gap-3 mx-auto"
          >
            <FaPlus size={16} />
            Create First Course
          </button>
        </div>
      )}

      {/* Academic Course Cards Grid - Same as Category Cards */}
      {!loading && courses?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <div
              key={course._id}
              className="classic-card bg-academic-cream-50 hover:shadow-elegant group transition-all duration-300 p-6"
            >
              {/* Header with Thumbnail, Title and Actions */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="bg-white border-2 border-academic-gold-300 p-3 rounded-xl group-hover:border-academic-gold-400 transition-colors duration-300 flex-shrink-0">
                    <Img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-academic-navy-900 mb-1 font-playfair group-hover:text-academic-navy-800 transition-colors duration-300 line-clamp-2">
                      {course.courseName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-academic-slate-600 font-inter font-medium">
                      <span>{getCourseDuration(course)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <span className="text-academic-gold-700 font-semibold">{course?.averageRating?.toFixed(1) || 0}</span>
                        <FaStar className="text-academic-gold-600" size={12} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-2">
                  <button
                    onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                    className="bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 p-2 border border-academic-navy-200 transition-all duration-200 rounded-lg hover:shadow-classic"
                    title="Edit Course"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleCourseDelete(course._id)}
                    className="bg-red-100 hover:bg-red-200 text-red-700 p-2 border border-red-200 transition-all duration-200 rounded-lg hover:shadow-classic"
                    title="Delete Course"
                  >
                    {loading ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"/>
                    ) : (
                      <FaTrash size={14} />
                    )}
                  </button>
                </div>
              </div>

              {/* Course Description */}
              <div className="mb-4">
                <p className="text-sm text-academic-slate-700 line-clamp-3 font-inter leading-relaxed">
                  {course.courseDescription.split(" ").length > TRUNCATE_LENGTH
                    ? course.courseDescription
                      .split(" ")
                      .slice(0, TRUNCATE_LENGTH)
                      .join(" ") + "..."
                    : course.courseDescription}
                </p>
              </div>

              {/* Course Metadata */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-academic-slate-600 font-inter">Price:</span>
                    {course.courseType === 'Free' ? (
                      <span className="bg-academic-navy-100 text-academic-navy-800 px-2 py-1 rounded-lg text-xs font-semibold">Free</span>
                    ) : (
                      <span className="text-academic-gold-700 font-semibold">₹{course.price}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <div className="flex items-center gap-2 rounded-full bg-academic-gold-100 border border-academic-gold-300 px-3 py-1 text-xs font-semibold text-academic-gold-800">
                        <FaClock size={10} />
                        Draft
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-full bg-academic-navy-100 border border-academic-navy-300 px-3 py-1 text-xs font-semibold text-academic-navy-800">
                        <div className="flex h-2 w-2 items-center justify-center rounded-full bg-academic-navy-700 text-white">
                          <FaCheck size={6} />
                        </div>
                        Published
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with Dates and Students */}
              <div className="pt-4 border-t border-academic-slate-200">
                <div className="flex items-center justify-between text-xs text-academic-slate-500 font-inter">
                  <div className="flex flex-col">
                    <span className="font-medium">Created: {formatDate(course?.createdAt)}</span>
                    <span className="font-medium">Updated: {formatDate(course?.updatedAt)}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{course?.studentsEnrolled?.length || 0} Students</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
