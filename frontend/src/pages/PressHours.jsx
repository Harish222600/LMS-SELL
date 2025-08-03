import React from "react";
import { motion } from "framer-motion";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";
import { 
  FaNewspaper, 
  FaClock, 
  FaEnvelope, 
  FaCalendarAlt,
  FaHeadset,
  FaGraduationCap,
  FaChevronRight,
  FaPhone,
  FaQuestionCircle
} from "react-icons/fa";

const PressHours = () => {
  const pressReleases = [
    {
      date: "March 15, 2024",
      title: "Beeja Academy Launches New AI and Machine Learning Track",
      content: "Expanding our curriculum to meet industry demands with cutting-edge AI courses designed by leading experts in the field.",
      category: "Product Launch"
    },
    {
      date: "February 28, 2024",
      title: "Partnership Announcement with Leading Tech Companies",
      content: "Strategic collaborations to enhance job placement opportunities for our graduates and provide real-world project experience.",
      category: "Partnership"
    },
    {
      date: "January 10, 2024",
      title: "Beeja Academy Reaches 100,000 Student Milestone",
      content: "Celebrating our growing community of learners and their remarkable success stories across various industries.",
      category: "Milestone"
    }
  ];

  const supportChannels = [
    {
      icon: <FaHeadset className="text-2xl text-academic-gold-600" />,
      title: "Technical Support",
      email: "support@beejaacademy.com",
      description: "Get help with platform issues, course access, and technical difficulties"
    },
    {
      icon: <FaGraduationCap className="text-2xl text-academic-navy-600" />,
      title: "Course Inquiries",
      email: "courses@beejaacademy.com",
      description: "Questions about course content, enrollment, and learning paths"
    },
    {
      icon: <FaNewspaper className="text-2xl text-academic-gold-600" />,
      title: "Media Contact",
      email: "press@beejaacademy.com",
      description: "Press inquiries, media kits, and interview requests"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-academic-gold-500/20 px-4 py-2 rounded-full text-academic-gold-400 text-sm font-medium">
                <FaNewspaper className="w-4 h-4" />
                Press & Support Information
              </div>
              
              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Press Room &
                <HighlightText text=" Support Hours" variant="gold" />
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed">
                Stay updated with our latest news and find the support you need. 
                We're here to help you succeed in your learning journey.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Press Section */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-6">
                Press
                <HighlightText text=" Room" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-600 text-lg mb-8">
                Welcome to Beeja Academy's Press Room. Find the latest news, press releases, 
                and media resources about our mission to transform education.
              </p>
            </motion.div>

            {/* Latest Press Releases */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-6">Latest Press Releases</h3>
              <div className="space-y-6">
                {pressReleases.map((press, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="classic-card p-6 hover:shadow-elegant transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="inline-flex items-center gap-2 bg-academic-gold-100 text-academic-gold-800 px-3 py-1 rounded-full text-sm font-medium">
                        <FaCalendarAlt className="text-xs" />
                        {press.date}
                      </div>
                      <span className="text-xs text-academic-slate-500 bg-academic-slate-100 px-2 py-1 rounded-full">
                        {press.category}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-academic-navy-900 mb-3 group-hover:text-academic-gold-600 transition-colors duration-300">
                      {press.title}
                    </h4>
                    <p className="text-academic-slate-700 leading-relaxed">{press.content}</p>
                    <div className="flex items-center gap-2 text-academic-gold-600 font-medium mt-4 group-hover:gap-3 transition-all duration-300">
                      <span className="text-sm">Read More</span>
                      <FaChevronRight className="text-xs" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Media Contact */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="elegant-heading text-2xl text-academic-navy-900">Media Resources</h3>
              <div className="classic-card p-8 bg-gradient-to-br from-academic-gold-50 to-academic-cream-50 border border-academic-gold-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-academic-gold-500 rounded-full flex items-center justify-center">
                    <FaNewspaper className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-academic-navy-900">Media Kit Available</h4>
                    <p className="text-academic-slate-600">Logos, images, and company information</p>
                  </div>
                </div>
                <p className="text-academic-slate-700 mb-4">
                  For media inquiries, interviews, or press materials, please contact our media team.
                </p>
                <a 
                  href="mailto:press@beejaacademy.com"
                  className="inline-flex items-center gap-2 text-academic-gold-700 hover:text-academic-gold-800 font-medium transition-colors duration-300"
                >
                  <FaEnvelope className="text-sm" />
                  press@beejaacademy.com
                </a>
              </div>
            </motion.section>
          </div>

          {/* Hours & Support Section */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-6">
                Support
                <HighlightText text=" Hours" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-600 text-lg mb-8">
                Our dedicated support team is here to help you succeed. Find our availability and contact information below.
              </p>
            </motion.div>

            {/* Support Hours */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-6">Business Hours</h3>
              <div className="classic-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-academic-navy-700 text-xl" />
                  </div>
                  <h4 className="text-xl font-bold text-academic-navy-900">Support Availability</h4>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-academic-slate-200">
                    <span className="text-academic-slate-700 font-medium">Monday - Friday:</span>
                    <span className="text-academic-navy-900 font-bold">9:00 AM - 6:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-academic-slate-200">
                    <span className="text-academic-slate-700 font-medium">Saturday:</span>
                    <span className="text-academic-navy-900 font-bold">10:00 AM - 2:00 PM IST</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-academic-slate-700 font-medium">Sunday:</span>
                    <span className="text-red-600 font-bold">Closed</span>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Support Channels */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-6">Contact Channels</h3>
              <div className="space-y-4">
                {supportChannels.map((channel, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="classic-card p-6 hover:shadow-elegant transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-academic-cream-100 rounded-full flex items-center justify-center flex-shrink-0">
                        {channel.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-academic-navy-900 mb-2">{channel.title}</h4>
                        <p className="text-academic-slate-600 text-sm mb-3">{channel.description}</p>
                        <a 
                          href={`mailto:${channel.email}`}
                          className="inline-flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-300"
                        >
                          <FaEnvelope className="text-sm" />
                          {channel.email}
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Holiday Schedule */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-6">Holiday Schedule</h3>
              <div className="classic-card p-8 bg-gradient-to-br from-academic-navy-50 to-academic-slate-50 border border-academic-navy-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-academic-navy-500 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-white text-xl" />
                  </div>
                  <h4 className="text-xl font-bold text-academic-navy-900">Important Notice</h4>
                </div>
                <p className="text-academic-slate-700 mb-4 leading-relaxed">
                  We observe major national holidays. During these times, support response 
                  may be delayed. Check our social media channels for specific holiday closure announcements.
                </p>
                <div className="flex items-center gap-2 text-academic-navy-700 font-medium">
                  <FaQuestionCircle className="text-sm" />
                  <span className="text-sm">Emergency support available via email</span>
                </div>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 rounded-3xl p-12 text-center text-white">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-academic-gold-500 rounded-full flex items-center justify-center mx-auto">
                <FaHeadset className="text-3xl text-academic-navy-900" />
              </div>
              
              <h2 className="classic-heading text-3xl md:text-4xl text-white">
                Need Immediate
                <HighlightText text=" Assistance?" variant="gold" />
              </h2>
              
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                Our support team is ready to help you with any questions or technical issues. 
                Don't hesitate to reach out during our business hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:support@beejaacademy.com"
                  className="inline-flex items-center gap-3 bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                >
                  <FaEnvelope className="text-sm" />
                  Contact Support
                </a>
                
                <button className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-academic-navy-900 transition-colors duration-300">
                  Live Chat <FaChevronRight className="text-sm" />
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

export default PressHours;
