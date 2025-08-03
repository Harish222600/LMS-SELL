import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaCheck, FaTimes, FaEdit, FaTrash, FaUser, FaClock, FaEye, FaEyeSlash, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getAllFaqs, answerFaq, toggleFaqPublish, deleteFaq } from '../../../services/operations/faqAPI';
import { toast } from 'react-hot-toast';

const FaqManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);
  const [answer, setAnswer] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 FAQs per page
  const { token } = useSelector((state) => state.auth);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const data = await getAllFaqs(token);
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [token]);

  const handleAnswerSubmit = async (faqId) => {
    if (!answer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    try {
      const updatedFaq = await answerFaq(faqId, answer, token);
      if (updatedFaq) {
        setFaqs(faqs.map(faq => 
          faq._id === faqId ? updatedFaq : faq
        ));
        setEditingFaq(null);
        setAnswer('');
        toast.success('Answer submitted successfully and email sent to user');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer');
    }
  };

  const handleTogglePublish = async (faqId) => {
    try {
      const updatedFaq = await toggleFaqPublish(faqId, token);
      if (updatedFaq) {
        setFaqs(faqs.map(faq => 
          faq._id === faqId ? updatedFaq : faq
        ));
        
      }
    } catch (error) {
      console.error('Error toggling FAQ publish status:', error);
      toast.error('Failed to update FAQ status');
    }
  };

  const handleDeleteFaq = async (faqId) => {
    try {
      const success = await deleteFaq(faqId, token);
      if (success) {
        setFaqs(faqs.filter(faq => faq._id !== faqId));
        setDeleteConfirm(null);
        toast.success('FAQ deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const filteredFaqs = faqs.filter(faq => {
    // Handle null userId cases
    const userFirstName = faq.userId?.firstName || '';
    const userLastName = faq.userId?.lastName || '';
    const userEmail = faq.userId?.email || '';
    
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faq.answer && faq.answer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      userFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'pending' && faq.status === 'pending') ||
      (filterStatus === 'answered' && faq.status === 'answered') ||
      (filterStatus === 'published' && faq.isPublished) ||
      (filterStatus === 'unpublished' && faq.status === 'answered' && !faq.isPublished);

    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFaqs = filteredFaqs.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of FAQ list
    document.getElementById('faq-list')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatusBadge = (faq) => {
    if (faq.status === 'pending') {
      return <span className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium border border-orange-300">Pending</span>;
    }
    if (faq.status === 'answered' && faq.isPublished) {
      return <span className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium border border-green-300">Published</span>;
    }
    if (faq.status === 'answered' && !faq.isPublished) {
      return <span className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium border border-blue-300">Answered</span>;
    }
    return null;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="classic-card p-6 mb-8 shadow-elegant">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="classic-heading text-3xl md:text-4xl mb-2">FAQ Management</h1>
              <p className="section-subtitle text-lg">Manage user questions and publish frequently asked questions</p>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-academic-cream-50 px-4 py-3 rounded-xl border border-academic-cream-200 text-center">
                <div className="text-sm text-academic-slate-600 font-medium">Total FAQs</div>
                <div className="text-2xl font-bold text-academic-navy-900">{faqs.length}</div>
              </div>
              <div className="bg-orange-50 px-4 py-3 rounded-xl border border-orange-200 text-center">
                <div className="text-sm text-orange-600 font-medium">Pending</div>
                <div className="text-2xl font-bold text-orange-700">{faqs.filter(f => f.status === 'pending').length}</div>
              </div>
              <div className="bg-green-50 px-4 py-3 rounded-xl border border-green-200 text-center">
                <div className="text-sm text-green-600 font-medium">Published</div>
                <div className="text-2xl font-bold text-green-700">{faqs.filter(f => f.isPublished).length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="classic-card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search FAQs, users, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input pl-12"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
            </div>

            {/* Filter */}
            <div className="w-full sm:w-auto sm:min-w-[200px]">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="classic-input pr-10 appearance-none"
                >
                  <option value="all">All FAQs</option>
                  <option value="pending">Pending</option>
                  <option value="answered">Answered</option>
                  <option value="published">Published</option>
                  <option value="unpublished">Unpublished</option>
                </select>
                <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Results info and pagination info */}
          {filteredFaqs.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-6 border-t border-academic-slate-200 gap-2">
              <div className="text-sm text-academic-slate-600 font-medium">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredFaqs.length)} of {filteredFaqs.length} FAQs
              </div>
              <div className="text-sm text-academic-slate-600 font-medium">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          )}
        </div>

        {/* FAQ List */}
        {loading ? (
          <div className="classic-card p-12 text-center">
            <div className="w-16 h-16 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-academic-slate-600 text-lg font-medium">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="classic-card p-12 text-center">
            <div className="w-20 h-20 bg-academic-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤔</span>
            </div>
            <h3 className="elegant-heading mb-3">No FAQs Found</h3>
            <p className="text-academic-slate-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'No FAQs have been submitted yet'}
            </p>
          </div>
        ) : (
          <>
            {/* FAQ List */}
            <div id="faq-list" className="space-y-6 mb-8">
              {currentFaqs.map((faq) => (
                <div key={faq._id} className="elegant-card hover:shadow-elegant transition-all duration-300 relative">
                  {deleteConfirm === faq._id && (
                    <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 rounded-xl">
                      <div className="bg-white rounded-xl p-6 shadow-elegant border border-academic-slate-200 max-w-md w-full mx-4">
                        <h3 className="elegant-heading mb-4">Confirm Delete</h3>
                        <p className="text-academic-slate-600 mb-6">
                          Are you sure you want to delete this FAQ? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleDeleteFaq(faq._id)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            Delete FAQ
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="btn-classic-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* FAQ Header */}
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                          {getStatusBadge(faq)}
                          <span className="text-sm text-academic-slate-500 flex items-center gap-2 font-medium">
                            <FaClock className="text-academic-slate-400" />
                            {formatDate(faq.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-lg lg:text-xl font-bold text-academic-navy-900 mb-4 leading-relaxed font-playfair">
                          {faq.question}
                        </h3>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {faq.status === 'answered' && (
                          <button
                            onClick={() => handleTogglePublish(faq._id)}
                            className={`p-3 rounded-lg transition-all font-medium ${
                              faq.isPublished 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300' 
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
                            }`}
                            title={faq.isPublished ? 'Published - Click to unpublish' : 'Not Published - Click to publish'}
                          >
                            {faq.isPublished ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        )}
                        
                        {!faq.answer && (
                          <button
                            onClick={() => {
                              setEditingFaq(faq._id);
                              setAnswer(faq.answer || '');
                            }}
                            className="p-3 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 transition-all"
                            title="Answer Question"
                          >
                            <FaEdit />
                          </button>
                        )}

                        <button
                          onClick={() => setDeleteConfirm(faq._id)}
                          className="p-3 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 transition-all"
                          title="Delete FAQ"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Answer Section */}
                    {editingFaq === faq._id ? (
                      <div className="bg-academic-cream-50 rounded-xl p-6 mb-6 border border-academic-cream-200">
                        <label className="classic-label mb-3">
                          Your Answer
                        </label>
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your detailed answer here..."
                          rows={4}
                          className="classic-textarea mb-4"
                        />
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleAnswerSubmit(faq._id)}
                            className="btn-elegant"
                          >
                            Submit Answer
                          </button>
                          <button
                            onClick={() => {
                              setEditingFaq(null);
                              setAnswer('');
                            }}
                            className="btn-classic-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      faq.answer && (
                        <div className="bg-academic-cream-50 rounded-xl p-6 mb-6 border border-academic-cream-200">
                          <h4 className="classic-label mb-3">Answer:</h4>
                          <p className="text-academic-slate-700 leading-relaxed mb-3">{faq.answer}</p>
                          {faq.answeredAt && (
                            <p className="text-sm text-academic-slate-500 font-medium">
                              Answered on {formatDate(faq.answeredAt)}
                            </p>
                          )}
                        </div>
                      )
                    )}

                    {/* User Info */}
                    <div className="flex items-center gap-3 text-sm text-academic-slate-600 bg-academic-slate-50 rounded-xl p-4 border border-academic-slate-200">
                      <div className="w-8 h-8 bg-academic-navy-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-academic-navy-600" />
                      </div>
                      <span className="font-medium">
                        Asked by: <span className="text-academic-navy-900 font-semibold">
                          {faq.userId ? 
                            `${faq.userId.firstName} ${faq.userId.lastName}` : 
                            'Unknown User'
                          }
                        </span> 
                        {faq.userId?.email && (
                          <span className="text-academic-slate-500"> ({faq.userId.email})</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="classic-card p-6">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-3 rounded-lg transition-all font-medium ${
                      currentPage === 1
                        ? 'bg-academic-slate-100 text-academic-slate-400 cursor-not-allowed'
                        : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                    }`}
                  >
                    <FaChevronLeft />
                  </button>

                  {/* Page numbers */}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = page === 1 || 
                                      page === totalPages || 
                                      (page >= currentPage - 1 && page <= currentPage + 1);
                      
                      if (!showPage && page === 2 && currentPage > 4) {
                        return <span key={page} className="px-3 py-2 text-academic-slate-400">...</span>;
                      }
                      
                      if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                        return <span key={page} className="px-3 py-2 text-academic-slate-400">...</span>;
                      }
                      
                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-3 rounded-lg transition-all font-medium ${
                            currentPage === page
                              ? 'bg-academic-navy-700 text-white shadow-classic'
                              : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-3 rounded-lg transition-all font-medium ${
                      currentPage === totalPages
                        ? 'bg-academic-slate-100 text-academic-slate-400 cursor-not-allowed'
                        : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaqManagement;
