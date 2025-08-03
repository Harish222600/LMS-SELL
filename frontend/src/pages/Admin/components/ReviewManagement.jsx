import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  FaStar, 
  FaUser, 
  FaBook, 
  FaToggleOn, 
  FaToggleOff, 
  FaSearch, 
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaTrash,
  FaSmile,
  FaChartBar,
  FaUsers,
  FaQuoteLeft,
  FaPlus
} from 'react-icons/fa';
import { 
  getAllReviewsForAdmin, 
  toggleReviewSelection, 
  bulkUpdateReviewSelection,
  deleteReview 
} from '../../../services/operations/adminAPI';

const ReviewManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterSelection, setFilterSelection] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [processingIds, setProcessingIds] = useState(new Set());
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getAllReviewsForAdmin(token);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  // Handle individual review selection toggle
  const handleToggleSelection = async (reviewId) => {
    if (processingIds.has(reviewId)) return;

    try {
      setProcessingIds(prev => new Set([...prev, reviewId]));
      const updatedReview = await toggleReviewSelection(reviewId, token);
      
      // Update the review in the local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review._id === reviewId 
            ? { ...review, isSelected: updatedReview.isSelected }
            : review
        )
      );
    } catch (error) {
      console.error('Error toggling review selection:', error);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  // Handle bulk selection
  const handleBulkSelection = async (isSelected) => {
    if (selectedReviews.length === 0) {
      toast.error('Please select reviews first');
      return;
    }

    try {
      await bulkUpdateReviewSelection(selectedReviews, isSelected, token);
      
      // Update local state
      setReviews(prevReviews => 
        prevReviews.map(review => 
          selectedReviews.includes(review._id)
            ? { ...review, isSelected }
            : review
        )
      );
      
      setSelectedReviews([]);
      toast.success(`${selectedReviews.length} reviews ${isSelected ? 'selected' : 'deselected'} successfully`);
    } catch (error) {
      console.error('Error in bulk selection:', error);
    }
  };

  // Filter reviews based on search and filters
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.course?.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
    
    const matchesSelection = 
      filterSelection === 'all' || 
      (filterSelection === 'selected' && review.isSelected) ||
      (filterSelection === 'unselected' && !review.isSelected);

    return matchesSearch && matchesRating && matchesSelection;
  });

  // Handle checkbox selection
  const handleCheckboxChange = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  // Select all filtered reviews
  const handleSelectAll = () => {
    const allFilteredIds = filteredReviews.map(review => review._id);
    setSelectedReviews(allFilteredIds);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedReviews([]);
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (processingIds.has(reviewId)) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setProcessingIds(prev => new Set([...prev, reviewId]));
      await deleteReview(reviewId, token);
      
      // Remove the review from local state
      setReviews(prevReviews => 
        prevReviews.filter(review => review._id !== reviewId)
      );
      
      // Remove from selected reviews if it was selected
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
      
      
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reviewId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-academic-cream-50 min-h-screen flex items-center justify-center py-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
          <span className="text-academic-slate-700 font-medium font-inter">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Review Management</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaSmile className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  Review Management
                </h1>
                <p className="section-subtitle text-lg">
                  Curate and manage course reviews for public display
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button
                onClick={() => setShowAddReviewModal(true)}
                className="btn-elegant flex items-center gap-3"
              >
                <FaPlus size={16} />
                Add Review
              </button>
              <div className="flex items-center gap-4 text-sm text-academic-slate-700 font-inter">
                <span className="flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg border border-green-200">
                  <FaCheckCircle className="text-green-600" />
                  <span className="font-medium">{reviews.filter(r => r.isSelected).length} Selected</span>
                </span>
                <span className="flex items-center gap-2 bg-red-100 px-3 py-2 rounded-lg border border-red-200">
                  <FaTimesCircle className="text-red-600" />
                  <span className="font-medium">{reviews.filter(r => !r.isSelected).length} Not Selected</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-8">
        {/* Academic Statistics Panel */}
        <div className="classic-card">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Review Statistics</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Overview of your review management</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaQuoteLeft className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{reviews.length}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Reviews</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">All submitted reviews</div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-green-50 border-green-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaCheckCircle className="text-green-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{reviews.filter(r => r.isSelected).length}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Selected</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">Displayed publicly</div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaStar className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                    {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                  </div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Average Rating</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">Overall satisfaction</div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaFilter className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{filteredReviews.length}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Filtered</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">Current view</div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Filters and Search Panel */}
        <div className="classic-card">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Search & Filter Reviews</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Find and manage specific reviews</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label className="classic-label" htmlFor="search">
                  Search Reviews
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={16} />
                  <input
                    id="search"
                    type="text"
                    placeholder="Search by user name, course, or review content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="classic-input pl-12"
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="classic-label" htmlFor="rating-filter">
                  Filter by Rating
                </label>
                <div className="flex items-center gap-3">
                  <FaFilter className="text-academic-slate-400" size={16} />
                  <select
                    id="rating-filter"
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="classic-input"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              {/* Selection Filter */}
              <div>
                <label className="classic-label" htmlFor="selection-filter">
                  Filter by Status
                </label>
                <select
                  id="selection-filter"
                  value={filterSelection}
                  onChange={(e) => setFilterSelection(e.target.value)}
                  className="classic-input"
                >
                  <option value="all">All Reviews</option>
                  <option value="selected">Selected Only</option>
                  <option value="unselected">Not Selected</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedReviews.length > 0 && (
              <div className="bg-academic-gold-50 border border-academic-gold-200 p-6 rounded-xl">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-academic-navy-800 font-medium font-inter">
                    {selectedReviews.length} review(s) selected
                  </span>
                  <button
                    onClick={() => handleBulkSelection(true)}
                    className="btn-classic-gold text-sm"
                  >
                    <FaCheckCircle size={14} className="mr-2" />
                    Select for Display
                  </button>
                  <button
                    onClick={() => handleBulkSelection(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 font-inter"
                  >
                    <FaTimesCircle size={14} className="mr-2 inline" />
                    Remove from Display
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="btn-classic-secondary text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* Select All */}
            <div className="flex items-center gap-4 pt-4 border-t border-academic-slate-200">
              <button
                onClick={handleSelectAll}
                className="btn-elegant flex items-center gap-2"
              >
                <FaUsers size={14} />
                Select All Filtered ({filteredReviews.length})
              </button>
            </div>
          </div>
        </div>

        {/* Academic Reviews Grid */}
        <div className="classic-card">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="elegant-heading text-academic-navy-900">Review Directory</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Manage and curate course reviews</p>
              </div>
              <div className="text-sm text-academic-slate-700 font-inter">
                Showing <span className="font-bold text-academic-navy-900">{filteredReviews.length}</span> of <span className="font-bold text-academic-navy-900">{reviews.length}</span> reviews
              </div>
            </div>
          </div>

          {/* Academic Empty State */}
          {filteredReviews.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                <FaEye className="text-5xl text-academic-gold-700" />
              </div>
              <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Reviews Found</h3>
              <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
                {searchTerm || filterRating !== 'all' || filterSelection !== 'all'
                  ? 'Try adjusting your search criteria to find the reviews you\'re looking for.'
                  : 'No reviews have been submitted yet. Reviews will appear here once students start rating courses.'}
              </p>
            </div>
          ) : (
            <div className="p-8">
              <div className="grid gap-6">
                {filteredReviews.map((review) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`classic-card transition-all duration-300 p-6 ${
                      review.isSelected 
                        ? 'bg-green-50 border-green-300 shadow-elegant' 
                        : 'bg-academic-cream-50 hover:shadow-elegant'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0 pt-1">
                        <input
                          type="checkbox"
                          checked={selectedReviews.includes(review._id)}
                          onChange={() => handleCheckboxChange(review._id)}
                          className="w-5 h-5 text-academic-gold-600 bg-white border-2 border-academic-slate-300 rounded focus:ring-academic-gold-500 focus:ring-2"
                        />
                      </div>

                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <img
                          src={review.user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName} ${review.user?.lastName}`}
                          alt={`${review.user?.firstName} ${review.user?.lastName}`}
                          className="w-16 h-16 rounded-full object-cover border-3 border-academic-slate-200 shadow-classic"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1 min-w-0">
                        {/* User Info and Rating */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h4 className="text-lg font-bold text-academic-navy-900 font-playfair">
                              {review.user?.firstName} {review.user?.lastName}
                            </h4>
                            <div className="flex items-center gap-2">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating ? 'text-academic-gold-600' : 'text-academic-slate-300'
                                  }`}
                                />
                              ))}
                              <span className="text-academic-gold-700 font-bold ml-1 font-inter">
                                {review.rating}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleSelection(review._id)}
                              disabled={processingIds.has(review._id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200 font-inter ${
                                review.isSelected
                                  ? 'bg-green-600 hover:bg-green-700 text-white border border-green-700'
                                  : 'bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 border border-academic-navy-200'
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {processingIds.has(review._id) ? (
                                <FaSpinner className="animate-spin" size={12} />
                              ) : review.isSelected ? (
                                <FaToggleOn size={14} />
                              ) : (
                                <FaToggleOff size={14} />
                              )}
                              {review.isSelected ? 'Selected' : 'Select'}
                            </button>
                            
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              disabled={processingIds.has(review._id)}
                              className="flex items-center gap-1 px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 rounded-lg font-medium text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-inter"
                              title="Delete Review"
                            >
                              {processingIds.has(review._id) ? (
                                <FaSpinner className="animate-spin" size={12} />
                              ) : (
                                <FaTrash size={12} />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Course Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <FaBook className="text-academic-navy-600 w-4 h-4 flex-shrink-0" />
                          <span className="text-academic-slate-700 font-medium font-inter">
                            {review.course?.courseName}
                          </span>
                        </div>

                        {/* Review Text */}
                        <div className="bg-white border border-academic-slate-200 p-4 rounded-lg mb-4">
                          <FaQuoteLeft className="text-academic-gold-600 mb-2 float-left mr-2" size={16} />
                          <p className="text-academic-slate-800 leading-relaxed font-inter">
                            {review.review}
                          </p>
                        </div>

                        {/* Date */}
                        <p className="text-academic-slate-500 text-sm font-inter">
                          Submitted on {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;
