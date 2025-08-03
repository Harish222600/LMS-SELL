import React from 'react'
import { motion } from 'framer-motion'

const BenefitsForEmployers = () => {
  const benefits = [
    {
      id: "01",
      title: "Get Skilled RESOURCE",
      description: "Access to highly trained and qualified professionals",
      icon: "👥"
    },
    {
      id: "02", 
      title: "Zero Investment on Training",
      description: "Save costs with pre-trained talent pool",
      icon: "💰"
    },
    {
      id: "03",
      title: "Zero Investment on Recruitment",
      description: "Streamlined hiring process at no additional cost",
      icon: "📋"
    },
    {
      id: "04",
      title: "Get highly Productive & Efficient Team",
      description: "Work with motivated and skilled professionals",
      icon: "🎯"
    }
  ]

  return (
    <div className='relative w-11/12 max-w-maxContent mx-auto py-24'>
      {/* Academic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-academic-cream-50 to-academic-slate-50 opacity-95 rounded-2xl"></div>
      
      {/* Content Container */}
      <div className='relative z-10'>
        {/* Section Title */}
        <div className='text-center mb-20'>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='classic-heading text-5xl text-academic-navy-900 mb-6'
          >
            Benefits for 
            <span className="bg-gradient-to-r from-academic-gold-600 to-academic-gold-500 bg-clip-text text-transparent ml-3">
              Employers
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='section-subtitle text-xl text-academic-slate-600 max-w-3xl mx-auto'
          >
            Partner with Beeja Academy to access top talent and transform your workforce with our comprehensive training programs
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative'>
          {/* Connecting Lines - Visible on larger screens */}
          <div className='hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-academic-navy-300 via-academic-gold-400 to-academic-navy-300 transform -translate-y-1/2 opacity-30 rounded-full'></div>

          {/* Benefits Cards */}
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className='relative'
            >
              {/* Card Container */}
              <div className='classic-card p-8 h-full hover:shadow-elegant transition-all duration-300 group'>
                {/* Number Badge */}
                <div className='absolute -top-4 left-8 bg-gradient-to-r from-academic-navy-800 to-academic-navy-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-elegant border-2 border-academic-gold-400'>
                  {benefit.id}
                </div>

                {/* Icon */}
                <div className='text-5xl mb-6 mt-4 group-hover:scale-110 transition-transform duration-300'>{benefit.icon}</div>

                {/* Content */}
                <h3 className='elegant-heading text-xl text-academic-navy-900 mb-4 group-hover:text-academic-gold-700 transition-colors duration-300'>
                  {benefit.title}
                </h3>
                <p className='text-academic-slate-600 leading-relaxed'>
                  {benefit.description}
                </p>

                {/* Decorative Element */}
                <div className='absolute bottom-4 right-4 w-8 h-8 bg-academic-gold-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                  <div className='w-3 h-3 bg-academic-gold-500 rounded-full'></div>
                </div>
              </div>

              {/* Connecting Line for larger screens */}
              {index < benefits.length - 1 && (
                <div className='hidden lg:block absolute top-1/2 right-[-2rem] w-16 border-t-2 border-dashed border-academic-slate-300 transform -translate-y-1/2 z-20'></div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className='text-center mt-16'
        >
          <div className='bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 rounded-2xl p-8 shadow-elegant'>
            <h3 className='elegant-heading text-2xl text-white mb-4'>
              Ready to Transform Your Workforce?
            </h3>
            <p className='text-academic-slate-200 mb-6 max-w-2xl mx-auto'>
              Join hundreds of companies that have already benefited from our skilled professionals and comprehensive training programs.
            </p>
            <button className='btn-elegant px-8 py-4 text-lg font-semibold'>
              Partner With Us Today
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BenefitsForEmployers
