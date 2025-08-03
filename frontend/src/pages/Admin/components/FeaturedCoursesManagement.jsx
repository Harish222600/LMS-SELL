import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUsers, FaEye, FaEdit, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { getAllCourses } from '../../../services/operations/courseDetailsAPI';
import { getFeaturedCourses, updateFeaturedCourses } from '../../../services/operations/featuredCoursesAPI';
import { toast } from 'react-hot-toast';

const FeaturedCoursesManagement = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState({
    popularPicks: [],
    topEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('popularPicks');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
    loadFeaturedCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const courses = await getAllCourses();
      if (courses && Array.isArray(courses)) {
        const publishedCourses = courses.filter(course => course.status === 'Published');
        setAllCourses(publishedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedCourses = async () => {
    try {
      const response = await getFeaturedCourses();
      if (response) {
        setFeaturedCourses({
          popularPicks: response.popularPicks?.map(course => course._id) || [],
          topEnrollments: response.topEnrollments?.map(course => course._id) || []
        });
      }
    } catch (error) {
      console.error('Error loading featured courses:', error);
      toast.error('Failed to load featured courses');
    }
  };

  const saveFeaturedCourses = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Extract just the course IDs from the state
      const dataToSend = {
        popularPicks: featuredCourses.popularPicks,
        topEnrollments: featuredCourses.topEnrollments
      };
      await updateFeaturedCourses(dataToSend, token);
      
    } catch (error) {
      console.error('Error saving featured courses:', error);
      toast.error('Failed to save featured courses');
    } finally {
      setSaving(false);
    }
  };

  const addToFeatured = (courseId, section) => {
    if (featuredCourses[section].includes(courseId)) {
      toast.error('Course already added to this section');
      return;
    }

    setFeaturedCourses(prev => ({
      ...prev,
      [section]: [...prev[section], courseId]
    }));
  };

  const removeFromFeatured = (courseId, section) => {
    setFeaturedCourses(prev => ({
      ...prev,
      [section]: prev[section].filter(id => id !== courseId)
    }));
  };

  const getFeaturedCoursesData = (section) => {
    return featuredCourses[section]
      .map(courseId => allCourses.find(course => course._id === courseId))
      .filter(Boolean);
  };

  const getAvailableCourses = (section) => {
    const availableCourses = allCourses.filter(course => !featuredCourses[section].includes(course._id));
    
    if (searchTerm === '') {
      return availableCourses;
    }
    
    return availableCourses.filter(course =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFeaturedCoursesFiltered = (section) => {
    const featuredCoursesData = getFeaturedCoursesData(section);
    
    if (searchTerm === '') {
      return featuredCoursesData;
    }
    
    return featuredCoursesData.filter(course =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const CourseCard = ({ course, isFeatured, section, onAdd, onRemove }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="classic-card bg-white hover:shadow-elegant transition-all duration-300"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-academic-navy-900 font-playfair line-clamp-1 mb-2">{course.courseName}</h3>
            <p className="text-sm text-academic-slate-600 font-inter line-clamp-2">{course.courseDescription}</p>
          </div>
          {isFeatured ? (
            <button
              onClick={() => onRemove(course._id)}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-inter font-medium"
            >
              <FaTimes size={12} /> Remove
            </button>
          ) : (
            <button
              onClick={() => onAdd(course._id)}
              className="px-3 py-1.5 bg-academic-gold-100 text-academic-gold-800 rounded-lg hover:bg-academic-gold-200 transition-colors flex items-center gap-2 text-sm font-inter font-medium"
            >
              <FaStar size={12} /> Add
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-academic-slate-600 font-inter">
          <div className="flex items-center gap-2">
            <FaUsers className="text-academic-gold-600" />
            <span>{course.studentsEnrolled?.length || 0} enrolled</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEye className="text-academic-gold-600" />
            <span>{course.totalViews || 0} views</span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Featured Courses Management</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaStar className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">Featured Courses Management</h1>
                <p className="section-subtitle text-lg">Manage courses displayed in Popular Picks and Top Enrollments sections</p>
              </div>
            </div>
            <button
              onClick={saveFeaturedCourses}
              disabled={saving}
              className="btn-classic-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-academic-navy-800 border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FaSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Academic Tabs */}
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Course Categories</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Select a category to manage featured courses</p>
          </div>
          <div className="p-8">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('popularPicks')}
                className={`px-6 py-3 text-sm font-semibold font-inter rounded-lg transition-all duration-200 ${
                  activeTab === 'popularPicks'
                    ? 'bg-academic-navy-800 text-white shadow-md'
                    : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                }`}
              >
                Popular Picks
              </button>
              <button
                onClick={() => setActiveTab('topEnrollments')}
                className={`px-6 py-3 text-sm font-semibold font-inter rounded-lg transition-all duration-200 ${
                  activeTab === 'topEnrollments'
                    ? 'bg-academic-navy-800 text-white shadow-md'
                    : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                }`}
              >
                Top Enrollments
              </button>
            </div>
          </div>
        </div>

        {/* Academic Search Section */}
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Search & Filter</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Find courses by name, description, or instructor</p>
          </div>
          <div className="p-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-academic-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses by name, description, or instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="classic-input pl-12 pr-12"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
              </div>
              {searchTerm && (
                <div className="text-sm text-academic-slate-600 font-inter flex items-center px-4 py-3 bg-academic-gold-50 rounded-lg border border-academic-gold-200">
                  <span className="font-semibold">Searching:</span> <span className="ml-2">"{searchTerm}"</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
              <span className="text-academic-slate-700 font-medium font-inter">Loading courses...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Courses Section */}
            <div className="classic-card">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="elegant-heading text-academic-navy-900">
                      Featured in {activeTab === 'popularPicks' ? 'Popular Picks' : 'Top Enrollments'}
                    </h2>
                    <p className="text-sm text-academic-slate-600 font-inter">
                      {getFeaturedCoursesFiltered(activeTab).length} courses currently featured
                    </p>
                  </div>
                  <div className="bg-academic-gold-100 border border-academic-gold-300 px-4 py-2 rounded-lg">
                    <span className="text-sm font-bold text-academic-gold-800 font-inter">
                      {getFeaturedCoursesFiltered(activeTab).length} Featured
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getFeaturedCoursesFiltered(activeTab).length > 0 ? (
                    getFeaturedCoursesFiltered(activeTab).map(course => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        isFeatured={true}
                        section={activeTab}
                        onRemove={(courseId) => removeFromFeatured(courseId, activeTab)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-16">
                      <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                        <FaStar className="text-5xl text-academic-gold-700" />
                      </div>
                      <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Featured Courses</h4>
                      <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                        {searchTerm ? 'No featured courses match your search criteria.' : 'No featured courses added yet. Add courses from the available section below.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Courses Section */}
            <div className="classic-card">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="elegant-heading text-academic-navy-900">Available Courses</h2>
                    <p className="text-sm text-academic-slate-600 font-inter">
                      {getAvailableCourses(activeTab).length} courses available to feature
                    </p>
                  </div>
                  <div className="bg-academic-slate-100 border border-academic-slate-300 px-4 py-2 rounded-lg">
                    <span className="text-sm font-bold text-academic-slate-700 font-inter">
                      {getAvailableCourses(activeTab).length} Available
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getAvailableCourses(activeTab).length > 0 ? (
                    getAvailableCourses(activeTab).map(course => (
                      <CourseCard
                        key={course._id}
                        course={course}
                        isFeatured={false}
                        section={activeTab}
                        onAdd={(courseId) => addToFeatured(courseId, activeTab)}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-16">
                      <div className="bg-academic-slate-100 border-2 border-academic-slate-300 p-8 inline-block mb-6 rounded-xl">
                        <FaSearch className="text-5xl text-academic-slate-500" />
                      </div>
                      <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Available Courses</h4>
                      <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                        {searchTerm ? 'No available courses match your search criteria.' : 'All published courses are already featured in this section.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedCoursesManagement;
