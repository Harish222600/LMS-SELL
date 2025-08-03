import React from "react"
import { motion } from "framer-motion"
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaHandshake,
  FaClock,
  FaGraduationCap,
  FaUsers,
  FaQuestionCircle,
  FaComments,
  FaChevronRight,
  FaBuilding,
  FaGlobe
} from "react-icons/fa"

import ImprovedFooter from "../components/common/ImprovedFooter"
import ContactUsForm from "../components/core/ContactPage/ContactUsForm"
import ReviewSlider from '../components/common/ReviewSlider'
import HighlightText from "../components/core/HomePage/HighlightText"

const contactMethods = [
  {
    icon: FaEnvelope,
    title: "Email Us",
    description: "Get in touch via email",
    details: "info@beejaacademy.com",
    action: "Send Email",
    href: "mailto:info@beejaacademy.com",
    color: "bg-blue-500"
  },
  {
    icon: FaPhone,
    title: "Call Us",
    description: "Speak with our team",
    details: "+91 91502 74222",
    action: "Call Now",
    href: "tel:+919150274222",
    color: "bg-green-500"
  },
  {
    icon: FaHandshake,
    title: "Partnership",
    description: "Business inquiries",
    details: "partner@beejaacademy.com",
    action: "Partner With Us",
    href: "mailto:partner@beejaacademy.com",
    color: "bg-purple-500"
  }
]

const officeLocations = [
  {
    type: "Marketing Office",
    address: "No.2, 2nd Floor, Gokul Arcade Sardar Patel Road, Adyar, Chennai 600020",
    mapUrl: "https://maps.app.goo.gl/izs9QjGre23YJPoXA",
    iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.8665540202246!2d80.23958003308385!3d12.956588031160546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d17a2d0336b%3A0x7e844a0c331cb391!2sBeeja%20Academy!5e1!3m2!1sen!2sin!4v1748981812254!5m2!1sen!2sin"
  },
  {
    type: "Training Centre",
    address: "No 31, Panchayat Main Road, Near Jain Anumitha Apartments, Perungudi, Chennai, Tamil Nadu 600096",
    mapUrl: "https://maps.app.goo.gl/uwz84s88kipS2MsK7",
    iframe: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3938.078403000359!2d80.2544201751349!3d13.006325287312254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267f3d1715661%3A0x8171b63cf3e5a7af!2sBeeja%20Academy!5e1!3m2!1sen!2sin!4v1748982487813!5m2!1sen!2sin"
  }
]

const faqItems = [
  {
    question: "What courses do you offer?",
    answer: "We offer a wide range of technology courses including web development, data science, AI/ML, and more."
  },
  {
    question: "How can I enroll in a course?",
    answer: "You can enroll through our website or contact us directly for personalized guidance."
  },
  {
    question: "Do you offer corporate training?",
    answer: "Yes, we provide customized corporate training solutions for organizations."
  },
  {
    question: "What are your operating hours?",
    answer: "We're available Monday to Friday, 8 AM to 6 PM IST for support and inquiries."
  }
]

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-slate-50 to-white">
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
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-academic-gold-500/20 px-4 py-2 rounded-full text-academic-gold-400 text-sm font-medium">
                <FaComments className="w-4 h-4" />
                Get In Touch
              </div>
              
              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Contact
                <HighlightText text=" Our Team" variant="gold" />
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl max-w-3xl mx-auto">
                Have questions about our courses or need guidance on your learning journey? 
                We're here to help you succeed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <div className="flex items-center gap-2 text-academic-slate-300">
                  <FaClock className="w-4 h-4 text-academic-gold-400" />
                  <span>Response within 24 hours</span>
                </div>
                <div className="flex items-center gap-2 text-academic-slate-300">
                  <FaUsers className="w-4 h-4 text-academic-gold-400" />
                  <span>Expert guidance available</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Multiple Ways to
              <HighlightText text=" Reach Us" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-2xl mx-auto">
              Choose the most convenient way to get in touch with our team
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-300 border border-academic-slate-200 group"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${method.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-academic-navy-900 mb-2">
                  {method.title}
                </h3>
                
                <p className="text-academic-slate-600 mb-4">
                  {method.description}
                </p>
                
                <p className="text-academic-navy-900 font-semibold mb-6">
                  {method.details}
                </p>
                
                <a
                  href={method.href}
                  className="inline-flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-300 group"
                >
                  <span>{method.action}</span>
                  <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-academic-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-elegant"
            >
              <div className="mb-8">
                <h3 className="classic-heading text-2xl md:text-3xl text-academic-navy-900 mb-4">
                  Send Us a
                  <HighlightText text=" Message" variant="gold" />
                </h3>
                <p className="text-academic-slate-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              
              <ContactUsForm />
            </motion.div>

            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="classic-heading text-2xl md:text-3xl text-academic-navy-900 mb-4">
                  Visit Our
                  <HighlightText text=" Offices" variant="gold" />
                </h3>
                <p className="text-academic-slate-600 mb-8">
                  Come visit us at our locations in Chennai for in-person consultations.
                </p>
              </div>

              {officeLocations.map((location, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-elegant">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-academic-gold-500/20 rounded-full">
                      <FaBuilding className="w-6 h-6 text-academic-gold-600" />
                    </div>
                    <h4 className="text-xl font-bold text-academic-navy-900">
                      {location.type}
                    </h4>
                  </div>
                  
                  <p className="text-academic-slate-600 mb-4 leading-relaxed">
                    {location.address}
                  </p>
                  
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-academic-gold-600 hover:text-academic-gold-700 font-medium transition-colors duration-300 mb-4 group"
                  >
                    <FaGlobe className="w-4 h-4" />
                    <span>View on Google Maps</span>
                    <FaChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  
                  <div className="w-full h-48 rounded-lg overflow-hidden">
                    <iframe
                      src={location.iframe}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Frequently Asked
              <HighlightText text=" Questions" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              Quick answers to common questions about our courses and services
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-academic-slate-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-8 h-8 bg-academic-gold-500/20 rounded-full flex-shrink-0 mt-1">
                    <FaQuestionCircle className="w-4 h-4 text-academic-gold-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-academic-navy-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-academic-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-academic-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              What Our Students
              <HighlightText text=" Say" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              Hear from learners who have transformed their careers with us
            </p>
          </motion.div>
          
          <ReviewSlider />
        </div>
      </section>

      {/* Footer */}
      <ImprovedFooter />
    </div>
  )
}

export default Contact
