import React, { Fragment, useEffect, useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { FaQuoteRight } from "react-icons/fa";
import data from "../api/data";

const TeamCard = () => {
  const [people, setPeople] = useState(data);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lastIndex = people.length - 1;
    if (index < 0) {
      setIndex(lastIndex);
    }
    if (index > lastIndex) {
      setIndex(0);
    }
  }, [index, people]);

  useEffect(() => {
    let slider = setInterval(() => {
      setIndex(index + 1);
    }, 3000);
    return () => clearInterval(slider);
  }, [index]);

  return (
    <div className="bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="classic-heading mb-4">
              What Our
              <span className="text-academic-gold-600"> Students Say</span>
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Discover the experiences and success stories of our amazing students
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="relative h-96 overflow-hidden">
            {people.map((person, personIndex) => {
              const { id, image, name, title, quote } = person;
              let position = "nextSlide";
              
              if (personIndex === index) {
                position = "activeSlide";
              }
              if (
                personIndex === index - 1 ||
                (index === 0 && personIndex === people.length - 1)
              ) {
                position = "lastSlide";
              }

              return (
                <article
                  className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out ${
                    position === "activeSlide" 
                      ? "opacity-100 transform translate-x-0" 
                      : position === "lastSlide"
                      ? "opacity-0 transform -translate-x-full"
                      : "opacity-0 transform translate-x-full"
                  }`}
                  key={id}
                >
                  <div className="classic-card p-8 h-full flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
                    {/* Profile Image */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-academic-gold-500 shadow-elegant">
                        <img 
                          src={image} 
                          alt={name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-academic-gold-500 rounded-full flex items-center justify-center">
                        <FaQuoteRight className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="mb-6">
                      <p className="text-lg md:text-xl text-academic-slate-700 leading-relaxed italic font-medium">
                        "{quote}"
                      </p>
                    </blockquote>

                    {/* Person Info */}
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold text-academic-navy-900 font-playfair">
                        {name}
                      </h4>
                      <p className="text-academic-slate-600 font-medium">
                        {title}
                      </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-academic-gold-300 opacity-30"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-academic-gold-300 opacity-30"></div>
                  </div>
                </article>
              );
            })}

            {/* Navigation Buttons */}
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border-2 border-academic-slate-300 rounded-full flex items-center justify-center text-academic-slate-600 hover:bg-academic-navy-700 hover:text-white hover:border-academic-navy-700 transition-all duration-300 shadow-classic z-10"
              onClick={() => setIndex(index - 1)}
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border-2 border-academic-slate-300 rounded-full flex items-center justify-center text-academic-slate-600 hover:bg-academic-navy-700 hover:text-white hover:border-academic-navy-700 transition-all duration-300 shadow-classic z-10"
              onClick={() => setIndex(index + 1)}
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {people.map((_, dotIndex) => (
              <button
                key={dotIndex}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  dotIndex === index
                    ? "bg-academic-gold-600 scale-125"
                    : "bg-academic-slate-300 hover:bg-academic-slate-400"
                }`}
                onClick={() => setIndex(dotIndex)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeamCard;
