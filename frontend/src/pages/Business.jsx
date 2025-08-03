import React from "react";
import { motion } from "framer-motion";
import ImprovedFooter from "../components/common/ImprovedFooter";

const Business = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="classic-heading text-4xl md:text-5xl lg:text-6xl mb-6">
            Beeja for
            <span className="text-academic-gold-600"> Business</span>
          </h1>
          <p className="section-subtitle text-xl max-w-4xl mx-auto">
            Empower your workforce with cutting-edge skills through our comprehensive business solutions. 
            Transform your organization's learning culture and drive innovation with Beeja Academy's 
            enterprise-grade training programs.
          </p>
        </motion.div>

        {/* Enterprise Solutions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="elegant-heading text-center mb-12">Enterprise Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="classic-card p-8 hover:shadow-elegant transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🏢</span>
                </div>
                <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair">Corporate Training</h3>
              </div>
              <ul className="space-y-3 text-academic-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Customized learning paths for your industry</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Skills assessment and gap analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Progress tracking and reporting</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Dedicated account management</span>
                </li>
              </ul>
            </div>

            <div className="classic-card p-8 hover:shadow-elegant transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair">Learning Analytics</h3>
              </div>
              <ul className="space-y-3 text-academic-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Real-time learning insights</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Performance metrics and KPIs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>ROI measurement tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Custom reporting dashboards</span>
                </li>
              </ul>
            </div>

            <div className="classic-card p-8 hover:shadow-elegant transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair">Skill Development</h3>
              </div>
              <ul className="space-y-3 text-academic-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Technical and soft skills training</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Leadership development programs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Digital transformation courses</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Industry-specific certifications</span>
                </li>
              </ul>
            </div>

            <div className="classic-card p-8 hover:shadow-elegant transition-shadow duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔧</span>
                </div>
                <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair">Integration Support</h3>
              </div>
              <ul className="space-y-3 text-academic-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>LMS integration capabilities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>Single sign-on (SSO) support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>API access for custom solutions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-academic-gold-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span>White-label options available</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Beeja */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="elegant-heading text-center mb-12">Why Choose Beeja for Business?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="classic-card p-8 text-center hover:shadow-elegant transition-shadow duration-300">
              <div className="w-20 h-20 bg-academic-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair mb-4">Accelerated Growth</h3>
              <p className="text-academic-slate-700 leading-relaxed">Fast-track your team's skill development with our proven methodologies.</p>
            </div>

            <div className="classic-card p-8 text-center hover:shadow-elegant transition-shadow duration-300">
              <div className="w-20 h-20 bg-academic-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair mb-4">Cost Effective</h3>
              <p className="text-academic-slate-700 leading-relaxed">Reduce training costs while maximizing learning outcomes and ROI.</p>
            </div>

            <div className="classic-card p-8 text-center hover:shadow-elegant transition-shadow duration-300">
              <div className="w-20 h-20 bg-academic-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold text-academic-navy-900 font-playfair mb-4">Targeted Learning</h3>
              <p className="text-academic-slate-700 leading-relaxed">Customized content that addresses your specific business challenges.</p>
            </div>
          </div>
        </motion.section>

        {/* Success Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="elegant-heading text-center mb-12">Success Stories</h2>
          <div className="classic-card p-10 bg-gradient-to-br from-academic-navy-700 to-academic-navy-800 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-academic-gold-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
                <span className="text-2xl">💬</span>
              </div>
              <blockquote className="text-xl md:text-2xl italic mb-8 leading-relaxed font-playfair">
                "Beeja Academy helped us upskill our entire development team in just 6 months. 
                The customized learning paths and hands-on projects were exactly what we needed 
                to stay competitive in the market."
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 bg-academic-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-academic-navy-900 font-bold text-lg">SJ</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-academic-gold-400">Sarah Johnson</p>
                  <p className="text-academic-slate-300">CTO at TechInnovate Solutions</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Get Started */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-20"
        >
          <div className="classic-card p-12 text-center bg-gradient-to-br from-academic-cream-50 to-academic-gold-50 border-2 border-academic-gold-200">
            <h2 className="elegant-heading mb-6">Get Started Today</h2>
            <p className="text-academic-slate-700 text-lg leading-relaxed mb-8 max-w-3xl mx-auto">
              Ready to transform your organization's learning culture? Contact our enterprise team or 
              schedule a demo to see how Beeja Academy can help your business achieve its goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-classic">
                <span className="text-2xl">📧</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-academic-slate-600">Email us at</p>
                  <a 
                    href="mailto:business@beejaacademy.com" 
                    className="text-academic-gold-700 font-bold hover:text-academic-gold-800 transition-colors"
                  >
                    business@beejaacademy.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-classic">
                <span className="text-2xl">📞</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-academic-slate-600">Call us at</p>
                  <a 
                    href="tel:+919585113955" 
                    className="text-academic-gold-700 font-bold hover:text-academic-gold-800 transition-colors"
                  >
                    +91 9585113955
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      <ImprovedFooter />
    </div>
  );
};

export default Business;
