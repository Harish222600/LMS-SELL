import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { FiClock, FiUsers, FiStar, FiPlay, FiBookOpen, FiArrowLeft } from "react-icons/fi"
import { BsCheckCircle } from "react-icons/bs"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/common/ConfirmationModal"
import ImprovedFooter from "../components/common/ImprovedFooter"
import RatingStars from "../components/common/RatingStars"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import { requestCourseAccess } from "../services/operations/courseAccessAPI"

import GetAvgRating from "../utils/avgRating"
import { ACCOUNT_TYPE } from './../utils/constants';
import { addToCart } from "../slices/cartSlice"

import { MdOutlineVerified } from 'react-icons/md'
import Img from './../components/common/Img';
import toast from "react-hot-toast"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { courseId } = useParams()
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    const fectchCourseDetailsData = async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    }
    fectchCourseDetailsData();
  }, [courseId])

  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
    setAvgReviewCount(count)
  }, [response])

  const [isActive, setIsActive] = useState(Array(0))
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    )
  }

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  if (paymentLoading || loading || !response) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="classic-card p-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-2/3 space-y-4">
                <div className="h-8 bg-academic-slate-200 rounded-lg animate-pulse"></div>
                <div className="h-6 bg-academic-slate-200 rounded-lg animate-pulse w-3/4"></div>
                <div className="h-4 bg-academic-slate-200 rounded-lg animate-pulse w-1/2"></div>
              </div>
              <div className="w-full sm:w-1/3">
                <div className="h-48 bg-academic-slate-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-academic-slate-200 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-academic-slate-200 rounded-lg animate-pulse w-5/6"></div>
              <div className="h-4 bg-academic-slate-200 rounded-lg animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
    tag
  } = response?.data?.courseDetails

  const handleBuyCourse = () => {
    if (!courseId) {
      toast.error("Course information not available")
      return
    }
    
    if (token) {
      navigate("/course-checkout", { state: { course: response?.data?.courseDetails } })
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  const handleAddToCart = () => {
    if (!response?.data?.courseDetails) {
      toast.error("Course information not available")
      return
    }

    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    
    if (token) {
      dispatch(addToCart(response.data.courseDetails))
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
    if (!courseId) {
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
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
        {/* Academic Hero Section */}
        <div className="relative bg-gradient-to-br from-academic-navy-800 via-academic-navy-700 to-academic-navy-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-academic-gold-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-academic-gold-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-16">
              <div className="lg:col-span-2">
                <motion.button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-academic-slate-200 hover:text-white mb-8 transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiArrowLeft className="w-5 h-5" />
                  Back to Courses
                </motion.button>

                <motion.div 
                  className="lg:hidden mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-elegant">
                    <Img
                      src={thumbnail}
                      alt="course thumbnail"
                      className="aspect-video w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-academic-navy-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-academic-navy-900 border border-academic-slate-200">
                        <FiPlay className="w-4 h-4 text-academic-gold-600" />
                        <span className="text-sm font-medium">Preview Course</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="text-white space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div>
                    <h1 className="classic-heading text-4xl lg:text-5xl text-white mb-4 leading-tight">
                      {courseName}
                    </h1>
                    <p className="text-xl text-academic-slate-200 leading-relaxed max-w-3xl">
                      {courseDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2 bg-academic-gold-500/20 px-4 py-2 rounded-lg border border-academic-gold-400/30">
                      <FiStar className="w-4 h-4 text-academic-gold-400" />
                      <span className="text-academic-gold-300 font-semibold">{avgReviewCount}</span>
                      <RatingStars Review_Count={avgReviewCount} Star_Size={18} />
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                      <span className="text-white font-medium">{ratingAndReviews.length} reviews</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 text-academic-slate-200">
                      <FiUsers className="w-4 h-4" />
                      <span>{studentsEnrolled.length} students</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                    <Img
                      src={instructor?.image ?? ''}
                      alt="Instructor"
                      className="h-12 w-12 rounded-full object-cover border-2 border-academic-gold-400 shadow-md"
                    />
                    <div>
                      <p className="text-academic-slate-300 text-sm">Created by</p>
                      <p className="font-semibold text-white flex items-center gap-2">
                        {instructor?.firstName ?? ''} {instructor?.lastName ?? ''}
                        <MdOutlineVerified className="w-4 h-4 text-blue-400" />
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20 text-academic-slate-200">
                      <BiInfoCircle className="w-4 h-4" />
                      <span className="text-sm">Created {formatDate(createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg border border-white/20 text-academic-slate-200">
                      <HiOutlineGlobeAlt className="w-4 h-4" />
                      <span className="text-sm">English</span>
                    </div>
                  </div>

                  <motion.div 
                    className="lg:hidden classic-card p-6 bg-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-6">
                      {response?.data?.courseDetails?.courseType === 'Free' ? (
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-green-700 font-playfair">Free</span>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold border border-green-200">
                            100% OFF
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-3xl font-bold text-academic-navy-900 font-playfair">₹{price}</p>
                          <div className="bg-academic-gold-100 text-academic-gold-800 px-3 py-1 rounded-lg text-sm font-medium border border-academic-gold-200">
                            Best Seller
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className={`inline-flex px-4 py-2 rounded-full font-bold text-sm mb-6
                      ${response?.data?.courseDetails?.courseType === 'Free' 
                        ? "bg-green-100 text-green-800 border border-green-200" 
                        : "bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-200"}`}>
                      {response?.data?.courseDetails?.courseType === 'Free' ? "FREE COURSE" : "PREMIUM COURSE"}
                    </div>

                    {user?.accountType === ACCOUNT_TYPE.ADMIN ? (
                      <button 
                        className="btn-elegant w-full"
                        onClick={() => navigate('/admin')}
                        disabled={!courseId}
                      >
                        Manage Course
                      </button>
                    ) : 
                    user?.accountType === ACCOUNT_TYPE.INSTRUCTOR ? (
                      instructor?._id === user?._id ? (
                        <button 
                          className="btn-elegant w-full"
                          onClick={() => navigate('/dashboard/my-courses')}
                          disabled={!courseId}
                        >
                          Manage Course
                        </button>
                      ) : (
                        <div className="bg-academic-slate-100 text-academic-slate-700 font-medium py-3 px-6 rounded-lg text-center border border-academic-slate-300">
                          <p className="text-sm">You can only manage courses you've created</p>
                          <p className="text-xs mt-1">This course is managed by {instructor?.firstName} {instructor?.lastName}</p>
                        </div>
                      )
                    ) :
                    response?.data?.courseDetails?.courseType === 'Free' ? (
                      <button 
                        className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-elegant hover:shadow-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        onClick={
                          user && response?.data?.courseDetails?.studentsEnrolled?.includes(user?._id)
                            ? () => navigate("/dashboard/enrolled-courses")
                            : handleRequestAccess
                        }
                      >
                        {user && response?.data?.courseDetails?.studentsEnrolled?.includes(user?._id)
                          ? "Go To Course"
                          : "Get Free Access"}
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <button 
                          className="btn-elegant w-full"
                          onClick={handleBuyCourse}
                        >
                          Buy Now
                        </button>
                        <button 
                          onClick={handleAddToCart} 
                          className="btn-classic-secondary w-full"
                        >
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </div>

              <motion.div 
                className="hidden lg:block"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <CourseDetailsCard
                  course={response?.data?.courseDetails}
                  setConfirmationModal={setConfirmationModal}
                  handleBuyCourse={handleBuyCourse}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              
              {/* What you'll learn section */}
              <motion.div 
                className="classic-card p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-academic-gold-100 rounded-xl flex items-center justify-center">
                    <FiBookOpen className="w-6 h-6 text-academic-gold-700" />
                  </div>
                  <h2 className="elegant-heading">What you'll learn</h2>
                </div>
                <div className="grid gap-4">
                  {whatYouWillLearn && whatYouWillLearn.trim() ? (
                    whatYouWillLearn.split('\n').filter(line => line.trim()).map((line, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-start gap-3 p-4 bg-academic-cream-50 rounded-lg border border-academic-cream-200 hover:bg-academic-cream-100 transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <BsCheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-academic-slate-700 leading-relaxed">{line.trim()}</p>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex items-start gap-3 p-4 bg-academic-slate-50 rounded-lg border border-academic-slate-200">
                      <BsCheckCircle className="w-5 h-5 text-academic-gold-600 mt-0.5 flex-shrink-0" />
                      <p className="text-academic-slate-600 leading-relaxed italic">
                        Course learning objectives will be updated soon.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Course Content Section */}
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="classic-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FiPlay className="w-6 h-6 text-blue-700" />
                    </div>
                    <h2 className="elegant-heading">Course Content</h2>
                  </div>
                  
                  <div className="flex flex-wrap justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-lg border border-academic-slate-200 text-academic-slate-700">
                        <FiBookOpen className="w-4 h-4" />
                        <span className="text-sm font-medium">{courseContent.length} sections</span>
                      </div>
                      <div className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-lg border border-academic-slate-200 text-academic-slate-700">
                        <FiPlay className="w-4 h-4" />
                        <span className="text-sm font-medium">{totalNoOfLectures} lectures</span>
                      </div>
                      <div className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-lg border border-academic-slate-200 text-academic-slate-700">
                        <FiClock className="w-4 h-4" />
                        <span className="text-sm font-medium">{response.data?.totalDuration} total</span>
                      </div>
                    </div>
                    <motion.button
                      className="bg-academic-gold-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-academic-gold-600 transition-all duration-200 shadow-classic"
                      onClick={() => setIsActive([])}
                      whileHover={{ scale: 1.05 }}
                    >
                      Collapse All Sections
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-4">
                  {courseContent?.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <CourseAccordionBar
                        course={course}
                        isActive={isActive}
                        handleActive={handleActive}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Instructor Section */}
              <motion.div 
                className="classic-card p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="elegant-heading mb-6">Meet Your Instructor</h2>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Img
                      src={instructor?.image ?? ''}
                      alt="Author"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-academic-gold-500 shadow-classic"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-1 border-2 border-white">
                      <MdOutlineVerified className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-academic-navy-900 mb-2 font-playfair">
                      {`${instructor?.firstName ?? ''} ${instructor?.lastName ?? ''}`}
                    </h3>
                    <p className="text-academic-slate-700 leading-relaxed">
                      {instructor?.additionalDetails?.about || "Experienced instructor passionate about teaching and helping students achieve their goals."}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <ImprovedFooter />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
