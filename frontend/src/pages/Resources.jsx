import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBook, FaCode, FaVideo, FaDownload, FaUsers, FaTools, FaGraduationCap, FaSearch, FaFilter, FaExternalLinkAlt, FaStar, FaChevronRight } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import HighlightText from "../components/core/HomePage/HighlightText";

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = [
    { id: "all", name: "All Resources", icon: <FaBook /> },
    { id: "study", name: "Study Materials", icon: <FaGraduationCap /> },
    { id: "tools", name: "Tools & Software", icon: <FaTools /> },
    { id: "community", name: "Community", icon: <FaUsers /> },
    { id: "external", name: "External Links", icon: <FaExternalLinkAlt /> }
  ];

  const resources = [
    {
      id: 1,
      title: "Complete JavaScript Course Notes",
      description: "Comprehensive notes covering ES6+, async programming, and modern frameworks",
      category: "study",
      type: "PDF",
      downloads: 1250,
      rating: 4.8,
      featured: true
    },
    {
      id: 2,
      title: "React Hooks Cheat Sheet",
      description: "Quick reference guide for all React hooks with practical examples",
      category: "study",
      type: "PDF",
      downloads: 890,
      rating: 4.9,
      featured: true
    },
    {
      id: 3,
      title: "Python Practice Exercises",
      description: "100+ coding challenges from beginner to advanced level",
      category: "study",
      type: "ZIP",
      downloads: 2100,
      rating: 4.7,
      featured: false
    },
    {
      id: 4,
      title: "VS Code Setup Guide",
      description: "Complete setup guide with essential extensions for web development",
      category: "tools",
      type: "Video",
      downloads: 750,
      rating: 4.6,
      featured: false
    },
    {
      id: 5,
      title: "Git & GitHub Masterclass",
      description: "Version control best practices and collaboration workflows",
      category: "tools",
      type: "Video",
      downloads: 1800,
      rating: 4.9,
      featured: true
    },
    {
      id: 6,
      title: "Study Group Finder",
      description: "Connect with peers and join study groups for collaborative learning",
      category: "community",
      type: "Platform",
      downloads: 0,
      rating: 4.5,
      featured: false
    },
    {
      id: 7,
      title: "MDN Web Docs",
      description: "Comprehensive documentation for web technologies",
      category: "external",
      type: "Website",
      downloads: 0,
      rating: 5.0,
      featured: true
    },
    {
      id: 8,
      title: "FreeCodeCamp",
      description: "Free coding bootcamp with interactive lessons",
      category: "external",
      type: "Website",
      downloads: 0,
      rating: 4.8,
      featured: false
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredResources = resources.filter(resource => resource.featured);

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

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF": return <FaBook className="text-academic-gold-600" />;
      case "Video": return <FaVideo className="text-academic-navy-600" />;
      case "ZIP": return <FaCode className="text-green-600" />;
      case "Website": return <FaExternalLinkAlt className="text-purple-600" />;
      case "Platform": return <FaUsers className="text-academic-gold-600" />;
      default: return <FaBook className="text-academic-slate-400" />;
    }
  };

  const ResourceCard = ({ resource, featured = false }) => (
    <motion.div
      className={`classic-card p-6 transition-all duration-300 hover:shadow-elegant group ${
        featured ? 'bg-gradient-to-br from-academic-gold-50 to-academic-cream-50 border-academic-gold-300' : 'hover:border-academic-gold-300'
      }`}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-academic-cream-100 rounded-full flex items-center justify-center">
            {getTypeIcon(resource.type)}
          </div>
          <div>
            <h3 className={`text-lg font-bold group-hover:text-academic-gold-600 transition-colors ${
              featured ? 'text-academic-navy-900' : 'text-academic-navy-900'
            }`}>
              {resource.title}
            </h3>
            <span className="text-sm text-academic-slate-600">{resource.type}</span>
          </div>
        </div>
        {featured && (
          <div className="bg-academic-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            Featured
          </div>
        )}
      </div>
      
      <p className="text-academic-slate-700 mb-6 leading-relaxed">
        {resource.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-academic-slate-600">
          {resource.downloads > 0 && (
            <span className="flex items-center gap-1">
              <FaDownload /> {resource.downloads.toLocaleString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaStar className="text-academic-gold-500" /> {resource.rating}
          </span>
        </div>
        <button className="btn-elegant flex items-center gap-2 group-hover:scale-105 transition-transform duration-300">
          {resource.type === "Website" || resource.type === "Platform" ? "Visit" : "Download"}
          {resource.type === "Website" || resource.type === "Platform" ? <FaExternalLinkAlt /> : <FaDownload />}
        </button>
      </div>
    </motion.div>
  );

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-academic-gold-500/20 px-4 py-2 rounded-full text-academic-gold-400 text-sm font-medium">
              <FaBook className="w-4 h-4" />
              Learning Resources Hub
            </div>
            
            <h1 className="classic-heading text-4xl md:text-6xl text-white">
              Learning
              <HighlightText text=" Resources" variant="gold" />
            </h1>
            
            <p className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed">
              Enhance your learning journey with our comprehensive collection of study materials, 
              tools, and community resources designed to accelerate your success.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-academic-gold-400">500+</div>
                <div className="text-sm text-academic-slate-300">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-academic-gold-400">50K+</div>
                <div className="text-sm text-academic-slate-300">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-academic-gold-400">4.8★</div>
                <div className="text-sm text-academic-slate-300">Average Rating</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Resources */}
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
              <HighlightText text=" Resources" variant="gold" />
            </h2>
            <p className="section-subtitle text-academic-slate-600 text-lg max-w-3xl mx-auto">
              Our most popular and highly-rated resources to jumpstart your learning journey
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} featured={true} />
            ))}
          </motion.div>
        </section>

        {/* Search and Filter */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="classic-card p-8"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Search Resources
                </label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by title or description..."
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
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        activeCategory === category.id
                          ? 'bg-academic-gold-500 text-white shadow-elegant'
                          : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                      }`}
                    >
                      {category.icon}
                      <span className="hidden sm:inline">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* All Resources */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-4">
              All Resources
              <span className="text-academic-slate-600 text-lg font-normal ml-3">
                ({filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'})
              </span>
            </h2>
          </motion.div>
          
          {filteredResources.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center py-16"
            >
              <div className="classic-card p-12 max-w-md mx-auto">
                <FaSearch className="text-6xl text-academic-slate-400 mx-auto mb-6" />
                <h3 className="elegant-heading text-xl text-academic-navy-900 mb-3">No resources found</h3>
                <p className="text-academic-slate-600 mb-6">Try adjusting your search terms or category filter to find what you're looking for.</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("all");
                  }}
                  className="btn-classic-secondary"
                >
                  Clear Filters
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* Community Section */}
        <section className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 rounded-3xl p-12 text-white"
          >
            <div className="text-center mb-12">
              <h2 className="classic-heading text-3xl md:text-4xl text-white mb-4">
                Join Our Learning
                <HighlightText text=" Community" variant="gold" />
              </h2>
              <p className="section-subtitle text-academic-slate-300 text-lg max-w-3xl mx-auto">
                Connect with fellow learners, access exclusive resources, and accelerate your growth through collaboration
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <FaUsers className="text-3xl" />,
                  title: "Discussion Forums",
                  description: "Connect with fellow learners",
                  color: "bg-academic-navy-600"
                },
                {
                  icon: <FaGraduationCap className="text-3xl" />,
                  title: "Study Groups",
                  description: "Collaborative learning sessions",
                  color: "bg-academic-gold-500"
                },
                {
                  icon: <FaStar className="text-3xl" />,
                  title: "Mentorship",
                  description: "Guidance from experts",
                  color: "bg-purple-600"
                },
                {
                  icon: <FaTools className="text-3xl" />,
                  title: "Career Services",
                  description: "Job placement assistance",
                  color: "bg-green-600"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className={`${item.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-academic-slate-300 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="btn-elegant">
                <span className="flex items-center gap-2">
                  Join Community <FaChevronRight className="text-sm" />
                </span>
              </button>
            </div>
          </motion.div>
        </section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Resources;
