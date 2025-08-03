import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaSpinner, FaGraduationCap, FaUsers, FaTimes, FaBook, FaArrowRight, FaClock, FaChartLine } from 'react-icons/fa';
import { getAllCourses } from '../../../../services/operations/adminAPI';

const CourseList = ({ categoryId, onCourseSelect }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await getAllCourses(token);
        // Filter courses by category
        const coursesData = result?.courses?.filter(course => 
          course.category._id === categoryId
        ) || [];
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [categoryId, token]);

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Calculate statistics
  const courseStats = {
    totalCourses: courses.length,
    totalStudents: courses.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0),
    averageStudents: courses.length > 0 
      ? Math.round(courses.reduce((acc, course) => acc + (course.studentsEnrolled?.length || 0), 0) / courses.length)
      : 0,
    filteredResults: filteredCourses.length
  };

  if (loading) {
    return (
      <div className="classic-card">
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
            <span className="text-academic-slate-700 font-medium font-inter">Loading courses...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Academic Statistics Panel */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h2 className="elegant-heading text-academic-navy-900">Course Overview</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Academic course statistics and enrollment data</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaBook className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.totalCourses}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Courses</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                In this category
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaUsers className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.totalStudents}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Students</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Enrolled across courses
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaChartLine className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.averageStudents}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Avg. Students</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Per course
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaSearch className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.filteredResults}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Filtered Results</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                {searchTerm ? 'Matching search' : 'All courses'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Search Panel */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h2 className="elegant-heading text-academic-navy-900">Search Courses</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Find academic courses by name or description</p>
        </div>
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by course name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input w-full pl-12"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={16} />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn-classic-secondary"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Academic Search Results Info */}
      {searchTerm && (
        <div className="classic-card">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <FaSearch className="text-academic-gold-600" size={16} />
              <div className="text-sm text-academic-slate-700 font-inter">
                Showing <span className="font-bold text-academic-navy-900">{filteredCourses.length}</span> of <span className="font-bold text-academic-navy-900">{courses.length}</span> courses
                <span className="text-academic-gold-700 font-semibold"> matching "{searchTerm}"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Courses Grid */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="elegant-heading text-academic-navy-900">Course Directory</h2>
              <p className="text-sm text-academic-slate-600 font-inter">Academic courses for progress tracking</p>
            </div>
            <div className="text-sm text-academic-slate-700 font-inter">
              <span className="font-bold text-academic-navy-900">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''} available
            </div>
          </div>
        </div>

        {/* Academic Empty State */}
        {filteredCourses.length === 0 && (
          <div className="p-16 text-center">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
              <FaBook className="text-5xl text-academic-gold-700" />
            </div>
            <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Courses Found</h3>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search criteria to find the courses you\'re looking for.' 
                : 'No academic courses are available in this category for progress tracking.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="btn-elegant flex items-center gap-3 mx-auto"
              >
                <FaTimes size={16} />
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Academic Courses Grid */}
        {filteredCourses.length > 0 && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="classic-card bg-academic-cream-50 hover:shadow-elegant group transition-all duration-300 p-6 cursor-pointer"
                  onClick={() => onCourseSelect(course)}
                >
                  {/* Header with Thumbnail, Title and Action */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-academic-gold-100 border-2 border-academic-gold-300 rounded-xl overflow-hidden flex-shrink-0 group-hover:border-academic-gold-400 transition-colors duration-300">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.courseName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaBook className="text-academic-gold-700 text-xl" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-academic-navy-900 mb-1 font-playfair group-hover:text-academic-navy-800 transition-colors duration-300 line-clamp-2">
                          {course.courseName}
                        </h3>
                        <p className="text-sm text-academic-slate-600 font-inter line-clamp-2 leading-relaxed">
                          {course.courseDescription}
                        </p>
                      </div>
                    </div>
                    <button 
                      className="bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 p-2 border border-academic-navy-200 transition-all duration-200 rounded-lg hover:shadow-classic flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCourseSelect(course);
                      }}
                      title="View Progress"
                    >
                      <FaArrowRight size={12} />
                    </button>
                  </div>

                  {/* Course Statistics */}
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <FaUsers className="text-academic-gold-700" size={12} />
                          <span className="text-xs font-semibold text-academic-gold-800 font-inter">Students</span>
                        </div>
                        <div className="text-lg font-bold text-academic-navy-900 font-playfair">
                          {course.studentsEnrolled?.length || 0}
                        </div>
                      </div>

                      <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <FaGraduationCap className="text-academic-navy-700" size={12} />
                          <span className="text-xs font-semibold text-academic-navy-800 font-inter">Sections</span>
                        </div>
                        <div className="text-lg font-bold text-academic-navy-900 font-playfair">
                          {course.courseContent?.length || 0}
                        </div>
                      </div>

                      <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-3">
                        <div className="flex items-center gap-1 mb-1">
                          <FaClock className="text-academic-gold-700" size={12} />
                          <span className="text-xs font-semibold text-academic-slate-800 font-inter">Duration</span>
                        </div>
                        <div className="text-sm font-bold text-academic-navy-900 font-playfair">
                          {course.totalDuration || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Course Meta Information */}
                  <div className="pt-4 border-t border-academic-slate-200">
                    <div className="flex items-center justify-between text-xs text-academic-slate-500 font-inter">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">ID: {course._id.slice(-8).toUpperCase()}</span>
                        <span className="font-medium">₹{course.price}</span>
                      </div>
                      <span className="font-medium">{course.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
