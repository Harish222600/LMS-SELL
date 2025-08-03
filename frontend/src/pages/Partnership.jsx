import React from "react";
import { motion } from "framer-motion";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";
import { 
  FaHandshake, 
  FaGlobe, 
  FaLightbulb, 
  FaChartLine, 
  FaUsers, 
  FaGraduationCap,
  FaBuilding,
  FaRocket,
  FaAward,
  FaEnvelope,
  FaChevronRight,
  FaCheckCircle
} from "react-icons/fa";

// Import logos from certification images
import adobe from "../assets/Images/certification img/Adobe.png";
import apple from "../assets/Images/certification img/Apple.png";
import autodesk from "../assets/Images/certification img/Autodesk.png";
import cisco from "../assets/Images/certification img/cisco.png";
import scb from "../assets/Images/certification img/CSB-Logo.png";
import esb from "../assets/Images/certification img/ESB.png";
import ic3 from "../assets/Images/certification img/IC3.png";
import intuit from "../assets/Images/certification img/Intuit.png";
import its from "../assets/Images/certification img/ITS-Logo-Stacked.png";
import meta from "../assets/Images/certification img/meta-logo.webp";
import Microsoft from "../assets/Images/certification img/microsoft.webp";
import Project from "../assets/Images/certification img/Project.png";
import Unity from "../assets/Images/certification img/Unity-logo.png";

const partnerLogos = [
  { src: adobe, alt: "Adobe", name: "Adobe" },
  { src: apple, alt: "Apple", name: "Apple" },
  { src: autodesk, alt: "Autodesk", name: "Autodesk" },
  { src: cisco, alt: "Cisco", name: "Cisco" },
  { src: scb, alt: "CSB", name: "CSB" },
  { src: meta, alt: "Meta", name: "Meta" },
  { src: Microsoft, alt: "Microsoft", name: "Microsoft" },
  { src: Project, alt: "Project Management", name: "Project Management" },
  { src: Unity, alt: "Unity", name: "Unity" },
  { src: esb, alt: "ESB", name: "ESB" },
  { src: ic3, alt: "IC3", name: "IC3" },
  { src: its, alt: "ITS", name: "ITS" },
  { src: intuit, alt: "Intuit", name: "Intuit" }
];

const Partnership = () => {
  const partnershipPrograms = [
    {
      icon: <FaBuilding className="text-3xl text-academic-gold-600" />,
      title: "Corporate Training",
      features: [
        "Customized learning paths for your employees",
        "Bulk enrollment discounts",
        "Progress tracking and analytics",
        "Dedicated support team"
      ]
    },
    {
      icon: <FaUsers className="text-3xl text-academic-navy-600" />,
      title: "Content Partnership",
      features: [
        "Co-create courses and learning materials",
        "Revenue sharing opportunities",
        "Access to our learning platform",
        "Marketing collaboration"
      ]
    }
  ];

  const benefits = [
    {
      icon: <FaGlobe className="text-4xl text-academic-gold-600" />,
      title: "Extended Reach",
      description: "Access our global network of learners and expand your market presence."
    },
    {
      icon: <FaLightbulb className="text-4xl text-academic-navy-600" />,
      title: "Innovation",
      description: "Stay ahead with cutting-edge educational technology and methodologies."
    },
    {
      icon: <FaChartLine className="text-4xl text-academic-gold-600" />,
      title: "Growth",
      description: "Create new revenue streams and business opportunities."
    }
  ];

  const partnerTypes = [
    "Educational institutions and universities",
    "Technology companies and startups",
    "Corporate organizations",
    "Industry experts and content creators",
    "Training providers and learning centers"
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
                <FaHandshake className="w-4 h-4" />
                Partnership Opportunities
              </div>
              
              <h1 className="classic-heading text-4xl md:text-6xl text-white">
                Partner with
                <HighlightText text=" Beeja Academy" variant="gold" />
              </h1>
              
              <p className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed">
                Join forces with us to expand your reach and create meaningful impact in the education sector. 
                We collaborate with organizations that share our vision of making quality education accessible to all.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-gold-400">200+</div>
                  <div className="text-sm text-academic-slate-300">Global Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-gold-400">50+</div>
                  <div className="text-sm text-academic-slate-300">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-academic-gold-400">1M+</div>
                  <div className="text-sm text-academic-slate-300">Learners Reached</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Trusted Partners Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Our Trusted
              <HighlightText text=" Partners" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              We're proud to partner with industry leaders who help us deliver world-class education and certifications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center"
          >
            {partnerLogos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="classic-card p-6 flex items-center justify-center hover:shadow-elegant transition-all duration-300 group"
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt} 
                  className="max-h-12 max-w-full object-contain group-hover:scale-110 transition-transform duration-300"
                  title={logo.name}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Partnership Programs Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Partnership
              <HighlightText text=" Programs" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Choose from our flexible partnership models designed to meet your specific needs and objectives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnershipPrograms.map((program, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="classic-card p-8 hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-academic-cream-100 rounded-2xl flex items-center justify-center">
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-academic-navy-900">{program.title}</h3>
                </div>
                <ul className="space-y-3">
                  {program.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <FaCheckCircle className="text-academic-gold-600 mt-1 flex-shrink-0" />
                      <span className="text-academic-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Benefits of
              <HighlightText text=" Partnership" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Discover the advantages of partnering with Beeja Academy and how we can grow together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="classic-card p-8 text-center hover:shadow-elegant transition-all duration-300 group"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-academic-cream-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-academic-navy-900 mb-4">{benefit.title}</h3>
                <p className="text-academic-slate-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Who We Partner With Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Who We
              <HighlightText text=" Partner With" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              We welcome partnerships with diverse organizations across various sectors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="classic-card p-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {partnerTypes.map((type, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-academic-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                  <span className="text-academic-slate-700 font-medium">{type}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Get Started Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 rounded-3xl p-12 text-center text-white"
          >
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-academic-gold-500 rounded-full flex items-center justify-center mx-auto">
                <FaRocket className="text-3xl text-academic-navy-900" />
              </div>
              
              <h2 className="classic-heading text-3xl md:text-4xl text-white">
                Ready to Get
                <HighlightText text=" Started?" variant="gold" />
              </h2>
              
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                Interested in partnering with us? Contact our partnership team to discuss collaboration 
                opportunities. We'll work together to create a partnership program that meets your specific needs and objectives.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:partnerships@beejaacademy.com"
                  className="inline-flex items-center gap-3 bg-academic-gold-500 text-academic-navy-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                >
                  <FaEnvelope className="text-sm" />
                  partnerships@beejaacademy.com
                </a>
                
                <button className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-academic-navy-900 transition-colors duration-300">
                  Learn More <FaChevronRight className="text-sm" />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-academic-slate-300 pt-4">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-academic-gold-400" />
                  <span>Custom solutions</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-academic-gold-400" />
                  <span>Dedicated support</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-academic-gold-400" />
                  <span>Proven results</span>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>

      <ImprovedFooter />
    </div>
  );
};

export default Partnership;
