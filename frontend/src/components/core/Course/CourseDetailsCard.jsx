import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { requestCourseAccess } from "../../../services/operations/courseAccessAPI"
import RatingStars from "../../common/RatingStars"
import Img from './../../common/Img';

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = async () => {
    if (!course?._id) {
      toast.error("Course information not available")
      return
    }

    const shareData = {
      title: course.courseName,
      text: course.courseDescription,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        // Use native sharing on mobile devices
        await navigator.share(shareData)
      } else {
        // Fallback for desktop - copy to clipboard
        copy(window.location.href)
        toast.success("Link copied to clipboard")
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled the share
        return
      }
      // Fallback if sharing fails
      copy(window.location.href)
      toast.success("Link copied to clipboard")
    }
  }

  const handleAddToCart = () => {
    if (!course) {
      toast.error("Course information not available")
      return
    }

    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    
    if (token) {
      dispatch(addToCart(course))
      return
    }
    
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleRequestAccess = async () => {
    if (!course?._id) {
      toast.error("Course information not available")
      return
    }

    if (!user) {
      toast.error("Please login to request access");
      navigate("/login");
      return;
    }

    try {
      const response = await requestCourseAccess({ courseId, requestMessage: "" }, token);
      if (response) {
        toast.success("Access request submitted successfully");
      }
    } catch (error) {
      console.error("Error requesting access:", error);
      toast.error("Failed to submit access request");
    }
  };

  return (
    <>
      <div data-course-component className="classic-card flex flex-col gap-6 p-6 shadow-elegant border-2 border-academic-slate-200 hover:shadow-2xl transition-all duration-300">
        {/* Course Image */}
        <div className="relative overflow-hidden rounded-xl">
          <Img
            src={ThumbnailImage}
            alt={course?.courseName}
            className="max-h-[300px] min-h-[180px] w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="space-y-6">
          {/* Price Section */}
          <div className="pb-4 border-b border-academic-slate-200">
            {course?.courseType === 'Free' ? (
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold border-2 border-green-200">
                  100% FREE
                </div>
              </div>
            ) : (
              <span className="text-3xl font-bold text-academic-navy-900">₹{CurrentPrice}</span>
            )}
          </div>
          
          {/* Rating Display */}
          {(course?.averageRating > 0 || course?.totalRatings > 0) && (
            <div className="flex items-center gap-3 pb-4 border-b border-academic-slate-200">
              <span className="text-academic-gold-600 text-lg font-semibold">
                {course?.averageRating || 0}
              </span>
              <RatingStars Review_Count={course?.averageRating || 0} />
              <span className="text-academic-slate-600 text-sm">
                ({course?.totalRatings || 0} ratings)
              </span>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {/* Course Type Badge */}
            <div className={`inline-flex px-4 py-2 rounded-full font-bold text-sm mb-4 ${
              course?.courseType === 'Free' 
                ? "bg-green-100 text-green-800 border-2 border-green-200" 
                : "bg-academic-navy-100 text-academic-navy-800 border-2 border-academic-navy-200"
            } shadow-sm`}>
              {course?.courseType === 'Free' ? "FREE COURSE" : "PREMIUM COURSE"}
            </div>

            {/* Admin Role - Can manage all courses */}
            {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
              <button
                className="btn-elegant w-full py-4 text-lg font-semibold"
                onClick={() => navigate('/admin')}
                disabled={!course?._id}
              >
                Manage Course
              </button>
            ) : 
            /* Instructor Role - Can manage only their own courses */
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
              course?.instructor?._id === user?._id ? (
                <button
                  className="btn-elegant w-full py-4 text-lg font-semibold"
                  onClick={() => navigate('/dashboard/my-courses')}
                  disabled={!course?._id}
                >
                  Manage Course
                </button>
              ) : (
                <div className="w-full bg-academic-slate-100 text-academic-slate-700 font-medium py-4 px-6 rounded-lg text-center border-2 border-academic-slate-200">
                  <p className="text-sm font-semibold">You can only manage courses you've created</p>
                  <p className="text-xs mt-2 text-academic-slate-600">This course is managed by {course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                </div>
              )
            ) :
            /* Student Role - Normal buy/request access flow */
            course?.courseType === 'Free' ? (
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-elegant transform hover:scale-105"
                onClick={
                  user && course?.studentsEnrolled?.includes(user?._id)
                    ? () => navigate("/dashboard/enrolled-courses")
                    : handleRequestAccess
                }
              >
                {user && course?.studentsEnrolled?.includes(user?._id)
                  ? "Go To Course"
                  : "Get Free Access"}
              </button>
            ) : (
              <>
                <button
                  className="btn-elegant w-full py-4 text-lg font-semibold"
                  onClick={
                    user && course?.studentsEnrolled?.includes(user?._id)
                      ? () => navigate("/dashboard/enrolled-courses")
                      : () => navigate("/course-checkout", { state: { course } })
                  }
                  disabled={!course?._id}
                >
                  {user && course?.studentsEnrolled?.includes(user?._id)
                    ? "Go To Course"
                    : "Buy Now"}
                </button>
              </>
            )}
          </div>

          {/* Course Requirements Section with Fallback */}
          <div className="mt-6 border-t-2 border-academic-slate-200 pt-6">
            <h3 className="mb-4 elegant-heading text-xl text-academic-navy-900">
              Course Requirements:
            </h3>
            <div className="flex flex-col gap-3 text-sm">
              {course?.instructions && course.instructions.length > 0 ? (
                course.instructions.map((item, i) => (
                  <div className="flex items-start gap-3" key={i}>
                    <BsFillCaretRightFill className="mt-1 text-academic-gold-600 flex-shrink-0" />
                    <span className="text-academic-slate-700 leading-relaxed">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-academic-slate-600 italic bg-academic-slate-50 p-4 rounded-lg border border-academic-slate-200">
                  No specific requirements listed for this course.
                </p>
              )}
            </div>
          </div>

          {/* Share Button */}
          <div className="text-center pt-4 border-t border-academic-slate-200">
            <button
              className="mx-auto flex items-center gap-3 py-3 px-6 text-academic-gold-700 hover:text-academic-gold-800 hover:bg-academic-gold-50 rounded-lg transition-all duration-300 font-medium"
              onClick={handleShare}
            >
              <FaShareSquare size={16} /> 
              <span>Share Course</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard
