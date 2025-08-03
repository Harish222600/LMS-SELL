import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaQuoteLeft, FaLinkedin, FaTwitter, FaFilter, FaSearch, FaPlay, FaGraduationCap, FaBriefcase, FaChevronRight } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";

const Testimonials = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Web Developer",
      company: "TechCorp Solutions",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Priya",
      content: "The courses at Beeja Academy transformed my career. The practical approach and industry-relevant curriculum helped me land my dream job as a web developer. The instructors are highly knowledgeable and supportive.",
      rating: 5,
      course: "Full Stack Development",
      category: "development",
      salaryIncrease: "150%",
      timeToJob: "3 months",
      featured: true,
      videoTestimonial: true
    },
    {
      id: 2,
      name: "Rahul Patel",
      role: "Data Scientist",
      company: "DataMinds Analytics",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Rahul",
      content: "I completed the Data Science track, and it exceeded my expectations. The hands-on projects and real-world datasets gave me practical experience that I use daily in my work. The community support was invaluable.",
      rating: 5,
      course: "Data Science & Analytics",
      category: "data-science",
      salaryIncrease: "200%",
      timeToJob: "2 months",
      featured: true,
      videoTestimonial: false
    },
    {
      id: 3,
      name: "Ananya Kumar",
      role: "UI/UX Designer",
      company: "Creative Solutions",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Ananya",
      content: "The design courses here are exceptional. They cover both theoretical principles and practical applications. The feedback from industry experts helped me improve my portfolio significantly.",
      rating: 5,
      course: "UI/UX Design",
      category: "design",
      salaryIncrease: "120%",
      timeToJob: "4 months",
      featured: false,
      videoTestimonial: true
    },
    {
      id: 4,
      name: "Mohammed Ali",
      role: "Cloud Engineer",
      company: "CloudTech Systems",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Mohammed",
      content: "The cloud computing certification program was comprehensive and up-to-date with industry standards. The labs and practical exercises prepared me well for real-world scenarios.",
      rating: 4,
      course: "Cloud Computing",
      category: "cloud",
      salaryIncrease: "180%",
      timeToJob: "1 month",
      featured: true,
      videoTestimonial: false
    },
    {
      id: 5,
      name: "Sarah Wilson",
      role: "Full Stack Developer",
      company: "InnovateTech",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Sarah",
      content: "The full stack development bootcamp was intense but incredibly rewarding. The curriculum covered all modern technologies, and the project-based learning approach was very effective.",
      rating: 5,
      course: "Full Stack Development",
      category: "development",
      salaryIncrease: "160%",
      timeToJob: "2 months",
      featured: false,
      videoTestimonial: true
    },
    {
      id: 6,
      name: "Raj Malhotra",
      role: "DevOps Engineer",
      company: "AgileOps Solutions",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Raj",
      content: "The DevOps course helped me understand the complete CI/CD pipeline. The instructors shared valuable insights from their industry experience, which was incredibly helpful.",
      rating: 5,
      course: "DevOps & Cloud",
      category: "cloud",
      salaryIncrease: "140%",
      timeToJob: "3 months",
      featured: false,
      videoTestimonial: false
    },
    {
      id: 7,
      name: "Lisa Chen",
      role: "Machine Learning Engineer",
      company: "AI Innovations",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=Lisa",
      content: "The AI and Machine Learning course was cutting-edge. The practical projects and mentorship helped me transition from a traditional software role to ML engineering.",
      rating: 5,
      course: "AI & Machine Learning",
      category: "data-science",
      salaryIncrease: "220%",
      timeToJob: "2 months",
      featured: true,
      videoTestimonial: true
    },
    {
      id: 8,
      name: "David Rodriguez",
      role: "Product Designer",
      company: "Design Studio Pro",
      image: "https://api.dicebear.com/6.x/avataaars/svg?seed=David",
      content: "The design thinking methodology and user research techniques I learned here completely changed how I approach design problems. Highly recommended!",
      rating: 4,
      course: "Product Design",
      category: "design",
      salaryIncrease: "130%",
      timeToJob: "5 months",
      featured: false,
      videoTestimonial: false
    }
  ];

  const categories = [
    { id: "all", name: "All Stories", count: testimonials.length },
    { id: "development", name: "Development", count: testimonials.filter(t => t.category === "development").length },
    { id: "data-science", name: "Data Science", count: testimonials.filter(t => t.category === "data-science").length },
    { id: "design", name: "Design", count: testimonials.filter(t => t.category === "design").length },
    { id: "cloud", name: "Cloud & DevOps", count: testimonials.filter(t => t.category === "cloud").length }
  ];

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesCategory = activeFilter === "all" || testimonial.category === activeFilter;
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.course.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTestimonials = testimonials.filter(t => t.featured);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const TestimonialCard = ({ testimonial, featured = false }) => (
    <motion.div
      className={`classic-card p-8 transition-all duration-300 hover:shadow-elegant group relative ${
        featured ? 'bg-gradient-to-br from-academic-gold-50 to-academic-cream-50 border-academic-gold-300' : 'hover:shadow-lg'
      }`}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      {featured && (
        <div className="absolute -top-3 -right-3 bg-academic-gold-500 text-academic-navy-900 px-3 py-1 rounded-full text-xs font-bold shadow-elegant">
          Featured
        </div>
      )}
      
      <div className="flex items-start justify-between mb-6">
        <FaQuoteLeft className="text-3xl text-academic-gold-400" />
        {testimonial.videoTestimonial && (
          <button className="bg-academic-navy-600 text-white p-3 rounded-full hover:bg-academic-navy-700 transition-colors shadow-elegant">
            <FaPlay className="text-sm" />
          </button>
        )}
      </div>
      
      <p className="text-academic-slate-700 mb-8 leading-relaxed italic text-lg">
        "{testimonial.content}"
      </p>
      
      <div className="flex items-center mb-6">
        <img 
          src={testimonial.image} 
          alt={testimonial.name} 
          className="w-16 h-16 rounded-full mr-4 border-3 border-academic-slate-300 shadow-elegant"
        />
        <div className="flex-1">
          <h3 className="elegant-heading text-lg text-academic-navy-900">{testimonial.name}</h3>
          <p className="text-sm text-academic-slate-600 font-medium">{testimonial.role}</p>
          <p className="text-sm text-academic-gold-700 font-semibold">{testimonial.company}</p>
        </div>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <FaStar 
              key={i} 
              className={`text-lg ${i < testimonial.rating ? 'text-academic-gold-500' : 'text-academic-slate-300'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="border-t border-academic-slate-200 pt-6">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-academic-slate-600">Course: <span className="text-academic-navy-900 font-semibold">{testimonial.course}</span></span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600 font-bold">+{testimonial.salaryIncrease} salary</span>
          <span className="text-academic-navy-600 font-bold">Job in {testimonial.timeToJob}</span>
        </div>
      </div>
    </motion.div>
  );

  const stats = [
    { label: "Success Rate", value: "95%", icon: <FaGraduationCap />, color: "text-academic-navy-600" },
    { label: "Avg Salary Increase", value: "165%", icon: <FaBriefcase />, color: "text-academic-gold-600" },
    { label: "Job Placement", value: "3 months", icon: <FaStar />, color: "text-academic-navy-600" },
    { label: "Student Satisfaction", value: "4.8/5", icon: <FaQuoteLeft />, color: "text-academic-gold-600" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-academic-gold-500 w-20 h-20 rounded-full flex items-center justify-center shadow-elegant">
              <FaQuoteLeft className="text-3xl text-academic-navy-900" />
            </div>
          </motion.div>
          <motion.h1 
            className="classic-heading text-4xl md:text-6xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Success <HighlightText text="Stories" variant="gold" />
          </motion.h1>
          <motion.p 
            className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Discover how Beeja Academy has helped thousands of students transform their careers and achieve their dreams 
            through world-class education and dedicated mentorship.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="classic-card p-8 text-center hover:shadow-elegant transition-all duration-300 group"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`text-4xl mb-4 flex justify-center ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-academic-navy-900 mb-2">{stat.value}</div>
                <div className="text-academic-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Testimonials */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              Featured
              <HighlightText text=" Success Stories" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Meet some of our most inspiring graduates who have achieved remarkable career transformations
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} featured={true} />
            ))}
          </motion.div>
        </section>

        {/* Search and Filter */}
        <section className="mb-16">
          <div className="classic-card p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Search Stories
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, role, company, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="classic-input pl-10"
                  />
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="lg:w-auto">
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Filter by Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveFilter(category.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        activeFilter === category.id
                          ? 'bg-academic-gold-500 text-white shadow-elegant'
                          : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                      }`}
                    >
                      {category.name} ({category.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* All Testimonials */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="classic-heading text-3xl text-academic-navy-900">
              All Success Stories
            </h2>
            <span className="text-academic-slate-600 text-lg">
              ({filteredTestimonials.length} {filteredTestimonials.length === 1 ? 'story' : 'stories'})
            </span>
          </div>
          
          {filteredTestimonials.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="classic-card p-12 max-w-md mx-auto">
                <FaSearch className="text-6xl text-academic-slate-400 mx-auto mb-6" />
                <h3 className="elegant-heading text-xl text-academic-navy-900 mb-3">No stories found</h3>
                <p className="text-academic-slate-600 mb-6">Try adjusting your search terms or category filter to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("all");
                  }}
                  className="btn-classic-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-24">
          <div className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 p-12 rounded-3xl text-center text-white shadow-elegant">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="w-20 h-20 bg-academic-gold-500 rounded-full flex items-center justify-center mx-auto">
                <FaGraduationCap className="text-3xl text-academic-navy-900" />
              </div>
              <h2 className="classic-heading text-3xl md:text-4xl text-white">
                Ready to Write Your
                <HighlightText text=" Success Story?" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-300 text-lg leading-relaxed">
                Join thousands of successful graduates who have transformed their careers with Beeja Academy. 
                Start your journey today and become our next success story.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="btn-elegant">
                  <span className="flex items-center gap-2">
                    Start Learning Today <FaChevronRight className="text-sm" />
                  </span>
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-academic-navy-900 transition-colors duration-300">
                  View All Courses
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Testimonials;
