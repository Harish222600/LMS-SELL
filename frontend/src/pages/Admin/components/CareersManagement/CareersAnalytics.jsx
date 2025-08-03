import React from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaCheckCircle, FaUserTie, FaChartLine, FaCalendarAlt, FaGraduationCap } from 'react-icons/fa';

const CareersAnalytics = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="classic-card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-academic-slate-200 border-t-academic-navy-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-academic-gold-600 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-academic-navy-600',
      green: 'bg-green-600',
      yellow: 'bg-academic-gold-600',
      purple: 'bg-purple-600',
      red: 'bg-red-600'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="classic-card p-6 hover:shadow-elegant transition-shadow duration-300"
        whileHover={{ y: -2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-academic-slate-600 text-sm font-medium font-inter">{title}</p>
            <p className="text-3xl font-bold text-academic-navy-900 mt-1 font-playfair">{value}</p>
            {subtitle && (
              <p className="text-academic-slate-500 text-sm mt-1 font-inter">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-classic`}>
            {icon}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Academic Header */}
      <motion.div 
        className="classic-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-academic-navy-100 rounded-xl">
            <FaChartLine className="text-2xl text-academic-navy-600" />
          </div>
          <div>
            <h2 className="elegant-heading text-3xl text-academic-navy-900">Careers Analytics</h2>
            <p className="text-academic-slate-600 mt-1">Overview of job postings and applications</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaBriefcase className="text-white text-xl" />}
          title="Total Jobs"
          value={analytics.jobs?.total || 0}
          subtitle={`${analytics.jobs?.published || 0} published`}
          color="blue"
        />
        
        <StatCard
          icon={<FaUsers className="text-white text-xl" />}
          title="Total Applications"
          value={analytics.applications?.total || 0}
          subtitle={`${analytics.applications?.pending || 0} pending review`}
          color="green"
        />
        
        <StatCard
          icon={<FaCheckCircle className="text-white text-xl" />}
          title="Shortlisted"
          value={analytics.applications?.shortlisted || 0}
          subtitle="Candidates in pipeline"
          color="yellow"
        />
        
        <StatCard
          icon={<FaUserTie className="text-white text-xl" />}
          title="Hired"
          value={analytics.applications?.hired || 0}
          subtitle="Successful placements"
          color="purple"
        />
      </div>

      {/* Academic Job Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="classic-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaBriefcase className="w-5 h-5 text-academic-navy-600" />
            <h3 className="text-lg font-semibold text-academic-navy-900 font-inter">Job Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-academic-slate-700 font-inter">Published Jobs</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-academic-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${analytics.jobs?.total > 0 ? (analytics.jobs.published / analytics.jobs.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-academic-navy-900 font-semibold font-inter w-8 text-right">{analytics.jobs?.published || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-academic-slate-700 font-inter">Draft Jobs</span>
              <div className="flex items-center gap-3">
                <div className="w-24 bg-academic-slate-200 rounded-full h-2">
                  <div 
                    className="bg-academic-gold-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${analytics.jobs?.total > 0 ? (analytics.jobs.draft / analytics.jobs.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <span className="text-academic-navy-900 font-semibold font-inter w-8 text-right">{analytics.jobs?.draft || 0}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="classic-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaUsers className="w-5 h-5 text-academic-navy-600" />
            <h3 className="text-lg font-semibold text-academic-navy-900 font-inter">Application Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-academic-slate-700 font-inter">Pending</span>
              <span className="text-academic-navy-900 font-semibold font-inter">{analytics.applications?.pending || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-academic-slate-700 font-inter">Shortlisted</span>
              <span className="text-academic-navy-900 font-semibold font-inter">{analytics.applications?.shortlisted || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-academic-slate-700 font-inter">Hired</span>
              <span className="text-academic-navy-900 font-semibold font-inter">{analytics.applications?.hired || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Academic Applications by Department */}
      {analytics.applicationsByDepartment && analytics.applicationsByDepartment.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="classic-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaGraduationCap className="w-5 h-5 text-academic-navy-600" />
            <h3 className="text-lg font-semibold text-academic-navy-900 font-inter">Applications by Department</h3>
          </div>
          <div className="space-y-4">
            {analytics.applicationsByDepartment.map((dept, index) => {
              const maxCount = Math.max(...analytics.applicationsByDepartment.map(d => d.count));
              const percentage = (dept.count / maxCount) * 100;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-academic-slate-700 flex-1 font-inter font-medium">{dept._id}</span>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-full bg-academic-slate-200 rounded-full h-2">
                      <div 
                        className="bg-academic-navy-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-academic-navy-900 font-semibold w-8 text-right font-inter">{dept.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Academic Recent Applications */}
      {analytics.recentApplications && analytics.recentApplications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="classic-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FaCalendarAlt className="w-5 h-5 text-academic-navy-600" />
            <h3 className="text-lg font-semibold text-academic-navy-900 font-inter">Recent Applications</h3>
          </div>
          <div className="space-y-4">
            {analytics.recentApplications.slice(0, 5).map((application, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-academic-slate-200 last:border-b-0">
                <div className="flex-1">
                  <p className="text-academic-navy-900 font-semibold font-inter">{application.applicantName}</p>
                  <p className="text-academic-slate-600 text-sm font-inter">{application.job?.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-academic-slate-500 text-sm font-inter mb-1">{formatDate(application.createdAt)}</p>
                  <span className={`px-3 py-1 text-xs rounded-full font-semibold font-inter ${
                    application.status === 'Pending' ? 'bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-300' :
                    application.status === 'Shortlisted' ? 'bg-green-100 text-green-800 border border-green-300' :
                    application.status === 'Hired' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                    'bg-academic-slate-100 text-academic-slate-800 border border-academic-slate-300'
                  }`}>
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Academic Empty State */}
      {(!analytics.jobs?.total && !analytics.applications?.total) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="classic-card p-12 text-center"
        >
          <div className="p-6 bg-academic-slate-100 rounded-full mb-6 inline-block">
            <FaChartLine className="text-4xl text-academic-slate-400" />
          </div>
          <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">No Data Available</h3>
          <p className="text-academic-slate-600 max-w-md mx-auto leading-relaxed font-inter">
            Analytics will appear here once you start posting jobs and receiving applications.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default CareersAnalytics;
