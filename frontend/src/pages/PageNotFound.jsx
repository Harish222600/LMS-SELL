import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa'

const PageNotFound = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative">
              <h1 className="text-8xl md:text-9xl font-bold text-academic-navy-200 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-4 border-academic-gold-300 border-t-academic-gold-600 rounded-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg text-academic-slate-600 mb-2">
              The page you're looking for seems to have wandered off into the digital wilderness.
            </p>
            <p className="text-academic-slate-500">
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="classic-card p-6 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHome className="text-academic-navy-700 text-xl" />
              </div>
              <h3 className="font-bold text-academic-navy-900 mb-2">Go Home</h3>
              <p className="text-sm text-academic-slate-600">Return to our homepage and start fresh</p>
            </div>

            <div className="classic-card p-6 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-academic-gold-700 text-xl" />
              </div>
              <h3 className="font-bold text-academic-navy-900 mb-2">Search Courses</h3>
              <p className="text-sm text-academic-slate-600">Find the perfect course for your learning journey</p>
            </div>

            <div className="classic-card p-6 text-center hover:shadow-elegant transition-all duration-300">
              <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaArrowLeft className="text-academic-navy-700 text-xl" />
              </div>
              <h3 className="font-bold text-academic-navy-900 mb-2">Go Back</h3>
              <p className="text-sm text-academic-slate-600">Return to the previous page you visited</p>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to='/'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-elegant flex items-center gap-2 px-8 py-4 text-lg font-bold"
              >
                <FaHome className="text-sm" />
                Back to Home
              </motion.button>
            </Link>

            <Link to='/courses'>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-classic-secondary flex items-center gap-2 px-8 py-4 text-lg font-medium"
              >
                <FaSearch className="text-sm" />
                Browse Courses
              </motion.button>
            </Link>
          </motion.div>

          {/* Fun Fact */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 p-6 bg-academic-gold-50 rounded-xl border border-academic-gold-200"
          >
            <p className="text-sm text-academic-slate-600">
              <span className="font-semibold text-academic-gold-700">Fun Fact:</span> The first 404 error was 
              discovered at CERN in 1992. Now you're part of internet history! 🎉
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PageNotFound
