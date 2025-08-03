import React from "react";
import { motion } from "framer-motion";
import { fadeIn, bounce, scaleUp } from "../components/common/motionFrameVarients";
import HighlightText from "../components/core/HomePage/HighlightText";
import ImprovedFooter from "../components/common/ImprovedFooter";
import { Link } from "react-router-dom";
import { 
  FaRocket, 
  FaCode, 
  FaBrain, 
  FaUsers, 
  FaTrophy, 
  FaLightbulb,
  FaGraduationCap,
  FaChartLine,
  FaStar,
  FaPlay,
  FaArrowRight,
  FaCheckCircle,
  FaBookOpen,
  FaCertificate,
  FaHandshake,
  FaAward,
  FaLaptopCode,
  FaProjectDiagram
} from "react-icons/fa";

const StudentService = () => {
  const features = [
    {
      icon: <FaGraduationCap className="text-4xl text-academic-gold-600" />,
      title: "Expert-Led Learning",
      description: "Learn from industry professionals with years of real-world experience and proven track records",
      color: "academic-gold"
    },
    {
      icon: <FaLaptopCode className="text-4xl text-academic-navy-600" />,
      title: "Hands-On Projects",
      description: "Build real-world applications and create an impressive portfolio that showcases your skills",
      color: "academic-navy"
    },
    {
      icon: <FaCertificate className="text-4xl text-academic-gold-600" />,
      title: "Industry Certification",
      description: "Earn recognized certifications that validate your expertise and enhance your career prospects",
      color: "academic-gold"
    },
    {
      icon: <FaHandshake className="text-4xl text-academic-navy-600" />,
      title: "Career Support",
      description: "Get comprehensive job placement assistance and career guidance from our dedicated team",
      color: "academic-navy"
    }
  ];

  const learningPath = [
    {
      step: "01",
      title: "Foundation Building",
      description: "Master the fundamentals with structured curriculum designed by industry experts",
      icon: <FaBookOpen className="text-2xl" />
    },
    {
      step: "02",
      title: "Skill Development",
      description: "Develop practical skills through hands-on coding exercises and real-world projects",
      icon: <FaCode className="text-2xl" />
    },
    {
      step: "03",
      title: "Portfolio Creation",
      description: "Build impressive projects that demonstrate your capabilities to potential employers",
      icon: <FaProjectDiagram className="text-2xl" />
    },
    {
      step: "04",
      title: "Career Launch",
      description: "Get placed in top companies with our comprehensive job placement assistance program",
      icon: <FaRocket className="text-2xl" />
    }
  ];

  const stats = [
    { number: "5000+", label: "Students Trained", icon: <FaUsers /> },
    { number: "95%", label: "Placement Rate", icon: <FaTrophy /> },
    { number: "200+", label: "Partner Companies", icon: <FaChartLine /> },
    { number: "4.8/5", label: "Student Rating", icon: <FaStar /> }
  ];

  const successStories = [
    { 
      name: "Sarah Chen", 
      role: "Frontend Developer at Google", 
      salary: "₹18 LPA", 
      story: "From marketing background to tech leader in 6 months",
      image: "SC"
    },
    { 
      name: "Rahul Sharma", 
      role: "Full Stack Developer at Microsoft", 
      salary: "₹22 LPA", 
      story: "College dropout turned successful software engineer",
      image: "RS"
    },
    { 
      name: "Priya Patel", 
      role: "Data Scientist at Amazon", 
      salary: "₹25 LPA", 
      story: "Career transition at 30, now leading data initiatives",
      image: "PP"
    }
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={fadeIn('right', 0.2)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-academic-gold-500/20 px-4 py-2 rounded-full text-academic-gold-400 text-sm font-medium">
                <FaStar className="w-4 h-4" />
                Rated #1 Learning Platform
              </div>
              
              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Launch Your
                <HighlightText text=" Tech Career" variant="gold" />
                <br />
                with Confidence
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl leading-relaxed">
                Transform from beginner to industry-ready professional with our comprehensive, 
                project-based learning programs designed by experts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/free-courses">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                  >
                    <FaGraduationCap className="w-5 h-5" />
                    Start Free Learning
                  </motion.button>
                </Link>
                
                <Link to="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 hover:bg-white hover:text-academic-navy-900 transition-colors duration-300"
                  >
                    Join Now <FaArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeIn('up', 0.2)}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-academic-gold-400 text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <div className="text-sm text-academic-slate-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn('left', 0.2)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="bg-academic-navy-800 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="font-mono text-sm text-academic-gold-400">
                    <div className="text-blue-400">const</div>
                    <div className="text-white ml-4">learnWithBeeja = function() {`{`}</div>
                    <div className="text-white ml-8">return "Success!";</div>
                    <div className="text-white ml-4">{`}`}</div>
                  </div>
                </div>
                <div className="text-center">
                  <FaLaptopCode className="text-6xl text-academic-gold-400 mx-auto mb-4" />
                  <p className="text-academic-slate-300">Interactive Learning Experience</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Why Students Choose
              <HighlightText text=" Beeja Academy" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-2xl mx-auto">
              We don't just teach code, we build careers and transform lives through comprehensive education
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index % 2 === 0 ? 'right' : 'left', 0.2)}
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.2 }}
                className="group bg-white rounded-2xl p-8 shadow-elegant hover:shadow-xl transition-all duration-300 border border-academic-slate-200 hover:border-academic-gold-300"
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-academic-navy-900 mb-4 group-hover:text-academic-gold-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-academic-slate-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20 bg-academic-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Your
              <HighlightText text=" Learning Journey" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              A structured path from beginner to professional
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-academic-gold-500 to-academic-navy-600 rounded-full hidden lg:block"></div>
            
            {learningPath.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index % 2 === 0 ? 'right' : 'left', 0.2)}
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.2 }}
                className={`flex items-center mb-16 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
              >
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-academic-gold-500 text-academic-navy-900 p-3 rounded-full font-bold text-lg">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-academic-navy-900">{item.title}</h3>
                      </div>
                    </div>
                    <p className="text-academic-slate-600 text-lg leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Timeline Node */}
                <div className="hidden lg:block relative z-10">
                  <div className="w-6 h-6 bg-academic-gold-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                
                <div className="lg:w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              <HighlightText text="Success Stories" variant="gold" />
              That Inspire
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              Real students, real transformations, real careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-academic-gold-500 text-academic-navy-900 rounded-full flex items-center justify-center font-bold text-lg">
                    {story.image}
                  </div>
                  <div>
                    <h4 className="text-academic-navy-900 font-bold">{story.name}</h4>
                    <p className="text-academic-slate-600 text-sm">{story.role}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-academic-gold-600 mb-2">{story.salary}</div>
                <p className="text-academic-slate-600 mb-4">{story.story}</p>
                <div className="flex text-academic-gold-500">
                  {[...Array(5)].map((_, i) => <FaStar key={i} className="text-sm" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-academic-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className="space-y-8"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-white">
              Ready to
              <HighlightText text=" Transform" variant="gold" />
              Your Career?
            </h2>
            <p className="section-subtitle text-academic-slate-300 text-lg">
              Join thousands of students who've already started their journey to a successful tech career
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/courses">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-academic-gold-500 text-academic-navy-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                >
                  Start Your Journey Today
                </motion.button>
              </Link>
              
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 hover:bg-white hover:text-academic-navy-900 transition-colors duration-300"
                >
                  Talk to Counselor <FaArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-academic-slate-300 pt-4">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>100% Job assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>Lifetime support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
};

export default StudentService;
