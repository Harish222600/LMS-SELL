import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

const JobForm = ({ job, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    department: '',
    description: '',
    responsibilities: [''],
    requirements: [''],
    applicationDeadline: '',
    employmentType: 'Full-time',
    experienceLevel: 'Mid Level',
    salaryRange: {
      min: '',
      max: '',
      currency: 'USD'
    },
    benefits: [''],
    isPublished: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title || '',
        location: job.location || '',
        department: job.department || '',
        description: job.description || '',
        responsibilities: job.responsibilities?.length > 0 ? job.responsibilities : [''],
        requirements: job.requirements?.length > 0 ? job.requirements : [''],
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString().split('T')[0] : '',
        employmentType: job.employmentType || 'Full-time',
        experienceLevel: job.experienceLevel || 'Mid Level',
        salaryRange: {
          min: job.salaryRange?.min || '',
          max: job.salaryRange?.max || '',
          currency: job.salaryRange?.currency || 'USD'
        },
        benefits: job.benefits?.length > 0 ? job.benefits : [''],
        isPublished: job.isPublished || false
      });
    }
  }, [job]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (arrayName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], '']
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    if (formData[arrayName].length > 1) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: prev[arrayName].filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.department.trim()) newErrors.department = 'Department is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
    
    // Check if deadline is in the future
    if (formData.applicationDeadline && new Date(formData.applicationDeadline) <= new Date()) {
      newErrors.applicationDeadline = 'Application deadline must be in the future';
    }

    // Validate responsibilities
    const validResponsibilities = formData.responsibilities.filter(r => r.trim());
    if (validResponsibilities.length === 0) {
      newErrors.responsibilities = 'At least one responsibility is required';
    }

    // Validate requirements
    const validRequirements = formData.requirements.filter(r => r.trim());
    if (validRequirements.length === 0) {
      newErrors.requirements = 'At least one requirement is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean up data before submission
    const submitData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r.trim()),
      requirements: formData.requirements.filter(r => r.trim()),
      benefits: formData.benefits.filter(b => b.trim()),
      salaryRange: formData.salaryRange.min || formData.salaryRange.max ? formData.salaryRange : null
    };

    onSubmit(submitData);
  };

  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-3 text-academic-slate-600 hover:text-academic-navy-700 hover:bg-academic-navy-50 rounded-lg transition-all duration-200"
            >
              <FaArrowLeft className="text-lg" />
            </button>
            <div>
              <h1 className="classic-heading text-3xl md:text-4xl">
                {job ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h1>
              <p className="section-subtitle text-lg mt-2">
                Fill in the details for the job posting with care and precision
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="classic-card p-8">
            <div className="space-y-6">
              <h2 className="elegant-heading border-b border-academic-slate-200 pb-3">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="classic-label">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`classic-input ${
                      errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="e.g., Senior Software Engineer"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1 font-medium">{errors.title}</p>}
                </div>

                <div>
                  <label className="classic-label">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`classic-input ${
                      errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="e.g., Remote, New York, NY"
                  />
                  {errors.location && <p className="text-red-600 text-sm mt-1 font-medium">{errors.location}</p>}
                </div>

                <div>
                  <label className="classic-label">
                    Department *
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`classic-input ${
                      errors.department ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="e.g., Engineering, Marketing"
                  />
                  {errors.department && <p className="text-red-600 text-sm mt-1 font-medium">{errors.department}</p>}
                </div>

                <div>
                  <label className="classic-label">
                    Application Deadline *
                  </label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`classic-input ${
                      errors.applicationDeadline ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                    }`}
                  />
                  {errors.applicationDeadline && <p className="text-red-600 text-sm mt-1 font-medium">{errors.applicationDeadline}</p>}
                </div>

                <div>
                  <label className="classic-label">
                    Employment Type
                  </label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="classic-input"
                  >
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="classic-label">
                    Experience Level
                  </label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleInputChange}
                    className="classic-input"
                  >
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="classic-label">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`classic-textarea ${
                    errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Describe the role, company culture, and what makes this position exciting..."
                />
                {errors.description && <p className="text-red-600 text-sm mt-1 font-medium">{errors.description}</p>}
              </div>

              {/* Salary Range */}
              <div>
                <label className="classic-label">
                  Salary Range (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    name="salaryRange.min"
                    value={formData.salaryRange.min}
                    onChange={handleInputChange}
                    className="classic-input"
                    placeholder="Min salary"
                  />
                  <input
                    type="number"
                    name="salaryRange.max"
                    value={formData.salaryRange.max}
                    onChange={handleInputChange}
                    className="classic-input"
                    placeholder="Max salary"
                  />
                  <select
                    name="salaryRange.currency"
                    value={formData.salaryRange.currency}
                    onChange={handleInputChange}
                    className="classic-input"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Responsibilities */}
          <div className="classic-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elegant-heading">Responsibilities *</h2>
              <button
                type="button"
                onClick={() => addArrayItem('responsibilities')}
                className="flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-200"
              >
                <FaPlus className="text-sm" />
                Add Responsibility
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                    className="flex-1 classic-input"
                    placeholder="Enter a key responsibility..."
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('responsibilities', index)}
                      className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.responsibilities && <p className="text-red-600 text-sm mt-2 font-medium">{errors.responsibilities}</p>}
          </div>

          {/* Requirements */}
          <div className="classic-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elegant-heading">Requirements *</h2>
              <button
                type="button"
                onClick={() => addArrayItem('requirements')}
                className="flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-200"
              >
                <FaPlus className="text-sm" />
                Add Requirement
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="flex-1 classic-input"
                    placeholder="Enter a requirement..."
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('requirements', index)}
                      className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.requirements && <p className="text-red-600 text-sm mt-2 font-medium">{errors.requirements}</p>}
          </div>

          {/* Benefits */}
          <div className="classic-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="elegant-heading">Benefits (Optional)</h2>
              <button
                type="button"
                onClick={() => addArrayItem('benefits')}
                className="flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-200"
              >
                <FaPlus className="text-sm" />
                Add Benefit
              </button>
            </div>
            
            <div className="space-y-4">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                    className="flex-1 classic-input"
                    placeholder="Enter a benefit..."
                  />
                  {formData.benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="p-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Publication Status */}
          <div className="classic-card p-8">
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleInputChange}
                className="mt-1 w-5 h-5 text-academic-gold-600 bg-white border-academic-slate-300 rounded focus:ring-academic-gold-500 focus:ring-2"
              />
              <div>
                <label htmlFor="isPublished" className="classic-label cursor-pointer">
                  Publish this job immediately
                </label>
                <p className="text-sm text-academic-slate-500 mt-1">
                  If unchecked, the job will be saved as a draft and can be published later.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-8">
            <button
              type="button"
              onClick={onCancel}
              className="btn-classic-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-elegant"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FaSave className="text-lg" />
              )}
              {job ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default JobForm;
