import React from "react"
import { motion } from 'framer-motion'
import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"

import ImprovedFooter from "../components/common/ImprovedFooter"
import LearningGrid from "../components/core/AboutPage/LearningGrid"
import Quote from "../components/core/AboutPage/Quote"
import HighlightText from "../components/core/HomePage/HighlightText"
import Img from "../components/common/Img"
import ReviewSlider from './../components/common/ReviewSlider';
import TeamCard from "./Card/components/TeamCard"
import FAQSection from "../components/core/AboutPage/Faqs"

import { FaGraduationCap, FaBookOpen, FaUsers, FaStar, FaChevronRight, FaLightbulb, FaRocket, FaHeart, FaGlobe, FaAward, FaClock } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen bg-classic-warmWhite">
      {/* Hero Section - Split Layout */}
      <section className="relative bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 py-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-academic-navy-200/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2 text-sm text-academic-slate-600 mb-8"
          >
            <span>Home</span>
            <FaChevronRight className="text-xs" />
            <span className="text-academic-gold-600 font-medium">About Us</span>
          </motion.nav>

          {/* Split Hero Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-academic-gold-100 text-academic-gold-800 px-4 py-2 rounded-full text-sm font-medium">
                <FaGraduationCap className="text-sm" />
                Welcome to the Future of Learning
              </div>
              
              <h1 className="classic-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
                Empowering Minds Through
                <HighlightText text=" Innovation" variant="gold" />
              </h1>
              
              <p className="section-subtitle text-xl leading-relaxed">
                At BeejaAcademy, we're revolutionizing education by combining cutting-edge technology 
                with expert instruction to create transformative learning experiences that prepare you for tomorrow's challenges.
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-navy-900">25K+</div>
                  <div className="text-sm text-academic-slate-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-navy-900">100+</div>
                  <div className="text-sm text-academic-slate-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-navy-900">4.9★</div>
                  <div className="text-sm text-academic-slate-600">Rating</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-academic-navy-700 text-white px-8 py-4 rounded-lg font-medium hover:bg-academic-navy-800 transition-colors shadow-elegant">
                  Start Your Journey
                </button>
                <button className="border border-academic-navy-700 text-academic-navy-700 px-8 py-4 rounded-lg font-medium hover:bg-academic-navy-700 hover:text-white transition-colors">
                  Watch Our Story
                </button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Img src={BannerImage1} alt="Learning Experience" className="w-full h-96 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-academic-navy-900/30 to-transparent"></div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-xl shadow-elegant p-4 max-w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-academic-gold-100 rounded-full flex items-center justify-center">
                    <FaAward className="text-academic-gold-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-academic-navy-900">Certified</div>
                    <div className="text-sm text-academic-slate-600">Industry Recognition</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl shadow-elegant p-4 max-w-48">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-academic-navy-100 rounded-full flex items-center justify-center">
                    <FaClock className="text-academic-navy-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-academic-navy-900">24/7</div>
                    <div className="text-sm text-academic-slate-600">Learning Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Quote Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-academic-navy-50 to-academic-gold-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Quote />
          </motion.div>
        </div>
      </section>

      {/* Story Timeline Section - New Layout */}
      <section className="py-20 bg-academic-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              Our Learning
              <HighlightText text=" Philosophy" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Discover how we're transforming education through innovative approaches and proven methodologies
            </p>
          </motion.div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-academic-gold-300 hidden lg:block"></div>

            {/* Timeline Items */}
            <div className="space-y-16">
              {/* Item 1 - Smart Learning */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row items-center gap-8"
              >
                <div className="lg:w-1/2 lg:pr-8 text-center lg:text-right">
                  <div className="classic-card p-8 hover:shadow-elegant group">
                    <div className="flex items-center justify-center lg:justify-end gap-4 mb-4">
                      <div className="w-12 h-12 bg-academic-gold-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h3 className="elegant-heading text-2xl">Smart Learning</h3>
                    </div>
                    <p className="text-academic-slate-600 leading-relaxed">
                      Embrace online education for personalized, accessible, and interactive learning experiences. 
                      Unlock knowledge from anywhere, anytime with our adaptive learning platform.
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-1/2 lg:pl-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                    <Img src={BannerImage2} alt="Smart Learning" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-academic-navy-900/20"></div>
                  </div>
                </div>
              </motion.div>

              {/* Item 2 - Bright Earning */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row-reverse items-center gap-8"
              >
                <div className="lg:w-1/2 lg:pl-8 text-center lg:text-left">
                  <div className="classic-card p-8 hover:shadow-elegant group">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-academic-navy-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h3 className="elegant-heading text-2xl">Bright Earning</h3>
                    </div>
                    <p className="text-academic-slate-600 leading-relaxed">
                      Seize online opportunities for career growth and financial success. Acquire skills, 
                      build expertise, and open doors to a prosperous future with flexible learning pathways.
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-1/2 lg:pr-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                    <Img src={BannerImage3} alt="Bright Earning" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-academic-navy-900/20"></div>
                  </div>
                </div>
              </motion.div>

              {/* Item 3 - Future Ready */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex flex-col lg:flex-row items-center gap-8"
              >
                <div className="lg:w-1/2 lg:pr-8 text-center lg:text-right">
                  <div className="classic-card p-8 hover:shadow-elegant group">
                    <div className="flex items-center justify-center lg:justify-end gap-4 mb-4">
                      <div className="w-12 h-12 bg-academic-gold-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h3 className="elegant-heading text-2xl">Future Ready</h3>
                    </div>
                    <p className="text-academic-slate-600 leading-relaxed">
                      Elevate your skills with flexible, accessible courses. Unleash your potential, 
                      shape a brighter future, and open doors to rewarding opportunities in the digital era.
                    </p>
                  </div>
                </div>
                
                <div className="lg:w-1/2 lg:pl-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-elegant">
                    <Img src={FoundingStory} alt="Future Ready" className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-academic-navy-900/20"></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Card Grid Layout */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              Vision &
              <HighlightText text=" Mission" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Our commitment to transforming education and empowering learners worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-academic-gold-500 to-academic-gold-600 rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-elegant">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-academic-gold-500 to-academic-gold-600 rounded-full flex items-center justify-center">
                    <FaLightbulb className="text-white text-2xl" />
                  </div>
                  <h3 className="elegant-heading text-2xl">Our Vision</h3>
                </div>
                <p className="text-academic-slate-600 leading-relaxed mb-6">
                  At Beeja, we aspire to ignite a lifelong passion for learning by providing transformative, 
                  accessible, and personalized educational experiences. Through our innovative platform, 
                  we empower learners to unlock their potential and shape a brighter future.
                </p>
                <div className="flex items-center gap-2 text-academic-gold-600 font-medium">
                  <span>Learn More</span>
                  <FaChevronRight className="text-sm" />
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-academic-navy-700 to-academic-navy-800 rounded-2xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-elegant">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-academic-navy-700 to-academic-navy-800 rounded-full flex items-center justify-center">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <h3 className="elegant-heading text-2xl">Our Mission</h3>
                </div>
                <p className="text-academic-slate-600 leading-relaxed mb-6">
                  We are dedicated to fostering continuous learning through accessible, high-quality education 
                  that evolves with industry demands. We transform learners into industry-ready professionals 
                  equipped with skills and confidence to excel.
                </p>
                <div className="flex items-center gap-2 text-academic-navy-700 font-medium">
                  <span>Learn More</span>
                  <FaChevronRight className="text-sm" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values - Creative Grid Layout */}
      <section className="py-20 bg-academic-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              Our Core
              <HighlightText text=" Values" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              The principles that guide everything we do at Beeja Academy
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaHeart className="text-3xl" />,
                title: "Passion",
                description: "We're passionate about education and helping learners achieve their goals",
                color: "from-red-500 to-pink-500"
              },
              {
                icon: <FaGlobe className="text-3xl" />,
                title: "Accessibility",
                description: "Making quality education accessible to everyone, everywhere",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FaUsers className="text-3xl" />,
                title: "Community",
                description: "Building a supportive community of learners and educators",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <FaStar className="text-3xl" />,
                title: "Excellence",
                description: "Striving for excellence in everything we create and deliver",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300 opacity-20`}></div>
                  <div className="relative bg-white rounded-2xl p-8 shadow-elegant text-center group-hover:shadow-2xl transition-shadow duration-300">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {value.icon}
                    </div>
                    <h3 className="elegant-heading text-lg mb-3">{value.title}</h3>
                    <p className="text-academic-slate-600 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Success Stories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              Student
              <HighlightText text=" Success Stories" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Real transformations from our amazing community of learners
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <TeamCard />
          </motion.div>
        </div>
      </section>

      {/* Learning Experience */}
      <section className="py-20 bg-academic-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              The Beeja
              <HighlightText text=" Experience" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Discover what makes our learning platform unique and effective
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <LearningGrid />
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              Frequently Asked
              <HighlightText text=" Questions" variant="gold" />
            </h2>
            <p className="section-subtitle max-w-3xl mx-auto">
              Find answers to common questions about our courses and platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <FAQSection />
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 bg-academic-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl mb-4">
              What Our Community
              <HighlightText text=" Says" variant="gold" />
            </h2>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-academic-gold-500 text-2xl">★</span>
                ))}
              </div>
              <span className="text-academic-slate-600 text-lg">4.9/5 from 10,000+ reviews</span>
            </div>
            <p className="section-subtitle max-w-3xl mx-auto">
              Join thousands of successful learners who have transformed their careers with Beeja Academy
            </p>
          </motion.div>
        </div>
      </section>
      <ImprovedFooter />
    </div>
  )
}

export default About
