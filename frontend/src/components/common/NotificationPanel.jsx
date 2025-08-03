import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { BsCheckAll } from 'react-icons/bs';
import { FiBell } from 'react-icons/fi';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../services/operations/notificationAPI';

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await getNotifications(token);
      if (response.success) {
        const notificationsList = response.data?.notifications || [];
        // Show all notifications but mark read status properly
        setNotifications(notificationsList);
        // Count unread notifications properly - check both read and isRead for compatibility
        const unreadCount = notificationsList.filter((n) => !n.read && !n.isRead).length;
        setUnreadCount(response.data?.unreadCount || unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await markNotificationAsRead(notificationId, token);
      if (response.success) {
        // Update the notification in the list to mark it as read
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification._id === notificationId
              ? { ...notification, isRead: true, read: true }
              : notification
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
        // Refresh notifications from backend to ensure sync
        setTimeout(() => fetchNotifications(), 500);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllNotificationsAsRead(token);
      if (response.success) {
        // Mark all notifications as read in the state
        setNotifications(prevNotifications =>
          prevNotifications.map(notification => ({
            ...notification,
            isRead: true,
            read: true
          }))
        );
        setUnreadCount(0);
        // Refresh notifications from backend to ensure sync
        setTimeout(() => fetchNotifications(), 500);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Filter notifications to show only unread ones in the panel
  const unreadNotifications = notifications.filter((n) => !n.read && !n.isRead);

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-2 rounded-lg hover:bg-academic-slate-50 transition-colors duration-200 group"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        title="Notifications"
      >
        <div className="relative">
          <FiBell className="w-5 h-5 text-academic-slate-700 group-hover:text-academic-navy-700 transition-all duration-300" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold text-[10px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="absolute right-0 mt-2 w-[320px] sm:w-[380px] lg:w-[420px] max-h-[85vh] overflow-hidden bg-white rounded-xl shadow-elegant border-2 border-academic-slate-200 z-50"
          >
            {/* Panel Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-academic-navy-900 to-academic-navy-800 p-4 border-b border-academic-slate-200 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white font-playfair">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2.5 py-1 bg-academic-gold-500/20 text-academic-gold-300 text-xs font-bold rounded-full border border-academic-gold-500/30">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleMarkAllAsRead}
                    className="p-2 text-academic-slate-200 hover:text-academic-gold-300 rounded-lg hover:bg-academic-gold-500/10 transition-all duration-200"
                    title="Mark all as read"
                  >
                    <BsCheckAll className="w-5 h-5" />
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-academic-slate-200 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                  title="Close"
                >
                  <IoClose className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[calc(85vh-80px)] scrollbar-thin scrollbar-thumb-academic-slate-300 scrollbar-track-transparent">
              {unreadNotifications.length > 0 ? (
                <ul className="divide-y divide-academic-slate-200">
                  {unreadNotifications.map((notification) => (
                    <motion.li
                      key={notification._id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="group relative bg-academic-gold-50 hover:bg-academic-gold-100 transition-all duration-300"
                    >
                      <div 
                        className="p-3 sm:p-4 cursor-pointer transition-all duration-200"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <div className="relative flex-shrink-0">
                            {notification.relatedCourse?.thumbnail ? (
                              <img
                                src={notification.relatedCourse.thumbnail}
                                alt="Course thumbnail"
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-academic-slate-200 group-hover:border-academic-gold-300 transition-all duration-300 shadow-classic"
                              />
                            ) : (
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-academic-navy-100 flex items-center justify-center border border-academic-navy-200">
                                <FiBell className="w-4 h-4 sm:w-5 sm:h-5 text-academic-navy-600" />
                              </div>
                            )}
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-academic-gold-500 rounded-full border-2 border-white animate-pulse"></div>
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm sm:text-[15px] font-bold text-academic-navy-900 break-all word-break-break-all overflow-hidden max-w-full flex-1">
                                {notification.title}
                              </h4>
                              <span className="text-xs text-academic-slate-600 whitespace-nowrap flex-shrink-0">
                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs sm:text-[13.5px] text-academic-slate-700 mt-1 leading-relaxed break-all word-break-break-all overflow-hidden max-w-full">
                              {notification.message}
                            </p>
                            <div className="flex items-center mt-2 space-x-2 sm:space-x-3">
                              <span className="text-xs text-academic-slate-500">
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                              {notification.relatedCourse?.name && (
                                <span className="text-xs px-2 sm:px-2.5 py-1 bg-academic-navy-100 text-academic-navy-700 rounded-full border border-academic-navy-200 break-all word-break-break-all overflow-hidden max-w-[120px] sm:max-w-[200px]">
                                  {notification.relatedCourse.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto w-16 h-16 bg-academic-navy-100 rounded-full flex items-center justify-center mb-4">
                    <FiBell className="w-7 h-7 text-academic-navy-600" />
                  </div>
                  <h4 className="text-academic-navy-900 font-bold text-lg mb-1 font-playfair">No unread notifications</h4>
                  <p className="text-academic-slate-600 text-sm">All caught up! New notifications will appear here</p>
                </motion.div>
              )}
            </div>

            {/* Panel Footer */}
            {unreadNotifications.length > 0 && (
              <div className="sticky bottom-0 bg-gradient-to-t from-white via-white/95 to-transparent p-4 border-t border-academic-slate-200 text-center">
                <button 
                  className="px-5 py-2 text-sm font-bold text-academic-gold-700 hover:text-academic-gold-800 transition-colors duration-200 rounded-lg hover:bg-academic-gold-100"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
