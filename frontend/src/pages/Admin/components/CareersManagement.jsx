import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaBriefcase, FaCalendarAlt, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import {
  getAllJobs,
  createJob,
  updateJob,
  deleteJob,
  toggleJobPublication,
  getAllApplications,
  getJobsAnalytics
} from '../../../services/operations/jobsAPI';
import JobForm from './CareersManagement/JobForm';
import JobApplications from './CareersManagement/JobApplications';
import CareersAnalytics from './CareersManagement/CareersAnalytics';

const CareersManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJobApplications, setSelectedJobApplications] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchAnalytics();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      console.log('Fetching jobs with token:', token ? 'Token present' : 'No token');
      const result = await getAllJobs(token);
      console.log('Jobs fetch result:', result);
      setJobs(result || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const result = await getAllApplications(token);
      setApplications(result || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const result = await getJobsAnalytics(token);
      setAnalytics(result);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleCreateJob = async (jobData) => {
    const result = await createJob(jobData, token);
    if (result) {
      await fetchJobs();
      await fetchAnalytics();
      setShowJobForm(false);
    }
  };

  const handleUpdateJob = async (jobData) => {
    const result = await updateJob(editingJob._id, jobData, token);
    if (result) {
      await fetchJobs();
      await fetchAnalytics();
      setShowJobForm(false);
      setEditingJob(null);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job? This will also delete all applications for this job.')) {
      const result = await deleteJob(jobId, token);
      if (result) {
        await fetchJobs();
        await fetchApplications();
        await fetchAnalytics();
      }
    }
  };

  const handleTogglePublication = async (jobId) => {
    const result = await toggleJobPublication(jobId, token);
    if (result) {
      await fetchJobs();
      await fetchAnalytics();
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleViewApplications = (job) => {
    setSelectedJobApplications(job);
    setActiveTab('applications');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (isPublished, deadline) => {
    const isExpired = new Date() > new Date(deadline);
    
    if (isExpired) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700 border border-red-200">Expired</span>;
    }
    
    if (isPublished) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">Published</span>;
    }
    
    return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">Draft</span>;
  };

  const tabs = [
    { id: 'jobs', label: 'Job Listings', icon: <FaBriefcase /> },
    { id: 'applications', label: 'Applications', icon: <FaUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FaCalendarAlt /> }
  ];

  if (showJobForm) {
    return (
      <JobForm
        job={editingJob}
        onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
        onCancel={() => {
          setShowJobForm(false);
          setEditingJob(null);
        }}
        loading={loading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="classic-heading text-3xl md:text-4xl">
                Careers Management
              </h1>
              <p className="section-subtitle text-lg mt-2">
                Manage job postings and applications with professional excellence
              </p>
            </div>
            
            {activeTab === 'jobs' && (
              <button
                onClick={() => setShowJobForm(true)}
                className="btn-elegant w-full sm:w-auto"
              >
                <FaPlus className="text-lg" />
                <span>Add New Job</span>
              </button>
            )}
          </div>

          {/* Tabs - Academic Style */}
          <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-xl shadow-classic border border-academic-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center sm:justify-start gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base min-h-[48px] ${
                  activeTab === tab.id
                    ? 'bg-academic-navy-700 text-white shadow-classic'
                    : 'text-academic-slate-600 hover:text-academic-navy-700 hover:bg-academic-navy-50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="classic-card p-6 md:p-8">
          {activeTab === 'jobs' && (
            <div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-10 h-10 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-academic-navy-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaBriefcase className="text-3xl text-academic-navy-600" />
                  </div>
                  <h3 className="elegant-heading mb-3">No jobs posted yet</h3>
                  <p className="section-subtitle mb-6">Create your first job posting to get started with recruiting top talent</p>
                  <button
                    onClick={() => setShowJobForm(true)}
                    className="btn-elegant"
                  >
                    <FaPlus className="text-lg" />
                    Create Job Posting
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-academic-slate-200 pb-4">
                    <h2 className="elegant-heading">Active Job Listings</h2>
                    <span className="text-sm text-academic-slate-600 bg-academic-slate-100 px-3 py-1 rounded-full">
                      {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
                    </span>
                  </div>
                  
                  {jobs.map((job) => (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="elegant-card p-6 hover:shadow-elegant transition-all duration-300"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex-1">
                          {/* Job Title and Status */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <h3 className="text-xl font-bold text-academic-navy-900 leading-tight break-words font-playfair">
                              {job.title}
                            </h3>
                            <div className="flex-shrink-0">
                              {getStatusBadge(job.isPublished, job.applicationDeadline)}
                            </div>
                          </div>
                          
                          {/* Job Meta Information */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                              <span className="w-2 h-2 bg-academic-gold-500 rounded-full"></span>
                              <span className="font-medium">Location:</span>
                              <span className="truncate">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                              <span className="w-2 h-2 bg-academic-navy-500 rounded-full"></span>
                              <span className="font-medium">Department:</span>
                              <span className="truncate">{job.department}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                              <span className="w-2 h-2 bg-academic-gold-500 rounded-full"></span>
                              <span className="font-medium">Type:</span>
                              <span className="truncate">{job.employmentType}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                              <span className="w-2 h-2 bg-academic-navy-500 rounded-full"></span>
                              <span className="font-medium">Deadline:</span>
                              <span className="truncate">{formatDate(job.applicationDeadline)}</span>
                            </div>
                          </div>
                          
                          {/* Job Description */}
                          <p className="text-academic-slate-700 text-base line-clamp-2 mb-4 leading-relaxed">
                            {job.description}
                          </p>
                          
                          {/* Job Stats */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm mb-4 p-3 bg-academic-cream-50 rounded-lg border border-academic-cream-200">
                            <div className="flex items-center gap-2">
                              <FaUsers className="text-academic-navy-600" />
                              <span className="text-academic-slate-600">Applications:</span>
                              <span className="font-bold text-academic-navy-700">{job.applicationCount || 0}</span>
                            </div>
                            <div className="hidden sm:block w-px h-4 bg-academic-slate-300"></div>
                            <div className="flex items-center gap-2">
                              <FaCalendarAlt className="text-academic-navy-600" />
                              <span className="text-academic-slate-600">Created:</span>
                              <span className="font-medium text-academic-slate-700">{formatDate(job.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-academic-slate-200">
                          <button
                            onClick={() => handleTogglePublication(job._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium min-h-[40px] ${
                              job.isPublished
                                ? 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                                : 'bg-academic-slate-100 hover:bg-academic-slate-200 text-academic-slate-700 border border-academic-slate-300'
                            }`}
                            title={job.isPublished ? 'Unpublish Job' : 'Publish Job'}
                          >
                            {job.isPublished ? <FaToggleOn className="text-lg" /> : <FaToggleOff className="text-lg" />}
                            <span>{job.isPublished ? 'Published' : 'Draft'}</span>
                          </button>
                          
                          <button
                            onClick={() => handleViewApplications(job)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-300 rounded-lg transition-all duration-200 text-sm font-medium min-h-[40px]"
                            title="View Applications"
                          >
                            <FaEye className="text-lg" />
                            <span>View Applications</span>
                          </button>
                          
                          <button
                            onClick={() => handleEditJob(job)}
                            className="flex items-center gap-2 px-4 py-2 bg-academic-gold-100 hover:bg-academic-gold-200 text-academic-gold-700 border border-academic-gold-300 rounded-lg transition-all duration-200 text-sm font-medium min-h-[40px]"
                            title="Edit Job"
                          >
                            <FaEdit className="text-lg" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg transition-all duration-200 text-sm font-medium min-h-[40px]"
                            title="Delete Job"
                          >
                            <FaTrash className="text-lg" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <JobApplications
              selectedJob={selectedJobApplications}
              applications={applications}
              onRefresh={fetchApplications}
            />
          )}

          {activeTab === 'analytics' && (
            <CareersAnalytics analytics={analytics} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CareersManagement;
