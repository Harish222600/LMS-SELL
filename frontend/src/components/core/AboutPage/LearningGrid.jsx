import React from "react";
import { motion } from "framer-motion";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "BeejaAcademy partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    icon: "📚"
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "Interactive and engaging learning experiences designed to maximize knowledge retention and practical application.",
    icon: "🎯"
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Industry-recognized certificates that validate your skills and enhance your professional credibility.",
    icon: "🏆"
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "Advanced automated assessment system providing instant feedback and personalized learning recommendations.",
    icon: "⭐"
  },
  {
    order: 5,
    heading: "Ready to Work",
    description:
      "Comprehensive job preparation with real-world projects, portfolio building, and career guidance.",
    icon: "💼"
  },
];

const LearningGrid = () => {
  return (
    <div className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12 gap-4">
      {LearningGridArray.map((card, i) => {
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`${i === 0 && "lg:col-span-2 lg:h-[320px]"} ${
              card.order % 2 === 1
                ? "bg-gradient-to-br from-academic-navy-800 to-academic-navy-900 h-[320px] text-white"
                : card.order % 2 === 0
                ? "bg-gradient-to-br from-academic-cream-50 to-white h-[320px] text-academic-navy-900"
                : "bg-transparent"
            } ${card.order === 3 && "lg:col-start-2"} rounded-xl shadow-elegant hover:shadow-2xl transition-all duration-300 group`}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-6 p-8 h-full justify-center">
                <div className="classic-heading text-4xl lg:text-5xl text-academic-navy-900">
                  {card.heading}
                  <HighlightText text={card.highlightText} variant="gold" />
                </div>
                <p className="section-subtitle text-lg text-academic-slate-600 leading-relaxed">
                  {card.description}
                </p>

                <div className="w-fit mt-4">
                  <CTAButton active={true} linkto={card.BtnLink} variant="elegant">
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-6 h-full justify-between group-hover:transform group-hover:scale-105 transition-all duration-300">
                {/* Icon */}
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h1 className={`elegant-heading text-xl mb-4 ${
                    card.order % 2 === 1 ? "text-white" : "text-academic-navy-900"
                  }`}>
                    {card.heading}
                  </h1>

                  <p className={`leading-relaxed ${
                    card.order % 2 === 1 ? "text-academic-slate-200" : "text-academic-slate-600"
                  }`}>
                    {card.description}
                  </p>
                </div>

                {/* Decorative Element */}
                <div className={`w-full h-1 rounded-full ${
                  card.order % 2 === 1 
                    ? "bg-gradient-to-r from-academic-gold-400 to-academic-gold-600" 
                    : "bg-gradient-to-r from-academic-navy-400 to-academic-navy-600"
                } opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default LearningGrid;
