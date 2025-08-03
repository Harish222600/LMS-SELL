import React from 'react'
import { motion } from 'framer-motion'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative mx-auto py-16 pb-24 text-center"
    >
      {/* Academic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 rounded-2xl opacity-95"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-2 border-academic-gold-400 rounded-full opacity-20"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-2 border-academic-gold-400 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 border-2 border-academic-gold-400 rounded-full opacity-15"></div>
      
      {/* Quote Content */}
      <div className="relative z-10 px-8 md:px-16">
        {/* Quote Icon */}
        <div className="text-6xl text-academic-gold-400 mb-8 opacity-60">"</div>
        
        <blockquote className="classic-heading text-2xl md:text-4xl lg:text-5xl leading-relaxed text-white max-w-5xl mx-auto">
          We are passionate about revolutionizing the way we learn. Our
          innovative platform{" "}
          <HighlightText text="combines technology" variant="gold" />,{" "}
          <span className="bg-gradient-to-r from-academic-gold-400 to-academic-gold-600 text-transparent bg-clip-text font-bold">
            expertise
          </span>
          , and community to create an{" "}
          <span className="bg-gradient-to-r from-academic-gold-500 to-academic-gold-300 text-transparent bg-clip-text font-bold">
            unparalleled educational experience.
          </span>
        </blockquote>
        
        {/* Attribution */}
        <div className="mt-12 pt-8 border-t border-academic-gold-400/30">
          <p className="text-academic-gold-300 text-lg font-medium">
            — Beeja Academy Team
          </p>
          <p className="text-academic-slate-300 text-sm mt-2">
            Committed to Excellence in Education
          </p>
        </div>
        
        {/* Decorative Line */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent to-academic-gold-400 rounded-full"></div>
          <div className="w-3 h-3 bg-academic-gold-500 rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-l from-transparent to-academic-gold-400 rounded-full"></div>
        </div>
      </div>
    </motion.div>
  )
}

export default Quote
