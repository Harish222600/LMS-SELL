import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"

import { getFullDetailsOfCourse, } from "../../../../services/operations/courseDetailsAPI"
import { setCourse, setEditCourse } from "../../../../slices/courseSlice"
import RenderSteps from "../AddCourse/RenderSteps"
import Loading from './../../../common/Loading';

export default function EditCourse() {
  const dispatch = useDispatch()
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      setLoading(true)
      const result = await getFullDetailsOfCourse(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true))
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false)
    }

    fetchFullCourseDetails();
  }, [])

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 to-academic-slate-50 flex items-center justify-center">
        <Loading />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 to-academic-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full items-start gap-8"
        >
          <div className="flex flex-1 flex-col">
            {/* Header Section */}
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="classic-heading text-4xl text-academic-navy-900 text-center sm:text-left mb-3"
              >
                Edit Course
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-academic-slate-600 text-lg text-center sm:text-left"
              >
                Update your course content and settings to provide the best learning experience
              </motion.p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loading />
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1"
              >
                {course ? (
                  <div className="classic-card p-8">
                    <RenderSteps />
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="classic-card p-12 text-center"
                  >
                    <div className="mb-6">
                      <div className="w-24 h-24 bg-academic-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-academic-slate-400">📚</span>
                      </div>
                      <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">
                        Course Not Found
                      </h3>
                      <p className="text-academic-slate-600 text-lg">
                        The course you're looking for doesn't exist or has been removed.
                      </p>
                    </div>
                    <button
                      onClick={() => window.history.back()}
                      className="btn-elegant px-8 py-3"
                    >
                      Go Back
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Course Upload Tips Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="sticky top-6 hidden lg:block max-w-[400px] flex-1"
          >
            <div className="classic-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-academic-gold-100 rounded-full flex items-center justify-center">
                  <span className="text-academic-gold-600 text-xl">⚡</span>
                </div>
                <h3 className="elegant-heading text-xl text-academic-navy-900">
                  Course Edit Tips
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  "Review and update course pricing or keep it free",
                  "Ensure thumbnail meets standard size (1024x576)",
                  "Update course overview video if needed",
                  "Reorganize content in Course Builder section",
                  "Add or modify topics, lessons, and assignments",
                  "Update additional course information",
                  "Make announcements for enrolled students",
                  "Review and update course notes"
                ].map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-academic-cream-50 rounded-lg border border-academic-slate-200"
                  >
                    <div className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-academic-slate-700 leading-relaxed">
                      {tip}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Additional Help Section */}
              <div className="mt-8 p-4 bg-academic-navy-50 rounded-lg border border-academic-navy-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-academic-navy-600">💡</span>
                  <h4 className="font-semibold text-academic-navy-900">Need Help?</h4>
                </div>
                <p className="text-sm text-academic-slate-600 mb-3">
                  Having trouble editing your course? Check our documentation or contact support.
                </p>
                <button className="btn-classic-secondary text-sm px-4 py-2">
                  Get Support
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
