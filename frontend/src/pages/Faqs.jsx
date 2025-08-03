import React from "react";
import FAQSection from "../components/core/AboutPage/Faqs";
import ImprovedFooter from "../components/common/ImprovedFooter";

const Faqs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="flex-grow">
        <div className="py-16">
          <FAQSection />
        </div>
      </div>
      <ImprovedFooter />
    </div>
  );
};

export default Faqs;
