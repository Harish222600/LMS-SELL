import React from "react";
import { motion } from "framer-motion";

const Stats = [
  { count: "5K", label: "Active Students", icon: "👨‍🎓" },
  { count: "10+", label: "Expert Mentors", icon: "👨‍🏫" },
  { count: "200+", label: "Quality Courses", icon: "📚" },
  { count: "50+", label: "Industry Awards", icon: "🏆" },
];

const StatsComponent = () => {
  return (
    <div className="bg-gradient-to-br from-academic-navy-900 to-academic-navy-800 py-20">
      {/* Stats */}
      <div className="flex flex-col gap-12 justify-between w-11/12 max-w-maxContent mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="classic-heading text-4xl text-white mb-4">
            Our Impact in 
            <span className="bg-gradient-to-r from-academic-gold-400 to-academic-gold-600 bg-clip-text text-transparent ml-3">
              Numbers
            </span>
          </h2>
          <p className="section-subtitle text-lg text-academic-slate-200 max-w-2xl mx-auto">
            Discover the measurable success of our educational community
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {Stats.map((data, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-academic-gold-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-elegant">
                  {/* Icon */}
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {data.icon}
                  </div>
                  
                  {/* Count */}
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-academic-gold-400 transition-colors duration-300">
                    {data.count}
                  </h1>
                  
                  {/* Label */}
                  <h2 className="elegant-heading text-lg text-academic-slate-200 group-hover:text-white transition-colors duration-300">
                    {data.label}
                  </h2>
                  
                  {/* Decorative Line */}
                  <div className="w-12 h-1 bg-academic-gold-500 rounded-full mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-academic-slate-300 text-lg max-w-3xl mx-auto">
            Join thousands of learners who have transformed their careers with Beeja Academy's 
            comprehensive educational programs and expert guidance.
          </p>
          
          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-academic-gold-400 rounded-full"></div>
            <div className="w-3 h-3 bg-academic-gold-500 rounded-full"></div>
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-academic-gold-400 rounded-full"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsComponent;
