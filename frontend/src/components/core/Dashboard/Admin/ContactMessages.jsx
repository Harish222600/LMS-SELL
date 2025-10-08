import React, { useEffect, useState } from 'react'
import { FaRegEnvelope, FaRegEnvelopeOpen, FaSync, FaSearch, FaEnvelope, FaEnvelopeOpen, FaClock, FaFilter } from 'react-icons/fa'
import { FiX, FiMail, FiPhone, FiCalendar } from 'react-icons/fi'
import { MdDelete, MdEmail, MdPhone, MdAccessTime } from 'react-icons/md'
import { HiOutlineMailOpen, HiOutlineMail } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

import { apiConnector } from '../../../../services/apiConnector'
import { contactMessageEndpoints } from '../../../../services/apis'
import { formatDate } from '../../../../services/formatDate'

export default function ContactMessages() {
  const { token } = useSelector((state) => state.auth)
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await apiConnector(
        'GET',
        contactMessageEndpoints.GET_ALL_MESSAGES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      if (response.data.success) {
        setMessages(response.data.data)
      }
    } catch (error) {
      console.log('Error fetching messages:', error)
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await apiConnector(
        'GET',
        contactMessageEndpoints.GET_MESSAGE_STATS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      )
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.log('Error fetching stats:', error)
    }
  }

  const handleMarkAsRead = async (messageId) => {
    try {
      const url = contactMessageEndpoints.MARK_MESSAGE_READ_API.replace(':messageId', messageId);
      console.log('Marking message as read:', { messageId, url });
      
      const response = await apiConnector(
        'PATCH',
        url,
        undefined,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      )
      
      console.log('Mark as read response:', response);
      
      if (response.data.success) {
        toast.success('Message marked as read')
        await fetchMessages()
        await fetchStats()
      } else {
        toast.error(response.data.message || 'Failed to mark message as read')
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 404) {
        toast.error('Message not found')
      } else if (error.response?.status === 400) {
        toast.error('Invalid request. Please try again.')
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action')
      } else if (!navigator.onLine) {
        toast.error('No internet connection')
      } else {
        toast.error('Failed to mark message as read. Please try again.')
      }
    }
  }

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }
    
    try {
      const url = contactMessageEndpoints.DELETE_MESSAGE_API.replace(':messageId', messageId);
      console.log('Deleting message:', { messageId, url });
      
      const response = await apiConnector(
        'DELETE',
        url,
        undefined,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      )
      
      console.log('Delete response:', response);
      
      if (response.data.success) {
        toast.success('Message deleted successfully')
        await fetchMessages()
        await fetchStats()
      } else {
        toast.error(response.data.message || 'Failed to delete message')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 404) {
        toast.error('Message not found')
      } else if (error.response?.status === 400) {
        toast.error('Invalid request. Please try again.')
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action')
      } else if (!navigator.onLine) {
        toast.error('No internet connection')
      } else {
        toast.error('Failed to delete message. Please try again.')
      }
    }
  }

  const handleRefresh = () => {
    fetchMessages()
    fetchStats()
  }

  // Filter messages based on search term and status
  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchTerm === "" || 
      `${message.firstname} ${message.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.phoneNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "read" && message.status === "read") ||
      (statusFilter === "unread" && message.status === "unread");
    
    return matchesSearch && matchesStatus;
  });

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaEnvelope className="text-orange-500" />
              Contact Messages
            </h1>
            <p className="text-gray-600 mt-2">View contact form submissions</p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 font-semibold text-white hover:bg-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Messages */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <HiOutlineMail className="text-3xl text-white opacity-80" />
                  <span className="text-sm font-medium text-teal-100">Total</span>
                </div>
                <h3 className="text-sm font-medium text-teal-100 mb-1">Total Messages</h3>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </div>

            {/* Unread Messages */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FaEnvelope className="text-3xl text-white opacity-80" />
                  <span className="text-sm font-medium text-orange-100">New</span>
                </div>
                <h3 className="text-sm font-medium text-orange-100 mb-1">Unread Messages</h3>
                <p className="text-3xl font-bold text-white">{stats.unread}</p>
              </div>
            </div>

            {/* Read Messages */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <HiOutlineMailOpen className="text-3xl text-white opacity-80" />
                  <span className="text-sm font-medium text-green-100">Done</span>
                </div>
                <h3 className="text-sm font-medium text-green-100 mb-1">Read Messages</h3>
                <p className="text-3xl font-bold text-white">{stats.read}</p>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <FaClock className="text-3xl text-white opacity-80" />
                  <span className="text-sm font-medium text-purple-100">30d</span>
                </div>
                <h3 className="text-sm font-medium text-purple-100 mb-1">Last 30 Days</h3>
                <p className="text-3xl font-bold text-white">{stats.recent}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, email, phone, or message content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="sm:w-56">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-300 cursor-pointer"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== "all") && (
            <button
              onClick={clearSearch}
              className="flex items-center gap-2 px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 whitespace-nowrap font-medium"
            >
              <FiX className="h-4 w-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Search Results Info */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="mt-4 flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-orange-600 font-semibold">
              {filteredMessages.length}
            </span>
            <span className="text-gray-600">
              of {messages.length} messages
              {searchTerm && (
                <span className="text-gray-700"> matching <span className="text-orange-600 font-medium">"{searchTerm}"</span></span>
              )}
              {statusFilter !== "all" && (
                <span className="text-gray-700"> • Status: <span className="text-orange-600 font-medium capitalize">{statusFilter}</span></span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Messages List */}
      <div className="rounded-xl border-2 border-gray-200 overflow-hidden shadow-md bg-white">
        <div className="border-b-2 border-gray-200 bg-gray-900 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FaEnvelope className="text-orange-400" />
              Messages ({filteredMessages.length})
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 px-3 py-1.5 rounded-lg">
                <FaSync className="animate-spin" />
                Loading...
              </div>
            )}
          </div>
        </div>
        
        {filteredMessages.length === 0 ? (
          <div className="p-16 text-center bg-gray-50">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-200 mb-4">
              <FaEnvelope className="text-4xl text-gray-400" />
            </div>
            <p className="text-lg text-gray-700 font-medium">
              {messages.length === 0 ? "No messages found" : "No messages match your search"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {messages.length === 0 ? "Messages from customers will appear here" : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-200">
            {filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`p-6 transition-all duration-300 hover:bg-gray-50 ${
                  message.status === 'unread'
                    ? 'bg-orange-50 border-l-4 border-l-orange-500'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.status === 'unread' ? 'bg-orange-500' : 'bg-green-500'
                      }`}>
                        <span className="text-white font-bold text-lg">
                          {message.firstname?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-bold text-gray-900">
                            {message.firstname} {message.lastname}
                          </h4>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${
                            message.status === 'unread' 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {message.status === 'unread' ? '● New' : '✓ Read'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiMail className="text-blue-500" />
                        <a href={`mailto:${message.email}`} className="hover:text-orange-600 transition-colors">
                          {message.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiPhone className="text-green-500" />
                        <a href={`tel:${message.phoneNo}`} className="hover:text-orange-600 transition-colors">
                          {message.phoneNo}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiCalendar className="text-purple-500" />
                        <span>{formatDate(message.createdAt)}</span>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-gray-100 rounded-lg p-4 border-l-4 border-l-orange-400">
                      <p className="text-gray-800 leading-relaxed">{message.message}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleMarkAsRead(message._id)}
                      className={`group relative rounded-lg p-3 text-xl transition-all duration-200 ${
                        message.status === 'unread'
                          ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={message.status === 'read'}
                      title={message.status === 'unread' ? 'Mark as read' : 'Already read'}
                    >
                      {message.status === 'unread' ? (
                        <FaRegEnvelope />
                      ) : (
                        <FaRegEnvelopeOpen />
                      )}
                      {message.status === 'unread' && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Mark as read
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(message._id)}
                      className="group relative rounded-lg p-3 text-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                      title="Delete message"
                    >
                      <MdDelete />
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
