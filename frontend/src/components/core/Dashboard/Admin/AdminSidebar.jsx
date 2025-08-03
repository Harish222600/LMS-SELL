import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUsers, 
  FaBookOpen, 
  FaChartBar, 
  FaGraduationCap, 
  FaQuestionCircle, 
  FaStar, 
  FaComments, 
  FaTag, 
  FaChartLine, 
  FaCommentDots, 
  FaBriefcase, 
  FaEnvelope, 
  FaTrash, 
  FaSmile,
  FaCrown,
  FaRocket,
  FaShieldAlt,
  FaGem
} from 'react-icons/fa';
import { 
  MdSettings, 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight,
  MdDashboard,
  MdNotifications,
  MdLogout
} from 'react-icons/md';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import { VscSignOut, VscPackage, VscGitPullRequestCreate, VscSymbolClass } from "react-icons/vsc";
import { HiMenuAlt1, HiSparkles } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from "react-router-dom";
import { toggleSidebarCollapse, setOpenSideMenu, setScreenSize } from '../../../../slices/sidebarSlice';
import { setNotificationCounts, clearNotificationCount } from '../../../../slices/adminNotificationSlice';
import { logout } from "../../../../services/operations/authAPI";
import { getNotificationCounts, markSectionAsSeen } from "../../../../services/operations/adminAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import NotificationBadge from "../../../common/NotificationBadge";

// Animation variants
const sidebarVariants = {
  open: { width: 200, transition: { duration: 0.2, ease: "linear" } },
  collapsed: { width: 60, transition: { duration: 0.2, ease: "linear" } }
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } }
};

