import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { FaCog, FaArrowLeft, FaArrowRight, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa"

import { createSection, updateSection, createSubSection, updateSubSection, deleteSubSection, deleteSection, getFullDetailsOfCourse } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse, setStep, } from "../../../../../slices/courseSlice"

import IconBtn from "../../../../common/IconBtn"
import AdminCourseBuilder from "../../../../../pages/Admin/components/AdminCourseBuilder"

export default function CourseBuilderForm() {
  const { course } = useSelector((state) => state.course)
  const dispatch = useDispatch()

  // Handle course update from AdminCourseBuilder
  const handleCourseUpdate = (updatedCourse) => {
    dispatch(setCourse(updatedCourse))
  }

  // go To Next
  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return;
    }
    if (course.courseContent.some((section) => section.subSection.length === 0)) {
      toast.error("Please add atleast one lecture in each section")
      return;
    }

    // all set go ahead
    dispatch(setStep(3))
  }

  // go Back
  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="space-y-8">
      {/* Course Builder Header */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaCog className="text-green-600" />
            Course Builder
          </h2>
          <p className="text-sm text-gray-600">Create and organize your course content structure</p>
        </div>

        <div className="p-6">
          {/* Course Builder Instructions */}
          <div className="bg-green-50 border border-green-200 p-4 mb-6">
            <div className="flex items-center gap-3">
              <FaCheckCircle className="text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Course Structure Guidelines</h3>
                <p className="text-sm text-green-600">Organize your content into logical sections with engaging lectures</p>
              </div>
            </div>
          </div>

          {/* Requirements Check */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`p-4 border-2 ${course?.courseContent?.length > 0 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
              <div className="flex items-center gap-2">
                {course?.courseContent?.length > 0 ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaExclamationTriangle className="text-yellow-600" />
                )}
                <span className={`font-semibold ${course?.courseContent?.length > 0 ? 'text-green-800' : 'text-yellow-800'}`}>
                  Sections Required
                </span>
              </div>
              <p className={`text-sm mt-1 ${course?.courseContent?.length > 0 ? 'text-green-700' : 'text-yellow-700'}`}>
                {course?.courseContent?.length > 0 
                  ? `${course.courseContent.length} section${course.courseContent.length !== 1 ? 's' : ''} created`
                  : 'At least one section is required'
                }
              </p>
            </div>

            <div className={`p-4 border-2 ${
              course?.courseContent?.every(section => section.subSection?.length > 0) && course?.courseContent?.length > 0
                ? 'border-green-200 bg-green-50' 
                : 'border-yellow-200 bg-yellow-50'
            }`}>
              <div className="flex items-center gap-2">
                {course?.courseContent?.every(section => section.subSection?.length > 0) && course?.courseContent?.length > 0 ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaExclamationTriangle className="text-yellow-600" />
                )}
                <span className={`font-semibold ${
                  course?.courseContent?.every(section => section.subSection?.length > 0) && course?.courseContent?.length > 0
                    ? 'text-green-800' 
                    : 'text-yellow-800'
                }`}>
                  Lectures Required
                </span>
              </div>
              <p className={`text-sm mt-1 ${
                course?.courseContent?.every(section => section.subSection?.length > 0) && course?.courseContent?.length > 0
                  ? 'text-green-700' 
                  : 'text-yellow-700'
              }`}>
                {course?.courseContent?.every(section => section.subSection?.length > 0) && course?.courseContent?.length > 0
                  ? 'All sections have lectures'
                  : 'Each section needs at least one lecture'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Use AdminCourseBuilder for all users */}
      <AdminCourseBuilder course={course} onCourseUpdate={handleCourseUpdate} />

      {/* Navigation Buttons */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="p-6 flex flex-col sm:flex-row gap-4 justify-between">
          <button
            onClick={goBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 border border-gray-400 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
          >
            <FaArrowLeft size={14} />
            Back to Course Information
          </button>

          <button
            onClick={goToNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 border border-blue-700 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
          >
            Continue to Publish
            <FaArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
