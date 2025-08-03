import React from "react";
import { motion } from "framer-motion";
import { fadeIn, bounce, scaleUp } from "../components/common/motionFrameVarients";
import HighlightText from "../components/core/HomePage/HighlightText";
import ImprovedFooter from "../components/common/ImprovedFooter";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaRocket, 
  FaCertificate, 
  FaHandshake, 
  FaChartLine, 
  FaClock,
  FaBuilding,
  FaGraduationCap,
  FaAward,
  FaLightbulb,
  FaCheckCircle,
  FaArrowRight,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaStar,
  FaQuoteLeft,
  FaTrophy,
  FaProjectDiagram
} from "react-icons/fa";

const InstituteService = () => {
  const services = [
    {
      icon: <FaUsers className="text-4xl text-academic-gold-600" />,
      title: "Talent Acquisition",
      description: "Access to pre-trained, industry-ready professionals who can contribute from day one to your organization's success."
    },
    {
      icon: <FaRocket className="text-4xl text-academic-navy-600" />,
      title: "Custom Training Programs",
      description: "Tailored training solutions designed specifically for your organization's unique needs and requirements."
    },
    {
      icon: <FaCertificate className="text-4xl text-academic-gold-600" />,
      title: "Certified Professionals",
      description: "All our candidates are certified and equipped with the latest industry skills and best practices."
    },
    {
      icon: <FaHandshake className="text-4xl text-academic-navy-600" />,
      title: "Partnership Support",
      description: "Ongoing support and collaboration to ensure successful integration and long-term partnership success."
    }
  ];

  const benefits = [
    {
      icon: <FaChartLine className="text-2xl text-academic-gold-600" />,
      title: "Accelerated Growth",
      description: "Speed up your organization's growth with skilled professionals ready to make immediate impact"
    },
    {
      icon: <FaClock className="text-2xl text-academic-navy-600" />,
      title: "Time & Cost Efficient",
      description: "Save valuable time and resources on training with our pre-trained, job-ready candidates"
    },
    {
      icon: <FaTrophy className="text-2xl text-academic-gold-600" />,
      title: "Quality Assurance",
      description: "Every candidate goes through rigorous training and assessment to ensure top-tier quality"
    },
    {
      icon: <FaProjectDiagram className="text-2xl text-academic-navy-600" />,
      title: "Industry Alignment",
      description: "Training programs aligned with current industry trends and technological advancements"
    }
  ];

  const partnerCompanies = [
    { name: "TechCorp", employees: "500+", industry: "Software Development" },
    { name: "DataSys", employees: "200+", industry: "Data Analytics" },
    { name: "CloudTech", employees: "300+", industry: "Cloud Services" },
    { name: "InnovateLab", employees: "150+", industry: "AI & ML" }
  ];

  const testimonials = [
    {
      name: "John Smith",
      position: "HR Director, TechCorp",
      company: "TechCorp Solutions",
      quote: "Beeja Academy has been instrumental in helping us find qualified candidates. Their training quality is exceptional.",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      position: "CTO, DataSys",
      company: "DataSys Analytics",
      quote: "The candidates from Beeja Academy are well-prepared and require minimal onboarding. Highly recommended!",
      rating: 5
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
                <FaBuilding className="w-4 h-4" />
                Trusted by 200+ Companies
              </div>

              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Partner with
                <HighlightText text=" Beeja Academy" variant="gold" />
                <br />
                for Excellence
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl leading-relaxed">
                Access industry-ready professionals and custom training solutions that drive 
                your organization's growth and success in the competitive market.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                  >
                    <FaHandshake className="w-5 h-5" />
                    Partner With Us
                  </motion.button>
                </Link>
                
                <Link to="/about">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 hover:bg-white hover:text-academic-navy-900 transition-colors duration-300"
                  >
                    Learn More <FaArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-academic-gold-400">200+</div>
                  <div className="text-sm text-academic-slate-300">Partner Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-academic-gold-400">95%</div>
                  <div className="text-sm text-academic-slate-300">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-academic-gold-400">5000+</div>
                  <div className="text-sm text-academic-slate-300">Professionals Placed</div>
                </div>
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
                <div className="text-center mb-6">
                  <FaBuilding className="text-6xl text-academic-gold-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Enterprise Solutions</h3>
                  <p className="text-academic-slate-300">Tailored for your business needs</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-academic-slate-300">
                    <FaCheckCircle className="text-academic-gold-400 flex-shrink-0" />
                    <span>Custom training programs</span>
                  </div>
                  <div className="flex items-center gap-3 text-academic-slate-300">
                    <FaCheckCircle className="text-academic-gold-400 flex-shrink-0" />
                    <span>Industry-ready professionals</span>
                  </div>
                  <div className="flex items-center gap-3 text-academic-slate-300">
                    <FaCheckCircle className="text-academic-gold-400 flex-shrink-0" />
                    <span>Ongoing partnership support</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
              Our
              <HighlightText text=" Enterprise Services" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-2xl mx-auto">
              Comprehensive solutions designed to meet your organization's talent acquisition and training needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={scaleUp}
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-academic-navy-900 mb-3 group-hover:text-academic-gold-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-academic-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Training CTA */}
      <section className="py-20 bg-academic-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={fadeIn('up', 0.2)}
            initial='hidden'
            whileInView={'show'}
            viewport={{ once: false, amount: 0.2 }}
            className="text-center bg-white rounded-3xl p-12 shadow-elegant border border-academic-slate-200"
          >
            <FaLightbulb className="text-6xl text-academic-gold-500 mx-auto mb-6" />
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-6">
              Got Specific Training Requirements?
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
              We provide customized training programs tailored to your organization's specific needs. 
              Work with us to develop solutions that improve performance, productivity, and help you identify the right talent.
            </p>
            <Link to="/contact">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
              >
                Discuss Your Needs
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              variants={fadeIn('right', 0.2)}
              initial='hidden'
              whileInView={'show'}
              viewport={{ once: false, amount: 0.2 }}
              className="space-y-8"
            >
              <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900">
                What Employers Get from
                <HighlightText text=" Beeja Academy" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-600 text-lg">
                Our comprehensive training programs transform candidates into industry-ready professionals
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-academic-slate-50 rounded-xl border-l-4 border-academic-gold-500">
                  <div className="w-3 h-3 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-academic-slate-700 leading-relaxed">
                    Get industry-ready candidates who can be assigned to real-time projects from day one, 
                    without spending time and money on extensive training programs.
                  </p>
                </div>
                
                <div className="flex items-start gap-4 p-6 bg-academic-slate-50 rounded-xl border-l-4 border-academic-navy-500">
                  <div className="w-3 h-3 bg-academic-navy-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-academic-slate-700 leading-relaxed">
                    Our candidates are trained according to current industry demands and equipped 
                    with the specific skills and knowledge your role requires.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={bounce}
                    initial='hidden'
                    whileInView={'show'}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-elegant border border-academic-slate-200"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {benefit.icon}
                      <h4 className="text-academic-navy-900 font-bold">{benefit.title}</h4>
                    </div>
                    <p className="text-academic-slate-600 text-sm leading-relaxed">{benefit.description}</p>
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
              <div className="bg-academic-slate-50 rounded-2xl p-8 border border-academic-slate-200">
                <div className="text-center mb-8">
                  <FaGraduationCap className="text-6xl text-academic-gold-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-academic-navy-900 mb-2">Training Excellence</h3>
                  <p className="text-academic-slate-600">Industry-aligned curriculum</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-academic-slate-700">Technical Skills</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-academic-slate-200 rounded-full">
                        <div className="w-4/5 h-full bg-academic-gold-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-academic-slate-600">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-academic-slate-700">Soft Skills</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-academic-slate-200 rounded-full">
                        <div className="w-4/5 h-full bg-academic-navy-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-academic-slate-600">90%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-academic-slate-700">Industry Readiness</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-academic-slate-200 rounded-full">
                        <div className="w-full h-full bg-academic-gold-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-academic-slate-600">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              What Our
              <HighlightText text=" Partners Say" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg">
              Trusted by leading organizations worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeIn(index % 2 === 0 ? 'right' : 'left', 0.2)}
                initial='hidden'
                whileInView={'show'}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
              >
                <FaQuoteLeft className="text-3xl text-academic-gold-500 mb-4" />
                <p className="text-academic-slate-700 text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-academic-gold-500 text-academic-navy-900 rounded-full flex items-center justify-center font-bold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-academic-navy-900 font-bold">{testimonial.name}</h4>
                    <p className="text-academic-slate-600 text-sm">{testimonial.position}</p>
                    <p className="text-academic-slate-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
                <div className="flex text-academic-gold-500 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => <FaStar key={i} className="text-sm" />)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
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
              Ready to Transform Your
              <HighlightText text=" Hiring Process?" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-300 text-lg">
              Join hundreds of companies that have already partnered with Beeja Academy 
              to access top-tier talent and accelerate their growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                >
                  Start Partnership
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-academic-navy-900 transition-colors duration-300"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-academic-slate-300 pt-4">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>Custom solutions</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>Ongoing support</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-academic-gold-400" />
                <span>Proven results</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ImprovedFooter />
    </div>
  );
};

export default InstituteService;
