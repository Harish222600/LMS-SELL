import React from "react";
import { FooterLink2 } from "../../../data/footer-links";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HighlightText from "../core/HomePage/HighlightText";
import { 
  FaGraduationCap,
  FaBookOpen,
  FaUsers,
  FaStar,
  FaHeart,
  FaGlobe,
  FaLightbulb,
  FaChevronRight,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaArrowUp
} from "react-icons/fa";

// Images
import BeejaLogo from "../../assets/Logo/Logo-Small-Light.png";

// Footer data
const BottomFooter = ["Privacy Policy", "Terms"];

const socialLinks = [
  { icon: FaFacebookF, href: "https://facebook.com/beeja", color: "hover:bg-blue-600", name: "Facebook" },
  { icon: FaTwitter, href: "https://twitter.com/beeja", color: "hover:bg-blue-400", name: "Twitter" },
  { icon: FaLinkedinIn, href: "https://linkedin.com/company/beeja", color: "hover:bg-blue-700", name: "LinkedIn" },
  { icon: FaGithub, href: "https://github.com/beeja", color: "hover:bg-gray-700", name: "GitHub" },
  { icon: FaYoutube, href: "https://www.youtube.com/@beejachennai", color: "hover:bg-red-600", name: "YouTube" },
  { icon: FaInstagram, href: "https://instagram.com/beeja", color: "hover:bg-pink-600", name: "Instagram" },
];

const contactInfo = [
  { icon: FaEnvelope, text: "info@beejaacademy.com", href: "mailto:info@beejaacademy.com" },
  { icon: FaPhone, text: "+91 91502 74222", href: "tel:+919150274222" },
  { icon: FaMapMarkerAlt, text: "No.2, 2nd Floor, Gokul Arcade Sardar Patel Road, Adyar, Chennai - 600020", href: "https://www.google.com/maps/place/Beeja+Academy" },
];

const quickStats = [
  { icon: FaUsers, number: "25K+", label: "Students" },
  { icon: FaBookOpen, number: "100+", label: "Courses" },
  { icon: FaStar, number: "4.9", label: "Rating" },
  { icon: FaGraduationCap, number: "95%", label: "Success Rate" },
];

const ImprovedFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-academic-gold-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        <section className="py-12 border-b border-academic-navy-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {quickStats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-academic-gold-500/20 rounded-full mb-4 group-hover:bg-academic-gold-500/30 transition-colors duration-300">
                    <stat.icon className="text-2xl text-academic-gold-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-academic-slate-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Main Footer Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Brand Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="lg:col-span-5 space-y-8"
              >
                {/* Logo and Description */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={BeejaLogo} 
                      alt="Beeja Academy" 
                      className="h-10 object-contain" 
                    />
                    <div>
                      <h3 className="text-xl font-bold text-white">Beeja Academy</h3>
                      <p className="text-academic-gold-400 text-sm">Empowering Future Leaders</p>
                    </div>
                  </div>
                  
                  <p className="text-academic-slate-300 leading-relaxed max-w-md">
                    Transform your career with cutting-edge courses designed by industry experts. 
                    Join our community of learners and unlock your potential in the digital age.
                  </p>

                  {/* Mission Statement */}
                  <div className="bg-academic-navy-800/50 rounded-xl p-6 border border-academic-gold-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <FaLightbulb className="text-academic-gold-400 text-xl" />
                      <h4 className="font-semibold text-white">Our Mission</h4>
                    </div>
                    <p className="text-academic-slate-300 text-sm leading-relaxed">
                      To democratize quality education and empower individuals with the skills 
                      needed to thrive in tomorrow's digital economy.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                    <FaPhone className="text-academic-gold-400" />
                    Get in Touch
                  </h4>
                  <div className="space-y-3">
                    {contactInfo.map((contact, index) => (
                      <a
                        key={index}
                        href={contact.href}
                        target={contact.href.startsWith('http') ? '_blank' : undefined}
                        rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-3 text-academic-slate-300 hover:text-academic-gold-400 transition-colors duration-300 group"
                      >
                        <contact.icon className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{contact.text}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-white text-lg flex items-center gap-2">
                    <FaGlobe className="text-academic-gold-400" />
                    Connect With Us
                  </h4>
                  <div className="flex gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 bg-academic-navy-800 rounded-full text-white ${social.color} transition-all duration-300 shadow-lg hover:shadow-xl`}
                        title={`Follow us on ${social.name}`}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Links Sections */}
              <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-8">
                {FooterLink2.map((section, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-academic-gold-400 rounded-full"></div>
                      <h3 className="text-white font-semibold text-lg">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {section.links.map((link, index) => (
                        <Link
                          key={index}
                          to={link.link}
                          className="block text-academic-slate-300 hover:text-academic-gold-400 transition-all duration-300 text-sm group relative"
                        >
                          <span className="flex items-center gap-2">
                            <FaChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="group-hover:translate-x-1 transition-transform duration-300">
                              {link.title}
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 border-t border-academic-navy-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-academic-navy-800/50 rounded-2xl p-8 border border-academic-gold-500/20"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <h3 className="text-white font-bold text-2xl mb-2 flex items-center justify-center lg:justify-start gap-2">
                    <FaEnvelope className="text-academic-gold-400" />
                    Stay Updated
                  </h3>
                  <p className="text-academic-slate-300">
                    Subscribe to our newsletter for the latest courses, updates, and exclusive offers
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="px-6 py-4 bg-academic-navy-700 border border-academic-navy-600 rounded-lg text-white placeholder-academic-slate-400 focus:outline-none focus:border-academic-gold-400 transition-colors duration-300 flex-1 lg:w-80"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-academic-gold-500 text-academic-navy-900 font-semibold rounded-lg hover:bg-academic-gold-400 transition-colors duration-300 shadow-elegant"
                  >
                    Subscribe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom Footer */}
        <section className="py-8 border-t border-academic-navy-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col lg:flex-row items-center justify-between gap-6"
            >
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1 text-sm">
                {BottomFooter.map((item, index) => (
                  <React.Fragment key={index}>
                    <Link
                      to={item.split(" ").join("-").toLowerCase()}
                      className="px-3 py-1 text-academic-slate-400 hover:text-academic-gold-400 transition-colors duration-300"
                    >
                      {item}
                    </Link>
                    {index < BottomFooter.length - 1 && (
                      <span className="text-academic-slate-600">|</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-academic-slate-400">
                <div className="flex items-center gap-2">
                  <FaHeart className="text-academic-gold-400" />
                  <span>Made with love in Chennai</span>
                </div>
                <span>© {new Date().getFullYear()} Beeja Academy. All rights reserved.</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-4 bg-academic-gold-500 text-academic-navy-900 rounded-full shadow-elegant hover:bg-academic-gold-400 transition-colors duration-300 z-50"
        title="Scroll to top"
      >
        <FaArrowUp className="w-5 h-5" />
      </motion.button>
    </footer>
  );
};

export default ImprovedFooter;
