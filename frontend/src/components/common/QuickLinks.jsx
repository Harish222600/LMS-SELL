import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function QuickLinks() {
  const links = [
    { text: 'Home', path: '/', icon: '🏠' },
    { text: 'Courses', path: '/courses', icon: '📚' },
    { text: 'Verify Certificate', path: '/verify-certificate', icon: '🎓' },
    { text: 'About Us', path: '/about', icon: '👥' },
    { text: 'Contact', path: '/contact', icon: '📞' },
    { text: 'FAQs', path: '/faqs', icon: '❓' }
  ];

  return (
    <div className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 py-8 mt-auto border-t-2 border-academic-gold-500">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <h3 className="elegant-heading text-xl text-white mb-2">Quick Navigation</h3>
          <p className="text-academic-slate-300 text-sm">Explore our platform with ease</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {links.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={link.path}
                className="group flex items-center gap-2 px-4 py-3 bg-academic-slate-800/50 hover:bg-academic-gold-500 text-white hover:text-academic-navy-900 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-elegant border border-academic-slate-600 hover:border-academic-gold-400"
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </span>
                <span className="font-medium text-sm">
                  {link.text}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Academic Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 pt-6 border-t border-academic-slate-600"
        >
          <p className="text-academic-slate-400 text-xs">
            © 2024 Beeja Academy - Excellence in Education
          </p>
        </motion.div>
      </div>
    </div>
  );
}
