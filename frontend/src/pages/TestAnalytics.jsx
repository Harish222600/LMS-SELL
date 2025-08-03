import React from 'react';
import { motion } from 'framer-motion';
import EnhancedAnalytics from './Admin/components/EnhancedAnalytics';
import { FaChartBar } from 'react-icons/fa';
import HighlightText from '../components/core/HomePage/HighlightText';

const TestAnalytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-20">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-academic-gold-100 text-academic-gold-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaChartBar className="w-4 h-4" />
            Analytics Dashboard
          </div>
          <h1 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
            Test
            <HighlightText text=" Analytics" variant="gold" />
          </h1>
          <p className="section-subtitle text-academic-slate-600 text-lg max-w-2xl mx-auto">
            Comprehensive analytics and insights for testing and performance monitoring
          </p>
        </div>
      </motion.div>

      {/* Analytics Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
      >
        <div className="classic-card p-6">
          <EnhancedAnalytics />
        </div>
      </motion.div>
    </div>
  );
};

export default TestAnalytics;
