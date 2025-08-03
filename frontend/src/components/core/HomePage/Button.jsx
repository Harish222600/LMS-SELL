import React from 'react'
import {Link} from "react-router-dom"

const Button = ({children, active, linkto, variant = "default", className = ""}) => {
  const getButtonStyles = () => {
    if (variant === "elegant") {
      return active 
        ? "btn-elegant" 
        : "btn-classic-secondary";
    }
    
    return active 
      ? "btn-classic-primary hover:shadow-classic-lg transform hover:-translate-y-1" 
      : "btn-classic-secondary hover:bg-academic-slate-50";
  }

  return (
    <Link to={linkto} className="inline-block">
      <div className={`${getButtonStyles()} transition-all duration-300 ${className}`}>
        {children}
      </div>
    </Link>
  )
}

export default Button
