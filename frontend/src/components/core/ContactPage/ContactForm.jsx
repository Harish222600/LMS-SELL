import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="relative classic-card p-8 lg:p-14 flex gap-6 flex-col overflow-hidden bg-gradient-to-br from-academic-cream-50 to-white border-2 border-academic-slate-200">
      {/* Academic Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-academic-navy-50/30 via-academic-cream-50/20 to-academic-gold-50/30 backdrop-blur-sm rounded-xl"></div>
      
      {/* Elegant academic orbs */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-academic-navy-200/20 to-academic-gold-200/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-academic-gold-200/15 to-academic-navy-200/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-academic-cream-200/10 to-academic-slate-200/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Content */}
      <div className="relative z-10">
        <h1 className="classic-heading text-academic-navy-900 mb-4">
          Got an Idea? We&apos;ve got the skills. Let&apos;s team up
        </h1>
        <p className="section-subtitle text-academic-slate-600 mb-8">
          Tell us more about yourself and what you&apos;ve got in mind.
        </p>

        <div className="mt-8">
          <ContactUsForm />
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
