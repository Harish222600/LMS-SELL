import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { BsChatDots, BsSearch, BsFilter } from 'react-icons/bs';
import { IoPersonCircle, IoTime } from 'react-icons/io5';
import { getInstructorChats, getChatDetails } from '../../services/operations/chatAPI';
import ChatWindow from '../../components/core/Chat/ChatWindow';
import { formatDistanceToNow } from 'date-fns';

const InstructorChats = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalChats: 0
  });

  // Get unique courses for filter
  const uniqueCourses = [...new Set(chats.map(chat => chat.course?.courseName))].filter(Boolean);

  useEffect(() => {
    if (token && user?.accountType === 'Instructor') {
      loadChats();
    }
  }, [token, user]);

  useEffect(() => {
    filterChats();
  }, [chats, searchTerm, filterCourse]);

  const loadChats = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getInstructorChats(token, page, 10);
      if (response?.chats) {
        setChats(response.chats);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalChats: response.totalChats
        });
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
        chat.course?.courseName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCourse) {
      filtered = filtered.filter(chat => chat.course?.courseName === filterCourse);
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
    // Refresh chats to update unread counts
    loadChats(pagination.currentPage);
  };

  const formatLastMessageTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'Recently';
    }
  };

  if (user?.accountType !== 'Instructor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="classic-card p-8 text-center">
          <p className="text-academic-slate-600">Access denied. This page is for instructors only.</p>
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
            <h1 className="classic-heading text-3xl md:text-4xl mb-2">My Chats</h1>
            <p className="section-subtitle text-lg">
              Manage conversations with your students
            </p>
          </div>
          <div className="flex items-center gap-3 bg-academic-navy-100 px-4 py-3 rounded-xl">
            <div className="w-10 h-10 bg-academic-navy-600 rounded-lg flex items-center justify-center">
              <BsChatDots className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-academic-slate-600">Total Conversations</p>
              <p className="text-xl font-bold text-academic-navy-900">{pagination.totalChats}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="classic-card p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by student name or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="classic-input pl-12"
              />
            </div>
            <div className="relative">
              <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="classic-input pl-12 min-w-[200px]"
              >
                <option value="">All Courses</option>
                {uniqueCourses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </div>
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
                  ? "You don't have any student conversations yet. Students can start chats from their course pages."
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
                  className="p-6 hover:bg-academic-cream-50 cursor-pointer transition-colors"
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
                          <h3 className="font-bold text-academic-navy-900 font-playfair text-lg mb-1">
                            {chat.student?.firstName} {chat.student?.lastName}
                          </h3>
                          <p className="text-academic-slate-600 font-medium mb-3">
                            {chat.course?.courseName}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <div className="flex items-center gap-2 text-sm text-academic-slate-500 bg-academic-slate-50 px-3 py-1 rounded-full">
                            <IoTime size={14} />
                            {formatLastMessageTime(chat.lastMessageTime)}
                          </div>
                          {chat.unreadByInstructor > 0 && (
                            <div className="bg-academic-gold-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-classic">
                              {chat.unreadByInstructor} new
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
      </div>
    </div>
  );
};

export default InstructorChats;
