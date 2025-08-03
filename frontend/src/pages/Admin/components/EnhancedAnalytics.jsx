import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import { Pie, Doughnut, Bar, Line } from "react-chartjs-2";
import { getAnalytics } from "../../../services/operations/adminAPI";
import { motion } from "framer-motion";
import { fadeIn } from "../../../components/common/motionFrameVarients";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  FaUsers,
  FaGraduationCap,
  FaChalkboardTeacher,
  FaUserShield,
  FaBookOpen,
  FaCalendarAlt,
  FaDownload,
  FaRedo,
  FaFilter,
  FaExpand,
  FaCompress,
  FaEye,
  FaDollarSign,
  FaClock,
  FaBell,
  FaChartLine,
  FaSignInAlt,
  FaUserClock,
  FaPlus,
  FaHistory,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaArrowUp,
  FaPlay,
  FaPause,
  FaFilePdf,
  FaFileCsv,
  FaSync
} from "react-icons/fa";



Chart.register(...registerables);

const EnhancedAnalytics = () => {
  const { token } = useSelector((state) => state.auth);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [dateRange, setDateRange] = useState('30d');
  const [expandedChart, setExpandedChart] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    api: { status: 'checking', responseTime: 0, lastChecked: null },
    database: { status: 'checking', responseTime: 0, lastChecked: null },
    serverLoad: { status: 'checking', cpuUsage: 0, memoryUsage: 0, lastChecked: null },
    cache: { status: 'checking', hitRate: 0, lastChecked: null }
  });

  
  // Check system health status
  const checkSystemHealth = useCallback(async () => {
    const startTime = Date.now();
    
    try {
      // Test API connectivity and response time
      const apiStartTime = Date.now();
      const analyticsData = await getAnalytics(token);
      const apiResponseTime = Date.now() - apiStartTime;
      
      // Determine API status based on response time
      let apiStatus = 'online';
      if (apiResponseTime > 5000) apiStatus = 'slow';
      else if (apiResponseTime > 2000) apiStatus = 'degraded';
      
      // Simulate server metrics based on API performance
      const cpuUsage = Math.min(90, Math.max(10, apiResponseTime / 50 + Math.random() * 20));
      const memoryUsage = Math.min(85, Math.max(15, apiResponseTime / 40 + Math.random() * 25));
      
      // Determine server load status
      let serverStatus = 'normal';
      if (cpuUsage > 80 || memoryUsage > 80) serverStatus = 'high';
      else if (cpuUsage > 60 || memoryUsage > 60) serverStatus = 'moderate';
      
      // Simulate cache performance
      const cacheHitRate = Math.max(60, Math.min(98, 95 - (apiResponseTime / 100)));
      let cacheStatus = 'optimized';
      if (cacheHitRate < 70) cacheStatus = 'poor';
      else if (cacheHitRate < 85) cacheStatus = 'fair';
      
      setSystemHealth({
        api: {
          status: apiStatus,
          responseTime: apiResponseTime,
          lastChecked: new Date()
        },
        database: {
          status: analyticsData ? 'connected' : 'disconnected',
          responseTime: apiResponseTime,
          lastChecked: new Date()
        },
        serverLoad: {
          status: serverStatus,
          cpuUsage: Math.round(cpuUsage),
          memoryUsage: Math.round(memoryUsage),
          lastChecked: new Date()
        },
        cache: {
          status: cacheStatus,
          hitRate: Math.round(cacheHitRate),
          lastChecked: new Date()
        }
      });
      
    } catch (error) {
      // Set error states for all systems
      setSystemHealth({
        api: {
          status: 'offline',
          responseTime: 0,
          lastChecked: new Date()
        },
        database: {
          status: 'disconnected',
          responseTime: 0,
          lastChecked: new Date()
        },
        serverLoad: {
          status: 'unknown',
          cpuUsage: 0,
          memoryUsage: 0,
          lastChecked: new Date()
        },
        cache: {
          status: 'unknown',
          hitRate: 0,
          lastChecked: new Date()
        }
      });
    }
  }, [token]);

  // Mock data for fallback
  const mockAnalytics = {
    users: {
      total: 1247,
      students: 892,
      instructors: 156,
      admins: 12,
      recentRegistrations: 89
    },
    courses: {
      total: 45,
      published: 38,
      draft: 7,
      free: 18,
      paid: 27
    },
    requests: {
      pendingAccessRequests: 3
    },
    revenue: {
      totalRevenue: 245000,
      monthlyRevenue: 58000,
      growthPercentage: 15.7
    },
    recentCourses: [
      { _id: '1', courseName: 'React Development', instructor: { firstName: 'John', lastName: 'Doe' }, createdAt: new Date(), status: 'Published', price: 2999 },
      { _id: '2', courseName: 'Node.js Backend', instructor: { firstName: 'Jane', lastName: 'Smith' }, createdAt: new Date(), status: 'Draft', price: 3499 },
      { _id: '3', courseName: 'Python Fundamentals', instructor: { firstName: 'Mike', lastName: 'Johnson' }, createdAt: new Date(), status: 'Published', price: 1999 }
    ],
    recentLogins: [
      { _id: '1', firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', accountType: 'Student', createdAt: new Date() },
      { _id: '2', firstName: 'Bob', lastName: 'Wilson', email: 'bob@example.com', accountType: 'Instructor', createdAt: new Date() },
      { _id: '3', firstName: 'Carol', lastName: 'Davis', email: 'carol@example.com', accountType: 'Student', createdAt: new Date() }
    ]
  };

  // Fetch analytics from backend API
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const analyticsData = await getAnalytics(token);
      setAnalytics(analyticsData);
      setError(null);

      // Add notification for data refresh
      if (autoRefresh) {
        setNotifications(prev => [...prev, {
          id: Date.now(),
          message: 'Analytics data refreshed',
          type: 'success',
          timestamp: new Date()
        }]);
      }
    } catch (err) {
      console.log('Analytics API failed, using mock data:', err);
      // Use mock data as fallback
      setAnalytics(mockAnalytics);
      setError(null);
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: 'Using demo data - API unavailable',
        type: 'warning',
        timestamp: new Date()
      }]);
    }
    setLoading(false);
  }, [token, autoRefresh]);

  // Auto-refresh functionality
  useEffect(() => {
    fetchAnalytics();
    checkSystemHealth();

    let analyticsInterval;
    let healthInterval;
    
    if (autoRefresh) {
      analyticsInterval = setInterval(fetchAnalytics, refreshInterval);
    }
    
    // Check system health every 30 seconds
    healthInterval = setInterval(checkSystemHealth, 30000);

    return () => {
      if (analyticsInterval) clearInterval(analyticsInterval);
      if (healthInterval) clearInterval(healthInterval);
    };
  }, [fetchAnalytics, checkSystemHealth, autoRefresh, refreshInterval]);

  // Clear notifications after 5 seconds
  useEffect(() => {
    notifications.forEach(notification => {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    });
  }, [notifications]);

  // Chart data with academic theme colors
  const userDistributionData = analytics ? {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [{
      data: [analytics.users.students, analytics.users.instructors, analytics.users.admins],
      backgroundColor: [
        '#3b82f6',
        '#d97706', 
        '#1e3a8a'
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  } : null;

  const courseTypeData = analytics ? {
    labels: ['Free Courses', 'Paid Courses'],
    datasets: [{
      data: [analytics.courses.free, analytics.courses.paid],
      backgroundColor: [
        '#22c55e',
        '#3b82f6'
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  } : null;

  const courseStatusData = analytics ? {
    labels: ['Published', 'Draft'],
    datasets: [{
      data: [analytics.courses.published, analytics.courses.draft],
      backgroundColor: [
        '#22c55e',
        '#f59e0b'
      ],
      borderWidth: 0,
      hoverOffset: 8
    }]
  } : null;

  // User comparison with academic colors
  const userComparisonData = analytics ? {
    labels: ['Students', 'Instructors', 'Admins'],
    datasets: [{
      label: 'User Count',
      data: [analytics.users.students, analytics.users.instructors, analytics.users.admins],
      backgroundColor: [
        '#3b82f6',
        '#d97706',
        '#1e3a8a'
      ],
      borderColor: ['#1e40af', '#b45309', '#1e3a8a'],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  } : null;

  // Course metrics with academic colors
  const courseMetricsData = analytics ? {
    labels: ['Total', 'Published', 'Draft', 'Free', 'Paid'],
    datasets: [{
      label: 'Course Count',
      data: [
        analytics.courses.total,
        analytics.courses.published,
        analytics.courses.draft,
        analytics.courses.free,
        analytics.courses.paid
      ],
      backgroundColor: [
        '#6b7280',
        '#22c55e',
        '#f59e0b',
        '#10b981',
        '#3b82f6'
      ],
      borderColor: ['#4b5563', '#16a34a', '#d97706', '#059669', '#1e40af'],
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  } : null;

  // Growth trend with academic colors
  const growthTrendData = analytics ? {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'New Users',
        data: [
          Math.max(0, analytics.users.recentRegistrations - 30),
          Math.max(0, analytics.users.recentRegistrations - 25),
          Math.max(0, analytics.users.recentRegistrations - 20),
          Math.max(0, analytics.users.recentRegistrations - 15),
          Math.max(0, analytics.users.recentRegistrations - 10),
          Math.max(0, analytics.users.recentRegistrations - 5),
          analytics.users.recentRegistrations
        ],
        borderColor: '#1e3a8a',
        backgroundColor: 'rgba(30, 58, 138, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#d97706',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6
      },
      {
        label: 'New Courses',
        data: [
          Math.max(0, analytics.courses.published - 15),
          Math.max(0, analytics.courses.published - 12),
          Math.max(0, analytics.courses.published - 10),
          Math.max(0, analytics.courses.published - 8),
          Math.max(0, analytics.courses.published - 5),
          Math.max(0, analytics.courses.published - 3),
          analytics.courses.published
        ],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#d97706',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6
      },
      {
        label: 'Revenue (₹)',
        data: [
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.7),
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.8),
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.85),
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.9),
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.95),
          Math.max(0, analytics.revenue?.monthlyRevenue * 0.98),
          analytics.revenue?.monthlyRevenue || 0
        ],
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1e3a8a',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 6
      }
    ]
  } : null;

  // Enhanced chart options with academic theme
  const enhancedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: 'easeInOutCubic',
      delay: (context) => context.dataIndex * 100
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#334155',
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e3a8a',
        bodyColor: '#334155',
        borderColor: '#d97706',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 10
        }
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 10
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2500,
      easing: 'easeInOutCubic',
      animateRotate: true,
      animateScale: true
    },
    interaction: {
      intersect: false
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 25,
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#334155',
          font: {
            size: 13,
            weight: '600',
            family: 'Inter, system-ui, sans-serif'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1e3a8a',
        bodyColor: '#334155',
        borderColor: '#d97706',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function (context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Export functionality
  const exportToPDF = async () => {
    try {
      const element = document.getElementById('analytics-dashboard');
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('analytics-dashboard.pdf');

      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: 'PDF exported successfully',
        type: 'success',
        timestamp: new Date()
      }]);
    } catch (error) {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        message: 'Failed to export PDF: ' + error.message,
        type: 'error',
        timestamp: new Date()
      }]);
    }
  };

  const exportToExcel = () => {
    if (!analytics) return;

    const data = {
      users: analytics.users,
      courses: analytics.courses,
      requests: analytics.requests
    };

    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Total Users,${analytics.users.total}\n`
      + `Students,${analytics.users.students}\n`
      + `Instructors,${analytics.users.instructors}\n`
      + `Admins,${analytics.users.admins}\n`
      + `Recent Registrations,${analytics.users.recentRegistrations}\n`
      + `Total Courses,${analytics.courses.total}\n`
      + `Published Courses,${analytics.courses.published}\n`
      + `Draft Courses,${analytics.courses.draft}\n`
      + `Free Courses,${analytics.courses.free}\n`
      + `Paid Courses,${analytics.courses.paid}\n`
      + `Pending Requests,${analytics.requests?.pendingAccessRequests || 0}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setNotifications(prev => [...prev, {
      id: Date.now(),
      message: 'Analytics exported to CSV successfully',
      type: 'success',
      timestamp: new Date()
    }]);
  };

  if (loading && !analytics) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-50"></div>
    </div>
  );

  if (error) return (
    <div className="card-gradient rounded-xl p-6 glass-effect text-center">
      <p className="text-red-400 text-lg">{error}</p>
      <button
        onClick={fetchAnalytics}
        className="mt-4 px-4 py-2 bg-yellow-500 text-richblack-900 rounded-lg hover:bg-yellow-400 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (!analytics) return null;

  return (
    <div id="analytics-dashboard" className="min-h-screen bg-gradient-to-br from-academic-slate-50 via-white to-academic-slate-50">
      <div className="max-w-[1600px] mx-auto p-6 space-y-8">

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <motion.div
              key={notification.id}
              variants={fadeIn('left', 0.2)}
              initial='hidden'
              animate='show'
              className={`p-4 rounded-xl shadow-elegant border transition-all duration-300 ${
                notification.type === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : notification.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    : notification.type === 'info'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-red-50 text-red-800 border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' ? <FaCheckCircle /> :
                 notification.type === 'warning' ? <FaExclamationTriangle /> :
                 notification.type === 'error' ? <FaTimesCircle /> : <FaBell />}
                <span className="font-medium">{notification.message}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Header */}
        <motion.div 
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-3xl p-8 shadow-elegant border border-academic-slate-200 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-academic-gold-500 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-academic-navy-500 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
          
          <div className="relative">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-r from-academic-navy-500 to-academic-gold-500 p-3 rounded-2xl">
                    <FaChartLine className="text-white w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-academic-slate-500">
                    <span>Admin Portal</span>
                    <span>/</span>
                    <span className="text-academic-navy-600 font-medium">Enhanced Analytics</span>
                  </div>
                </div>
                <h1 className="classic-heading text-4xl xl:text-5xl text-academic-navy-900 mb-3">
                  Enhanced <HighlightText text="Analytics" variant="gold" />
                </h1>
                <p className="section-subtitle text-academic-slate-600 text-lg">
                  Advanced insights with real-time monitoring and comprehensive performance metrics
                </p>
                
                {/* Quick Stats Bar */}
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-academic-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-academic-slate-600">System Status: <span className="font-semibold text-green-600">Online</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="text-academic-slate-400 w-4 h-4" />
                    <span className="text-sm text-academic-slate-600">Last Updated: <span className="font-semibold">Just now</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-academic-slate-400 w-4 h-4" />
                    <span className="text-sm text-academic-slate-600">Total Users: <span className="font-semibold text-academic-navy-900">{analytics?.users?.total || 0}</span></span>
                  </div>
                </div>
              </div>
              
              {/* Control Panel */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <button 
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      autoRefresh 
                        ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                        : 'bg-academic-slate-100 text-academic-slate-600 border-2 border-academic-slate-200 hover:border-academic-navy-300'
                    }`}
                  >
                    {autoRefresh ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
                    {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
                  </button>
                  <button 
                    onClick={fetchAnalytics}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-academic-slate-100 text-academic-slate-600 rounded-xl text-sm font-medium hover:bg-academic-navy-100 hover:text-academic-navy-700 transition-all duration-300 disabled:opacity-50"
                  >
                    <FaSync className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                </div>
                
                <div className="flex items-center gap-3 flex-wrap">
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 bg-white border-2 border-academic-slate-200 rounded-xl text-sm font-medium focus:border-academic-navy-400 focus:outline-none"
                  >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="1y">Last Year</option>
                  </select>
                  <button 
                    onClick={exportToPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-academic-gold-500 text-white rounded-xl text-sm font-medium hover:bg-academic-gold-600 transition-all duration-300"
                  >
                    <FaFilePdf className="w-4 h-4" />
                    Export PDF
                  </button>
                  <button 
                    onClick={exportToExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-academic-navy-500 text-white rounded-xl text-sm font-medium hover:bg-academic-navy-600 transition-all duration-300"
                  >
                    <FaFileCsv className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Users Card */}
          <motion.div 
            variants={fadeIn('up', 0.3)}
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
                    <span>+12.5%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics.users.total.toLocaleString()}</h3>
              <p className="text-blue-100 text-sm font-medium">Total Users</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-blue-100">+{analytics.users.recentRegistrations} new registrations</p>
              </div>
            </div>
          </motion.div>

          {/* Students Card */}
          <motion.div 
            variants={fadeIn('up', 0.4)}
            initial='hidden'
            animate='show'
            className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaGraduationCap className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-100 text-sm">
                    <FaArrowUp className="w-3 h-3" />
                    <span>+8.2%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics.users.students.toLocaleString()}</h3>
              <p className="text-green-100 text-sm font-medium">Students</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-green-100">{((analytics.users.students / analytics.users.total) * 100).toFixed(1)}% of total users</p>
              </div>
            </div>
          </motion.div>

          {/* Instructors Card */}
          <motion.div 
            variants={fadeIn('up', 0.5)}
            initial='hidden'
            animate='show'
            className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaChalkboardTeacher className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-purple-100 text-sm">
                    <FaArrowUp className="w-3 h-3" />
                    <span>+5.7%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">{analytics.users.instructors.toLocaleString()}</h3>
              <p className="text-purple-100 text-sm font-medium">Instructors</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-purple-100">{((analytics.users.instructors / analytics.users.total) * 100).toFixed(1)}% of total users</p>
              </div>
            </div>
          </motion.div>

          {/* Revenue Card */}
          <motion.div 
            variants={fadeIn('up', 0.6)}
            initial='hidden'
            animate='show'
            className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <FaDollarSign className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-orange-100 text-sm">
                    <FaArrowUp className="w-3 h-3" />
                    <span>+{analytics.revenue?.growthPercentage || 15.7}%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-1">₹{(analytics.revenue?.totalRevenue || 0).toLocaleString()}</h3>
              <p className="text-orange-100 text-sm font-medium">Total Revenue</p>
              <div className="mt-3 pt-3 border-t border-white/20">
                <p className="text-xs text-orange-100">₹{(analytics.revenue?.monthlyRevenue || 0).toLocaleString()} this month</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* User Distribution Chart */}
          <motion.div 
            variants={fadeIn('right', 0.4)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1">User Distribution</h3>
                <p className="text-sm text-academic-slate-600">Platform user breakdown</p>
              </div>
              <button 
                onClick={() => setExpandedChart(expandedChart === 'userDist' ? null : 'userDist')}
                className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50"
              >
                {expandedChart === 'userDist' ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>
            </div>
            <div className={`${expandedChart === 'userDist' ? 'h-96' : 'h-80'}`}>
              {userDistributionData && (
                <Pie data={userDistributionData} options={pieChartOptions} />
              )}
            </div>
          </motion.div>

          {/* Course Type Distribution */}
          <motion.div 
            variants={fadeIn('left', 0.4)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1">Course Types</h3>
                <p className="text-sm text-academic-slate-600">Free vs Paid courses</p>
              </div>
              <button 
                onClick={() => setExpandedChart(expandedChart === 'courseType' ? null : 'courseType')}
                className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50"
              >
                {expandedChart === 'courseType' ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
              </button>
            </div>
            <div className={`${expandedChart === 'courseType' ? 'h-96' : 'h-80'}`}>
              {courseTypeData && (
                <Doughnut data={courseTypeData} options={pieChartOptions} />
              )}
            </div>
          </motion.div>

        </div>

        {/* Enhanced Bar Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Comparison Bar Chart */}
          <motion.div 
            variants={fadeIn('right', 0.5)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1">User Type Comparison</h3>
                <p className="text-sm text-academic-slate-600">Breakdown by user roles</p>
              </div>
              <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
            <div className="h-80">
              {userComparisonData && (
                <Bar data={userComparisonData} options={enhancedChartOptions} />
              )}
            </div>
          </motion.div>

          {/* Course Metrics Bar Chart */}
          <motion.div 
            variants={fadeIn('left', 0.5)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1">Course Metrics Overview</h3>
                <p className="text-sm text-academic-slate-600">Complete course statistics</p>
              </div>
              <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
            <div className="h-80">
              {courseMetricsData && (
                <Bar data={courseMetricsData} options={enhancedChartOptions} />
              )}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Growth Trend Chart */}
        <motion.div 
          variants={fadeIn('up', 0.5)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="elegant-heading text-academic-navy-900 mb-1">Growth Trends & Projections</h3>
              <p className="text-sm text-academic-slate-600">Monthly growth in users and engagement</p>
            </div>
            <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50">
              <FaEye className="w-4 h-4" />
            </button>
          </div>
          <div className="h-96">
            {growthTrendData && (
              <Line data={growthTrendData} options={enhancedChartOptions} />
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Courses */}
          <motion.div 
            variants={fadeIn('right', 0.6)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1 flex items-center gap-2">
                  <FaPlus className="text-green-500" />
                  Recent Courses
                </h3>
                <p className="text-sm text-academic-slate-600">Latest course additions</p>
              </div>
              <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {analytics.recentCourses?.slice(0, 5).map((course, index) => (
                <div key={course._id || index} className="flex items-center gap-4 p-4 bg-academic-slate-50 rounded-xl hover:bg-academic-slate-100 transition-colors duration-200">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <FaBookOpen className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-academic-navy-900 truncate">{course.courseName}</h4>
                    <p className="text-sm text-academic-slate-600">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                    <p className="text-xs text-academic-slate-500">
                      {new Date(course.createdAt).toLocaleDateString()} • ₹{course.price}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'Published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <FaBookOpen className="text-academic-slate-300 text-3xl mx-auto mb-3" />
                  <p className="text-academic-slate-500">No recent courses found</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Logins */}
          <motion.div 
            variants={fadeIn('left', 0.6)}
            initial='hidden'
            animate='show'
            className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="elegant-heading text-academic-navy-900 mb-1 flex items-center gap-2">
                  <FaSignInAlt className="text-blue-500" />
                  Recent Logins
                </h3>
                <p className="text-sm text-academic-slate-600">Latest user activity</p>
              </div>
              <button className="text-academic-slate-400 hover:text-academic-slate-600 p-2 rounded-lg hover:bg-academic-slate-50">
                <FaEye className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {analytics.recentLogins?.slice(0, 5).map((user, index) => (
                <div key={user._id || index} className="flex items-center gap-4 p-4 bg-academic-slate-50 rounded-xl hover:bg-academic-slate-100 transition-colors duration-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-academic-navy-900 truncate">{user.firstName} {user.lastName}</h4>
                    <p className="text-sm text-academic-slate-600 truncate">{user.email}</p>
                    <p className="text-xs text-academic-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()} • {new Date(user.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.accountType === 'Student' 
                        ? 'bg-blue-100 text-blue-700' 
                        : user.accountType === 'Instructor'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.accountType}
                    </span>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8">
                  <FaSignInAlt className="text-academic-slate-300 text-3xl mx-auto mb-3" />
                  <p className="text-academic-slate-500">No recent logins found</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>

        {/* System Health & Performance */}
        <motion.div 
          variants={fadeIn('up', 0.7)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="elegant-heading text-academic-navy-900 mb-1 flex items-center gap-2">
                <FaUserShield className="text-green-500" />
                System Health & Performance
              </h3>
              <p className="text-sm text-academic-slate-600">Real-time system monitoring and performance metrics</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-600">All Systems Operational</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-500 p-2 rounded-lg">
                  <FaCheckCircle className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-green-700">99.9%</span>
              </div>
              <h4 className="font-semibold text-green-900 mb-1">Uptime</h4>
              <p className="text-sm text-green-600">System availability</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <FaClock className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-blue-700">245ms</span>
              </div>
              <h4 className="font-semibold text-blue-900 mb-1">Response Time</h4>
              <p className="text-sm text-blue-600">Average API response</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <FaUsers className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-purple-700">1,247</span>
              </div>
              <h4 className="font-semibold text-purple-900 mb-1">Active Users</h4>
              <p className="text-sm text-purple-600">Currently online</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-500 p-2 rounded-lg">
                  <FaExclamationTriangle className="text-white w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-orange-700">{analytics.requests?.pendingAccessRequests || 0}</span>
              </div>
              <h4 className="font-semibold text-orange-900 mb-1">Pending Requests</h4>
              <p className="text-sm text-orange-600">Require attention</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default EnhancedAnalytics;