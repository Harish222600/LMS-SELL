import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getAnalytics } from '../../../../services/operations/adminAPI'
import CourseAccessRequests from './CourseAccessRequests'
import { motion } from "framer-motion";
import { fadeIn } from "../../../common/motionFrameVarients";
import HighlightText from "../../HomePage/HighlightText";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  FaUsers, 
  FaGraduationCap, 
  FaDollarSign,
  FaChartLine,
  FaSync,
  FaFilePdf,
  FaFileCsv,
  FaEye,
  FaBookOpen,
  FaClock,
  FaArrowUp,
  FaBell,
  FaCog,
  FaExpand,
  FaPlay,
  FaPause,
  FaStar
} from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth)
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPeriod, setSelectedPeriod] = useState('30')
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    fetchAnalytics()
  }, [selectedPeriod])

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAnalytics()
      }, 30000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const result = await getAnalytics(token)
      if (result) {
        setAnalytics(result)
      } else {
        // Mock data
        setAnalytics({
          overview: {
            totalUsers: 1247,
            totalRevenue: 245000,
            courseCompletions: 234,
            avgSessionTime: 45,
            activeUsers: 734,
            newRegistrations: 89
          },
          growth: {
            users: 12.5,
            revenue: 8.3,
            courses: 15.7,
            engagement: 6.2
          },
          topCourses: [
            { name: 'React Development', students: 234, revenue: 45000, rating: 4.8 },
            { name: 'Node.js Backend', students: 189, revenue: 38000, rating: 4.6 },
            { name: 'Python Programming', students: 156, revenue: 31000, rating: 4.7 },
            { name: 'UI/UX Design', students: 134, revenue: 27000, rating: 4.5 }
          ],
          monthlyData: [
            { month: 'Jan', users: 145, revenue: 28000 },
            { month: 'Feb', users: 167, revenue: 32000 },
            { month: 'Mar', users: 189, revenue: 38000 },
            { month: 'Apr', users: 234, revenue: 45000 },
            { month: 'May', users: 278, revenue: 52000 },
            { month: 'Jun', users: 312, revenue: 58000 }
          ],
          userDistribution: {
            students: 72,
            instructors: 18,
            admins: 10
          },
          requests: {
            pendingAccessRequests: 3
          }
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
    setLoading(false)
  }

  const tabData = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'courses', label: 'Courses', icon: FaBookOpen },
    { id: 'revenue', label: 'Revenue', icon: FaDollarSign },
    { id: 'system', label: 'System', icon: FaCog },
    { id: 'requests', label: 'Requests', icon: FaBell, badge: analytics?.requests?.pendingAccessRequests || 0 }
  ]

  // Chart configurations
  const monthlyRevenueData = {
    labels: analytics?.monthlyData?.map(item => item.month) || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: analytics?.monthlyData?.map(item => item.revenue) || [28000, 32000, 38000, 45000, 52000, 58000],
      borderColor: '#1e3a8a',
      backgroundColor: 'rgba(30, 58, 138, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#d97706',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 3,
      pointRadius: 6
    }]
  }

  const userDistributionData = {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [{
      data: [
        analytics?.userDistribution?.students || 72,
        analytics?.userDistribution?.instructors || 18,
        analytics?.userDistribution?.admins || 10
      ],
      backgroundColor: ['#3b82f6', '#d97706', '#1e3a8a'],
      borderWidth: 0,
      hoverOffset: 12
    }]
  }

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 border-4 border-academic-slate-200 border-t-academic-gold-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaChartLine className="text-academic-navy-600 text-xl animate-pulse" />
            </div>
          </div>
          <p className="text-academic-slate-600 font-medium">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-[1800px] mx-auto p-4 lg:p-6">
        
        {/* Modern Header with Sidebar Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          
          {/* Main Header Section */}
          <motion.div 
            variants={fadeIn('right', 0.2)}
            initial='hidden'
            animate='show'
            className="xl:col-span-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden"
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32 animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <FaChartLine className="text-white w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
                    <span>Admin Portal</span>
                    <span>•</span>
                    <span>Real-time Analytics</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold">
                    Admin <span className="text-yellow-300">Dashboard</span>
                  </h1>
                </div>
              </div>
              
              <p className="text-white/90 text-lg mb-6 max-w-2xl">
                Monitor your learning platform's performance with comprehensive analytics, user insights, and real-time metrics.
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    autoRefresh 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                  }`}
                >
                  {autoRefresh ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                  {autoRefresh ? 'Live Mode' : 'Start Live'}
                </button>
                <button 
                  onClick={fetchAnalytics}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300"
                >
                  <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Sidebar */}
          <motion.div 
            variants={fadeIn('left', 0.3)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              System Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Active Users</span>
                <span className="font-bold text-slate-900">{analytics?.overview?.activeUsers || 734}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Server Load</span>
                <span className="font-bold text-green-600">Normal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Response Time</span>
                <span className="font-bold text-blue-600">245ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 text-sm">Uptime</span>
                <span className="font-bold text-purple-600">99.9%</span>
              </div>
            </div>

            {/* Export Controls */}
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Export Data</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                  <FaFilePdf className="w-4 h-4" />
                  Export PDF
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                  <FaFileCsv className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Modern Tab Navigation */}
        <motion.div 
          variants={fadeIn('up', 0.4)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-6 overflow-hidden"
        >
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabData.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 font-medium whitespace-nowrap transition-all duration-300 relative min-w-fit ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === tab.id 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-slate-100 text-slate-500'
                }`}>
                  <tab.icon className="w-4 h-4" />
                </div>
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Tab Content */}
        <motion.div 
          variants={fadeIn('up', 0.5)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
        >
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="p-8 space-y-8">
              
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Total Users KPI */}
                <motion.div 
                  variants={fadeIn('up', 0.4)}
                  initial='hidden'
                  animate='show'
                  className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <FaUsers className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-blue-100 text-sm">
                          <FaArrowUp className="w-3 h-3" />
                          <span>+{analytics?.growth?.users || 12.5}%</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.totalUsers?.toLocaleString() || '1,247'}</h3>
                    <p className="text-blue-100 text-sm font-medium">Total Users</p>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-blue-100">+{analytics?.overview?.newRegistrations || 89} new this month</p>
                    </div>
                  </div>
                </motion.div>

                {/* Revenue KPI */}
                <motion.div 
                  variants={fadeIn('up', 0.5)}
                  initial='hidden'
                  animate='show'
                  className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <FaDollarSign className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-100 text-sm">
                          <FaArrowUp className="w-3 h-3" />
                          <span>+{analytics?.growth?.revenue || 8.3}%</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">₹{analytics?.overview?.totalRevenue?.toLocaleString() || '2,45,000'}</h3>
                    <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-green-100">Monthly recurring revenue</p>
                    </div>
                  </div>
                </motion.div>

                {/* Course Completions KPI */}
                <motion.div 
                  variants={fadeIn('up', 0.6)}
                  initial='hidden'
                  animate='show'
                  className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <FaGraduationCap className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-purple-100 text-sm">
                          <FaArrowUp className="w-3 h-3" />
                          <span>+{analytics?.growth?.courses || 15.7}%</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.courseCompletions || 234}</h3>
                    <p className="text-purple-100 text-sm font-medium">Course Completions</p>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-purple-100">This month</p>
                    </div>
                  </div>
                </motion.div>

                {/* Engagement KPI */}
                <motion.div 
                  variants={fadeIn('up', 0.7)}
                  initial='hidden'
                  animate='show'
                  className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <FaClock className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-orange-100 text-sm">
                          <FaArrowUp className="w-3 h-3" />
                          <span>+{analytics?.growth?.engagement || 6.2}%</span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{analytics?.overview?.avgSessionTime || 45}m</h3>
                    <p className="text-orange-100 text-sm font-medium">Avg Session Time</p>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <p className="text-xs text-orange-100">Per user session</p>
                    </div>
                  </div>
                </motion.div>

              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Revenue Trend Chart */}
                <motion.div 
                  variants={fadeIn('right', 0.5)}
                  initial='hidden'
                  animate='show'
                  className="bg-academic-slate-50 rounded-2xl p-6 border border-academic-slate-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="elegant-heading text-academic-navy-900 mb-1">Revenue Trend</h3>
                      <p className="text-sm text-academic-slate-600">Monthly revenue growth over time</p>
                    </div>
                    <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-100">
                      <FaExpand className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-80">
                    <Line 
                      data={monthlyRevenueData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(148, 163, 184, 0.2)' },
                            ticks: { color: '#64748b', font: { size: 12 } }
                          },
                          x: {
                            grid: { color: 'rgba(148, 163, 184, 0.2)' },
                            ticks: { color: '#64748b', font: { size: 12 } }
                          }
                        },
                        plugins: {
                          legend: { display: false },
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

                {/* User Distribution Chart */}
                <motion.div 
                  variants={fadeIn('left', 0.5)}
                  initial='hidden'
                  animate='show'
                  className="bg-academic-slate-50 rounded-2xl p-6 border border-academic-slate-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="elegant-heading text-academic-navy-900 mb-1">User Distribution</h3>
                      <p className="text-sm text-academic-slate-600">Platform user breakdown</p>
                    </div>
                    <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-100">
                      <FaExpand className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="h-80">
                    <Doughnut 
                      data={userDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { 
                              color: '#334155',
                              font: { size: 12, weight: '500' },
                              padding: 15,
                              usePointStyle: true
                            }
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

              {/* Top Courses */}
              <motion.div 
                variants={fadeIn('up', 0.6)}
                initial='hidden'
                animate='show'
                className="bg-academic-slate-50 rounded-2xl p-6 border border-academic-slate-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="elegant-heading text-academic-navy-900 mb-1">Top Performing Courses</h3>
                    <p className="text-sm text-academic-slate-600">Most popular courses by enrollment and revenue</p>
                  </div>
                  <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-100">
                    <FaEye className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {analytics?.topCourses?.map((course, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 hover:shadow-sm transition-all duration-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-academic-navy-900 text-sm">{course.name}</h4>
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-500 w-3 h-3" />
                          <span className="text-xs text-academic-slate-600">{course.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-academic-slate-600">Students</span>
                          <span className="font-medium text-academic-navy-900">{course.students}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-academic-slate-600">Revenue</span>
                          <span className="font-medium text-green-600">₹{course.revenue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          )}

          {/* Access Requests Tab */}
          {activeTab === 'requests' && (
            <div className="p-8">
              <CourseAccessRequests />
            </div>
          )}

          {/* Other Tabs - Simple Placeholder */}
          {activeTab !== 'overview' && activeTab !== 'requests' && (
            <div className="p-8 text-center">
              <div className="bg-slate-50 rounded-2xl p-12 border border-slate-200">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {React.createElement(tabData.find(tab => tab.id === activeTab)?.icon || FaChartLine, {
                    className: "text-white w-8 h-8"
                  })}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {tabData.find(tab => tab.id === activeTab)?.label} Dashboard
                </h3>
                <p className="text-slate-600 mb-6">
                  This section is under development. More detailed analytics coming soon.
                </p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    Back to Overview
                  </button>
                  <button className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors">
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>

      </div>
    </div>
  )
}
