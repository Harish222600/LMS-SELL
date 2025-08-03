import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  BsChatDots, 
  BsSearch, 
  BsFilter, 
  BsArchive, 
  BsFlag, 
  BsTrash,
  BsEye,
  BsThreeDotsVertical 
} from 'react-icons/bs';
import { IoPersonCircle, IoTime, IoWarning } from 'react-icons/io5';
import { 
  getAllChats, 
  getChatDetails, 
  archiveChat, 
  unarchiveChat,
  flagChat, 
  unflagChat,
  deleteChat 
} from '../../services/operations/chatAPI';
import ChatWindow from '../../components/core/Chat/ChatWindow';
import { formatDistanceToNow } from 'date-fns';

const AdminChats = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalChats: 0
  });

  // Get unique courses and instructors for filters
  const uniqueCourses = [...new Set(chats.map(chat => chat.course?.courseName))].filter(Boolean);
  const uniqueInstructors = [...new Set(chats.map(chat => 
    `${chat.instructor?.firstName} ${chat.instructor?.lastName}`
  ))].filter(Boolean);

  useEffect(() => {
    if (token && user?.accountType === 'Admin') {
      loadChats();
    }
  }, [token, user, statusFilter]);

  useEffect(() => {
    filterChats();
  }, [chats, searchTerm, filterCourse, filterInstructor]);

  const [allChats, setAllChats] = useState([]);

  const loadChats = async (page = 1) => {
    setIsLoading(true);
    try {
      // Get filtered chats based on status
      const filters = {
        page,
        limit: 10,
        status: statusFilter
      };
      
      const response = await getAllChats(token, filters);
      
      // Get all chats for accurate counts
      const allChatsResponse = await getAllChats(token, { status: 'all' });
      
      if (response?.chats) {
        setChats(response.chats);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalChats: response.totalChats
        });
      }

      if (allChatsResponse?.chats) {
        setAllChats(allChatsResponse.chats);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterChats = () => {
    let filtered = chats;

    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.instructor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.instructor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.course?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCourse) {
      filtered = filtered.filter(chat => chat.course?.courseName === filterCourse);
    }

    if (filterInstructor) {
      filtered = filtered.filter(chat => 
        `${chat.instructor?.firstName} ${chat.instructor?.lastName}` === filterInstructor
      );
    }

    setFilteredChats(filtered);
  };

  const handleChatSelect = async (chat) => {
    try {
      const chatDetails = await getChatDetails(chat._id, token);
      if (chatDetails) {
        setSelectedChat(chatDetails);
      }
    } catch (error) {
      console.error('Error loading chat details:', error);
      toast.error('Failed to load chat details');
    }
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    loadChats(pagination.currentPage);
  };

  const handleArchiveChat = async (chatId) => {
    const success = await archiveChat(chatId, token);
    if (success) {
      loadChats(pagination.currentPage);
    }
    setShowActionMenu(null);
  };

  const handleFlagChat = async (chatId) => {
    const reason = prompt('Enter reason for flagging this chat:');
    if (reason) {
      const success = await flagChat(chatId, reason, token);
      if (success) {
        loadChats(pagination.currentPage);
      }
    }
    setShowActionMenu(null);
  };

  const handleUnarchiveChat = async (chatId) => {
    const success = await unarchiveChat(chatId, token);
    if (success) {
      loadChats(pagination.currentPage);
    }
    setShowActionMenu(null);
  };

  const handleUnflagChat = async (chatId) => {
    const success = await unflagChat(chatId, token);
    if (success) {
      loadChats(pagination.currentPage);
    }
    setShowActionMenu(null);
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      const success = await deleteChat(chatId, token);
      if (success) {
        loadChats(pagination.currentPage);
      }
    }
    setShowActionMenu(null);
  };

  const formatLastMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  const getStatusBadge = (chat) => {
    if (chat.isFlagged) {
      return (
        <div className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
          <IoWarning size={12} />
          Flagged
        </div>
      );
    }
    if (chat.isArchived) {
      return (
        <div className="bg-academic-slate-100 text-academic-slate-700 px-3 py-1 rounded-full text-xs font-medium">
          Archived
        </div>
      );
    }
    return (
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
        Active
      </div>
    );
  };

  if (user?.accountType !== 'Admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="classic-card p-8 text-center">
          <p className="text-academic-slate-600">Access denied. This page is for administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="classic-heading text-3xl md:text-4xl mb-2">Manage Chats</h1>
            <p className="section-subtitle text-lg">
              Monitor and moderate all student-instructor conversations
            </p>
          </div>
          <div className="flex items-center gap-3 bg-academic-navy-100 px-4 py-3 rounded-xl">
            <div className="w-10 h-10 bg-academic-navy-600 rounded-lg flex items-center justify-center">
              <BsChatDots className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-academic-slate-600">Total Conversations</p>
              <p className="text-xl font-bold text-academic-navy-900">{allChats.length}</p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="classic-card p-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'active', label: 'Active', count: allChats.filter(c => !c.isArchived && !c.isFlagged).length },
              { key: 'flagged', label: 'Flagged', count: allChats.filter(c => c.isFlagged).length },
              { key: 'archived', label: 'Archived', count: allChats.filter(c => c.isArchived).length },
              { key: 'all', label: 'All', count: allChats.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  statusFilter === tab.key
                    ? 'bg-academic-navy-700 text-white shadow-classic'
                    : 'bg-academic-slate-100 text-academic-slate-700 hover:bg-academic-slate-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="classic-card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input pl-12"
              />
            </div>
            
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="classic-input"
            >
              <option value="">All Courses</option>
              {uniqueCourses.map((course, index) => (
                <option key={index} value={course}>{course}</option>
              ))}
            </select>

            <select
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
              className="classic-input"
            >
              <option value="">All Instructors</option>
              {uniqueInstructors.map((instructor, index) => (
                <option key={index} value={instructor}>{instructor}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat List */}
        <div className="classic-card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin"></div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <BsChatDots className="w-10 h-10 text-academic-slate-400" />
              </div>
              <h3 className="elegant-heading mb-3">No chats found</h3>
              <p className="text-academic-slate-600 max-w-md">
                {chats.length === 0 
                  ? "No conversations match the current filter criteria."
                  : "No chats match your current search or filter criteria."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-academic-slate-200">
              {filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => handleChatSelect(chat)}
                  className="p-6 hover:bg-academic-cream-50 transition-colors relative cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Student Avatar */}
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-academic-slate-100 flex items-center justify-center flex-shrink-0 border-2 border-academic-slate-200">
                      {chat.student?.image ? (
                        <img
                          src={chat.student.image}
                          alt={`${chat.student.firstName} ${chat.student.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <IoPersonCircle size={48} className="text-academic-slate-400" />
                      )}
                    </div>

                    {/* Chat Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-academic-navy-900 font-playfair">
                              {chat.student?.firstName} {chat.student?.lastName}
                            </h3>
                            <span className="text-academic-slate-400">↔</span>
                            <span className="font-semibold text-academic-slate-700">
                              {chat.instructor?.firstName} {chat.instructor?.lastName}
                            </span>
                          </div>
                          <p className="text-academic-slate-600 font-medium mb-3">
                            {chat.course?.courseName}
                          </p>
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusBadge(chat)}
                            <div className="flex items-center gap-2 text-sm text-academic-slate-500 bg-academic-slate-50 px-3 py-1 rounded-full">
                              <IoTime size={14} />
                              {formatLastMessageTime(chat.lastMessageTime)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActionMenu(showActionMenu === chat._id ? null : chat._id);
                            }}
                            className="p-2 text-academic-slate-400 hover:text-academic-slate-700 hover:bg-academic-slate-100 rounded-lg transition-colors"
                          >
                            <BsThreeDotsVertical size={16} />
                          </button>
                          
                          {showActionMenu === chat._id && (
                            <div className="absolute right-0 top-full mt-2 bg-white border border-academic-slate-200 rounded-xl shadow-elegant z-10 min-w-[160px] overflow-hidden">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleChatSelect(chat);
                                  setShowActionMenu(null);
                                }}
                                className="w-full px-4 py-3 text-left text-academic-navy-900 hover:bg-academic-cream-50 flex items-center gap-3 font-medium"
                              >
                                <BsEye size={16} />
                                View Chat
                              </button>
                              {chat.isArchived ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnarchiveChat(chat._id);
                                  }}
                                  className="w-full px-4 py-3 text-left text-academic-navy-900 hover:bg-academic-cream-50 flex items-center gap-3 font-medium"
                                >
                                  <BsArchive size={16} />
                                  Unarchive
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleArchiveChat(chat._id);
                                  }}
                                  className="w-full px-4 py-3 text-left text-academic-navy-900 hover:bg-academic-cream-50 flex items-center gap-3 font-medium"
                                >
                                  <BsArchive size={16} />
                                  Archive
                                </button>
                              )}
                              {chat.isFlagged ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUnflagChat(chat._id);
                                  }}
                                  className="w-full px-4 py-3 text-left text-orange-700 hover:bg-orange-50 flex items-center gap-3 font-medium"
                                >
                                  <BsFlag size={16} />
                                  Remove Flag
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFlagChat(chat._id);
                                  }}
                                  className="w-full px-4 py-3 text-left text-orange-700 hover:bg-orange-50 flex items-center gap-3 font-medium"
                                >
                                  <BsFlag size={16} />
                                  Flag
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteChat(chat._id);
                                }}
                                className="w-full px-4 py-3 text-left text-red-700 hover:bg-red-50 flex items-center gap-3 font-medium"
                              >
                                <BsTrash size={16} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Last Message Preview */}
                      {chat.lastMessage && (
                        <div className="mt-3 p-3 bg-academic-slate-50 rounded-lg border border-academic-slate-200">
                          <p className="text-sm text-academic-slate-700">
                            <span className="font-medium">Last message:</span>{' '}
                            {chat.lastMessage.messageType === 'image' ? '📷 Image' : chat.lastMessage.content}
                          </p>
                        </div>
                      )}

                      {/* Flag Reason */}
                      {chat.isFlagged && chat.flagReason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-800">
                            <span className="font-bold">Flag Reason:</span> {chat.flagReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="classic-card p-6">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => loadChats(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-academic-slate-100 border border-academic-slate-300 text-academic-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-academic-slate-200 transition-colors font-medium"
              >
                Previous
              </button>
              <span className="text-academic-slate-600 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => loadChats(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 bg-academic-slate-100 border border-academic-slate-300 text-academic-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-academic-slate-200 transition-colors font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Chat Window Modal */}
        {selectedChat && (
          <ChatWindow
            chat={selectedChat}
            onClose={handleCloseChat}
            courseName={selectedChat.course?.courseName}
          />
        )}

        {/* Click outside to close action menu */}
        {showActionMenu && (
          <div 
            className="fixed inset-0 z-5" 
            onClick={() => setShowActionMenu(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminChats;
