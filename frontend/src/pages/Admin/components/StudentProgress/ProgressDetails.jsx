import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSpinner, FaVideo, FaCheckCircle, FaTimesCircle, FaCertificate, FaSyncAlt, FaChartLine, FaCalendarAlt, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';
import { getStudentProgress } from '../../../../services/operations/adminAPI';
import { formatDate } from '../../../../utils/dateFormatter';

const ProgressDetails = ({ courseId, studentId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const { token } = useSelector((state) => state.auth);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const progressData = await getStudentProgress(courseId, studentId, token);
      setProgress(progressData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error refreshing progress:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await getStudentProgress(courseId, studentId, token);
        setProgress(progressData);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, studentId, token]);

  if (loading) {
    return (
      <div className="classic-card">
        <div className="flex justify-center items-center py-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
            <span className="text-academic-slate-700 font-medium font-inter">Loading progress details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="classic-card">
        <div className="p-16 text-center">
          <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
            <FaExclamationTriangle className="text-5xl text-academic-gold-700" />
          </div>
          <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Progress Data Available</h3>
          <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
            Unable to load academic progress information for this student.
          </p>
          <button
            onClick={handleRefresh}
            className="btn-elegant flex items-center gap-3 mx-auto"
          >
            <FaSyncAlt size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Academic Header with Actions */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="elegant-heading text-academic-navy-900 mb-2">Detailed Progress Report</h2>
              <p className="section-subtitle text-academic-slate-600 font-inter">Comprehensive academic learning analytics and performance metrics</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-academic-slate-500 font-inter">
                <FaCalendarAlt className="inline mr-2" size={12} />
                Last updated: {formatDate(lastUpdated)}
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`btn-elegant flex items-center gap-3 ${
                  refreshing ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {refreshing ? (
                  <>
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <FaSyncAlt size={16} />
                    Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Overall Progress Statistics */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h3 className="elegant-heading text-academic-navy-900">Overall Progress Summary</h3>
          <p className="text-sm text-academic-slate-600 font-inter">Academic performance overview and completion metrics</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaChartLine className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{progress.progressPercentage}%</div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Completion Rate</div>
              </div>
              <div className="w-full bg-academic-slate-200 h-3 rounded-full border border-academic-slate-300">
                <div
                  className="bg-academic-gold-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaVideo className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                  {progress.completedVideos?.length || 0}
                </div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Videos Completed</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                of {progress.totalVideos || 0} total videos
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaCertificate className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                  {progress.passedQuizzes?.length || 0}
                </div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Quizzes Passed</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                of {progress.totalQuizzes || 0} total quizzes
              </div>
            </div>

            <div className="text-center group">
              <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                <FaTrophy className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                  {progress.progressPercentage >= 100 ? '1' : '0'}
                </div>
                <div className="text-sm font-semibold text-academic-slate-700 font-inter">Course Completed</div>
              </div>
              <div className="text-xs text-academic-slate-500 font-inter">
                {progress.progressPercentage >= 100 ? 'Congratulations!' : 'In Progress'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Quiz Performance Analysis */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="elegant-heading text-academic-navy-900">Quiz Performance Analysis</h3>
              <p className="text-sm text-academic-slate-600 font-inter">Detailed academic assessment results</p>
            </div>
            <div className="text-sm text-academic-slate-700 font-inter">
              <span className="font-bold text-academic-navy-900">{progress.quizResults?.length || 0}</span> quiz attempt{(progress.quizResults?.length || 0) !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Academic Quiz Results */}
        {(!progress.quizResults || progress.quizResults.length === 0) ? (
          <div className="p-16 text-center">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
              <FaCertificate className="text-5xl text-academic-gold-700" />
            </div>
            <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Quiz Attempts Yet</h4>
            <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
              The student hasn't attempted any academic assessments in this course.
            </p>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            {progress.quizResults.map((result, index) => (
              <div key={result._id || index} className="classic-card bg-academic-cream-50 p-6">
                {/* Academic Quiz Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-academic-navy-900 mb-3 font-playfair">
                      Quiz: {result.quiz?.videoTitle || result.quiz?.title || `Assessment ${index + 1}`}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-academic-slate-600 font-inter">
                      <span className="font-medium">Section: {result.quiz?.section || 'General'}</span>
                      <span className="text-academic-gold-600">•</span>
                      <span className="font-medium">Attempts: {result.attempts || 1}</span>
                      {result.completedAt && (
                        <>
                          <span className="text-academic-gold-600">•</span>
                          <span className="font-medium">Completed: {formatDate(result.completedAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-2 font-semibold font-inter ${
                    result.passed 
                      ? 'bg-academic-navy-100 border-academic-navy-300 text-academic-navy-800' 
                      : 'bg-red-100 border-red-300 text-red-800'
                  }`}>
                    {result.passed ? (
                      <div className="flex items-center gap-2">
                        <FaCheckCircle size={16} />
                        PASSED
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <FaTimesCircle size={16} />
                        NEEDS REVIEW
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Quiz Performance Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaChartLine className="text-academic-gold-700" size={16} />
                      <span className="text-sm font-semibold text-academic-gold-800 font-inter">Score</span>
                    </div>
                    <div className="text-2xl font-bold text-academic-navy-900 font-playfair">
                      {result.score}/{result.totalMarks}
                    </div>
                    <div className="text-xs text-academic-slate-600 font-inter">
                      Raw Score
                    </div>
                  </div>

                  <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaTrophy className="text-academic-navy-700" size={16} />
                      <span className="text-sm font-semibold text-academic-navy-800 font-inter">Percentage</span>
                    </div>
                    <div className="text-2xl font-bold text-academic-navy-900 font-playfair">
                      {result.percentage}%
                    </div>
                    <div className="text-xs text-academic-slate-600 font-inter">
                      Performance Rate
                    </div>
                  </div>

                  <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaSyncAlt className="text-academic-gold-700" size={16} />
                      <span className="text-sm font-semibold text-academic-slate-800 font-inter">Attempts</span>
                    </div>
                    <div className="text-2xl font-bold text-academic-navy-900 font-playfair">
                      {result.attempts || 1}
                    </div>
                    <div className="text-xs text-academic-slate-600 font-inter">
                      Total Tries
                    </div>
                  </div>

                  <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaCalendarAlt className="text-academic-navy-700" size={16} />
                      <span className="text-sm font-semibold text-academic-slate-800 font-inter">Status</span>
                    </div>
                    {result.passed ? (
                      <div>
                        <div className="text-lg font-bold text-academic-navy-900 font-playfair">Completed</div>
                        <div className="text-xs text-academic-slate-600 font-inter">
                          {result.completedAt ? formatDate(result.completedAt) : 'Recently'}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-lg font-bold text-red-700 font-playfair">Incomplete</div>
                        <div className="text-xs text-academic-slate-600 font-inter">
                          Needs improvement
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Academic Performance Bar */}
                <div className="pt-4 border-t border-academic-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-academic-navy-800 font-inter">Academic Performance</span>
                    <span className="text-sm font-bold text-academic-navy-900 font-playfair">{result.percentage}%</span>
                  </div>
                  <div className="w-full bg-academic-slate-200 h-3 rounded-full border border-academic-slate-300">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        result.passed ? 'bg-academic-gold-600' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Academic Certificate Status */}
      {progress.certificateStatus && (
        <div className="classic-card">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h3 className="elegant-heading text-academic-navy-900">Certificate Achievement</h3>
            <p className="text-sm text-academic-slate-600 font-inter">Academic completion recognition</p>
          </div>
          <div className="p-8">
            <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                    <FaCertificate className="text-academic-gold-700 text-3xl" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-academic-navy-900 mb-2 font-playfair">
                      Academic Course Completion Certificate
                    </h4>
                    <p className="text-sm text-academic-slate-700 mb-3 font-inter">
                      Successfully earned upon academic course completion
                    </p>
                    <div className="flex items-center gap-2 text-xs text-academic-slate-500 font-inter">
                      <FaCalendarAlt size={12} />
                      <span className="font-medium">
                        Issued: {progress.certificateStatus?.issuedDate 
                          ? formatDate(progress.certificateStatus.issuedDate) 
                          : 'Date not available'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="bg-academic-navy-700 text-white px-6 py-3 font-semibold mb-2 rounded-lg font-inter">
                      EARNED
                    </div>
                    <div className="text-xs text-academic-slate-600 font-inter">
                      Certificate Status
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Progress Summary */}
      <div className="classic-card">
        <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
          <h3 className="elegant-heading text-academic-navy-900">Learning Journey Summary</h3>
          <p className="text-sm text-academic-slate-600 font-inter">Comprehensive academic progress overview</p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaVideo className="text-academic-gold-700 text-xl" />
                <h4 className="font-bold text-academic-navy-900 font-playfair">Video Progress</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Completed Videos:</span>
                  <span className="font-bold text-academic-navy-900">{progress.completedVideos?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Total Videos:</span>
                  <span className="font-bold text-academic-navy-900">{progress.totalVideos || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Completion Rate:</span>
                  <span className="font-bold text-academic-gold-700">
                    {progress.totalVideos > 0 
                      ? Math.round(((progress.completedVideos?.length || 0) / progress.totalVideos) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-academic-slate-200 h-2 rounded-full border border-academic-slate-300 mt-3">
                  <div
                    className="bg-academic-gold-600 h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progress.totalVideos > 0 
                        ? Math.round(((progress.completedVideos?.length || 0) / progress.totalVideos) * 100)
                        : 0
                      }%` 
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaCertificate className="text-academic-navy-700 text-xl" />
                <h4 className="font-bold text-academic-navy-900 font-playfair">Quiz Performance</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Passed Quizzes:</span>
                  <span className="font-bold text-academic-navy-900">{progress.passedQuizzes?.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Total Quizzes:</span>
                  <span className="font-bold text-academic-navy-900">{progress.totalQuizzes || 0}</span>
                </div>
                <div className="flex justify-between text-sm font-inter">
                  <span className="text-academic-slate-700">Success Rate:</span>
                  <span className="font-bold text-academic-gold-700">
                    {progress.totalQuizzes > 0 
                      ? Math.round(((progress.passedQuizzes?.length || 0) / progress.totalQuizzes) * 100)
                      : 0
                    }%
                  </span>
                </div>
                <div className="w-full bg-academic-slate-200 h-2 rounded-full border border-academic-slate-300 mt-3">
                  <div
                    className="bg-academic-navy-600 h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${progress.totalQuizzes > 0 
                        ? Math.round(((progress.passedQuizzes?.length || 0) / progress.totalQuizzes) * 100)
                        : 0
                      }%` 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDetails;
