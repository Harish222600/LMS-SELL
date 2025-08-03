import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { getAllCourses } from '../../../services/operations/adminAPI';
import { getFullDetailsOfCourse } from '../../../services/operations/courseDetailsAPI';
import { showAllCategories } from '../../../services/operations/categoryAPI';
import QuizCreator from './QuizCreator';

const QuizManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [selectedSubSection, setSelectedSubSection] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingCourseDetails, setLoadingCourseDetails] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const categoriesData = await showAllCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Error fetching categories:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setCategories([]);
      // You might want to show a toast error here
      // toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchCourses = async (categoryId) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      console.log("Fetching courses with token:", token);
      
      // Get all courses from admin API
      const result = await getAllCourses(token);
      console.log("Courses data received:", result);
      
      if (!result?.courses) {
        throw new Error("No courses data received");
      }

      // Filter courses by category if a category is selected
      console.log("Filtering courses for category:", categoryId);
      console.log("Available courses:", result.courses);
      
      const filteredCourses = categoryId 
        ? result.courses.filter(course => {
            console.log("Course category:", course.category);
            return course.category?._id === categoryId;
          })
        : result.courses;

      console.log("Filtered courses:", filteredCourses);
      setCourses(filteredCourses || []);
    } catch (error) {
      console.error("Error fetching courses:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setCourses([]);
      // You might want to show a toast error here
      // toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseDetails = async (courseId) => {
    setLoadingCourseDetails(true);
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await getFullDetailsOfCourse(courseId, token);
      console.log("Course details API response:", response);
      
      if (!response?.courseDetails) {
        throw new Error("No course details in response");
      }
      
      setSelectedCourseDetails(response.courseDetails);
    } catch (error) {
      console.error("Error fetching course details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setSelectedCourseDetails(null);
      // You might want to show a toast error here
      // toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingCourseDetails(false);
    }
  };

  const getSubSections = () => {
    try {
      console.log("Getting subsections from course details:", selectedCourseDetails);
      
      if (!selectedCourseDetails) {
        console.log("No course details available");
        return [];
      }
      
      if (!selectedCourseDetails.courseContent) {
        console.log("No course content in details");
        return [];
      }
      
      console.log("Course content:", selectedCourseDetails.courseContent);
      
      const subsections = selectedCourseDetails.courseContent.reduce((acc, section) => {
        console.log("Processing section:", section);
        if (section.subSection && Array.isArray(section.subSection)) {
          const sectionSubsections = section.subSection.map(sub => ({
            ...sub,
            sectionName: section.sectionName || 'Unknown Section'
          }));
          console.log("Section subsections:", sectionSubsections);
          return [...acc, ...sectionSubsections];
        }
        return acc;
      }, []);
      
      console.log("All subsections:", subsections);
      return subsections;
    } catch (error) {
      console.error("Error in getSubSections:", error);
      return [];
    }
  };

  const handleQuizCreated = () => {
    // Refresh course details to get updated quiz data
    if (selectedCourse) {
      fetchCourseDetails(selectedCourse._id);
    }
    setShowQuizForm(false);
  };

  try {
    return (
      <div className="bg-academic-cream-50 min-h-screen">
        {/* Academic Header */}
        <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
          <div className="px-8 py-8">
            <div className="text-sm text-academic-slate-500 mb-4 font-inter">
              <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Quiz Management</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaPlus className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">Quiz Management System</h1>
                <p className="section-subtitle text-lg">Create, edit, and manage academic assessments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Academic Category Selection */}
          <div className="classic-card mb-8">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
              <h2 className="elegant-heading text-academic-navy-900">Category Selection</h2>
              <p className="text-sm text-academic-slate-600 font-inter">Choose a category to view available courses</p>
            </div>
            <div className="p-8">
              {loadingCategories ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                    <span className="text-academic-slate-700 font-medium font-inter">Loading categories...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="classic-label">Select Academic Category</label>
                  <select
                    value={selectedCategory || ""}
                    onChange={(e) => {
                      try {
                        const categoryId = e.target.value;
                        setSelectedCategory(categoryId);
                        setSelectedCourse(null);
                        setSelectedCourseDetails(null);
                        setSelectedSubSection(null);
                        if (categoryId) {
                          fetchCourses(categoryId);
                        }
                      } catch (error) {
                        console.error("Error in category selection:", error);
                      }
                    }}
                    className="classic-input"
                  >
                    <option value="">Select a category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Academic Course Selection */}
          {selectedCategory && (
            <div className="classic-card mb-8">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <h2 className="elegant-heading text-academic-navy-900">Course Selection</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Select a course to manage its quizzes</p>
              </div>
              <div className="p-8">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                      <span className="text-academic-slate-700 font-medium font-inter">Loading courses...</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="classic-label">Select Course</label>
                    <select
                      value={selectedCourse?._id || ""}
                      onChange={(e) => {
                        try {
                          const course = courses.find(c => c._id === e.target.value);
                          setSelectedCourse(course);
                          setSelectedCourseDetails(null);
                          setSelectedSubSection(null);
                          if (course) {
                            fetchCourseDetails(course._id);
                          }
                        } catch (error) {
                          console.error("Error in course selection:", error);
                        }
                      }}
                      className="classic-input"
                    >
                      <option value="">Select a course</option>
                      {courses?.map((course) => (
                        <option key={course._id} value={course._id}>
                          {course.courseName}
                        </option>
                      ))}
                    </select>

                    {courses.length === 0 && (
                      <div className="text-center py-16">
                        <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                          <FaPlus className="text-5xl text-academic-gold-700" />
                        </div>
                        <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Courses Found</h4>
                        <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                          There are no courses available in this category. Please select a different category or create new courses.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academic Lectures List */}
          {selectedCourse && (
            <div className="classic-card mb-8">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <h2 className="elegant-heading text-academic-navy-900">Lecture Management</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Manage quizzes for course lectures and assessments</p>
              </div>
              <div className="p-8">
                {loadingCourseDetails && (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                      <span className="text-academic-slate-700 font-medium font-inter">Loading course details...</span>
                    </div>
                  </div>
                )}
                
                {selectedCourseDetails && !loadingCourseDetails && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-academic-navy-900 font-playfair">Course Lectures</h3>
                      <div className="text-sm text-academic-slate-600 font-inter">
                        <span className="font-bold text-academic-navy-900">{getSubSections().length}</span> lectures available
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {getSubSections().map((subsection, index) => (
                        <div key={subsection._id} className="classic-card bg-white p-6 hover:shadow-elegant transition-all duration-300">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="bg-academic-navy-100 p-2 rounded-lg">
                                  <FaEdit className="text-academic-navy-700" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-bold text-academic-navy-900 font-playfair">
                                    {subsection.title}
                                  </h4>
                                  <p className="text-sm text-academic-slate-600 font-inter">
                                    Section: {subsection.sectionName}
                                  </p>
                                </div>
                              </div>
                              
                              {subsection.quiz && (
                                <div className="bg-academic-gold-50 border border-academic-gold-200 rounded-lg p-4 mt-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <FaPlus className="text-academic-gold-700" />
                                    <span className="font-semibold text-academic-gold-800 font-inter">Quiz Attached</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-inter">
                                    <div className="flex justify-between">
                                      <span className="text-academic-slate-700">Questions:</span>
                                      <span className="font-bold text-academic-navy-900">{subsection.quiz.questions?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-academic-slate-700">Total Marks:</span>
                                      <span className="font-bold text-academic-navy-900">{subsection.quiz.questions?.reduce((sum, q) => sum + (q.marks || 0), 0) || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-academic-slate-700">Time Limit:</span>
                                      <span className="font-bold text-academic-navy-900">{Math.floor((subsection.quiz.timeLimit || 1800) / 60)} min</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="ml-6">
                              {subsection.quiz ? (
                                <button
                                  onClick={() => {
                                    setSelectedSubSection(subsection);
                                    setShowQuizForm(true);
                                  }}
                                  className="btn-classic-secondary flex items-center gap-2"
                                >
                                  <FaEdit className="text-sm" />
                                  <span>Edit Quiz</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedSubSection(subsection);
                                    setShowQuizForm(true);
                                  }}
                                  className="btn-classic-gold flex items-center gap-2"
                                >
                                  <FaPlus className="text-sm" />
                                  <span>Add Quiz</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getSubSections().length === 0 && (
                        <div className="text-center py-16">
                          <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                            <FaEdit className="text-5xl text-academic-gold-700" />
                          </div>
                          <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Lectures Found</h4>
                          <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                            This course doesn't have any lectures yet. Please add lectures to the course before creating quizzes.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Academic Quiz Creator Modal */}
          {showQuizForm && selectedSubSection && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 p-4">
              <div className="classic-card w-full max-w-[900px] max-h-[90vh] overflow-auto">
                <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="elegant-heading text-academic-navy-900">
                        {selectedSubSection.quiz ? 'Edit Quiz' : 'Create New Quiz'}
                      </h3>
                      <p className="text-sm text-academic-slate-600 font-inter">
                        Lecture: {selectedSubSection.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowQuizForm(false)}
                      className="text-academic-slate-400 hover:text-academic-slate-600 text-2xl transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="p-8">
                  <QuizCreator
                    subSectionId={selectedSubSection._id}
                    existingQuiz={selectedSubSection.quiz}
                    onClose={() => setShowQuizForm(false)}
                    onSuccess={handleQuizCreated}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering QuizManagement component:", error);
    return (
      <div className="bg-academic-cream-50 min-h-screen">
        <div className="px-8 py-6">
          <div className="classic-card">
            <div className="bg-red-50 border-b border-red-200 px-8 py-4">
              <h3 className="text-lg font-bold text-red-800 font-playfair">System Error</h3>
            </div>
            <div className="p-8">
              <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg font-inter">
                <p className="font-semibold mb-2">An error occurred while loading the quiz management interface.</p>
                <p className="text-sm">Please refresh the page and try again.</p>
                <p className="text-xs mt-2 text-red-600">Error: {error.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default QuizManagement;
