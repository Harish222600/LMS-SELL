import React, { useState, lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaBookOpen, 
  FaChartBar, 
  FaGraduationCap, 
  FaQuestionCircle, 
  FaChartLine, 
  FaTag,
  FaSearch,
  FaBell,
  FaCog,
  FaPlus,
  FaHome,
  FaArrowRight,
  FaStar,
  FaChartArea,
  FaEye,
  FaFilter
} from 'react-icons/fa';
import { MdSettings, MdDashboard, MdNotifications } from 'react-icons/md';
import { VscPackage } from 'react-icons/vsc';

import AdminSidebar from '../../components/core/Dashboard/Admin/AdminSidebar';

// Lazy load components to improve initial load performance
const StudentProgress = lazy(() => import('./components/StudentProgress/StudentProgress'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const CourseManagement = lazy(() => import('./components/CourseManagement'));
const CreateCourse = lazy(() => import('./components/CreateCourse/CreateCourse'));
const EnhancedAnalytics = lazy(() => import('./components/EnhancedAnalytics'));
const Settings = lazy(() => import('./components/Settings'));
const CourseAccessRequests = lazy(() => import('../../components/core/Dashboard/Admin/CourseAccessRequests'));
const QuizManagement = lazy(() => import('./components/QuizManagement'));
const CourseCategories = lazy(() => import('../../components/core/Dashboard/AddCategory/CourseCategories'));
const BundleAccessRequests = lazy(() => import('./components/BundleAccessRequests'));
const Coupons = lazy(() => import('./Coupons'));
const Orders = lazy(() => import('./components/Orders'));
const NotificationManagement = lazy(() => import('./components/NotificationManagement'));
const FeaturedCoursesManagement = lazy(() => import('./components/FeaturedCoursesManagement'));
const ContactMessages = lazy(() => import('../../components/core/Dashboard/Admin/ContactMessages'));
const FaqManagement = lazy(() => import('./components/FaqManagement'));
const AdminChats = lazy(() => import('../Dashboard/AdminChats'));
const CareersManagement = lazy(() => import('./components/CareersManagement'));
const RecycleBin = lazy(() => import('./components/RecycleBin'));
const ReviewManagement = lazy(() => import('./components/ReviewManagement'));

// Enhanced Loading component with modern design
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
      <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" style={{ animationDelay: '0.3s' }}></div>
    </div>
  </div>
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.profile);
  const { isCollapsed } = useSelector((state) => state.sidebar);
  const [activeTab, setActiveTab] = useState('analytics');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Enhanced sidebar navigation items with better icons and descriptions
  const sidebarItems = [
    { 
      id: 'analytics', 
      label: 'Analytics Dashboard', 
      icon: <FaChartBar className="w-5 h-5" />, 
      description: 'View comprehensive platform analytics',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'users', 
      label: 'User Management', 
      icon: <FaUsers className="w-5 h-5" />, 
      description: 'Manage students, instructors, and admins',
      color: 'from-green-500 to-teal-600'
    },
    { 
      id: 'courses', 
      label: 'Course Management', 
      icon: <FaBookOpen className="w-5 h-5" />, 
      description: 'Create and manage courses',
      color: 'from-orange-500 to-red-600'
    },
    { 
      id: 'categories', 
      label: 'Course Categories', 
      icon: <FaGraduationCap className="w-5 h-5" />, 
      description: 'Organize courses by categories',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'recycleBin', 
      label: 'Recycle Bin', 
      icon: <FaUsers className="w-5 h-5" />, 
      description: 'Restore deleted items',
      color: 'from-gray-500 to-slate-600'
    },
    { 
      id: 'studentProgress', 
      label: 'Student Progress', 
      icon: <FaChartLine className="w-5 h-5" />, 
      description: 'Track student learning progress',
      color: 'from-indigo-500 to-blue-600'
    },
    { 
      id: 'quizzes', 
      label: 'Quiz Management', 
      icon: <FaQuestionCircle className="w-5 h-5" />, 
      description: 'Create and manage quizzes',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      id: 'featuredCourses', 
      label: 'Featured Courses', 
      icon: <FaStar className="w-5 h-5" />, 
      description: 'Manage featured course listings',
      color: 'from-amber-500 to-yellow-600'
    },
    { 
      id: 'reviews', 
      label: 'Review Management', 
      icon: <FaStar className="w-5 h-5" />, 
      description: 'Moderate course reviews',
      color: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'accessRequests', 
      label: 'Access Requests', 
      icon: <FaBell className="w-5 h-5" />, 
      description: 'Handle course access requests',
      color: 'from-red-500 to-pink-600'
    },
    { 
      id: 'bundleRequests', 
      label: 'Bundle Requests', 
      icon: <VscPackage className="w-5 h-5" />, 
      description: 'Manage bundle access requests',
      color: 'from-teal-500 to-cyan-600'
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: <VscPackage className="w-5 h-5" />, 
      description: 'View and manage orders',
      color: 'from-emerald-500 to-green-600'
    },
    { 
      id: 'coupons', 
      label: 'Coupons', 
      icon: <FaTag className="w-5 h-5" />, 
      description: 'Create and manage discount coupons',
      color: 'from-violet-500 to-purple-600'
    },
    { 
      id: 'careers', 
      label: 'Careers', 
      icon: <FaChartArea className="w-5 h-5" />, 
      description: 'Manage career opportunities',
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <MdNotifications className="w-5 h-5" />, 
      description: 'Send platform notifications',
      color: 'from-orange-500 to-amber-600'
    },
    { 
      id: 'contactMessages', 
      label: 'Contact Messages', 
      icon: <FaBell className="w-5 h-5" />, 
      description: 'View contact form submissions',
      color: 'from-cyan-500 to-blue-600'
    },
    { 
      id: 'faqs', 
      label: 'FAQ Management', 
      icon: <FaQuestionCircle className="w-5 h-5" />, 
      description: 'Manage frequently asked questions',
      color: 'from-lime-500 to-green-600'
    },
    { 
      id: 'chats', 
      label: 'Manage Chats', 
      icon: <FaBell className="w-5 h-5" />, 
      description: 'Monitor platform communications',
      color: 'from-rose-500 to-red-600'
    },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setShowCreateCourse(false);
  };

  const handleCreateCourse = () => {
    setShowCreateCourse(true);
    setActiveTab('courses');
  };

  const currentItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="sm:fixed sm:left-0 sm:top-16 h-[calc(100vh-4rem)] z-30 transition-all duration-300">
          <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Main Content */}
        <div className={`flex-1 mt-16 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
          isCollapsed ? 'sm:ml-[60px]' : 'sm:ml-[200px]'
        } w-full`}>
          
          {/* Modern Header */}
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200 p-4 lg:p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              
              {/* Title Section */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentItem?.color || 'from-blue-500 to-purple-600'} shadow-lg`}>
                  <div className="text-white">
                    {currentItem?.icon || <MdDashboard className="w-6 h-6" />}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <FaHome className="w-3 h-3" />
                    <span>Admin Portal</span>
                    <FaArrowRight className="w-3 h-3" />
                    <span className="text-slate-700 font-medium">
                      {showCreateCourse ? 'Create Course' : currentItem?.label}
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">
                    {showCreateCourse ? 'Create New Course' : currentItem?.label}
                  </h1>
                  <p className="text-slate-600 text-sm mt-1">
                    {showCreateCourse ? 'Build engaging courses for your students' : currentItem?.description}
                  </p>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative hidden lg:block">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>

                {/* Quick Actions */}
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  <FaBell className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  <FaCog className="w-4 h-4 text-slate-600" />
                </button>
                
                {/* Create Course Button */}
                {activeTab === 'courses' && !showCreateCourse && (
                  <button
                    onClick={handleCreateCourse}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Course</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="p-4 lg:p-6">
            <motion.div 
              variants={slideIn}
              initial="hidden"
              animate="visible"
              className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
            >
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence mode="wait">
                  {showCreateCourse ? (
                    <motion.div
                      key="create-course"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="p-6"
                    >
                      <CreateCourse onCancel={() => setShowCreateCourse(false)} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="min-h-[600px]"
                    >
                      {activeTab === 'analytics' && <EnhancedAnalytics />}
                      {activeTab === 'users' && <div className="p-6"><UserManagement /></div>}
                      {activeTab === 'courses' && <div className="p-6"><CourseManagement onCreateCourse={handleCreateCourse} /></div>}
                      {activeTab === 'categories' && <div className="p-6"><CourseCategories /></div>}
                      {activeTab === 'accessRequests' && <div className="p-6"><CourseAccessRequests /></div>}
                      {activeTab === 'settings' && <div className="p-6"><Settings /></div>}
                      {activeTab === 'quizzes' && <div className="p-6"><QuizManagement /></div>}
                      {activeTab === 'bundleRequests' && <div className="p-6"><BundleAccessRequests /></div>}
                      {activeTab === 'studentProgress' && <div className="p-6"><StudentProgress /></div>}
                      {activeTab === 'orders' && <div className="p-6"><Orders /></div>}
                      {activeTab === 'coupons' && <div className="p-6"><Coupons /></div>}
                      {activeTab === 'notifications' && <div className="p-6"><NotificationManagement /></div>}
                      {activeTab === 'contactMessages' && <div className="p-6"><ContactMessages /></div>}
                      {activeTab === 'featuredCourses' && <div className="p-6"><FeaturedCoursesManagement /></div>}
                      {activeTab === 'reviews' && <div className="p-6"><ReviewManagement /></div>}
                      {activeTab === 'faqs' && <div className="p-6"><FaqManagement /></div>}
                      {activeTab === 'chats' && <div className="p-6"><AdminChats /></div>}
                      {activeTab === 'careers' && <div className="p-6"><CareersManagement /></div>}
                      {activeTab === 'recycleBin' && <div className="p-6"><RecycleBin /></div>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
