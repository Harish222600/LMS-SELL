import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';

import "./css style/home.css"

import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ImprovedFooter from '../components/common/ImprovedFooter';
import ExploreMore from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';
import FeaturedCourses from '../components/core/HomePage/FeaturedCourses';

import TeamSlider from '../components/core/HomePage/TeamSlider';
import SplitScreen from '../components/core/HomePage/SplitScreen';

import { MdOutlineRateReview } from 'react-icons/md';
import { FaArrowRight, FaGraduationCap, FaBookOpen, FaUsers } from "react-icons/fa";

import { motion } from 'framer-motion';
import { fadeIn, scaleUp, bounce } from './../components/common/motionFrameVarients';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  const dispatch = useDispatch();

  const learnerRef1 = useRef(null);
  const learnerRef2 = useRef(null);
  const learnerRef3 = useRef(null);

  const animateCount = (ref) => {
    if (!ref.current) return;
    let count = 0;
    const target = parseInt(ref.current.getAttribute('data-target'));
    const speed = 130;

    const updateCount = () => {
      const increment = Math.ceil(target / speed);
      count += increment;
      if (count > target) count = target;
      ref.current.innerText = count;
      if (count < target) {
        requestAnimationFrame(updateCount);
      }
    };

    updateCount();
  };

  useEffect(() => {
    animateCount(learnerRef1);
    animateCount(learnerRef2);
    animateCount(learnerRef3);
  }, []);

  return (
    <React.Fragment>
      {/* Main Content */}
      <div className="bg-classic-warmWhite">
        {/* Hero Section - Redesigned with Split Layout */}
        <section className="relative min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-academic-gold-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-academic-navy-200/20 rounded-full blur-3xl"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="inline-flex items-center px-4 py-2 bg-academic-gold-100 rounded-full text-academic-gold-800 text-sm font-medium"
                  >
                    🎓 Welcome to the Future of Learning
                  </motion.div>
                  
                  <h1 className="classic-heading text-5xl md:text-6xl lg:text-7xl leading-tight">
                    Master Skills with
                    <HighlightText text=" Beeja " variant="elegant" />
                    <br />
                    <span className="text-academic-slate-700 text-4xl md:text-5xl lg:text-6xl">
                      Academy
                    </span>
                  </h1>
                  
                  <p className="section-subtitle text-xl md:text-2xl max-w-2xl leading-relaxed">
                    Transform your career with cutting-edge courses designed by industry experts. 
                    Join thousands of learners building their future today.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-md"
                >
                  <CTAButton active={true} linkto={"/signup"} variant="elegant" className="flex-1">
                    <span className="flex items-center justify-center gap-2">
                      Start Learning <FaArrowRight className="text-sm" />
                    </span>
                  </CTAButton>
                  <CTAButton active={false} linkto={"/courses"} className="flex-1">
                    <span className="flex items-center justify-center gap-2">
                      Browse Courses <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
                    </span>
                  </CTAButton>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center gap-8 pt-8"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-academic-navy-900">
                      <span ref={learnerRef1} data-target="25">0</span>K+
                    </div>
                    <p className="text-sm text-academic-slate-600">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-academic-navy-900">
                      <span ref={learnerRef3} data-target="100">0</span>+
                    </div>
                    <p className="text-sm text-academic-slate-600">Courses</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-academic-navy-900">4.9★</div>
                    <p className="text-sm text-academic-slate-600">Rating</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Content - Interactive Demo */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative bg-white rounded-2xl shadow-elegant p-8 border border-academic-slate-200">
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-academic-gold-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✨</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-academic-navy-100 rounded-lg flex items-center justify-center">
                        <FaGraduationCap className="text-academic-navy-700 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-academic-navy-900">Interactive Learning</h3>
                        <p className="text-sm text-academic-slate-600">Hands-on projects & real-world applications</p>
                      </div>
                    </div>

                    <div className="bg-academic-slate-900 rounded-xl p-4 text-white font-mono text-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="ml-2 text-academic-slate-400">live-coding.js</span>
                      </div>
                      <div className="space-y-1">
                        <div className="text-academic-gold-400">const learnWithBeeja = () {'=>'} {'{'}</div>
                        <div className="text-green-400 ml-4">return "Success!";</div>
                        <div className="text-blue-400">{'}'}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-academic-cream-50 rounded-lg">
                        <div className="text-2xl font-bold text-academic-navy-900">24/7</div>
                        <p className="text-xs text-academic-slate-600">Support</p>
                      </div>
                      <div className="text-center p-4 bg-academic-gold-50 rounded-lg">
                        <div className="text-2xl font-bold text-academic-gold-700">Live</div>
                        <p className="text-xs text-academic-slate-600">Sessions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                Why Choose
                <HighlightText text=" Beeja Academy" variant="gold" />
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Experience learning like never before with our comprehensive platform designed for modern professionals
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FaGraduationCap className="text-3xl text-academic-navy-700" />,
                  title: "Expert Instructors",
                  description: "Learn from industry professionals with years of real-world experience",
                  color: "bg-academic-navy-100"
                },
                {
                  icon: <FaBookOpen className="text-3xl text-academic-gold-700" />,
                  title: "Comprehensive Curriculum",
                  description: "Structured learning paths covering everything from basics to advanced topics",
                  color: "bg-academic-gold-100"
                },
                {
                  icon: <FaUsers className="text-3xl text-academic-navy-700" />,
                  title: "Community Support",
                  description: "Join a vibrant community of learners and get help when you need it",
                  color: "bg-academic-navy-100"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="classic-card p-8 text-center hover:shadow-elegant group"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="elegant-heading mb-4">{feature.title}</h3>
                  <p className="text-academic-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Learning Showcase */}
        <section className="py-24 bg-gradient-to-br from-academic-cream-50 to-academic-navy-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div>
                  <h2 className="classic-heading mb-6">
                    Learn by
                    <HighlightText text=" Doing" variant="gold" />
                  </h2>
                  <p className="section-subtitle mb-8">
                    Our interactive approach ensures you don't just learn theory, but gain practical skills through hands-on projects and real-world applications.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { step: "01", title: "Interactive Lessons", desc: "Engage with dynamic content and live coding exercises" },
                    { step: "02", title: "Real Projects", desc: "Build portfolio-worthy projects as you learn" },
                    { step: "03", title: "Expert Feedback", desc: "Get personalized guidance from industry professionals" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-academic-gold-500 text-white rounded-lg flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-semibold text-academic-navy-900 mb-2">{item.title}</h4>
                        <p className="text-academic-slate-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <CTAButton active={true} linkto={"/signup"} variant="elegant">
                  Start Your Journey
                </CTAButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-academic-slate-900 rounded-2xl p-8 text-white font-mono text-sm shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="ml-2 text-academic-slate-400">beeja-project.js</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="text-purple-400">// Welcome to Beeja Academy</div>
                    <div className="text-blue-400">const buildFuture = () {'=>'} {'{'}</div>
                    <div className="text-green-400 ml-4">console.log("Learning never stops!");</div>
                    <div className="text-yellow-400 ml-4">return success;</div>
                    <div className="text-blue-400">{'}'}</div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-academic-gold-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-academic-navy-500 rounded-full animate-bounce"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Courses - Redesigned */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                Popular
                <HighlightText text=" Courses" variant="gold" />
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Discover our most sought-after courses designed to accelerate your career growth
              </p>
            </motion.div>
            <FeaturedCourses />
          </div>
        </section>

        {/* Team Section - Redesigned */}
        <section className="py-24 bg-academic-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                Meet Our
                <HighlightText text=" Expert Team" variant="gold" />
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Learn from industry professionals who bring real-world experience to every lesson
              </p>
            </motion.div>
            <TeamSlider />
          </div>
        </section>

        {/* Technology Partners - Redesigned */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                Trusted by
                <HighlightText text=" Industry Leaders" variant="gold" />
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Our courses are certified by leading tech companies and recognized globally
              </p>
            </motion.div>
            <SplitScreen />
          </div>
        </section>

        {/* Skills & Timeline Section */}
        <section className="py-24 bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="classic-heading text-white mb-6">
                  Get the Skills you need for a
                  <HighlightText text=" Job that is in demand" variant="gold" />
                </h2>
                <p className="section-subtitle text-academic-slate-200 mb-8">
                  The modern job market demands more than just technical skills. Our comprehensive approach ensures you're ready for tomorrow's challenges.
                </p>
                <CTAButton active={true} linkto={"/signup"} variant="elegant">
                  <span className="flex items-center gap-2">
                    Start Your Career Journey <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </span>
                </CTAButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  { number: "95%", label: "Job Placement Rate" },
                  { number: "50K+", label: "Average Salary Increase" },
                  { number: "200+", label: "Hiring Partners" },
                  { number: "24/7", label: "Career Support" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                  >
                    <div className="text-3xl font-bold text-academic-gold-400 mb-2">{stat.number}</div>
                    <p className="text-sm text-academic-slate-300">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Timeline Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <TimelineSection />
            </motion.div>
          </div>
        </section>

        {/* Instructor Section - Redesigned */}
        <section className="py-24 bg-academic-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                Become an
                <HighlightText text=" Instructor" variant="gold" />
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                Share your expertise with thousands of learners worldwide and build a rewarding teaching career
              </p>
            </motion.div>
            <InstructorSection />
          </div>
        </section>

        {/* Reviews Section - Redesigned */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="classic-heading mb-4">
                What Our Students
                <HighlightText text=" Say" variant="gold" />
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
            <ReviewSlider />
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="classic-heading text-white text-4xl md:text-5xl mb-6">
                Ready to Transform Your
                <HighlightText text=" Future?" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-200 text-xl max-w-2xl mx-auto">
                Join over 25,000 students who are already building their dream careers with Beeja Academy
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <CTAButton active={true} linkto={"/signup"} variant="elegant" className="w-full sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    Start Learning Today <FaArrowRight className="text-sm" />
                  </span>
                </CTAButton>
                <CTAButton active={false} linkto={"/courses"} className="w-full sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    Explore All Courses <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-sm" />
                  </span>
                </CTAButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <ImprovedFooter />
      </div>
    </React.Fragment>
  );
};

export default Home;
