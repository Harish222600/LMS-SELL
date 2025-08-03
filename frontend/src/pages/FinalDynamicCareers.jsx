import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaRocket, FaGraduationCap, FaHeart, FaMapMarkerAlt, FaClock, FaEnvelope, FaArrowRight, FaBriefcase } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import { getPublishedJobs, submitJobApplication } from "../services/operations/jobsAPI";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

// Separate ApplicationForm component to prevent re-mounting
const ApplicationForm = React.memo(({ selectedJob, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: '',
    experience: '',
    portfolio: '',
    linkedinProfile: '',
    expectedSalary: '',
    availableStartDate: '',
    source: 'Website'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  }, []);

  const { token } = useSelector((state) => state.auth);
  
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (submitting || !token) {
      toast.error('Please login to submit your application');
      return;
    }

    // Basic validation
    if (!formData.applicantName || !formData.email || !formData.phone || !formData.resume) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Resume file validation
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(formData.resume.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    if (formData.resume.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Resume file size must be less than 5MB');
      return;
    }

    setSubmitting(true);

    try {
      const applicationData = new FormData();
      
      // Append all form fields
      applicationData.append('jobId', selectedJob._id);
      applicationData.append('applicantName', formData.applicantName);
      applicationData.append('email', formData.email);
      applicationData.append('phone', formData.phone);
      applicationData.append('resume', formData.resume);
      
      // Append optional fields only if they have values
      if (formData.coverLetter) applicationData.append('coverLetter', formData.coverLetter);
      if (formData.experience) applicationData.append('experience', formData.experience);
      if (formData.portfolio) applicationData.append('portfolio', formData.portfolio);
      if (formData.linkedinProfile) applicationData.append('linkedinProfile', formData.linkedinProfile);
      if (formData.expectedSalary) applicationData.append('expectedSalary', formData.expectedSalary);
      if (formData.availableStartDate) applicationData.append('availableStartDate', formData.availableStartDate);
      applicationData.append('source', formData.source);

      console.log('Form data being sent:');
      for (let [key, value] of applicationData.entries()) {
        console.log(key, value);
      }

      const result = await submitJobApplication(applicationData, token);
      if (result) {
        toast.success('Application submitted successfully!');
        onSubmit();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Error submitting application');
    } finally {
      setSubmitting(false);
    }
  }, [formData, selectedJob, submitting, onSubmit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl w-full max-w-4xl mx-2 sm:mx-4 p-4 sm:p-6 border border-academic-slate-200 max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-elegant">
          {/* Header - Mobile Optimized */}
          <div className="mb-4 sm:mb-6">
            <h2 className="classic-heading text-lg sm:text-xl lg:text-2xl text-academic-navy-900 mb-1 sm:mb-2 leading-tight break-words">
              Apply for {selectedJob.title}
            </h2>
            <p className="text-sm sm:text-base text-academic-slate-600 break-words">
              {selectedJob.department} • {selectedJob.location}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Form Grid - Single column on mobile, two columns on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  required
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Resume (PDF/DOC) *
                </label>
                <input
                  type="file"
                  name="resume"
                  onChange={handleInputChange}
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full px-3 py-3 sm:py-2 bg-white border border-academic-slate-300 rounded-lg text-academic-navy-900 focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 min-h-[44px] touch-manipulation file:mr-2 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-academic-gold-500 file:text-white hover:file:bg-academic-gold-600"
                />
              </div>

              {/* Cover Letter - Full width on all screens */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-3 sm:py-2 bg-white border border-academic-slate-300 rounded-lg text-academic-navy-900 focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 text-base sm:text-sm resize-y min-h-[100px] touch-manipulation"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Portfolio URL
                </label>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={handleInputChange}
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Expected Salary
                </label>
                <input
                  type="number"
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="classic-input min-h-[44px] touch-manipulation"
                />
              </div>
            </div>

            {/* Action Buttons - Stack on mobile, inline on larger screens */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="btn-classic-secondary w-full sm:w-auto min-h-[44px] touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-elegant w-full sm:w-auto min-h-[44px] touch-manipulation flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
});

const FinalDynamicCareers = () => {
  const { token } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const benefits = useMemo(() => [
    {
      icon: <FaRocket className="text-2xl text-academic-gold-600" />,
      title: "Mission-Driven Work",
      description: "Be part of transforming education and empowering learners worldwide"
    },
    {
      icon: <FaUsers className="text-2xl text-blue-600" />,
      title: "Diverse Team",
      description: "Collaborate with talented professionals from diverse backgrounds"
    },
    {
      icon: <FaGraduationCap className="text-2xl text-green-600" />,
      title: "Continuous Learning",
      description: "Professional development opportunities and skill enhancement"
    },
    {
      icon: <FaHeart className="text-2xl text-pink-600" />,
      title: "Work-Life Balance",
      description: "Flexible work arrangements and remote-friendly culture"
    }
  ], []);

  const fetchJobs = useCallback(async () => {
    try {
      console.log('Fetching published jobs...');
      console.log('API Base URL:', import.meta.env.VITE_APP_BASE_URL);
      console.log('Making request to:', `${import.meta.env.VITE_APP_BASE_URL}/api/v1/jobs/published`);
      
      const result = await getPublishedJobs();
      console.log('Jobs fetch result:', result);
      console.log('Number of jobs returned:', result ? result.length : 0);
      
      if (result && result.length > 0) {
        console.log('First job details:', result[0]);
        result.forEach((job, index) => {
          console.log(`Job ${index + 1}:`, {
            id: job._id,
            title: job.title,
            isPublished: job.isPublished,
            deadline: job.applicationDeadline,
            isExpired: new Date() > new Date(job.applicationDeadline)
          });
        });
      } else {
        console.log('No jobs returned from API');
      }
      
      setJobs(result || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      console.error('Error details:', error.response?.data || error.message);
      toast.error('Failed to load job listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleApplyClick = useCallback((job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowApplicationForm(false);
    setSelectedJob(null);
  }, []);

  const handleApplicationSubmit = useCallback(() => {
    handleCloseModal();
    fetchJobs(); // Refresh jobs if needed
  }, [handleCloseModal, fetchJobs]);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-academic-navy-800 via-academic-navy-700 to-academic-navy-900 py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-academic-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-academic-gold-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="classic-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join Our <span className="text-academic-gold-400">Mission</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-academic-slate-200 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform education and empower learners worldwide. Join our passionate team of innovators, educators, and technologists.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Why Work With Us Section */}
        <motion.section 
          className="mb-20"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="elegant-heading text-center mb-6"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5
                }
              }
            }}
          >
            Why Choose <span className="text-academic-gold-600">Beeja?</span>
          </motion.h2>
          <motion.p 
            className="text-academic-slate-600 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5
                }
              }
            }}
          >
            We're not just building a company; we're creating the future of education. Here's what makes Beeja special.
          </motion.p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="classic-card p-8 text-center hover:shadow-elegant transition-all duration-300 transform hover:scale-105"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.5
                    }
                  }
                }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-academic-cream-100 rounded-2xl flex items-center justify-center shadow-classic">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-academic-navy-900 font-playfair">{benefit.title}</h3>
                <p className="text-academic-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Positions Section */}
        <motion.section 
          className="mb-20"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="elegant-heading text-center mb-6"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5
                }
              }
            }}
          >
            Open <span className="text-academic-gold-600">Positions</span>
          </motion.h2>
          <motion.p 
            className="text-academic-slate-600 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed"
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: {
                  duration: 0.5
                }
              }
            }}
          >
            Ready to make an impact? Explore our current openings and find your perfect role.
          </motion.p>
          
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="classic-card p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaBriefcase className="w-8 h-8 text-academic-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-academic-navy-900 mb-3 font-playfair">No open positions at the moment</h3>
                <p className="text-academic-slate-600">
                  Please check back later for new opportunities.
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-8 relative z-50">
              {console.log('Rendering jobs:', jobs)}
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="classic-card p-6 sm:p-8 lg:p-10 hover:shadow-elegant transition-all duration-300 w-full overflow-hidden"
                  style={{ zIndex: 100 + index }}
                >
                  {/* Job Header - Mobile First Layout */}
                  <div className="flex flex-col gap-6 md:gap-8">
                    <div className="flex-1 space-y-4 md:space-y-6">
                      <h3 className="classic-heading text-lg sm:text-xl lg:text-2xl text-academic-navy-900 leading-tight break-words">
                        {job.title || 'Job Title'}
                      </h3>
                      
                      {/* Job Meta - Stack on mobile, wrap on larger screens */}
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 text-xs sm:text-sm">
                        <span className="inline-flex items-center gap-2 bg-academic-navy-100 text-academic-navy-800 px-4 py-2 rounded-full font-medium w-fit">
                          <FaUsers className="text-blue-600 text-xs" /> 
                          <span className="truncate">{job.department || 'Department'}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 bg-academic-gold-100 text-academic-gold-800 px-4 py-2 rounded-full font-medium w-fit">
                          <FaClock className="text-green-600 text-xs" /> 
                          <span className="truncate">{job.employmentType || 'Full-time'}</span>
                        </span>
                        <span className="inline-flex items-center gap-2 bg-academic-slate-100 text-academic-slate-800 px-4 py-2 rounded-full font-medium w-fit">
                          <FaMapMarkerAlt className="text-red-600 text-xs" /> 
                          <span className="truncate">{job.location || 'Location'}</span>
                        </span>
                      </div>
                    </div>
                    
                    {/* Apply Button - Full width on mobile */}
                    <button
                      onClick={() => handleApplyClick(job)}
                      className="btn-elegant w-full sm:w-auto sm:min-w-[140px] min-h-[44px] touch-manipulation flex items-center justify-center gap-2"
                    >
                      Apply Now <FaArrowRight className="text-xs sm:text-sm" />
                    </button>
                  </div>
                  
                  {/* Job Description */}
                  <p className="text-academic-slate-700 mt-6 mb-8 leading-relaxed text-sm sm:text-base break-words">
                    {job.description || 'Job description will be displayed here.'}
                  </p>
                  
                  {/* Job Details */}
                  <div className="space-y-6 sm:space-y-8">
                    {job.requirements && job.requirements.length > 0 && (
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-academic-navy-900 mb-4 font-playfair">
                          Key Requirements:
                        </h4>
                        <ul className="list-disc pl-6 text-academic-slate-700 leading-relaxed space-y-2">
                          {job.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="text-sm sm:text-base break-words">
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-academic-navy-900 mb-4 font-playfair">
                          Benefits:
                        </h4>
                        <ul className="list-disc pl-6 text-academic-slate-700 leading-relaxed space-y-2">
                          {job.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="text-sm sm:text-base break-words">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Application Deadline */}
                    <div className="pt-4 sm:pt-6 border-t border-academic-slate-200 mt-6 sm:mt-8">
                      <p className="text-xs sm:text-sm text-academic-slate-600">
                        <span className="text-academic-gold-700 font-bold">Application Deadline:</span> {formatDate(job.applicationDeadline)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
      
      <ImprovedFooter />

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <ApplicationForm 
          selectedJob={selectedJob} 
          onClose={handleCloseModal} 
          onSubmit={handleApplicationSubmit} 
        />
      )}
    </div>
  );
};

export default FinalDynamicCareers;
