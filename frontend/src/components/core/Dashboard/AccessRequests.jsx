import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiBook, FiClock, FiMessageSquare, FiCheckCircle, FiXCircle, FiAlertCircle, FiPlay, FiFilter, FiSearch } from 'react-icons/fi'
import { FaGraduationCap, FaClipboardList, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { getUserAccessRequests } from '../../../services/operations/courseAccessAPI'
import { getRelativeTime, formatDate } from '../../../utils/dateFormatter'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AccessRequests() {
  const { token } = useSelector((state) => state.auth)
  const [requests, setRequests] = useState([])
  const [filteredRequests, setFilteredRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchRequests()
  }, [])

  useEffect(() => {
    let filtered = requests
    
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestMessage?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredRequests(filtered)
  }, [statusFilter, requests, searchTerm])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const result = await getUserAccessRequests(token)
      if (result) {
        setRequests(result)
      }
    } catch (error) {
      toast.error('Failed to fetch access requests')
    }
    setLoading(false)
  }

  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        color: 'bg-academic-gold-100 text-academic-gold-800 border-academic-gold-300',
        icon: FaHourglassHalf,
        bgGradient: 'from-academic-gold-50 to-academic-cream-100',
        cardBg: 'bg-academic-gold-50'
      },
      Approved: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: FaCheckCircle,
        bgGradient: 'from-green-50 to-emerald-100',
        cardBg: 'bg-green-50'
      },
      Rejected: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: FaTimesCircle,
        bgGradient: 'from-red-50 to-pink-100',
        cardBg: 'bg-red-50'
      }
    }
    return configs[status] || {
      color: 'bg-academic-slate-100 text-academic-slate-800 border-academic-slate-300',
      icon: FiAlertCircle,
      bgGradient: 'from-academic-slate-50 to-academic-cream-100',
      cardBg: 'bg-academic-slate-50'
    }
  }

  const getRequestStats = () => {
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'Pending').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length
    }
    return stats
  }

  const stats = getRequestStats()

  return (
    <div className="space-y-6">
      {/* Academic Header Section */}
      <motion.div 
        className="classic-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-academic-navy-100 rounded-xl">
              <FaClipboardList className="text-2xl text-academic-navy-600" />
            </div>
            <div>
              <h1 className="elegant-heading text-3xl text-academic-navy-900">
                My Course Requests
              </h1>
              <p className="text-academic-slate-600 mt-1">
                Track your course access requests and their status
              </p>
            </div>
          </div>
          
          {/* Academic Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="classic-card bg-academic-slate-50 p-3 text-center">
              <p className="text-2xl font-bold text-academic-navy-900 font-playfair">{stats.total}</p>
              <p className="text-xs text-academic-slate-600 font-inter font-medium">Total</p>
            </div>
            <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-3 text-center">
              <p className="text-2xl font-bold text-academic-gold-800 font-playfair">{stats.pending}</p>
              <p className="text-xs text-academic-gold-700 font-inter font-medium">Pending</p>
            </div>
            <div className="classic-card bg-green-50 border-green-200 p-3 text-center">
              <p className="text-2xl font-bold text-green-800 font-playfair">{stats.approved}</p>
              <p className="text-xs text-green-700 font-inter font-medium">Approved</p>
            </div>
            <div className="classic-card bg-red-50 border-red-200 p-3 text-center">
              <p className="text-2xl font-bold text-red-800 font-playfair">{stats.rejected}</p>
              <p className="text-xs text-red-700 font-inter font-medium">Rejected</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Academic Filters Section */}
      <motion.div 
        className="classic-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Academic Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search courses or messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-academic-slate-200 rounded-xl text-academic-navy-900 placeholder-academic-slate-400 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter"
            />
          </div>
          
          {/* Academic Status Filter */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-academic-navy-100 rounded-lg">
              <FiFilter className="text-academic-navy-600" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border-2 border-academic-slate-200 rounded-xl px-4 py-3 text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter font-medium relative z-20"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Academic Content Section */}
      <motion.div 
        className="classic-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-academic-slate-200 border-t-academic-navy-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-academic-gold-600 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="p-6 bg-academic-slate-100 rounded-full mb-6">
              <FiBook className="w-12 h-12 text-academic-slate-400" />
            </div>
            <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">
              {requests.length === 0 ? 'No requests yet' : 'No matching requests'}
            </h3>
            <p className="text-academic-slate-600 text-center max-w-md mb-8 leading-relaxed">
              {requests.length === 0 
                ? "You haven't made any course access requests yet. Browse our free courses to get started!"
                : "No requests match your current filters. Try adjusting your search or filter criteria."
              }
            </p>
            {requests.length === 0 && (
              <Link
                to="/free-courses"
                className="btn-elegant flex items-center gap-2"
              >
                <FiBook className="w-4 h-4" />
                Browse Free Courses
              </Link>
            )}
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredRequests.map((request, index) => {
                const statusConfig = getStatusConfig(request.status)
                const StatusIcon = statusConfig.icon
                
                return (
                  <motion.div
                    key={request._id}
                    className={`relative classic-card ${statusConfig.cardBg} p-6 hover:shadow-elegant transition-all duration-300 group`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    {/* Academic Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="font-inter font-semibold">{request.status}</span>
                      </div>
                    </div>

                    {/* Academic Course Info */}
                    <div className="flex gap-4 mb-6">
                      <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={request.course.thumbnail}
                          alt={request.course.courseName}
                          className="w-24 h-16 rounded-xl object-cover ring-2 ring-academic-slate-200 group-hover:ring-academic-navy-300"
                        />
                        <div className="absolute inset-0 bg-academic-navy-900/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-academic-navy-900 text-lg line-clamp-2 mb-2 font-playfair">
                          {request.course.courseName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-academic-slate-600">
                          <FiClock className="w-4 h-4" />
                          <span className="font-inter">Requested {getRelativeTime(request.requestDate)}</span>
                        </div>
                        <p className="text-xs text-academic-slate-500 mt-1 font-inter">
                          {formatDate(request.requestDate)}
                        </p>
                      </div>
                    </div>

                    {/* Academic Request Message */}
                    {request.requestMessage && (
                      <div className="bg-academic-cream-100 border border-academic-cream-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMessageSquare className="w-4 h-4 text-academic-navy-600" />
                          <span className="text-sm font-semibold text-academic-navy-800 font-inter">Your message:</span>
                        </div>
                        <p className="text-sm text-academic-slate-700 leading-relaxed font-inter">
                          {request.requestMessage}
                        </p>
                      </div>
                    )}

                    {/* Academic Admin Response */}
                    {request.adminResponse && (
                      <div className="bg-academic-navy-50 border border-academic-navy-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-academic-navy-600 rounded-full flex items-center justify-center">
                            <FaGraduationCap className="text-xs text-white" />
                          </div>
                          <span className="text-sm font-semibold text-academic-navy-800 font-inter">Admin response:</span>
                        </div>
                        <p className="text-sm text-academic-slate-700 leading-relaxed font-inter">
                          {request.adminResponse}
                        </p>
                      </div>
                    )}

                    {/* Academic Action Buttons */}
                    {request.status === 'Approved' && (
                      <Link
                        to={`/view-course/${request.course._id}`}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105 font-medium font-inter shadow-classic"
                      >
                        <FiPlay className="w-4 h-4" />
                        Start Learning
                      </Link>
                    )}

                    {request.status === 'Pending' && (
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-academic-gold-100 text-academic-gold-800 rounded-xl border border-academic-gold-300 font-medium font-inter">
                        <FaHourglassHalf className="w-4 h-4" />
                        Awaiting Review
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
