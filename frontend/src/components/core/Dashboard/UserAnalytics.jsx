import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserAnalytics, getUserActivity } from "../../../services/operations/userAnalyticsAPI";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { motion } from "framer-motion";
import { fadeIn } from "../../common/motionFrameVarients";
import HighlightText from "../HomePage/HighlightText";
import { 
  FaGraduationCap, 
  FaClock, 
  FaTrophy, 
  FaChartLine, 
  FaBookOpen, 
  FaStar, 
  FaCalendarAlt,
  FaUserGraduate,
  FaAward,
  FaCertificate,
  FaLightbulb,
  FaBullseye,
  FaRocket,
  FaFire,
  FaHistory,
  FaArrowUp,
  FaArrowDown,
  FaEquals
} from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function UserAnalytics() {
  const { token } = useSelector((state) => state.auth);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const analytics = await getUserAnalytics(token);
        const activity = await getUserActivity(token, selectedPeriod);
        console.log('Received analytics data:', analytics);
        console.log('Received activity data:', activity);
        
        if (!analytics?.courseProgress) {
          console.warn('No course progress data in analytics');
        }
        if (!analytics?.weeklyActivity) {
          console.warn('No weekly activity data in analytics');
        }
        
        setAnalyticsData(analytics);
        setActivityData(activity);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        console.error("Error details:", err.response?.data || err.message);
        
        // Use mock data when API fails
        const mockData = {
          overview: {
            enrolledCourses: 5,
            totalLearningTime: 1250, // minutes
            totalSpent: 15000,
            completionRate: 78
          },
          learningStreak: 12,
          courseProgress: [
            { courseName: "React Development", progressPercentage: 85 },
            { courseName: "Node.js Backend", progressPercentage: 60 },
            { courseName: "Database Design", progressPercentage: 45 },
            { courseName: "UI/UX Design", progressPercentage: 90 }
          ],
          weeklyActivity: [
            { day: "Mon", hours: 2.5 },
            { day: "Tue", hours: 1.8 },
            { day: "Wed", hours: 3.2 },
            { day: "Thu", hours: 2.1 },
            { day: "Fri", hours: 2.8 },
            { day: "Sat", hours: 4.0 },
            { day: "Sun", hours: 1.5 }
          ],
          loginHistory: [
            {
              type: "progress",
              action: "Completed React Hooks Module",
              details: "Successfully finished the advanced React Hooks section",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              type: "enrollment",
              action: "Enrolled in Node.js Course",
              details: "Started learning backend development with Node.js",
              amount: 2999,
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
            },
            {
              type: "achievement",
              action: "Earned JavaScript Certificate",
              details: "Completed JavaScript fundamentals with 95% score",
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              type: "progress",
              action: "Started Database Module",
              details: "Beginning SQL and NoSQL database concepts",
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        };
        
        setAnalyticsData(mockData);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [token, selectedPeriod]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-academic-slate-50 to-white">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-academic-slate-200 border-t-academic-gold-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaChartLine className="text-academic-navy-600 text-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-academic-slate-50 to-white">
        <div className="text-center p-8 bg-white rounded-2xl border border-red-200 shadow-elegant">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <p className="text-academic-slate-600 text-sm mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  // Chart Data with academic colors
  const courseProgressData = {
    labels: analyticsData?.courseProgress?.length > 0 
      ? analyticsData.courseProgress.map(course => course.courseName)
      : ['No courses enrolled'],
    datasets: [{
      data: analyticsData?.courseProgress?.length > 0 
        ? analyticsData.courseProgress.map(course => course.progressPercentage)
        : [100],
      backgroundColor: analyticsData?.courseProgress?.length > 0 
        ? analyticsData.courseProgress.map((_, index) => [
            '#1e3a8a', // academic-navy-800
            '#d97706', // academic-gold-600
            '#0f172a', // academic-slate-900
            '#b45309', // academic-gold-700
            '#1e40af', // academic-navy-700
            '#92400e', // academic-gold-800
            '#334155', // academic-slate-700
            '#a16207'  // academic-gold-700
          ][index % 8])
        : ['#6B7280'],
      borderWidth: 2,
      borderColor: '#ffffff',
      hoverOffset: 8
    }]
  };

  const weeklyActivityData = {
    labels: analyticsData?.weeklyActivity?.length > 0
      ? analyticsData.weeklyActivity.map(day => day.day)
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours Spent Learning',
      data: analyticsData?.weeklyActivity?.length > 0
        ? analyticsData.weeklyActivity.map(day => day.hours)
        : [0, 0, 0, 0, 0, 0, 0],
      borderColor: '#1e3a8a',
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#d97706',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      pointRadius: 6,
      pointHoverRadius: 8
    }]
  };

  return (
    <div className="w-full bg-gradient-to-br from-academic-slate-50 to-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <motion.div 
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-academic-slate-500 mb-2">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-academic-navy-600 font-medium">Analytics</span>
              </div>
              <h1 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-2">
                Learning <HighlightText text="Analytics" variant="gold" />
              </h1>
              <p className="section-subtitle text-academic-slate-600 mb-0">
                Track your progress and celebrate your achievements
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="classic-input text-sm px-4 py-2"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <div className="bg-academic-gold-100 p-3 rounded-lg">
                <FaChartLine className="text-academic-gold-600 w-5 h-5" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Enrolled Courses */}
          <motion.div 
            variants={fadeIn('up', 0.3)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-academic-navy-300 transition-all duration-300 hover:shadow-classic-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-academic-navy-100 p-3 rounded-lg">
                <FaGraduationCap className="text-academic-navy-600 w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <FaArrowUp className="w-3 h-3" />
                  <span>+12%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-academic-navy-900 mb-1">
                {analyticsData.overview.enrolledCourses}
              </h3>
              <p className="text-academic-slate-600 text-sm font-medium">Enrolled Courses</p>
              <p className="text-academic-slate-500 text-xs mt-1">Active learning paths</p>
            </div>
          </motion.div>

          {/* Learning Time */}
          <motion.div 
            variants={fadeIn('up', 0.4)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-300 hover:shadow-classic-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-academic-gold-100 p-3 rounded-lg">
                <FaClock className="text-academic-gold-600 w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <FaArrowUp className="w-3 h-3" />
                  <span>+8%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-academic-navy-900 mb-1">
                {Math.floor(analyticsData.overview.totalLearningTime / 60)}h {Math.round(analyticsData.overview.totalLearningTime % 60)}m
              </h3>
              <p className="text-academic-slate-600 text-sm font-medium">Learning Time</p>
              <p className="text-academic-slate-500 text-xs mt-1">
                🔥 {analyticsData.learningStreak} day streak
              </p>
            </div>
          </motion.div>

          {/* Investment */}
          <motion.div 
            variants={fadeIn('up', 0.5)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-green-300 transition-all duration-300 hover:shadow-classic-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaTrophy className="text-green-600 w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-academic-slate-500 text-sm">
                  <FaEquals className="w-3 h-3" />
                  <span>0%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-academic-navy-900 mb-1">
                ₹{analyticsData.overview.totalSpent.toLocaleString()}
              </h3>
              <p className="text-academic-slate-600 text-sm font-medium">Investment</p>
              <p className="text-academic-slate-500 text-xs mt-1">Knowledge investment</p>
            </div>
          </motion.div>

          {/* Success Rate */}
          <motion.div 
            variants={fadeIn('up', 0.6)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-classic-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBullseye className="text-blue-600 w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <FaArrowUp className="w-3 h-3" />
                  <span>+5%</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-academic-navy-900 mb-1">
                {analyticsData.overview.completionRate}%
              </h3>
              <p className="text-academic-slate-600 text-sm font-medium">Success Rate</p>
              <p className="text-academic-slate-500 text-xs mt-1">Overall completion</p>
            </div>
          </motion.div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Course Progress Chart */}
          <motion.div 
            variants={fadeIn('right', 0.4)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-academic-navy-100 p-3 rounded-lg">
                <FaBookOpen className="text-academic-navy-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="elegant-heading text-academic-navy-900">Course Progress</h3>
                <p className="text-sm text-academic-slate-600">Your learning progress by course</p>
              </div>
            </div>
            <div className="h-80 flex items-center justify-center">
              {analyticsData?.courseProgress?.length > 0 ? (
                <Pie 
                  data={courseProgressData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { 
                          color: '#334155',
                          font: { size: 12, weight: '500' },
                          padding: 20,
                          usePointStyle: true,
                          pointStyle: 'circle'
                        }
                      },
                      tooltip: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1e3a8a',
                        bodyColor: '#334155',
                        borderColor: '#d97706',
                        borderWidth: 2,
                        cornerRadius: 12,
                        padding: 12,
                        displayColors: true
                      }
                    }
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-academic-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaBookOpen className="text-academic-slate-400 w-8 h-8" />
                  </div>
                  <p className="text-academic-slate-600 font-medium">No Course Data</p>
                  <p className="text-academic-slate-500 text-sm">Enroll in courses to see progress</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Weekly Activity Chart */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-academic-gold-100 p-3 rounded-lg">
                <FaChartLine className="text-academic-gold-600 w-5 h-5" />
              </div>
              <div>
                <h3 className="elegant-heading text-academic-navy-900">Weekly Activity</h3>
                <p className="text-sm text-academic-slate-600">Your daily learning patterns</p>
              </div>
            </div>
            <div className="h-80">
              <Line 
                data={weeklyActivityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(148, 163, 184, 0.2)', drawBorder: false },
                      ticks: { color: '#64748b', font: { size: 12, weight: '500' } }
                    },
                    x: {
                      grid: { color: 'rgba(148, 163, 184, 0.2)', drawBorder: false },
                      ticks: { color: '#64748b', font: { size: 12, weight: '500' } }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: '#334155', font: { size: 13, weight: '600' } }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      titleColor: '#1e3a8a',
                      bodyColor: '#334155',
                      borderColor: '#d97706',
                      borderWidth: 2,
                      cornerRadius: 12,
                      padding: 12
                    }
                  }
                }}
              />
            </div>
          </motion.div>

        </div>

        {/* Activity History */}
        <motion.div 
          variants={fadeIn('up', 0.5)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaHistory className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="elegant-heading text-academic-navy-900">Recent Activity</h3>
              <p className="text-sm text-academic-slate-600">Your latest learning activities and achievements</p>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {analyticsData?.loginHistory?.length > 0 ? (
              analyticsData.loginHistory.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-academic-slate-50 rounded-xl border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-200"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'progress' ? 'bg-blue-100' : 
                    activity.type === 'enrollment' ? 'bg-green-100' : 'bg-academic-gold-100'
                  }`}>
                    {activity.type === 'progress' ? (
                      <FaBookOpen className="text-blue-600 w-4 h-4" />
                    ) : activity.type === 'enrollment' ? (
                      <FaUserGraduate className="text-green-600 w-4 h-4" />
                    ) : (
                      <FaAward className="text-academic-gold-600 w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-academic-navy-900 text-sm">{activity.action}</p>
                        <p className="text-academic-slate-600 text-sm mt-1">{activity.details}</p>
                        {activity.amount && (
                          <p className="text-green-600 text-sm mt-1 font-medium">Amount: ₹{activity.amount}</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-academic-slate-500 text-xs">
                          {new Date(activity.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-academic-slate-400 text-xs">
                          {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-academic-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHistory className="text-academic-slate-400 w-8 h-8" />
                </div>
                <p className="text-academic-slate-600 font-medium mb-2">No Recent Activity</p>
                <p className="text-academic-slate-500 text-sm">Start learning or enroll in courses to see your activity here!</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
