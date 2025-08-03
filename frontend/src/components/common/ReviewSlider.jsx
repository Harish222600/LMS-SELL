import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import Img from './Img';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "swiper/css/autoplay"

// Import Swiper modules
import { FreeMode, Autoplay } from "swiper/modules"

// Icons
import { FaStar } from "react-icons/fa"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    ; (async () => {
      try {
        // First try to get selected reviews
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.SELECTED_REVIEWS_API
        )
        
        if (data?.success && data?.data?.length > 0) {
          // If we have selected reviews, use them
          setReviews(data?.data)
        } else {
          // Fallback to all reviews if no reviews are selected
          const fallbackData = await apiConnector(
            "GET",
            ratingsEndpoints.REVIEWS_DETAILS_API
          )
          if (fallbackData?.data?.success) {
            setReviews(fallbackData?.data?.data)
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
        // Fallback to all reviews on error
        try {
          const fallbackData = await apiConnector(
            "GET",
            ratingsEndpoints.REVIEWS_DETAILS_API
          )
          if (fallbackData?.data?.success) {
            setReviews(fallbackData?.data?.data)
          }
        } catch (fallbackError) {
          console.error("Error fetching fallback reviews:", fallbackError)
        }
      }
    })()
  }, [])

  if(!reviews) return;

  // Duplicate reviews if we have fewer than 6 for better looping
  const displayReviews = reviews.length < 6 ? [...reviews, ...reviews, ...reviews] : reviews;

  return (
    <div className="w-full overflow-hidden">
      <div className="my-12 h-[160px] max-w-maxContentTab lg:max-w-maxContent mx-auto px-6">
        <Swiper
          modules={[FreeMode, Autoplay]}
          breakpoints={{
            320: {
              slidesPerView: 1.1,
              spaceBetween: 20,
            },
            480: {
              slidesPerView: 2.1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 2.5,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3.2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4.3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 5.5,
              spaceBetween: 32,
            },
          }}
          loop={true}
          loopAdditionalSlides={3}
          freeMode={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={1000}
          className="w-full overflow-hidden"
          watchOverflow={true}
          centeredSlides={false}
          slidesPerGroup={1}
          allowTouchMove={true}
          spaceBetween={24}
        >
          {displayReviews.map((review, i) => {
            return (
              <SwiperSlide key={`${review._id}-${i}`}>
                <div className="flex flex-col gap-3 bg-gradient-to-br from-white to-academic-cream-50 p-4 text-sm h-[140px] rounded-xl border-2 border-academic-slate-200 hover:border-academic-gold-400 transition-all duration-300 group shadow-classic hover:shadow-elegant transform hover:scale-[1.02]">
                  {/* Header with user info */}
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-academic-gold-300 shadow-sm">
                        <Img
                          src={
                            review?.user?.image
                              ? review?.user?.image
                              : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                          }
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h1 className="font-semibold text-sm text-academic-navy-900 capitalize truncate pr-2">
                          {`${review?.user?.firstName} ${review?.user?.lastName}`}
                        </h1>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="text-academic-gold-700 text-xs font-bold bg-academic-gold-100 px-2 py-1 rounded-full">
                            {review.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <ReactStars
                          count={5}
                          value={parseInt(review.rating)}
                          size={12}
                          edit={false}
                          activeColor="#d97706"
                          emptyIcon={<FaStar />}
                          fullIcon={<FaStar />}
                        />
                      </div>
                      <h2 className="text-xs font-medium text-academic-slate-600 truncate">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>

                  {/* Review text */}
                  <div className="flex-1 overflow-hidden">
                    <div className="relative">
                      <p className="text-xs text-academic-slate-700 leading-relaxed line-clamp-3 italic">
                        "{review?.review.length > 100 
                          ? `${review?.review.substring(0, 100)}...`
                          : review?.review}"
                      </p>
                      {/* Subtle quote decoration */}
                      <div className="absolute -top-1 -left-1 text-academic-gold-300 text-lg font-bold opacity-50">
                        "
                      </div>
                    </div>
                  </div>

                  {/* Academic accent line */}
                  <div className="w-full h-1 bg-gradient-to-r from-academic-gold-400 to-academic-navy-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
