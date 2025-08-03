import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { useSelector } from "react-redux"

import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from './../../common/IconBtn';
import Img from './../../common/Img';




export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ratingChanged = (newRating) => {
    // console.log(newRating)
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  // Prevent keyboard events from propagating to video player
  const handleKeyDown = (e) => {
    e.stopPropagation()
  }

  const handleKeyUp = (e) => {
    e.stopPropagation()
  }

  const handleKeyPress = (e) => {
    e.stopPropagation()
  }

  return (
    <div 
      className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-black bg-opacity-50 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onKeyPress={handleKeyPress}
    >
      <div 
        className="my-10 w-11/12 max-w-[700px] classic-card bg-white shadow-elegant"
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onKeyPress={handleKeyPress}
      >
        {/* Academic Modal Header */}
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-3 rounded-xl">
                <svg className="w-6 h-6 text-academic-gold-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h2 className="elegant-heading text-academic-navy-900">Add Course Review</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Share your learning experience</p>
              </div>
            </div>
            <button 
              onClick={() => setReviewModal(false)}
              className="text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
            >
              <RxCross2 className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Academic Modal Body */}
        <div className="p-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            <Img
              src={user?.image}
              alt={user?.firstName + "profile"}
              className="aspect-square w-16 h-16 rounded-full object-cover border-3 border-academic-slate-200 shadow-classic"
            />
            <div className="text-center">
              <p className="text-lg font-bold text-academic-navy-900 capitalize font-playfair">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-academic-slate-600 font-inter">Posting Publicly</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onKeyPress={handleKeyPress}
          >
            {/* Academic Rating Section */}
            <div className="text-center">
              <label className="classic-label block mb-4">
                Rate Your Experience
              </label>
              <div className="flex justify-center">
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={32}
                  activeColor="#d97706"
                  inactiveColor="#e2e8f0"
                />
              </div>
            </div>

            {/* Academic Review Text Section */}
            <div className="space-y-3">
              <label
                className="classic-label"
                htmlFor="courseExperience"
              >
                Share Your Experience <sup className="text-red-500">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Tell us about your learning journey, what you liked, and how this course helped you..."
                {...register("courseExperience", { required: true })}
                className="classic-textarea min-h-[150px] w-full"
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onKeyPress={handleKeyPress}
              />
              {errors.courseExperience && (
                <span className="text-sm text-red-600 font-inter">
                  Please share your experience with this course
                </span>
              )}
            </div>

            {/* Academic Action Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t border-academic-slate-200">
              <button
                onClick={() => setReviewModal(false)}
                type="button"
                className="btn-classic-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-elegant flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
