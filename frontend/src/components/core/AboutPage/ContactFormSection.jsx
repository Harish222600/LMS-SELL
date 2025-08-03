import React from "react";
import { motion } from "framer-motion";
import ContactUsForm from '../ContactPage/ContactUsForm';

const ContactFormSection = () => {
  return (
    <div className="mx-auto py-16">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h1 className="classic-heading text-5xl text-academic-navy-900 mb-6">
          Get in 
          <span className="bg-gradient-to-r from-academic-gold-600 to-academic-gold-500 bg-clip-text text-transparent ml-3">
            Touch
          </span>
        </h1>
        <p className="section-subtitle text-xl text-academic-slate-600 max-w-2xl mx-auto">
          We'd love to hear from you. Please fill out this form and we'll get back to you as soon as possible.
        </p>
        
        {/* Decorative Elements */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <div className="w-16 h-1 bg-gradient-to-r from-academic-gold-400 to-academic-navy-400 rounded-full"></div>
          <div className="w-3 h-3 bg-academic-gold-500 rounded-full"></div>
          <div className="w-16 h-1 bg-gradient-to-l from-academic-gold-400 to-academic-navy-400 rounded-full"></div>
        </div>
      </motion.div>
      
      {/* Contact Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-12 mx-auto max-w-4xl"
      >
        <div className="classic-card p-8 md:p-12 shadow-elegant">
          {/* Contact Info Header */}
          <div className="text-center mb-8">
            <h2 className="elegant-heading text-2xl text-academic-navy-900 mb-4">
              Let's Start a Conversation
            </h2>
            <p className="text-academic-slate-600">
              Whether you have questions about our courses, need support, or want to explore partnership opportunities, we're here to help.
            </p>
          </div>

          {/* Contact Form */}
          <ContactUsForm />

          {/* Additional Contact Information */}
          <div className="mt-12 pt-8 border-t border-academic-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-academic-navy-700 text-xl">📧</span>
                </div>
                <h3 className="font-semibold text-academic-navy-900">Email Us</h3>
                <p className="text-sm text-academic-slate-600">info@beejaacademy.com</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-academic-gold-700 text-xl">📞</span>
                </div>
                <h3 className="font-semibold text-academic-navy-900">Call Us</h3>
                <p className="text-sm text-academic-slate-600">+1 (555) 123-4567</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-academic-navy-700 text-xl">🕒</span>
                </div>
                <h3 className="font-semibold text-academic-navy-900">Office Hours</h3>
                <p className="text-sm text-academic-slate-600">Mon-Fri: 9AM-6PM</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactFormSection;
