import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaRocket, FaArrowLeft, FaCheckCircle, FaEye, FaGlobe, FaLock, FaExclamationTriangle } from "react-icons/fa"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"

export default function PublishCourse() {
  const { register, handleSubmit, setValue, getValues } = useForm()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/admin")
  }

  const handleCoursePublish = async () => {
    // check if form has been updated or not
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      // form has not been updated
      // no need to make api call
      goToCourses()
      return
    }
    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)
    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  const onSubmit = (data) => {
    handleCoursePublish()
  }

  // Calculate course statistics
  const courseStats = {
    totalSections: course?.courseContent?.length || 0,
    totalLectures: course?.courseContent?.reduce((acc, section) => acc + (section.subSection?.length || 0), 0) || 0,
    hasContent: course?.courseContent?.length > 0 && course?.courseContent?.every(section => section.subSection?.length > 0)
  }

  return (
    <div className="space-y-8">
      {/* Publish Header */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaRocket className="text-purple-600" />
            Publish Course
          </h2>
          <p className="text-sm text-gray-600">Review your course and choose publishing settings</p>
        </div>

        <div className="p-6">
          {/* Course Summary */}
          <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <FaCheckCircle className="text-blue-600" />
              <h3 className="font-semibold text-blue-800">Course Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">{courseStats.totalSections}</div>
                <div className="text-sm text-blue-600">Sections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">{courseStats.totalLectures}</div>
                <div className="text-sm text-blue-600">Lectures</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${courseStats.hasContent ? 'text-green-800' : 'text-red-800'}`}>
                  {courseStats.hasContent ? 'Ready' : 'Incomplete'}
                </div>
                <div className={`text-sm ${courseStats.hasContent ? 'text-green-600' : 'text-red-600'}`}>
                  Status
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Preview */}
          <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Course Title:</span>
                <span className="font-medium text-gray-800">{course?.courseName || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium text-gray-800">₹{course?.price || '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium text-gray-800">{course?.category?.name || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Status:</span>
                <span className={`font-medium px-2 py-1 text-xs ${
                  course?.status === COURSE_STATUS.PUBLISHED 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course?.status === COURSE_STATUS.PUBLISHED ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publishing Settings */}
      <div className="bg-white border border-gray-300 shadow-sm">
        <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">Publishing Settings</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Readiness Check */}
          {!courseStats.hasContent && (
            <div className="bg-red-50 border border-red-200 p-4 mb-6">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-800">Course Not Ready for Publishing</h4>
                  <p className="text-sm text-red-600">Please ensure all sections have at least one lecture before publishing.</p>
                </div>
              </div>
            </div>
          )}

          {/* Visibility Settings */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Course Visibility</h4>
              
              <div className="space-y-4">
                {/* Public Option */}
                <label className="flex items-start gap-4 p-4 border-2 border-gray-300 cursor-pointer hover:border-blue-300 transition-colors duration-200">
                  <input
                    type="checkbox"
                    id="public"
                    {...register("public")}
                    className="mt-1 h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaGlobe className="text-blue-600" />
                      <span className="font-semibold text-gray-800">Make this course public</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Your course will be visible to all students and can be enrolled by anyone. 
                      This is recommended for courses ready for general audience.
                    </p>
                  </div>
                </label>

                {/* Draft Info */}
                <div className="p-4 bg-gray-50 border border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <FaLock className="text-gray-600" />
                    <span className="font-semibold text-gray-800">Keep as Draft</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your course will remain private and only visible to you. 
                    You can continue editing and publish it later when ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Publishing Guidelines */}
            <div className="bg-yellow-50 border border-yellow-200 p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">📋 Publishing Guidelines</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Ensure all content is original or properly licensed</li>
                <li>• Review all lectures for quality and completeness</li>
                <li>• Verify course description and pricing are accurate</li>
                <li>• Test video playback and audio quality</li>
                <li>• Published courses can still be edited later</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8 pt-6 border-t border-gray-300">
            <button
              disabled={loading}
              type="button"
              onClick={goBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 border border-gray-400 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
            >
              <FaArrowLeft size={14} />
              Back to Course Builder
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 border border-blue-700 flex items-center justify-center gap-2 transition-colors duration-200 font-medium ${
                loading ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                  Publishing...
                </>
              ) : (
                <>
                  <FaRocket size={14} />
                  {getValues("public") ? "Publish Course" : "Save as Draft"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
