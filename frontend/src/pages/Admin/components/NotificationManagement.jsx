import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiBell, 
  FiSend, 
  FiUsers, 
  FiUser, 
  FiTrash2, 
  FiEdit3, 
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiEye,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { BsCheckAll, BsPeople, BsPersonCheck } from 'react-icons/bs';
import { IoClose, IoSparkles } from 'react-icons/io5';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { 
  sendNotification, 
  getAllNotifications, 
  deleteNotificationAdmin, 
  getAllUsers,
  formatRecipientType,
  getPriorityColor 
} from '../../../services/operations/adminNotificationAPI';
import toast from 'react-hot-toast';

const NotificationManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    recipients: 'all',
    selectedUsers: [],
    relatedCourse: '',
    priority: 'medium'
  });

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getAllNotifications(token);
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers(token);
      if (response.success) {
        setUsers(response.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelection = (userId) => {
    setFormData(prev => ({
      ...prev,
      selectedUsers: prev.selectedUsers.includes(userId)
        ? prev.selectedUsers.filter(id => id !== userId)
        : [...prev.selectedUsers, userId]
    }));
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.recipients === 'specific' && formData.selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setLoading(true);
      const notificationData = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        recipients: formData.recipients,
        selectedUsers: formData.recipients === 'specific' ? formData.selectedUsers : undefined,
        relatedCourse: formData.relatedCourse || undefined,
        priority: formData.priority
      };

      const response = await sendNotification(notificationData, token);
      
      if (response.success) {
        setFormData({
          title: '',
          message: '',
          recipients: 'all',
          selectedUsers: [],
          relatedCourse: '',
          priority: 'medium'
        });
        setShowCreateForm(false);
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notification) => {
    const displayText = notification.recipientCount > 1 
      ? `this notification group (${notification.recipientCount} recipients)` 
      : 'this notification';
    
    if (!window.confirm(`Are you sure you want to delete ${displayText}?`)) {
      return;
    }

    try {
      const deleteId = notification.bulkId || notification.displayId || notification._id;
      const response = await deleteNotificationAdmin(deleteId, token);
      if (response.success) {
        const deletedCount = response.deletedCount || 1;
        toast.success(`${deletedCount} notification${deletedCount > 1 ? 's' : ''} deleted successfully`);
        fetchNotifications();
      } else if (response.notFound) {
        toast.success('Notification was already deleted');
        fetchNotifications();
      } else {
        toast.error(response.error || 'Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getRecipientText = (notification) => {
    if (notification.recipients === 'all' || notification.recipientType === 'All') return 'All Users';
    if (notification.recipients === 'students' || notification.recipientType === 'Student') return 'All Students';
    if (notification.recipients === 'instructors' || notification.recipientType === 'Instructor') return 'All Instructors';
    if (notification.recipients === 'admins' || notification.recipientType === 'Admin') return 'All Administrators';
    if (notification.recipients === 'specific' || notification.recipientType === 'Specific') {
      return `${notification.recipientCount || 0} Selected Users`;
    }
    return formatRecipientType(notification.recipients || notification.recipientType);
  };

  const getRecipientIcon = (recipients) => {
    const type = String(recipients || 'unknown');
    switch (type.toLowerCase()) {
      case 'all': return <BsPeople className="w-4 h-4" />;
      case 'student':
      case 'students': return <HiOutlineAcademicCap className="w-4 h-4" />;
      case 'instructor':
      case 'instructors': return <BsPersonCheck className="w-4 h-4" />;
      case 'admin':
      case 'admins': return <FiUser className="w-4 h-4" />;
      case 'specific': return <FiUsers className="w-4 h-4" />;
      default: return <FiUsers className="w-4 h-4" />;
    }
  };

  const getLocalPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      const recipientType = notification.recipients || notification.recipientType || '';
      const matchesFilter = filterType === 'all' || recipientType.toLowerCase() === filterType.toLowerCase();
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title': return a.title.localeCompare(b.title);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const getNotificationStats = () => {
    const total = notifications.length;
    const byType = {
      all: notifications.filter(n => (n.recipients === 'all' || n.recipientType === 'All')).length,
      students: notifications.filter(n => (n.recipients === 'students' || n.recipientType === 'Student')).length,
      instructors: notifications.filter(n => (n.recipients === 'instructors' || n.recipientType === 'Instructor')).length,
      admins: notifications.filter(n => (n.recipients === 'admins' || n.recipientType === 'Admin')).length,
      specific: notifications.filter(n => (n.recipients === 'specific' || n.recipientType === 'Specific')).length,
    };
    return { total, byType };
  };

  const stats = getNotificationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-academic-navy-100 rounded-xl flex items-center justify-center shadow-classic">
              <FiBell className="w-8 h-8 text-academic-navy-700" />
            </div>
            <div>
              <h1 className="classic-heading text-3xl md:text-4xl mb-2 flex items-center gap-3">
                Notification Center
                <IoSparkles className="w-6 h-6 text-academic-gold-600" />
              </h1>
              <p className="section-subtitle text-lg">Manage and send notifications to your academic community</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={fetchNotifications}
              className="btn-classic-secondary flex items-center justify-center gap-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-elegant flex items-center justify-center gap-2"
            >
              <FiSend className="w-4 h-4" />
              Create Notification
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="classic-card p-6 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FiBell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-academic-navy-900 mb-1">{stats.total}</div>
            <div className="text-sm text-academic-slate-600 font-medium">Total Sent</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="classic-card p-6 text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <HiOutlineAcademicCap className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-academic-navy-900 mb-1">{stats.byType.students}</div>
            <div className="text-sm text-academic-slate-600 font-medium">To Students</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="classic-card p-6 text-center"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BsPersonCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-academic-navy-900 mb-1">{stats.byType.instructors}</div>
            <div className="text-sm text-academic-slate-600 font-medium">To Instructors</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="classic-card p-6 text-center"
          >
            <div className="w-12 h-12 bg-academic-gold-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <BsPeople className="w-6 h-6 text-academic-gold-700" />
            </div>
            <div className="text-2xl font-bold text-academic-navy-900 mb-1">{stats.byType.all}</div>
            <div className="text-sm text-academic-slate-600 font-medium">Broadcast</div>
          </motion.div>
        </div>

        {/* Search and Filter Bar */}
        <div className="classic-card p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input pl-12"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="classic-input"
              >
                <option value="all">All Recipients</option>
                <option value="student">Students Only</option>
                <option value="instructor">Instructors Only</option>
                <option value="admin">Administrators Only</option>
                <option value="specific">Specific Users</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="classic-input"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Create Notification Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-elegant"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="elegant-heading">Send New Notification</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="p-2 text-academic-slate-500 hover:text-academic-slate-700 rounded-lg hover:bg-academic-slate-100 transition-colors"
                  >
                    <IoClose className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSendNotification} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="lg:col-span-2">
                      <label className="classic-label">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter notification title"
                        className="classic-input"
                        required
                      />
                    </div>

                    {/* Recipients */}
                    <div>
                      <label className="classic-label">
                        Recipients
                      </label>
                      <select
                        name="recipients"
                        value={formData.recipients}
                        onChange={handleInputChange}
                        className="classic-input"
                      >
                        <option value="all">🌐 All Users</option>
                        <option value="students">🎓 All Students</option>
                        <option value="instructors">👨‍🏫 All Instructors</option>
                        <option value="admins">👑 All Administrators</option>
                        <option value="specific">👥 Specific Users</option>
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="classic-label">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="classic-input"
                      >
                        <option value="low">🟢 Low Priority</option>
                        <option value="medium">🟡 Medium Priority</option>
                        <option value="high">🔴 High Priority</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="classic-label">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Enter notification message..."
                      rows={4}
                      className="classic-textarea"
                      required
                    />
                    <div className="mt-2 text-sm text-academic-slate-500">
                      {formData.message.length}/500 characters
                    </div>
                  </div>

                  {/* User Selection */}
                  {formData.recipients === 'specific' && (
                    <div>
                      <label className="classic-label mb-3">
                        Select Users ({formData.selectedUsers.length} selected)
                      </label>
                      <div className="max-h-64 overflow-y-auto bg-academic-cream-50 rounded-xl border border-academic-cream-200">
                        <div className="p-4 border-b border-academic-cream-200 bg-academic-slate-50">
                          <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-academic-slate-700 font-medium">Select recipients</span>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, selectedUsers: users.map(u => u._id) }))}
                                  className="text-xs px-3 py-1 bg-academic-navy-600 text-white rounded-lg hover:bg-academic-navy-700 transition-colors font-medium"
                                >
                                  Select All
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, selectedUsers: [] }))}
                                  className="text-xs px-3 py-1 bg-academic-slate-400 text-white rounded-lg hover:bg-academic-slate-500 transition-colors font-medium"
                                >
                                  Clear All
                                </button>
                              </div>
                            </div>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search users by email..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                className="classic-input pr-10"
                              />
                              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400" />
                            </div>
                          </div>
                        </div>
                        {users
                          .filter(user => {
                            if (userSearchTerm === '') return true;
                            const searchLower = userSearchTerm.toLowerCase();
                            const emailMatch = user.email.toLowerCase().includes(searchLower);
                            const nameMatch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower);
                            return emailMatch || nameMatch;
                          })
                          .map((user) => (
                          <motion.label
                            key={user._id}
                            whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
                            className="flex items-center p-4 cursor-pointer border-b border-academic-cream-200 last:border-b-0 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={formData.selectedUsers.includes(user._id)}
                              onChange={() => handleUserSelection(user._id)}
                              className="mr-4 w-4 h-4 text-academic-navy-600 bg-white border-academic-slate-300 rounded focus:ring-academic-navy-500 focus:ring-2"
                            />
                            <div className="flex items-center gap-3 flex-1">
                              <div className="relative">
                                <img
                                  src={user.image || `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-10 h-10 rounded-full border-2 border-academic-slate-200"
                                />
                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                  user.accountType === 'Student' ? 'bg-green-500' : 
                                  user.accountType === 'Instructor' ? 'bg-blue-500' : 'bg-purple-500'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <p className="text-academic-navy-900 text-sm font-semibold">
                                  {user.firstName} {user.lastName}
                                </p>
                                <div className="flex items-center gap-2">
                                  <p className="text-academic-slate-600 text-xs">{user.email}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    user.accountType === 'Student' ? 'bg-green-100 text-green-700' :
                                    user.accountType === 'Instructor' ? 'bg-blue-100 text-blue-700' :
                                    'bg-purple-100 text-purple-700'
                                  }`}>
                                    {user.accountType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  {(formData.title || formData.message) && (
                    <div className="bg-academic-cream-50 rounded-xl p-6 border border-academic-cream-200">
                      <h4 className="classic-label mb-3">Preview</h4>
                      <div className="bg-white rounded-lg p-4 border border-academic-slate-200 shadow-classic">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-academic-navy-100 rounded-lg flex items-center justify-center">
                            <FiBell className="w-5 h-5 text-academic-navy-700" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-academic-navy-900 font-bold mb-1">{formData.title || 'Notification Title'}</h5>
                            <p className="text-academic-slate-700 text-sm mb-3">{formData.message || 'Notification message will appear here...'}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getLocalPriorityColor(formData.priority)}`}>
                                {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                              </span>
                              <span className="text-xs text-academic-slate-500 font-medium">
                                {getRecipientText({ recipients: formData.recipients, recipientCount: formData.selectedUsers.length })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t border-academic-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="btn-classic-secondary flex-1 flex items-center justify-center gap-2"
                    >
                      <IoClose className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-elegant flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          Send Notification
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications List */}
        <div className="classic-card overflow-hidden">
          <div className="p-6 border-b border-academic-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="elegant-heading flex items-center gap-2">
                  <FiEye className="w-5 h-5" />
                  Recent Notifications
                </h3>
                <p className="text-academic-slate-600 text-sm mt-1">
                  {filteredNotifications.length} of {notifications.length} notifications
                </p>
              </div>
              {filteredNotifications.length > 0 && (
                <div className="text-xs text-academic-slate-500 font-medium">
                  Showing {sortBy === 'newest' ? 'newest' : sortBy === 'oldest' ? 'oldest' : 'alphabetical'} first
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-academic-slate-600 text-lg font-medium">Loading notifications...</p>
              <p className="text-academic-slate-500 text-sm mt-2">Please wait while we fetch your data</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FiBell className="w-10 h-10 text-academic-slate-400" />
              </div>
              <h4 className="elegant-heading mb-3">
                {searchTerm || filterType !== 'all' ? 'No matching notifications' : 'No notifications sent yet'}
              </h4>
              <p className="text-academic-slate-600 mb-6">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Start by creating your first notification to engage with your community'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-elegant flex items-center gap-2 mx-auto"
                >
                  <FiSend className="w-4 h-4" />
                  Create First Notification
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-academic-slate-200">
              {filteredNotifications
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-academic-slate-50 transition-all duration-200 group"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-academic-navy-100 rounded-lg flex items-center justify-center">
                          {getRecipientIcon(notification.recipients)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg text-academic-navy-900 font-bold mb-2 group-hover:text-academic-navy-700 transition-colors font-playfair">
                            {notification.title}
                          </h4>
                          <p className="text-academic-slate-700 mb-4 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-2 text-academic-slate-600 bg-academic-slate-100 px-3 py-1 rounded-lg font-medium">
                          {getRecipientIcon(notification.recipients)}
                          {getRecipientText(notification)}
                        </span>
                        
                        <span className="flex items-center gap-2 text-academic-slate-600 bg-academic-slate-100 px-3 py-1 rounded-lg font-medium">
                          <FiClock className="w-4 h-4" />
                          {new Date(notification.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })} at {new Date(notification.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        
                        {notification.priority && notification.priority !== 'medium' && (
                          <span className={`text-xs px-3 py-1 rounded-lg border font-medium ${getLocalPriorityColor(notification.priority)}`}>
                            {notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)} Priority
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteNotification(notification)}
                        className="p-2 text-academic-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                        title={`Delete ${notification.recipientCount > 1 ? 'notification group' : 'notification'}`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredNotifications.length > itemsPerPage && (
            <div className="p-6 border-t border-academic-slate-200">
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    currentPage === 1
                      ? 'bg-academic-slate-100 text-academic-slate-400 cursor-not-allowed'
                      : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                  }`}
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {[...Array(Math.ceil(filteredNotifications.length / itemsPerPage))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition-all font-medium ${
                        currentPage === i + 1
                          ? 'bg-academic-navy-700 text-white shadow-classic'
                          : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredNotifications.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredNotifications.length / itemsPerPage)}
                  className={`px-4 py-2 rounded-lg transition-all font-medium ${
                    currentPage === Math.ceil(filteredNotifications.length / itemsPerPage)
                      ? 'bg-academic-slate-100 text-academic-slate-400 cursor-not-allowed'
                      : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredNotifications.length > 0 && (
          <div className="text-center text-academic-slate-600 text-sm">
            <p>
              Showing {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
              {filterType !== 'all' && ` for ${filterType}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationManagement;
