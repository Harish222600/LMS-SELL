import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeadset, FaEnvelope, FaPhone, FaClock, FaQuestionCircle, FaSearch, FaChevronDown, FaChevronUp, FaComments, FaBook, FaVideo, FaTicketAlt, FaChevronRight } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";

const Support = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportCategories = [
    { id: "all", name: "All Topics", icon: <FaQuestionCircle /> },
    { id: "account", name: "Account", icon: <FaHeadset /> },
    { id: "courses", name: "Courses", icon: <FaBook /> },
    { id: "technical", name: "Technical", icon: <FaVideo /> },
    { id: "billing", name: "Billing", icon: <FaTicketAlt /> }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page. Enter your email address and we'll send you a reset link.",
      category: "account"
    },
    {
      id: 2,
      question: "Can I download course videos for offline viewing?",
      answer: "Yes, our mobile app allows you to download course videos for offline viewing. This feature is available for premium subscribers.",
      category: "courses"
    },
    {
      id: 3,
      question: "How do I get a refund for a course?",
      answer: "We offer a 30-day money-back guarantee. To request a refund, contact our support team with your order details within 30 days of purchase.",
      category: "billing"
    },
    {
      id: 4,
      question: "Why can't I access my enrolled course?",
      answer: "This could be due to payment issues, account verification, or technical problems. Check your account status and contact support if the issue persists.",
      category: "technical"
    },
    {
      id: 5,
      question: "How do I update my profile information?",
      answer: "Go to your Dashboard, click on 'My Profile', and you can edit your personal information, profile picture, and preferences.",
      category: "account"
    },
    {
      id: 6,
      question: "Do I get a certificate after completing a course?",
      answer: "Yes, you'll receive a verified certificate of completion for each course you finish. Certificates can be downloaded from your dashboard.",
      category: "courses"
    },
    {
      id: 7,
      question: "Can I change my subscription plan?",
      answer: "Yes, you can upgrade or downgrade your subscription plan at any time from your account settings. Changes take effect at the next billing cycle.",
      category: "billing"
    },
    {
      id: 8,
      question: "The video player is not working properly",
      answer: "Try refreshing the page, clearing your browser cache, or switching to a different browser. Ensure you have a stable internet connection.",
      category: "technical"
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const contactMethods = [
    {
      icon: <FaEnvelope className="text-3xl text-academic-gold-600" />,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "support@beejaacademy.com",
      responseTime: "Within 24 hours",
      action: "Send Email"
    },
    {
      icon: <FaPhone className="text-3xl text-academic-navy-600" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+91 9150274222",
      responseTime: "Mon-Fri, 9 AM - 6 PM IST",
      action: "Call Now"
    },
    {
      icon: <FaComments className="text-3xl text-academic-gold-600" />,
      title: "Live Chat",
      description: "Instant help through chat",
      contact: "Available on website",
      responseTime: "Real-time response",
      action: "Start Chat"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-academic-gold-500 w-20 h-20 rounded-full flex items-center justify-center shadow-elegant">
              <FaHeadset className="text-3xl text-academic-navy-900" />
            </div>
          </motion.div>
          <motion.h1 
            className="classic-heading text-4xl md:text-6xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We're Here to <HighlightText text="Help" variant="gold" />
          </motion.h1>
          <motion.p 
            className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Get the support you need to succeed in your learning journey. Our dedicated team is ready to assist you 
            with expert guidance and personalized solutions.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-academic-gold-400">24/7</div>
              <div className="text-sm text-academic-slate-300">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-academic-gold-400">{"<2hrs"}</div>
              <div className="text-sm text-academic-slate-300">Average Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-academic-gold-400">98%</div>
              <div className="text-sm text-academic-slate-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods */}
        <motion.section 
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Get in
              <HighlightText text=" Touch" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Choose the most convenient way to reach our support team and get the help you need
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                className="classic-card p-8 text-center hover:shadow-elegant transition-all duration-300 group"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 bg-academic-cream-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                </div>
                <h3 className="elegant-heading text-xl text-academic-navy-900 mb-3 group-hover:text-academic-gold-600 transition-colors">
                  {method.title}
                </h3>
                <p className="text-academic-slate-600 mb-6">{method.description}</p>
                <div className="space-y-2 mb-8">
                  <p className="text-academic-navy-900 font-bold">{method.contact}</p>
                  <p className="text-academic-slate-500 text-sm">{method.responseTime}</p>
                </div>
                <button className="btn-elegant group-hover:scale-105 transition-transform duration-300">
                  {method.action}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Frequently Asked
              <HighlightText text=" Questions" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Find quick answers to common questions about our platform and services
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div 
            className="mb-12"
            variants={itemVariants}
          >
            <div className="classic-card p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                    Search FAQs
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400" />
                    <input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="classic-input pl-10"
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="lg:w-auto">
                  <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                    Filter by Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {supportCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          activeCategory === category.id
                            ? 'bg-academic-gold-500 text-white shadow-elegant'
                            : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                        }`}
                      >
                        {category.icon}
                        <span className="hidden sm:inline">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div 
            className="space-y-4"
            variants={itemVariants}
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="classic-card overflow-hidden hover:shadow-elegant transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-academic-slate-50 transition-colors duration-300"
                  >
                    <h3 className="elegant-heading text-lg text-academic-navy-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="text-academic-slate-400 flex-shrink-0">
                      {expandedFaq === faq.id ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedFaq === faq.id ? "auto" : 0,
                      opacity: expandedFaq === faq.id ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 border-t border-academic-slate-200">
                      <p className="text-academic-slate-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="classic-card p-12 max-w-md mx-auto">
                  <FaSearch className="text-6xl text-academic-slate-400 mx-auto mb-6" />
                  <h3 className="elegant-heading text-xl text-academic-navy-900 mb-3">No FAQs found</h3>
                  <p className="text-academic-slate-600 mb-6">Try adjusting your search terms or category filter to find what you're looking for.</p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setActiveCategory("all");
                    }}
                    className="btn-classic-secondary"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.section>

        {/* Additional Support Resources */}
        <motion.section 
          className="mt-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="classic-card p-12 bg-gradient-to-br from-academic-gold-50 to-academic-cream-50 border-academic-gold-200">
            <div className="text-center mb-12">
              <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
                Additional
                <HighlightText text=" Resources" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
                Explore our comprehensive support ecosystem designed to help you succeed
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaBook className="text-3xl" />,
                  title: "Help Center",
                  description: "Comprehensive guides and tutorials",
                  color: "bg-academic-navy-600"
                },
                {
                  icon: <FaVideo className="text-3xl" />,
                  title: "Video Tutorials",
                  description: "Step-by-step video guides",
                  color: "bg-academic-gold-500"
                },
                {
                  icon: <FaComments className="text-3xl" />,
                  title: "Community Forum",
                  description: "Connect with other learners",
                  color: "bg-purple-600"
                },
                {
                  icon: <FaClock className="text-3xl" />,
                  title: "24/7 Support",
                  description: "Round-the-clock assistance",
                  color: "bg-green-600"
                }
              ].map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className={`${resource.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {resource.icon}
                    </div>
                  </div>
                  <h3 className="elegant-heading text-lg text-academic-navy-900 mb-2">{resource.title}</h3>
                  <p className="text-academic-slate-600 text-sm">{resource.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact Form CTA */}
        <motion.section 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 rounded-3xl p-12 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-academic-gold-500 rounded-full flex items-center justify-center mx-auto">
                <FaTicketAlt className="text-3xl text-academic-navy-900" />
              </div>
              <h2 className="classic-heading text-3xl md:text-4xl text-white">
                Still Need
                <HighlightText text=" Help?" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                Can't find what you're looking for? Our support team is here to help. 
                Submit a support ticket and we'll get back to you as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="btn-elegant">
                  <span className="flex items-center gap-2">
                    Submit Support Ticket <FaChevronRight className="text-sm" />
                  </span>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-academic-navy-900 transition-colors duration-300">
                  Browse Help Center
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Support;
