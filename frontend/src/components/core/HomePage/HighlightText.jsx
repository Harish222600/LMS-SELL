import React from 'react'

const HighlightText = ({ text, variant = "gold" }) => {
  const variants = {
    gold: 'font-bold text-academic-gold-600 relative inline-block',
    navy: 'font-bold text-academic-navy-700 relative inline-block',
    elegant: 'font-bold text-academic-navy-800 relative inline-block bg-gradient-to-r from-academic-gold-500 to-academic-gold-600 bg-clip-text text-transparent'
  }

  return (
    <span className={`${variants[variant]} classic-highlight`}>
      {" "}
      {text}
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-academic-gold-400 opacity-30"></span>
    </span>
  )
}

export default HighlightText