const AdminSidebar = ({ activeTab, onTabChange }) => {
  const { isCollapsed, openSideMenu, screenSize } = useSelector((state) => state.sidebar);
  const { user, loading: profileLoading } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading: authLoading } = useSelector((state) => state.auth);
  const { notificationCounts } = useSelector((state) => state.adminNotification);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Enhanced sidebar navigation items with modern design
  const sidebarSections = [
    {
      title: "Dashboard",
      items: [
        { 
          id: 'analytics', 
          label: 'Analytics', 
          icon: <FaChartBar size={18} />, 
          notificationKey: null,
          gradient: 'from-blue-500 to-purple-600',
          description: 'View platform insights'
        }
      ]
    },
    {
      title: "Management",
      items: [
        { 
          id: 'users', 
          label: 'Users', 
          icon: <FaUsers size={18} />, 
          notificationKey: null,
          gradient: 'from-green-500 to-teal-600',
          description: 'Manage all users'
        },
        { 
          id: 'courses', 
          label: 'Courses', 
          icon: <FaBookOpen size={18} />, 
          notificationKey: null,
          gradient: 'from-orange-500 to-red-600',
          description: 'Course management'
        },
        { 
          id: 'categories', 
          label: 'Categories', 
          icon: <VscSymbolClass size={18} />, 
          notificationKey: null,
          gradient: 'from-purple-500 to-pink-600',
          description: 'Course categories'
        },
        { 
          id: 'studentProgress', 
          label: 'Progress', 
          icon: <FaChartLine size={18} />, 
          notificationKey: null,
          gradient: 'from-indigo-500 to-blue-600',
          description: 'Student progress'
        }
      ]
    },
    {
      title: "Content",
      items: [
        { 
          id: 'quizzes', 
          label: 'Quizzes', 
          icon: <FaQuestionCircle size={18} />, 
          notificationKey: null,
          gradient: 'from-yellow-500 to-orange-600',
          description: 'Quiz management'
        },
        { 
          id: 'featuredCourses', 
          label: 'Featured', 
          icon: <FaStar size={18} />, 
          notificationKey: null,
          gradient: 'from-amber-500 to-yellow-600',
          description: 'Featured courses'
        },
        { 
          id: 'reviews', 
          label: 'Reviews', 
          icon: <FaSmile size={18} />, 
          notificationKey: 'reviews',
          gradient: 'from-pink-500 to-rose-600',
          description: 'Course reviews'
        }
      ]
    },
    {
      title: "Requests",
      items: [
        { 
          id: 'accessRequests', 
          label: 'Access', 
          icon: <FaShieldAlt size={18} />, 
          notificationKey: 'accessRequests',
          gradient: 'from-red-500 to-pink-600',
          description: 'Access requests'
        },
        { 
          id: 'bundleRequests', 
          label: 'Bundles', 
          icon: <VscGitPullRequestCreate size={18} />, 
          notificationKey: 'bundleRequests',
          gradient: 'from-teal-500 to-cyan-600',
          description: 'Bundle requests'
        }
      ]
    },
    {
      title: "Commerce",
      items: [
        { 
          id: 'orders', 
          label: 'Orders', 
          icon: <VscPackage size={18} />, 
          notificationKey: null,
          gradient: 'from-emerald-500 to-green-600',
          description: 'Order management'
        },
        { 
          id: 'coupons', 
          label: 'Coupons', 
          icon: <FaTag size={18} />, 
          notificationKey: null,
          gradient: 'from-violet-500 to-purple-600',
          description: 'Discount coupons'
        }
      ]
    },
    {
      title: "Communication",
      items: [
        { 
          id: 'notifications', 
          label: 'Notifications', 
          icon: <MdNotifications size={18} />, 
          notificationKey: 'notifications',
          gradient: 'from-orange-500 to-amber-600',
          description: 'Send notifications'
        },
        { 
          id: 'contactMessages', 
          label: 'Messages', 
          icon: <FaEnvelope size={18} />, 
          notificationKey: 'contactMessages',
          gradient: 'from-cyan-500 to-blue-600',
          description: 'Contact messages'
        },
        { 
          id: 'chats', 
          label: 'Chats', 
          icon: <FaCommentDots size={18} />, 
          notificationKey: 'chats',
          gradient: 'from-rose-500 to-red-600',
          description: 'Manage chats'
        }
      ]
    },
    {
      title: "System",
      items: [
        { 
          id: 'faqs', 
          label: 'FAQs', 
          icon: <FaComments size={18} />, 
          notificationKey: 'faqs',
          gradient: 'from-lime-500 to-green-600',
          description: 'FAQ management'
        },
        { 
          id: 'careers', 
          label: 'Careers', 
          icon: <FaBriefcase size={18} />, 
          notificationKey: 'careers',
          gradient: 'from-blue-500 to-indigo-600',
          description: 'Career opportunities'
        },
        { 
          id: 'recycleBin', 
          label: 'Recycle Bin', 
          icon: <FaTrash size={18} />, 
          notificationKey: null,
          gradient: 'from-gray-500 to-slate-600',
          description: 'Deleted items'
        }
      ]
    }
  ];

  // Flatten items for easy access
  const allItems = sidebarSections.flatMap(section => section.items);

  // Fetch notification counts
  const fetchNotificationCounts = async () => {
    if (!token || !user || user.accountType !== 'Admin') return;
    
    try {
      const counts = await getNotificationCounts(token);
      dispatch(setNotificationCounts(counts));
    } catch (error) {
      console.error('Error fetching notification counts:', error);
    }
  };

  // Handle section click
  const handleSectionClick = async (sectionId) => {
    // Mark section as seen if it has notifications
    const item = allItems.find(item => item.id === sectionId);
    if (item?.notificationKey) {
      try {
        // Always mark as seen when clicking, regardless of current count
        await markSectionAsSeen(item.notificationKey, token);
        dispatch(clearNotificationCount(item.notificationKey));
        
        console.log(`Section ${item.notificationKey} marked as seen`);
      } catch (error) {
        console.error('Error marking section as seen:', error);
      }
    }
    
    // Call the original onTabChange
    onTabChange(sectionId);
  };

  useEffect(() => {
    const handleResize = () => dispatch(setScreenSize(window.innerWidth));
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // If screen size is small then close the side bar
  useEffect(() => {
    if (screenSize <= 640) {
      dispatch(setOpenSideMenu(false));
    } else {
      dispatch(setOpenSideMenu(true));
    }
  }, [screenSize, dispatch]);

  // Fetch notification counts on component mount and periodically
  useEffect(() => {
    if (user?.accountType === 'Admin' && token) {
      console.log('AdminSidebar: Fetching initial notification counts');
      fetchNotificationCounts();
      
      // Set up periodic refresh every 30 seconds
      const interval = setInterval(() => {
        console.log('AdminSidebar: Periodic notification count refresh');
        fetchNotificationCounts();
      }, 30000);
      
      return () => {
        console.log('AdminSidebar: Cleaning up notification interval');
        clearInterval(interval);
      };
    }
  }, [user, token]);

  // Debug notification counts changes
  useEffect(() => {
    console.log('AdminSidebar: Notification counts updated:', notificationCounts);
  }, [notificationCounts]);

  if (profileLoading || authLoading) {
    return (
      <motion.div 
        className="flex h-[calc(100vh-3.5rem)] min-w-[280px] items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 border-r border-slate-200/50 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border-3 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Modern Mobile Menu Toggle */}
      <div className="sm:hidden fixed top-20 left-4 z-[60]">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(setOpenSideMenu(!openSideMenu))}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 text-slate-700 hover:bg-white/90 transition-all duration-300 shadow-xl"
        >
          <AnimatePresence mode="wait">
            {openSideMenu ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiX size={20} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiMenu size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Modern Sidebar */}
      <AnimatePresence>
        {openSideMenu && (
          <>
            {/* Mobile Overlay */}
            {screenSize <= 640 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] sm:hidden"
                onClick={() => dispatch(setOpenSideMenu(false))}
              />
            )}
            
            <motion.div 
              variants={sidebarVariants}
              animate={isCollapsed ? "collapsed" : "open"}
              className="fixed sm:relative h-[100vh] flex flex-col bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-2xl transition-all duration-300 z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
                width: isCollapsed ? '60px' : '200px'
              }}
            >
              {/* Top Spacer */}
              <div className="h-20 sm:h-0 flex-shrink-0"></div>

              {/* Enhanced User Profile Section with Collapse Button */}
              <motion.div 
                className={`${isCollapsed ? 'p-3' : 'p-6'} border-b border-slate-200/50 transition-all duration-300 flex-shrink-0`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Collapse/Expand Button - Desktop Only */}
                {screenSize > 640 && (
                  <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-4`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(toggleSidebarCollapse())}
                      className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:shadow-lg transition-all duration-300 shadow-md"
                      title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      <motion.div
                        animate={{ rotate: isCollapsed ? 0 : 180 }}
                        transition={{ duration: 0.2, ease: "linear" }}
                      >
                        <MdKeyboardArrowLeft size={16} />
                      </motion.div>
                    </motion.button>
                  </div>
                )}
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
                  <div className="relative">
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      src={user?.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName} ${user?.lastName}`}
                      alt="Profile"
                      className={`${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'} rounded-2xl object-cover ring-3 ring-blue-500 ring-offset-2 transition-all duration-300`}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        className="flex-1 min-w-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="mb-1">
                          <h3 className="text-slate-800 font-bold text-sm truncate">
                            {user?.firstName} {user?.lastName}
                          </h3>
                        </div>
                        <div>
                          <div className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                            Admin
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Enhanced Navigation Links */}
              <div className="flex-1 overflow-hidden">
                <div className={`h-full ${isCollapsed ? 'px-2' : 'px-4'} py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300/50 hover:scrollbar-thumb-slate-400/50 scrollbar-thumb-rounded-full`}>
                  <nav className="space-y-6">
                    {sidebarSections.map((section, sectionIndex) => (
                      <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + sectionIndex * 0.05 }}
                      >
                        <AnimatePresence>
                          {!isCollapsed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mb-3"
                            >
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                                {section.title}
                              </h4>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="space-y-1">
                          {section.items.map((item, itemIndex) => (
                            <motion.button
                              key={item.id}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: 0.1 + sectionIndex * 0.05 + itemIndex * 0.02 }}
                              onClick={() => handleSectionClick(item.id)}
                              onMouseEnter={() => setHoveredItem(item.id)}
                              onMouseLeave={() => setHoveredItem(null)}
                              className={`w-full flex items-center ${
                                isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                              } rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                                activeTab === item.id
                                  ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100 hover:shadow-md'
                              }`}
                              title={isCollapsed ? item.label : item.description}
                            >
                              {/* Background Animation */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: hoveredItem === item.id ? '100%' : '-100%' }}
                                transition={{ duration: 0.6 }}
                              />
                              
                              <div className="relative flex items-center gap-3 w-full">
                                <div className={`relative flex items-center justify-center ${
                                  isCollapsed ? 'w-6 h-6' : 'w-8 h-8'
                                } rounded-xl ${
                                  activeTab === item.id 
                                    ? 'bg-white/20' 
                                    : 'bg-slate-100 group-hover:bg-white'
                                } transition-all duration-300`}>
                                  <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-600 group-hover:text-slate-800'}`}>
                                    {item.icon}
                                  </span>
                                  
                                  {/* Notification Badge */}
                                  {item.notificationKey && notificationCounts[item.notificationKey] > 0 && (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                                    >
                                      {notificationCounts[item.notificationKey] > 9 ? '9+' : notificationCounts[item.notificationKey]}
                                    </motion.div>
                                  )}
                                </div>
                                
                                <AnimatePresence>
                                  {!isCollapsed && (
                                    <motion.div 
                                      className="flex-1 text-left"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      transition={{ duration: 0.1 }}
                                    >
                                      <div className="font-semibold text-sm">{item.label}</div>
                                      <div className={`text-xs ${
                                        activeTab === item.id ? 'text-white/80' : 'text-slate-400'
                                      }`}>
                                        {item.description}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              
                              {/* Tooltip for collapsed state */}
                              {isCollapsed && (
                                <motion.div 
                                  className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-xl"
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: hoveredItem === item.id ? 1 : 0 }}
                                >
                                  <div className="font-medium">{item.label}</div>
                                  <div className="text-xs text-slate-300">{item.description}</div>
                                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </nav>

                  {/* Enhanced Logout Section */}
                  <motion.div 
                    className="mt-8 pt-6 border-t border-slate-200/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Are you sure?",
                          text2: "You will be logged out of your account.",
                          btn1Text: "Logout",
                          btn2Text: "Cancel",
                          btn1Handler: () => dispatch(logout(navigate)),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className={`w-full flex items-center ${
                        isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'
                      } text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 group`}
                      title={isCollapsed ? "Logout" : "Sign out of your account"}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-red-100 transition-all duration-300">
                        <MdLogout className="text-lg group-hover:text-red-500 transition-colors duration-300" />
                      </div>
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className="flex-1 text-left"
                          >
                            <div className="font-semibold text-sm">Logout</div>
                            <div className="text-xs text-slate-400">Sign out of your account</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>

                  {/* Enhanced Footer */}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.div 
                        className="mt-6 pt-4 border-t border-slate-200/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <FaGem className="text-blue-500 w-4 h-4" />
                            <span className="text-sm font-bold text-blue-600">
                              Beeja Admin
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            © 2024 Beeja Innovation Ventures
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} closeModal={() => setConfirmationModal(null)} />}
    </>
  );
};

export default AdminSidebar;
