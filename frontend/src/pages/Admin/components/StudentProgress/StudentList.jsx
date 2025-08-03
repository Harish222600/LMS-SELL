import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch, FaSpinner, FaGraduationCap, FaCertificate, FaTimes, FaUsers, FaArrowRight, FaCalendarAlt, FaChartLine, FaUser } from 'react-icons/fa';
import { getStudentsByCourse } from '../../../../services/operations/adminAPI';
import { formatDate } from '../../../../utils/dateFormatter';

const StudentList = ({ courseId, onStudentSelect }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await getStudentsByCourse(courseId, token);
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [courseId, token]);

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  // Calculate statistics
  const studentStats = {
    totalStudents: students.length,
    activeStudents: students.filter(student => (student.progress?.progressPercentage || 0) > 0).length,
    completedStudents: students.filter(student => (student.progress?.progressPercentage || 0) >= 100).length,
    averageProgress: students.length > 0 
      ? Math.round(students.reduce((acc, student) => acc + (student.progress?.progressPercentage || 0), 0) / students.length)
      : 0,
    filteredResults: filteredStudents.length
  };

  if (loading) {
    return (
      <div className="classic-card">
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
            <span className="text-academic-slate-700 font-medium font-inter">Loading students...</span>
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
          <h2 className="elegant-heading text-academic-navy-900">Student Overview</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Academic performance statistics</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="text-center group">
              <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaUsers className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{studentStats.totalStudents}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Students</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Enrolled in course
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaChartLine className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{studentStats.activeStudents}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Active Students</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                With progress {'>'} 0%
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaCertificate className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{studentStats.completedStudents}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Completed</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                100% progress
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaGraduationCap className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{studentStats.averageProgress}%</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Avg. Progress</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                Across all students
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaSearch className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{studentStats.filteredResults}</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Filtered Results</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                {searchTerm ? 'Matching search' : 'All students'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Search Panel */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h2 className="elegant-heading text-academic-navy-900">Search Students</h2>
          <p className="text-sm text-academic-slate-600 font-inter">Find students by name or email</p>
        </div>
        <div className="p-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email address..."
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
                Showing <span className="font-bold text-academic-navy-900">{filteredStudents.length}</span> of <span className="font-bold text-academic-navy-900">{students.length}</span> students
                <span className="text-academic-gold-700 font-semibold"> matching "{searchTerm}"</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Students List */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="elegant-heading text-academic-navy-900">Student Directory</h2>
              <p className="text-sm text-academic-slate-600 font-inter">Academic progress and enrollment details</p>
            </div>
            <div className="text-sm text-academic-slate-700 font-inter">
              <span className="font-bold text-academic-navy-900">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''} enrolled
            </div>
          </div>
        </div>

        {/* Academic Empty State */}
        {filteredStudents.length === 0 && (
          <div className="p-16 text-center">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
              <FaUsers className="text-5xl text-academic-gold-700" />
            </div>
            <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Students Found</h3>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
              {searchTerm 
                ? 'Try adjusting your search criteria to find the students you\'re looking for.' 
                : 'No students are enrolled in this academic course yet.'
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

        {/* Academic Students Grid */}
        {filteredStudents.length > 0 && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="classic-card bg-academic-cream-50 hover:shadow-elegant group transition-all duration-300 p-6 cursor-pointer"
                  onClick={() => onStudentSelect(student)}
                >
                  {/* Header with Avatar, Name and Action */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-16 h-16 bg-academic-gold-100 border-2 border-academic-gold-300 rounded-xl overflow-hidden flex-shrink-0 group-hover:border-academic-gold-400 transition-colors duration-300">
                        {student.image ? (
                          <img
                            src={student.image}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FaUser className="text-academic-gold-700 text-2xl" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-academic-navy-900 mb-1 font-playfair group-hover:text-academic-navy-800 transition-colors duration-300 line-clamp-2">
                          {student.firstName} {student.lastName}
                        </h3>
                        <p className="text-sm text-academic-slate-600 font-inter mb-2 line-clamp-1">{student.email}</p>
                        <div className="flex items-center gap-2 text-xs text-academic-slate-500 font-inter">
                          <FaCalendarAlt size={10} />
                          <span>Enrolled: {formatDate(student.enrolledAt)}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 p-2 border border-academic-navy-200 transition-all duration-200 rounded-lg hover:shadow-classic flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStudentSelect(student);
                      }}
                      title="View Details"
                    >
                      <FaArrowRight size={12} />
                    </button>
                  </div>

                  {/* Progress Indicators */}
                  <div className="mb-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="bg-academic-gold-50 border border-academic-gold-200 p-3 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FaGraduationCap className="text-academic-gold-700" size={12} />
                            <span className="text-lg font-bold text-academic-navy-900 font-playfair">
                              {student.progress?.completedVideos?.length || 0}
                            </span>
                          </div>
                          <p className="text-xs text-academic-slate-600 font-inter font-medium">Videos</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-academic-navy-50 border border-academic-navy-200 p-3 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FaCertificate className="text-academic-navy-700" size={12} />
                            <span className="text-lg font-bold text-academic-navy-900 font-playfair">
                              {student.progress?.passedQuizzes?.length || 0}
                            </span>
                          </div>
                          <p className="text-xs text-academic-slate-600 font-inter font-medium">Quizzes</p>
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="bg-academic-cream-100 border border-academic-cream-300 p-3 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FaChartLine className="text-academic-gold-700" size={12} />
                            <span className="text-lg font-bold text-academic-navy-900 font-playfair">
                              {student.progress?.progressPercentage || 0}%
                            </span>
                          </div>
                          <p className="text-xs text-academic-slate-600 font-inter font-medium">Complete</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-academic-navy-800 font-inter">Overall Progress</span>
                      <span className="text-sm font-bold text-academic-navy-900 font-playfair">
                        {student.progress?.progressPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-academic-slate-200 h-3 rounded-full border border-academic-slate-300">
                      <div
                        className="bg-academic-gold-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${student.progress?.progressPercentage || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer with Student Meta Information */}
                  <div className="pt-4 border-t border-academic-slate-200">
                    <div className="flex items-center justify-between text-xs text-academic-slate-500 font-inter">
                      <span className="font-medium">ID: {student._id.slice(-8).toUpperCase()}</span>
                      <span className="font-medium">Account: {student.accountType}</span>
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

export default StudentList;
