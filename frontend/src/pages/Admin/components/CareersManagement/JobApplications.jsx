import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaDownload, FaEye, FaEdit, FaTrash, FaFilter, FaSearch, FaFileAlt, FaGraduationCap, FaUserTie, FaBriefcase } from 'react-icons/fa';
import { getJobApplications, updateApplicationStatus, deleteJobApplication } from '../../../../services/operations/jobsAPI';

const JobApplications = ({ selectedJob, applications, onRefresh }) => {
  const { token } = useSelector((state) => state.auth);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    job: selectedJob?._id || 'all'
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    filterApplications();
  }, [applications, filters]);

  const filterApplications = () => {
    let filtered = [...applications];

    // Filter by job
    if (filters.job !== 'all') {
      filtered = filtered.filter(app => app.job._id === filters.job);
    }

    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicantName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.job.title.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredApplications(filtered);
  };

  const handleStatusUpdate = async (applicationId, newStatus, notes = '') => {
    setLoading(true);
    try {
      await updateApplicationStatus(applicationId, { status: newStatus, notes }, token);
      await onRefresh();
      setShowStatusModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': { bg: 'bg-academic-gold-100', text: 'text-academic-gold-800', border: 'border-academic-gold-300' },
      'Under Review': { bg: 'bg-academic-navy-100', text: 'text-academic-navy-800', border: 'border-academic-navy-300' },
      'Shortlisted': { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
      'Interview Scheduled': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
      'Hired': { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    return (
      <span className={`px-3 py-1 text-xs rounded-full font-semibold font-inter border ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUniqueJobs = () => {
    const jobs = applications.reduce((acc, app) => {
      if (!acc.find(job => job._id === app.job._id)) {
        acc.push(app.job);
      }
      return acc;
    }, []);
    return jobs;
  };

  const StatusModal = () => {
    const [newStatus, setNewStatus] = useState(selectedApplication?.status || 'Pending');
    const [notes, setNotes] = useState('');

    const statusOptions = [
      'Pending',
      'Under Review',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Hired'
    ];

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div 
          className="classic-card p-6 w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-academic-navy-100 rounded-lg">
              <FaEdit className="text-academic-navy-600" />
            </div>
            <h3 className="text-lg font-semibold text-academic-navy-900 font-inter">
              Update Application Status
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-academic-slate-700 mb-2 font-inter">
                Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-academic-slate-700 mb-2 font-inter">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
                placeholder="Add any notes about this status change..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowStatusModal(false);
                setSelectedApplication(null);
              }}
              className="px-4 py-2 text-academic-slate-600 hover:text-academic-navy-900 transition-colors font-inter font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleStatusUpdate(selectedApplication._id, newStatus, notes)}
              disabled={loading}
              className="btn-elegant"
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </motion.div>
      </div>
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
            <FaUserTie className="text-2xl text-academic-navy-600" />
          </div>
          <div>
            <h2 className="elegant-heading text-3xl text-academic-navy-900">
              Job Applications
              {selectedJob && (
                <span className="text-academic-slate-600 font-normal text-xl ml-2">
                  for {selectedJob.title}
                </span>
              )}
            </h2>
            <p className="text-academic-slate-600 mt-1">
              {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </motion.div>

      {/* Academic Filters */}
      <motion.div 
        className="classic-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-2 font-inter">
              Search Applications
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-3 py-3 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
                placeholder="Search by name, email, or job title..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-2 font-inter">
              Filter by Job
            </label>
            <select
              value={filters.job}
              onChange={(e) => setFilters(prev => ({ ...prev, job: e.target.value }))}
              className="w-full px-3 py-3 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
            >
              <option value="all">All Jobs</option>
              {getUniqueJobs().map(job => (
                <option key={job._id} value={job._id}>{job.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-2 font-inter">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-3 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Academic Applications List */}
      <motion.div 
        className="classic-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="p-6 bg-academic-slate-100 rounded-full mb-6">
              <FaFileAlt className="w-12 h-12 text-academic-slate-400" />
            </div>
            <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">No applications found</h3>
            <p className="text-academic-slate-600 text-center max-w-md leading-relaxed font-inter">
              {filters.search || filters.status !== 'all' || filters.job !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Applications will appear here once candidates start applying.'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="classic-card bg-academic-cream-50 p-6"
                whileHover={{ y: -2 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-academic-navy-900 font-inter">
                          {application.applicantName}
                        </h3>
                        <p className="text-academic-slate-600 font-inter">{application.email}</p>
                        <p className="text-academic-slate-500 text-sm font-inter">{application.phone}</p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-academic-slate-600 font-inter font-medium">Applied for:</span>
                        <p className="text-academic-navy-900 font-semibold font-inter">{application.job.title}</p>
                      </div>
                      <div>
                        <span className="text-academic-slate-600 font-inter font-medium">Applied on:</span>
                        <p className="text-academic-navy-900 font-inter">{formatDate(application.createdAt)}</p>
                      </div>
                      {application.experience && (
                        <div>
                          <span className="text-academic-slate-600 font-inter font-medium">Experience:</span>
                          <p className="text-academic-navy-900 font-inter">{application.experience}</p>
                        </div>
                      )}
                      {application.expectedSalary && (
                        <div>
                          <span className="text-academic-slate-600 font-inter font-medium">Expected Salary:</span>
                          <p className="text-academic-navy-900 font-inter">${application.expectedSalary.toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {application.coverLetter && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-academic-slate-200">
                        <span className="text-academic-slate-700 text-sm font-semibold font-inter">Cover Letter:</span>
                        <p className="text-academic-navy-900 text-sm mt-2 line-clamp-2 font-inter">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {application.notes && (
                      <div className="mt-4 p-4 bg-academic-navy-50 rounded-lg border border-academic-navy-200">
                        <span className="text-academic-navy-700 text-sm font-semibold font-inter">Admin Notes:</span>
                        <p className="text-academic-navy-900 text-sm mt-2 font-inter">{application.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                                       (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                                         ? `${window.location.protocol}//${window.location.hostname}:5001` 
                                         : 'http://localhost:5001');
                        const downloadUrl = `${baseUrl}/api/v1/job-applications/download/${application._id}`;
                        
                        const token = localStorage.getItem('token');
                        if (token) {
                          // Get download info from backend
                          fetch(downloadUrl, {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                            },
                          })
                          .then(response => {
                            if (!response.ok) {
                              throw new Error('Download failed');
                            }
                            return response.json();
                          })
                          .then(data => {
                            if (data.success) {
                              // Use the URL directly from Cloudinary
                              const link = document.createElement('a');
                              link.href = data.data.url;
                              link.download = data.data.filename;
                              link.target = '_blank';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              toast.success(`Downloaded: ${data.data.filename}`);
                            } else {
                              throw new Error(data.message || 'Download failed');
                            }
                          })
                          .catch(error => {
                            console.error('Download error:', error);
                            toast.error('Failed to download resume');
                          });
                        } else {
                          toast.error('Authentication required');
                        }
                      }}
                      className="p-3 bg-academic-navy-600 hover:bg-academic-navy-700 text-white rounded-xl transition-colors shadow-classic"
                      title="Download Resume"
                    >
                      <FaDownload />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowStatusModal(true);
                      }}
                      className="p-3 bg-academic-gold-600 hover:bg-academic-gold-700 text-white rounded-xl transition-colors shadow-classic"
                      title="Update Status"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this application?')) {
                          const deleted = await deleteJobApplication(application._id, token);
                          if (deleted) {
                            onRefresh();
                          }
                        }
                      }}
                      className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-classic"
                      title="Delete Application"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Status Update Modal */}
      {showStatusModal && <StatusModal />}
    </div>
  );
};

export default JobApplications;
