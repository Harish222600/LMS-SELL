import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGavel, FaUserShield, FaExclamationTriangle, FaLock, FaFileContract, FaBalanceScale, FaChevronDown, FaChevronUp, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";

const Terms = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <FaFileContract className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            By accessing and using Beeja Academy's platform, you acknowledge that you have read, 
            understood, and agree to be bound by these Terms of Service and our Privacy Policy.
          </p>
          <div className="bg-academic-navy-50 border border-academic-navy-300 p-6 rounded-xl">
            <h4 className="font-bold text-academic-navy-900 mb-2">Important Notice</h4>
            <p className="text-academic-navy-800 text-sm leading-relaxed">
              If you do not agree to these terms, please do not use our platform. 
              Your continued use constitutes acceptance of any updates to these terms.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "platform-usage",
      title: "Platform Usage",
      icon: <FaUserShield className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            Our platform is designed for educational purposes. You agree to use it responsibly and in accordance with these guidelines:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Permitted Uses
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>Personal learning and skill development</li>
                <li>Professional development and training</li>
                <li>Educational research and study</li>
                <li>Creating portfolios with course projects</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Prohibited Uses
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>Sharing account credentials</li>
                <li>Downloading and redistributing content</li>
                <li>Commercial use without permission</li>
                <li>Reverse engineering or copying</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "user-accounts",
      title: "User Accounts",
      icon: <FaLock className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            When you create an account with us, you are responsible for maintaining its security and accuracy.
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-academic-gold-500 pl-6 bg-academic-gold-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Account Security</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                You are responsible for maintaining the confidentiality of your login credentials 
                and for all activities that occur under your account.
              </p>
            </div>
            
            <div className="border-l-4 border-academic-navy-500 pl-6 bg-academic-navy-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Accurate Information</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                You agree to provide accurate, current, and complete information during registration 
                and to update such information as necessary.
              </p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-6 bg-red-50 p-4 rounded-r-xl">
              <h4 className="font-bold text-academic-navy-900 mb-2">Account Termination</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms 
                or engage in fraudulent activities.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "content-policy",
      title: "Content and Intellectual Property",
      icon: <FaBalanceScale className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            All content on our platform is protected by intellectual property laws. Here's what you need to know:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Our Content</h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>Videos, text, and course materials</li>
                <li>Beeja Academy trademarks and logos</li>
                <li>Platform design and functionality</li>
                <li>Assessment and quiz content</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Your Content</h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>Discussion forum posts</li>
                <li>Project submissions</li>
                <li>Profile information</li>
                <li>Feedback and reviews</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-academic-gold-50 border border-academic-gold-300 p-6 rounded-xl">
            <p className="text-academic-gold-800 text-sm leading-relaxed">
              <strong>License:</strong> We grant you a limited, non-exclusive, non-transferable license 
              to access and use our content for personal educational purposes only.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "payments",
      title: "Payments and Refunds",
      icon: <FaGavel className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            Our payment and refund policies are designed to be fair and transparent:
          </p>
          
          <div className="space-y-4">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Payment Terms</h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>All prices are in USD unless otherwise specified</li>
                <li>Payment is required before accessing premium content</li>
                <li>We accept major credit cards and digital payment methods</li>
                <li>Subscription fees are billed according to your chosen plan</li>
              </ul>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-3">Refund Policy</h4>
              <ul className="list-disc pl-6 space-y-2 text-academic-slate-700 text-sm">
                <li>30-day money-back guarantee for most courses</li>
                <li>Refunds processed within 5-10 business days</li>
                <li>No refunds for completed courses or certificates issued</li>
                <li>Subscription cancellations take effect at the end of billing period</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "security",
      title: "Platform Security",
      icon: <FaExclamationTriangle className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            You agree not to engage in any activities that could compromise the security or integrity of our platform:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 border border-red-300 p-6 rounded-xl">
              <h4 className="font-bold text-red-800 mb-3">Prohibited Activities</h4>
              <ul className="list-disc pl-6 space-y-2 text-red-700 text-sm">
                <li>Attempting to hack or breach security</li>
                <li>Using automated tools to access content</li>
                <li>Distributing malware or viruses</li>
                <li>Interfering with other users' experience</li>
              </ul>
            </div>
            
            <div className="bg-green-50 border border-green-300 p-6 rounded-xl">
              <h4 className="font-bold text-green-800 mb-3">Security Measures</h4>
              <ul className="list-disc pl-6 space-y-2 text-green-700 text-sm">
                <li>SSL encryption for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Monitoring for suspicious activities</li>
                <li>Incident response procedures</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-academic-gold-50 border border-academic-gold-300 p-6 rounded-xl">
            <p className="text-academic-gold-800 text-sm leading-relaxed">
              <strong>Reporting:</strong> If you discover any security vulnerabilities, 
              please report them to security@beejaacademy.com immediately.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <FaBalanceScale className="text-academic-gold-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            While we strive to provide the best educational experience, there are certain limitations to our liability:
          </p>
          
          <div className="space-y-4">
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Service Availability</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                We aim for 99.9% uptime but cannot guarantee uninterrupted service. 
                Maintenance windows and technical issues may occasionally affect availability.
              </p>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Educational Outcomes</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                While our courses are designed to provide valuable skills and knowledge, 
                we cannot guarantee specific career outcomes or job placement.
              </p>
            </div>
            
            <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
              <h4 className="font-bold text-academic-navy-900 mb-2">Third-Party Content</h4>
              <p className="text-academic-slate-700 text-sm leading-relaxed">
                We are not responsible for the accuracy or reliability of third-party 
                content, links, or services referenced in our courses.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "modifications",
      title: "Modifications to Terms",
      icon: <FaCalendarAlt className="text-academic-navy-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-academic-slate-700 leading-relaxed">
            We may update these Terms of Service from time to time to reflect changes in our practices or legal requirements.
          </p>
          
          <div className="bg-academic-slate-50 p-6 rounded-xl border border-academic-slate-200">
            <h4 className="font-bold text-academic-navy-900 mb-3">How We Notify You</h4>
            <ul className="list-disc pl-6 space-y-2 text-academic-slate-700">
              <li>Email notification to all registered users</li>
              <li>Prominent notice on our website homepage</li>
              <li>In-app notifications for significant changes</li>
              <li>30-day notice period for major changes</li>
            </ul>
          </div>
          
          <div className="bg-academic-gold-50 border border-academic-gold-300 p-6 rounded-xl">
            <p className="text-academic-gold-800 text-sm leading-relaxed">
              <strong>Continued Use:</strong> Your continued use of the platform after changes 
              are posted constitutes acceptance of the updated terms.
            </p>
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
              <FaGavel className="text-3xl text-academic-navy-900" />
            </div>
          </motion.div>
          <motion.h1 
            className="classic-heading text-4xl md:text-6xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Terms of <HighlightText text="Service" variant="gold" />
          </motion.h1>
          <motion.p 
            className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Please read these terms carefully before using our platform. They govern your use of Beeja Academy's 
            services and outline our mutual rights and responsibilities.
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
              <FaFileContract className="text-academic-gold-600" />
              Terms Summary
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-navy-900">Fair Use</div>
                <div className="text-sm text-academic-slate-600">Educational purposes only</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-gold-700">Protected</div>
                <div className="text-sm text-academic-slate-600">Your rights are respected</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-academic-navy-900">Transparent</div>
                <div className="text-sm text-academic-slate-600">Clear and understandable</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Terms Sections */}
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
                Questions About These
                <HighlightText text=" Terms?" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                If you have any questions about these Terms of Service or need clarification 
                on any provisions, our legal team is here to help.
              </p>
              <a 
                href="mailto:legal@beejaacademy.com"
                className="inline-flex items-center gap-3 bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
              >
                <FaEnvelope />
                legal@beejaacademy.com
              </a>
            </div>
          </div>
        </motion.section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Terms;
