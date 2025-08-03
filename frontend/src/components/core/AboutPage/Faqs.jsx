import React, { useState, useEffect } from 'react'
import HighlightText from '../HomePage/HighlightText'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn } from '../../common/motionFrameVarients'
import { getPublishedFaqs, submitQuestion } from '../../../services/operations/faqAPI'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { FaTimes, FaSearch, FaQuestionCircle } from 'react-icons/fa'

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null)
  const [faqData, setFaqData] = useState([])
  const [filteredFaqs, setFilteredFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ question: '' })
  const [submitting, setSubmitting] = useState(false)

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)

  // Fallback FAQ data in case API fails
  const fallbackFaqData = [
    {
      question: "How does Beeja ensure the quality of its courses?",
      answer: "At Beeja, course quality is our priority. We collaborate with industry experts to design and update our curriculum, ensuring it aligns with the latest trends and standards. Our rigorous review process includes user feedback and continuous assessments. Rest assured, our commitment to providing high-quality, relevant content ensures an enriching learning experience for our users, preparing them for success in their chosen fields."
    },
    {
      question: "How does Beeja stand out from other online learning platforms?",
      answer: "Beeja distinguishes itself through a combination of diverse, expert-curated content and an interactive learning environment. Our courses are crafted by industry professionals, ensuring real-world relevance. We prioritize user engagement with interactive elements, fostering a dynamic and effective learning experience. Additionally, personalized learning paths cater to individual needs."
    },
    {
      question: "What types of learning formats does Beeja offer?",
      answer: "Beeja offers a diverse range of learning formats including video lectures, interactive assignments, live sessions, hands-on projects, and peer collaboration opportunities. Our platform supports both self-paced learning and structured courses, complemented by practical exercises and real-world case studies to ensure comprehensive skill development."
    },
    {
      question: "How does Beeja ensure the accessibility of its courses for learners with different schedules?",
      answer: "We understand the importance of flexibility in learning. Our platform offers 24/7 access to course materials, allowing learners to study at their own pace. Content is available on multiple devices, and courses are structured in digestible modules. We also provide downloadable resources and mobile-friendly content for learning on-the-go."
    },
    {
      question: "Can I get a refund if I'm unsatisfied with a course on Beeja?",
      answer: "Yes, we offer a satisfaction guarantee. If you're unsatisfied with your course, you can request a refund within the first 7 days of purchase. Our support team will guide you through the refund process and gather feedback to help us improve our offerings. Terms and conditions apply to specific courses and circumstances."
    }
  ]

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true)
        const publishedFaqs = await getPublishedFaqs()
        
        if (publishedFaqs && Array.isArray(publishedFaqs) && publishedFaqs.length > 0) {
          setFaqData(publishedFaqs)
          setFilteredFaqs(publishedFaqs)
        } else {
          // Use fallback data if no published FAQs are available
          console.log('No published FAQs found, using fallback data')
          setFaqData(fallbackFaqData)
          setFilteredFaqs(fallbackFaqData)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        // Use fallback data on error
        setFaqData(fallbackFaqData)
        setFilteredFaqs(fallbackFaqData)
      } finally {
        setLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = faqData.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredFaqs(filtered)
    } else {
      setFilteredFaqs(faqData)
    }
  }, [searchTerm, faqData])

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Please login to submit a question')
      return
    }

    if (!formData.question.trim()) {
      toast.error('Please enter your question')
      return
    }

    setSubmitting(true)
    try {
      const result = await submitQuestion(formData.question, token)
      if (result) {
        setFormData({ question: '' })
        setShowModal(false)
        
      }
    } catch (error) {
      console.error('Error submitting question:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-11/12 max-w-maxContent py-20 relative bg-gradient-to-br from-academic-cream-50 to-white">
      {/* Academic Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border-2 border-academic-navy-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border-2 border-academic-gold-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 border-2 border-academic-navy-300 rounded-full"></div>
      </div>
      
      <motion.div
        variants={fadeIn('up', 0.1)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: false, amount: 0.1 }}
        className="text-center mb-16 relative"
      >
        <h2 className="classic-heading text-5xl text-academic-navy-900 mb-6">
          Frequently Asked 
          <HighlightText text=" Questions" variant="gold" />
        </h2>
        <p className="section-subtitle text-xl text-academic-slate-600 max-w-3xl mx-auto">
          Find answers to common questions about our platform, courses, and learning experience
        </p>
        
        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="w-16 h-1 bg-gradient-to-r from-academic-gold-400 to-academic-navy-400 rounded-full"></div>
          <FaQuestionCircle className="text-academic-gold-500 text-2xl" />
          <div className="w-16 h-1 bg-gradient-to-l from-academic-gold-400 to-academic-navy-400 rounded-full"></div>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        variants={fadeIn('up', 0.2)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: false, amount: 0.1 }}
        className="max-w-[600px] mx-auto mb-12"
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="classic-input w-full pl-12 pr-4 py-4 text-lg"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-slate-400 text-lg" />
        </div>
      </motion.div>

      <div className="mt-8 space-y-6 max-w-[900px] mx-auto relative">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="classic-card p-8">
                <div className="animate-pulse">
                  <div className="h-6 bg-academic-slate-200 rounded mb-4"></div>
                  <div className="h-4 bg-academic-slate-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16">
            <div className="classic-card p-12">
              <div className="text-6xl mb-6 text-academic-slate-400">🔍</div>
              <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-4">No FAQs Found</h3>
              <p className="text-academic-slate-600 mb-2">No FAQs found matching your search.</p>
              <p className="text-sm text-academic-slate-500">Try different keywords or browse all questions.</p>
            </div>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={fadeIn('up', 0.1 * (index + 1))}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.1 }}
              className={`classic-card overflow-hidden transition-all duration-300 hover:shadow-elegant group ${activeIndex === index ? 'ring-2 ring-academic-gold-400' : ''}`}
            >
              <button
                className="w-full px-8 py-6 text-left transition-all duration-300 flex justify-between items-center gap-4"
                onClick={() => toggleAccordion(index)}
              >
                <span className={`elegant-heading text-lg transition-all duration-300 ${activeIndex === index ? 'text-academic-gold-700' : 'text-academic-navy-900'}`}>
                  {faq.question}
                </span>
                <span 
                  className={`transform transition-all duration-300 text-xl min-w-[24px] ${activeIndex === index ? 'text-academic-gold-600 rotate-180' : 'text-academic-slate-500'}`}
                >
                  ▼
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="px-8 pb-6 border-t border-academic-slate-200">
                  <p className="text-academic-slate-700 text-base leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Ask a Question Section */}
      <motion.div
        variants={fadeIn('up', 0.3)}
        initial='hidden'
        whileInView={'show'}
        viewport={{ once: false, amount: 0.1 }}
        className="text-center mt-20"
      >
        <div className="classic-card p-10 max-w-[700px] mx-auto bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 text-white">
          <FaQuestionCircle className="text-4xl text-academic-gold-400 mx-auto mb-6" />
          <h3 className="elegant-heading text-3xl mb-4 text-white">
            Still have questions?
          </h3>
          <p className="text-academic-slate-200 text-lg mb-8 max-w-md mx-auto">
            Can't find the answer you're looking for? We're here to help you succeed!
          </p>
          <button 
            onClick={() => setShowModal(true)}
            className="btn-elegant px-10 py-4 text-lg font-semibold"
          >
            Ask a Question
          </button>
        </div>
      </motion.div>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="classic-card w-full max-w-md mx-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-academic-slate-200">
                <h2 className="elegant-heading text-2xl text-academic-navy-900">Ask a Question</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-academic-slate-400 hover:text-academic-navy-700 transition-colors p-2"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {user && (
                  <div className="bg-academic-cream-50 p-4 rounded-lg">
                    <p className="text-sm text-academic-slate-600 mb-1">
                      <span className="font-semibold">Submitting as:</span> {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-academic-slate-600">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                  </div>
                )}

                <div>
                  <label htmlFor="question" className="block text-sm font-semibold text-academic-navy-900 mb-3">
                    Your Question *
                  </label>
                  <textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Type your question here..."
                    rows={4}
                    className="classic-input w-full resize-none"
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
                    disabled={submitting || !formData.question.trim()}
                    className="btn-elegant flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Question'}
                  </button>
                </div>
              </form>

              {!token && (
                <div className="mt-6 p-4 bg-academic-gold-50 border-2 border-academic-gold-200 rounded-lg">
                  <p className="text-academic-gold-800 text-sm text-center">
                    Please <a href="/login" className="underline hover:text-academic-gold-900 font-semibold">login</a> to submit a question.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default FAQSection
