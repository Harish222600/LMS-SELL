import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartLine, FaUsers, FaGraduationCap } from 'react-icons/fa';
import CategoryList from './CategoryList';
import CourseList from './CourseList';
import StudentList from './StudentList';
import ProgressDetails from './ProgressDetails';

const StudentProgress = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Reset states when moving back in the hierarchy
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCourse(null);
    setSelectedStudent(null);
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSelectedStudent(null);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleBack = () => {
    if (selectedStudent) {
      setSelectedStudent(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Get current page title and description
  const getCurrentPageInfo = () => {
    if (selectedStudent) {
      return {
        title: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
        description: 'Detailed academic progress tracking and performance analytics',
        icon: FaUsers
      };
    } else if (selectedCourse) {
      return {
        title: selectedCourse.courseName,
        description: 'Student enrollment and academic progress overview',
        icon: FaGraduationCap
      };
    } else if (selectedCategory) {
      return {
        title: selectedCategory.name,
        description: 'Academic courses available in this category',
        icon: FaGraduationCap
      };
    } else {
      return {
        title: 'Student Progress Tracking',
        description: 'Monitor and analyze student learning progress across all academic courses',
        icon: FaChartLine
      };
    }
  };

  const pageInfo = getCurrentPageInfo();

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Student Progress</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              {(selectedCategory || selectedCourse || selectedStudent) && (
                <button
                  onClick={handleBack}
                  className="btn-classic-secondary flex items-center gap-2"
                  title="Go Back"
                >
                  <FaArrowLeft size={14} />
                  Back
                </button>
              )}
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <pageInfo.icon className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">{pageInfo.title}</h1>
                <p className="section-subtitle text-lg">{pageInfo.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Breadcrumb Navigation */}
      <div className="bg-white border-b border-academic-slate-200 px-8 py-4">
        <div className="flex items-center gap-3 text-sm font-inter">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedCourse(null);
              setSelectedStudent(null);
            }}
            className={`hover:text-academic-gold-700 transition-colors duration-200 font-medium ${
              !selectedCategory ? 'text-academic-gold-700 font-semibold' : 'text-academic-slate-600'
            }`}
          >
            Categories
          </button>
          {selectedCategory && (
            <>
              <span className="text-academic-gold-600">›</span>
              <button
                onClick={() => {
                  setSelectedCourse(null);
                  setSelectedStudent(null);
                }}
                className={`hover:text-academic-gold-700 transition-colors duration-200 font-medium ${
                  selectedCategory && !selectedCourse ? 'text-academic-gold-700 font-semibold' : 'text-academic-slate-600'
                }`}
              >
                {selectedCategory.name}
              </button>
            </>
          )}
          {selectedCourse && (
            <>
              <span className="text-academic-gold-600">›</span>
              <button
                onClick={() => setSelectedStudent(null)}
                className={`hover:text-academic-gold-700 transition-colors duration-200 font-medium ${
                  selectedCourse && !selectedStudent ? 'text-academic-gold-700 font-semibold' : 'text-academic-slate-600'
                }`}
              >
                {selectedCourse.courseName}
              </button>
            </>
          )}
          {selectedStudent && (
            <>
              <span className="text-academic-gold-600">›</span>
              <span className="text-academic-gold-700 font-semibold">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Academic Content Area */}
      <div className="px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          key={`${selectedCategory?._id}-${selectedCourse?._id}-${selectedStudent?._id}`}
        >
          {!selectedCategory ? (
            <CategoryList onCategorySelect={handleCategorySelect} />
          ) : !selectedCourse ? (
            <CourseList 
              categoryId={selectedCategory._id} 
              onCourseSelect={handleCourseSelect} 
            />
          ) : !selectedStudent ? (
            <StudentList 
              courseId={selectedCourse._id} 
              onStudentSelect={handleStudentSelect} 
            />
          ) : (
            <ProgressDetails 
              courseId={selectedCourse._id} 
              studentId={selectedStudent._id} 
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StudentProgress;
