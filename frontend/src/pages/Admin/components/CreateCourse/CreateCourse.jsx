import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaBook, FaLightbulb, FaCheckCircle, FaArrowLeft } from "react-icons/fa"

import RenderSteps from "../../../../components/core/Dashboard/AddCourse/RenderSteps"
import { resetCourseState } from "../../../../slices/courseSlice"

export default function CreateCourse({ onCancel }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    // Reset course state when admin starts creating a new course
    dispatch(resetCourseState())
  }, [dispatch])

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Classic Header */}
      <div className="bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 border border-gray-400 flex items-center gap-2 transition-colors duration-200 font-medium"
                title="Back to Course Management"
              >
                <FaArrowLeft size={14} />
                Back
              </button>
              <div className="bg-blue-50 border-2 border-blue-200 p-3">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Create New Course</h1>
                <p className="text-gray-600">Build engaging courses for your students with our step-by-step process</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex w-full items-start gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <RenderSteps />
          </div>

          {/* Course Creation Tips Sidebar */}
          <div className="hidden lg:block w-80 bg-white border border-gray-300 shadow-sm">
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                <FaLightbulb className="text-blue-600" />
                Course Creation Tips
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">Course Pricing</h4>
                      <p className="text-sm text-green-700">Set a competitive price or make it free to attract more students.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Course Thumbnail</h4>
                      <p className="text-sm text-blue-700">Use high-quality images with 1024x576 resolution for best results.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-purple-600 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-1">Course Structure</h4>
                      <p className="text-sm text-purple-700">Organize content into logical sections with engaging lectures.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4">
                  <div className="flex items-start gap-3">
                    <FaCheckCircle className="text-orange-600 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-1">Video Content</h4>
                      <p className="text-sm text-orange-700">Upload high-quality videos with clear audio for better engagement.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Quick Checklist:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Clear course title and description
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Appropriate category selection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Engaging course thumbnail
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Well-structured content sections
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Quality video lectures
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      Clear learning objectives
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Pro Tips</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Save your progress regularly</li>
                    <li>• Preview before publishing</li>
                    <li>• Test all video uploads</li>
                    <li>• Write clear descriptions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
