import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuestionCircle, FaTimes } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { submitQuestion } from '../../services/operations/faqAPI';
import { toast } from 'react-hot-toast';

const FaqButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    question: ''
  });
  const [loading, setLoading] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a question');
      return;
    }

    if (!formData.question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    setLoading(true);
    try {
      const result = await submitQuestion(formData.question, token);
      if (result) {
        setFormData({ question: '' });
        setShowModal(false);
        
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAQ Button */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="bg-academic-gold-500 hover:bg-academic-gold-600 hover:scale-110 p-4 text-lg text-white rounded-full fixed right-6 bottom-24 z-50 duration-500 ease-in-out shadow-elegant border-2 border-academic-gold-400"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Ask a Question"
      >
        <FaQuestionCircle />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="classic-card p-8 w-full max-w-lg mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-academic-gold-100 rounded-full flex items-center justify-center">
                    <FaQuestionCircle className="text-academic-gold-600" />
                  </div>
                  <h2 className="classic-heading text-xl text-academic-navy-900">Ask a Question</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-academic-slate-500 hover:text-academic-slate-700 transition-colors p-2 hover:bg-academic-slate-100 rounded-lg"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {user && (
                  <div className="bg-academic-slate-50 p-4 rounded-lg border border-academic-slate-200">
                    <p className="text-sm text-academic-slate-600 mb-1">
                      Submitting as: <span className="font-semibold text-academic-navy-900">{user.firstName} {user.lastName}</span>
                    </p>
                    <p className="text-sm text-academic-slate-600">
                      Email: <span className="font-semibold text-academic-navy-900">{user.email}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-academic-slate-700 mb-3">
                    Your Question *
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Type your question here..."
                    rows={4}
                    className="classic-input resize-none"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-classic-secondary flex-1 py-3"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formData.question.trim()}
                    className="btn-elegant flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      'Submit Question'
                    )}
                  </button>
                </div>
              </form>

              {!token && (
                <div className="mt-6 p-4 bg-academic-gold-50 border border-academic-gold-200 rounded-lg">
                  <p className="text-academic-gold-800 text-sm">
                    Please <a href="/login" className="underline hover:text-academic-gold-600 font-semibold">login</a> to submit a question.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FaqButton;
