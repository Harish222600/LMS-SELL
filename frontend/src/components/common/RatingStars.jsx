import React, { useEffect, useState } from "react"
import {
  TiStarFullOutline,
  TiStarHalfOutline,
  TiStarOutline,
} from "react-icons/ti"

function RatingStars({ Review_Count, Star_Size, className = "" }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  })

  useEffect(() => {
    const wholeStars = Math.floor(Review_Count) || 0
    SetStarCount({
      full: wholeStars,
      half: Number.isInteger(Review_Count) ? 0 : 1,
      empty: Number.isInteger(Review_Count) ? 5 - wholeStars : 4 - wholeStars,
    })
  }, [Review_Count])

  return (
    <div className={`flex gap-1 items-center ${className}`}>
      {/* Full Stars */}
      {starCount.full >= 0 &&
        [...new Array(starCount.full)].map((_, i) => (
          <TiStarFullOutline 
            key={`full-${i}`} 
            size={Star_Size || 20} 
            className="text-academic-gold-500 drop-shadow-sm transition-colors duration-200 hover:text-academic-gold-600" 
          />
        ))}
      
      {/* Half Stars */}
      {starCount.half >= 0 &&
        [...new Array(starCount.half)].map((_, i) => (
          <TiStarHalfOutline 
            key={`half-${i}`} 
            size={Star_Size || 20} 
            className="text-academic-gold-500 drop-shadow-sm transition-colors duration-200 hover:text-academic-gold-600" 
          />
        ))}
      
      {/* Empty Stars */}
      {starCount.empty >= 0 &&
        [...new Array(starCount.empty)].map((_, i) => (
          <TiStarOutline 
            key={`empty-${i}`} 
            size={Star_Size || 20} 
            className="text-academic-slate-300 drop-shadow-sm transition-colors duration-200 hover:text-academic-slate-400" 
          />
        ))}
      
      {/* Rating Value Display */}
      {Review_Count && (
        <span className="ml-2 text-sm font-medium text-academic-slate-600">
          ({Review_Count.toFixed(1)})
        </span>
      )}
    </div>
  );
}

export default RatingStars
