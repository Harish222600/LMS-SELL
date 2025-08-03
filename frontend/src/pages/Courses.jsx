import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCode, FaDatabase, FaMobile, FaCloud, FaShieldAlt, FaCogs, FaSearch, FaFilter, FaStar, FaClock, FaUsers, FaPlay, FaBookmark, FaArrowRight } from "react-icons/fa";
import ImprovedFooter from "../components/common/ImprovedFooter";
import { getAllCourses } from "../services/operations/courseDetailsAPI";

const Courses = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const coursesData = await getAllCourses();
      console.log("Raw courses data:", coursesData);
      console.log("Is array?", Array.isArray(coursesData));
      console.log("Length:", coursesData?.length);
      
      if (Array.isArray(coursesData)) {
        console.log("First course:", coursesData[0]);
        setCourses(coursesData);
      } else {
        console.log("Courses data is not an array, setting empty array");
        setCourses([]);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // Set empty array on error
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter(course => {
    if (!course) return false;

    // Exclude drafted courses by draft flags or status
    if (course.draft === true || course.isDraft === true || course.status === "Draft") return false;
    
    const matchesCategory = activeCategory === "all" || 
                          (course.category && course.category === activeCategory);
    
    const matchesSearch = 
      (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.courseDescription && course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.tag && Array.isArray(course.tag) && 
       course.tag.some(tag => tag && tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    return matchesCategory && matchesSearch;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (!a || !b) return 0;
    
    switch (sortBy) {
      case "popular": return (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0);
      case "rating": return (b.averageRating || 0) - (a.averageRating || 0);
      case "price-low": return (a.price || 0) - (b.price || 0);
      case "price-high": return (b.price || 0) - (a.price || 0);
      default: return 0;
    }
  });

  const featuredCourses = courses.filter(course => course && course.featured && !(course.draft === true || course.isDraft === true || course.status === "Draft"));

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

  const CourseCard = ({ course, featured = false }) => (
    <motion.div
      className={`classic-card overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-elegant group ${
        featured ? 'border-2 border-academic-gold-300' : ''
      }`}
      variants={itemVariants}
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <img 
          src={course.thumbnail || course.image} 
          alt={course.courseName}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {course.bestseller && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-classic">
              Bestseller
            </span>
          )}
          {featured && (
            <span className="bg-academic-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-classic">
              Featured
            </span>
          )}
        </div>
        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-elegant">
          <FaPlay />
        </button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-academic-gold-700 font-bold bg-academic-gold-100 px-2 py-1 rounded-full">{course.level}</span>
          <button className="text-academic-slate-400 hover:text-academic-gold-600 transition-colors">
            <FaBookmark />
          </button>
        </div>
        
        <h3 className="text-xl font-bold text-academic-navy-900 mb-3 group-hover:text-academic-gold-700 transition-colors font-playfair">
          {course.courseName}
        </h3>
        
        <p className="text-academic-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {course.courseDescription}
        </p>
        
        <div className="flex items-center gap-4 text-sm text-academic-slate-500 mb-4">
          <span className="flex items-center gap-1 bg-academic-slate-100 px-2 py-1 rounded-full">
            <FaClock className="w-3 h-3" /> {course.totalDuration || "N/A"}
          </span>
          <span className="flex items-center gap-1 bg-academic-slate-100 px-2 py-1 rounded-full">
            <FaUsers className="w-3 h-3" /> {course.studentsEnrolled?.length?.toLocaleString() || 0}
          </span>
          <span className="flex items-center gap-1 bg-academic-slate-100 px-2 py-1 rounded-full">
            <FaStar className="text-academic-gold-600 w-3 h-3" /> {course.averageRating?.toFixed(1) || "0.0"}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tag?.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="bg-academic-navy-100 text-academic-navy-800 px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {course.tag && course.tag.length > 3 && (
            <span className="text-academic-slate-500 text-xs">+{course.tag.length - 3} more</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            {course.courseType === 'Free' || course.adminSetFree ? (
              <span className="text-2xl font-bold text-green-700 font-playfair">Free</span>
            ) : (
              <>
                <span className="text-2xl font-bold text-academic-navy-900 font-playfair">₹{course.price}</span>
                {course.originalPrice && course.originalPrice !== course.price && (
                  <span className="text-academic-slate-400 line-through ml-2">₹{course.originalPrice}</span>
                )}
              </>
            )}
          </div>
          <button 
            onClick={() => navigate(`/courses/${course._id}`)}
            className="btn-elegant flex items-center gap-2 group-hover:scale-105 transition-transform"
          >
            Enroll Now <FaArrowRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="pt-4 border-t border-academic-slate-200">
          <p className="text-sm text-academic-slate-600">
            Instructor: <span className="text-academic-navy-900 font-semibold">
              {course.instructor?.firstName} {course.instructor?.lastName}
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-academic-navy-800 via-academic-navy-700 to-academic-navy-900 py-24"
        initial={false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-academic-gold-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-academic-gold-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="classic-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our <span className="text-academic-gold-400">Courses</span>
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-academic-slate-200 max-w-4xl mx-auto mb-8 leading-relaxed"
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Master new skills and advance your career with our comprehensive, industry-relevant courses designed by experts.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Featured Courses */}
        <section className="mb-20">
          <motion.h2 
            className="elegant-heading text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Featured <span className="text-academic-gold-600">Courses</span>
          </motion.h2>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {featuredCourses.map((course) => (
              <CourseCard key={course._id || course.id} course={course} featured={true} />
            ))}
          </motion.div>
        </section>

        {/* Search and Filter */}
        <section className="mb-16">
          <motion.div 
            className="classic-card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search courses, skills, or instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="classic-input pl-12"
                  />
                </div>
              </div>
              
              {/* Sort */}
              <div className="w-full lg:w-64">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="classic-input"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </motion.div>
        </section>

        {/* All Courses */}
        <section>
          <motion.h2 
            className="elegant-heading mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            All Courses
            <span className="text-academic-slate-500 text-lg font-normal ml-3">
              ({sortedCourses.length} {sortedCourses.length === 1 ? 'course' : 'courses'})
            </span>
          </motion.h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
            </div>
          ) : sortedCourses.length > 0 ? (
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sortedCourses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="classic-card p-12 max-w-md mx-auto">
                <div className="w-16 h-16 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="w-8 h-8 text-academic-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-academic-navy-900 mb-3 font-playfair">No courses found</h3>
                <p className="text-academic-slate-600">Try adjusting your search terms or category filter.</p>
              </div>
            </div>
          )}
        </section>

        {/* Why Choose Our Courses */}
        <section className="mt-24">
          <motion.div 
            className="classic-card p-12 bg-gradient-to-br from-academic-navy-50 to-academic-cream-50 border-2 border-academic-navy-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="elegant-heading text-center mb-16">
              Why Choose Our <span className="text-academic-gold-600">Courses?</span>
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <FaCode className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-academic-navy-900 font-playfair">Industry-Relevant</h3>
                <p className="text-academic-slate-700 leading-relaxed">Curriculum designed by industry experts with real-world applications</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <FaPlay className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-academic-navy-900 font-playfair">Hands-On Projects</h3>
                <p className="text-academic-slate-700 leading-relaxed">Real-world applications and portfolio building opportunities</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="w-20 h-20 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elegant">
                  <FaClock className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-academic-navy-900 font-playfair">Flexible Learning</h3>
                <p className="text-academic-slate-700 leading-relaxed">Learn at your own pace, anytime, anywhere with lifetime access</p>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
      
      <ImprovedFooter />
    </div>
  );
};

export default Courses;
