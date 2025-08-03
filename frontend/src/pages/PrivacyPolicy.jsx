import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaEye, FaUserShield, FaDatabase, FaCookie, FaEnvelope, FaCalendarAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: "overview",
      title: "Privacy Overview",
      icon: <FaShieldAlt className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            At Beeja Academy, we understand the importance of safeguarding your personal information. 
            This Privacy Policy outlines our approach to data protection and privacy to fulfill our 
            obligations under applicable laws and regulations.
          </p>
          <p className="text-academic-slate-700 leading-relaxed">
            We are committed to treating data privacy seriously and want you to know exactly what we do 
            with your personal data. This policy applies to all personal data processed by us, whether 
            in physical or electronic mode.
          </p>
        </div>
      )
    },
    {
      id: "collection",
      title: "Information We Collect",
      icon: <FaDatabase className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">We collect information in several ways:</p>
          
          <div className="space-y-4">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-academic-gold-500 rounded-full"></div>
                Information You Provide
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700">
                <li>Account registration details (name, email, password)</li>
                <li>Profile information and preferences</li>
                <li>Course enrollment and progress data</li>
                <li>Communication with support team</li>
                <li>Newsletter subscriptions</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-academic-navy-500 rounded-full"></div>
                Automatically Collected Information
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700">
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Usage patterns and learning analytics</li>
                <li>Cookies and similar technologies</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "usage",
      title: "How We Use Your Information",
      icon: <FaEye className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">We use your information to:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Service Delivery</h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>Provide and maintain our platform</li>
                <li>Process course enrollments</li>
                <li>Track learning progress</li>
                <li>Issue certificates</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Communication</h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>Send course updates</li>
                <li>Respond to inquiries</li>
                <li>Marketing communications</li>
                <li>Security notifications</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Improvement</h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>Analyze usage patterns</li>
                <li>Personalize experience</li>
                <li>Develop new features</li>
                <li>Quality assurance</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Legal Compliance</h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>Meet regulatory requirements</li>
                <li>Prevent fraud and abuse</li>
                <li>Enforce terms of service</li>
                <li>Protect user safety</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: <FaUserShield className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information only in the following circumstances:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-academic-gold-500 pl-6 bg-academic-gold-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Service Providers</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                With trusted third-party service providers who assist in operating our platform, 
                subject to strict confidentiality agreements.
              </p>
            </div>
            
            <div className="border-l-4 border-academic-navy-500 pl-6 bg-academic-navy-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Legal Requirements</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                When required by law, court order, or government regulation, or to protect 
                our rights and the safety of our users.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Business Transfers</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                In connection with a merger, acquisition, or sale of assets, with appropriate 
                notice to affected users.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Data Security",
      icon: <FaLock className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            We implement comprehensive security measures to protect your personal information:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-academic-slate-50 to-academic-slate-100 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <FaLock className="text-academic-gold-600" />
                Technical Safeguards
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Encrypted data storage</li>
                <li>Regular security audits</li>
                <li>Secure access controls</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-academic-slate-50 to-academic-slate-100 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <FaShieldAlt className="text-academic-navy-600" />
                Administrative Safeguards
              </h4>
              <ul className="list-disc pl-6 space-y-1 text-academic-slate-700 text-sm">
                <li>Employee training on data privacy</li>
                <li>Limited access on need-to-know basis</li>
                <li>Regular policy updates</li>
                <li>Incident response procedures</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-academic-gold-50 border border-academic-gold-300 p-6 rounded-xl">
            <p className="text-academic-gold-800 text-sm leading-relaxed">
              <strong>Important:</strong> While we implement robust security measures, no method of 
              transmission over the Internet or electronic storage is 100% secure. We cannot guarantee 
              absolute security but are committed to protecting your data using industry best practices.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking",
      icon: <FaCookie className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            We use cookies and similar technologies to enhance your experience:
          </p>
          
          <div className="space-y-4">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Essential Cookies</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                Required for basic platform functionality, including authentication and security features.
              </p>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Analytics Cookies</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                Help us understand how users interact with our platform to improve user experience.
              </p>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Preference Cookies</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                Remember your settings and preferences for a personalized experience.
              </p>
            </div>
          </div>
          
          <p className="text-academic-slate-600 text-sm leading-relaxed">
            You can control cookie settings through your browser preferences, though disabling certain 
            cookies may affect platform functionality.
          </p>
        </div>
      )
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <FaUserShield className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            You have several rights regarding your personal data:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-academic-navy-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Access</h4>
                  <p className="text-academic-slate-700 text-sm">Request a copy of your personal data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-academic-gold-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Correction</h4>
                  <p className="text-academic-slate-700 text-sm">Update or correct inaccurate information</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Deletion</h4>
                  <p className="text-academic-slate-700 text-sm">Request deletion of your personal data</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Portability</h4>
                  <p className="text-academic-slate-700 text-sm">Export your data in a portable format</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">5</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Restriction</h4>
                  <p className="text-academic-slate-700 text-sm">Limit how we process your data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-academic-gold-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">6</span>
                </div>
                <div>
                  <h4 className="font-bold text-academic-navy-900">Objection</h4>
                  <p className="text-academic-slate-700 text-sm">Object to certain data processing</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-academic-navy-50 border border-academic-navy-300 p-6 rounded-xl">
            <p className="text-academic-navy-800 text-sm leading-relaxed">
              To exercise any of these rights, please contact us at 
              <span className="font-bold"> privacy@beejaacademy.com</span>. 
              We will respond to your request within 30 days.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "updates",
      title: "Policy Updates",
      icon: <FaCalendarAlt className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            technology, legal requirements, or other factors.
          </p>
          
          <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
            <h4 className="font-bold text-academic-navy-900 mb-3">How We Notify You</h4>
            <ul className="list-disc pl-6 space-y-2 text-academic-slate-700">
              <li>Email notification to registered users</li>
              <li>Prominent notice on our website</li>
              <li>In-app notifications for significant changes</li>
              <li>Updated effective date at the top of this policy</li>
            </ul>
          </div>
          
          <p className="text-academic-slate-600 font-medium">
            <strong>Last Updated:</strong> January 15, 2024
          </p>
        </div>
      )
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
              <FaShieldAlt className="text-3xl text-academic-navy-900" />
            </div>
          </motion.div>
          <motion.h1 
            className="classic-heading text-4xl md:text-6xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Privacy <HighlightText text="Policy" variant="gold" />
          </motion.h1>
          <motion.p 
            className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Your privacy is important to us. Learn how we collect, use, and protect your personal information 
            with transparency and care.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Summary */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="classic-card p-8 bg-gradient-to-r from-academic-gold-50 to-academic-cream-50 border border-academic-gold-200">
            <h2 className="elegant-heading text-2xl text-academic-navy-900 mb-6 flex items-center gap-3">
              <FaEye className="text-academic-gold-600" />
              Quick Summary
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-navy-900">Transparent</div>
                <div className="text-sm text-academic-slate-600">Clear about data collection</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-gold-700">Secure</div>
                <div className="text-sm text-academic-slate-600">Industry-standard protection</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-navy-900">Your Control</div>
                <div className="text-sm text-academic-slate-600">You own your data</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Privacy Sections */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-6">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                className="classic-card overflow-hidden hover:shadow-elegant transition-all duration-300"
                variants={itemVariants}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-academic-slate-50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-academic-cream-100 rounded-full flex items-center justify-center">
                      {section.icon}
                    </div>
                    <h3 className="elegant-heading text-xl text-academic-navy-900">
                      {section.title}
                    </h3>
                  </div>
                  <div className="text-academic-slate-400">
                    {expandedSection === section.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedSection === section.id ? "auto" : 0,
                    opacity: expandedSection === section.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-academic-slate-200">
                    {section.content}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section 
          className="mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 p-12 rounded-3xl text-center text-white shadow-elegant">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-academic-gold-500 rounded-full flex items-center justify-center mx-auto">
                <FaEnvelope className="text-3xl text-academic-navy-900" />
              </div>
              <h2 className="classic-heading text-3xl md:text-4xl text-white">
                Questions About
                <HighlightText text=" Privacy?" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, 
                we're here to help. Contact our privacy team directly.
              </p>
              <a 
                href="mailto:privacy@beejaacademy.com"
                className="inline-flex items-center gap-3 bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
              >
                <FaEnvelope />
                privacy@beejaacademy.com
              </a>
            </div>
          </div>
        </motion.section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default PrivacyPolicy;
