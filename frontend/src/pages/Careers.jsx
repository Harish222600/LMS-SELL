import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaRocket, FaGraduationCap, FaHeart, FaMapMarkerAlt, FaClock, FaEnvelope, FaArrowRight } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";

const Careers = () => {
  const benefits = [
    {
      icon: <FaRocket className="text-3xl text-academic-gold-600" />,
      title: "Mission-Driven Work",
      description: "Be part of transforming education and empowering learners worldwide"
    },
    {
      icon: <FaUsers className="text-3xl text-blue-600" />,
      title: "Diverse Team",
      description: "Collaborate with talented professionals from diverse backgrounds"
    },
    {
      icon: <FaGraduationCap className="text-3xl text-green-600" />,
      title: "Continuous Learning",
      description: "Professional development opportunities and skill enhancement"
    },
    {
      icon: <FaHeart className="text-3xl text-pink-600" />,
      title: "Work-Life Balance",
      description: "Flexible work arrangements and remote-friendly culture"
    }
  ];

  const openPositions = [
    {
      title: "Software Engineer",
      department: "Engineering",
      type: "Full-time",
      location: "Remote",
      description: "Build scalable web applications and contribute to our learning platform architecture using modern technologies like React, Node.js, and cloud services.",
      requirements: ["3+ years experience", "React/Node.js", "Cloud platforms", "Agile methodology"]
    },
    {
      title: "Product Manager",
      department: "Product",
      type: "Full-time",
      location: "Hybrid",
      description: "Drive product strategy and work with cross-functional teams to deliver exceptional user experiences that impact millions of learners.",
      requirements: ["5+ years PM experience", "EdTech background", "Data-driven mindset", "User research skills"]
    },
    {
      title: "Content Creator",
      department: "Content",
      type: "Full-time",
      location: "Remote",
      description: "Create engaging educational content and collaborate with subject matter experts to develop world-class learning experiences.",
      requirements: ["Content creation experience", "Educational background", "Video production", "Creative writing"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      type: "Full-time",
      location: "Remote",
      description: "Design intuitive and beautiful user interfaces that make learning accessible and enjoyable for students worldwide.",
      requirements: ["4+ years design experience", "Figma/Sketch", "User research", "Design systems"]
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
        className="relative bg-gradient-to-br from-academic-navy-800 via-academic-navy-700 to-academic-navy-900 py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-academic-gold-500/10 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="classic-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join Our <span className="text-academic-gold-400">Mission</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-academic-slate-200 max-w-4xl mx-auto mb-10 leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform education and empower learners worldwide. Join our passionate team of innovators, educators, and technologists.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button className="btn-elegant text-lg px-10 py-4 shadow-elegant hover:shadow-lg transform hover:scale-105">
              View Open Positions
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Why Work With Us Section */}
        <motion.section 
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="classic-heading text-center mb-6"
            variants={itemVariants}
          >
            Why Choose <span className="text-academic-gold-600">Beeja?</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle text-center mb-16 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            We're not just building a company; we're creating the future of education. Here's what makes Beeja special.
          </motion.p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="classic-card p-8 text-center hover:shadow-elegant transition-all duration-300 transform hover:scale-105"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-academic-navy-900 font-playfair">{benefit.title}</h3>
                <p className="text-academic-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Open Positions Section */}
        <motion.section 
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="classic-heading text-center mb-6"
            variants={itemVariants}
          >
            Open <span className="text-academic-gold-600">Positions</span>
          </motion.h2>
          <motion.p 
            className="section-subtitle text-center mb-16 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Ready to make an impact? Explore our current openings and find your perfect role.
          </motion.p>
          
          <div className="grid gap-8">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                className="classic-card p-8 hover:shadow-elegant transition-all duration-300 group border-l-4 border-academic-gold-500"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-academic-navy-900 mb-3 group-hover:text-academic-gold-700 transition-colors font-playfair">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-full text-academic-slate-700 font-medium">
                        <FaUsers className="w-4 h-4" /> {position.department}
                      </span>
                      <span className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-full text-academic-slate-700 font-medium">
                        <FaClock className="w-4 h-4" /> {position.type}
                      </span>
                      <span className="flex items-center gap-2 bg-academic-slate-100 px-3 py-2 rounded-full text-academic-slate-700 font-medium">
                        <FaMapMarkerAlt className="w-4 h-4" /> {position.location}
                      </span>
                    </div>
                  </div>
                  <button className="mt-6 lg:mt-0 btn-elegant flex items-center gap-2 group-hover:scale-105 transition-transform">
                    Apply Now <FaArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <p className="text-academic-slate-700 mb-6 leading-relaxed text-lg">
                  {position.description}
                </p>
                
                <div>
                  <h4 className="text-academic-navy-900 font-bold mb-4 font-playfair">Key Requirements:</h4>
                  <div className="flex flex-wrap gap-3">
                    {position.requirements.map((req, reqIndex) => (
                      <span 
                        key={reqIndex}
                        className="bg-academic-navy-100 text-academic-navy-800 px-4 py-2 rounded-full text-sm font-medium border border-academic-navy-200"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Application Process Section */}
        <motion.section 
          className="mb-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="classic-heading text-center mb-16"
            variants={itemVariants}
          >
            How to <span className="text-academic-gold-600">Apply</span>
          </motion.h2>
          
          <div className="classic-card p-12 bg-gradient-to-br from-academic-navy-50 to-academic-cream-50 border-2 border-academic-navy-200">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <motion.div variants={itemVariants}>
                <div className="w-20 h-20 bg-academic-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-academic-navy-900 font-playfair">Submit Application</h3>
                <p className="text-academic-slate-700 leading-relaxed">Send your resume and cover letter to our careers email</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-academic-navy-900 font-playfair">Initial Review</h3>
                <p className="text-academic-slate-700 leading-relaxed">Our team reviews your application within 2 weeks</p>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-academic-navy-900 font-playfair">Interview Process</h3>
                <p className="text-academic-slate-700 leading-relaxed">Multiple rounds including technical and cultural fit assessments</p>
              </motion.div>
            </div>
            
            <motion.div 
              className="text-center mt-16"
              variants={itemVariants}
            >
              <p className="text-academic-slate-700 mb-8 text-xl leading-relaxed">
                Ready to join our team? We'd love to hear from you!
              </p>
              <a 
                href="mailto:careers@beejaacademy.com"
                className="inline-flex items-center gap-4 bg-academic-gold-600 hover:bg-academic-gold-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-elegant"
              >
                <FaEnvelope className="w-5 h-5" />
                careers@beejaacademy.com
              </a>
            </motion.div>
          </div>
        </motion.section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Careers;
