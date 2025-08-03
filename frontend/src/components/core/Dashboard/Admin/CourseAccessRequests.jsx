import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiUser, FiBook, FiCalendar, FiMessageSquare, FiCheck, FiX, FiChevronLeft, FiChevronRight, FiFilter } from 'react-icons/fi'
import { FaGraduationCap, FaClipboardList, FaUserGraduate, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { getAllAccessRequests, handleAccessRequest } from '../../../../services/operations/courseAccessAPI'
import { formatDate, getRelativeTime } from '../../../../utils/dateFormatter'
import toast from 'react-hot-toast'

export default function CourseAccessRequests() {
  const { token } = useSelector((state) => state.auth)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedStatus, setSelectedStatus] = useState('Pending')
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    fetchAccessRequests()
  }, [currentPage, selectedStatus])

  const fetchAccessRequests = async () => {
    setLoading(true)
    try {
      const result = await getAllAccessRequests(token, selectedStatus, currentPage)
      if (result) {
        setRequests(result.data)
        setTotalPages(result.pagination.totalPages)
      }
    } catch (error) {
      toast.error('Failed to fetch access requests')
    }
    setLoading(false)
  }

  const handleStatusChange = async (requestId, action, adminResponse = '') => {
    setProcessingId(requestId)
    try {
      const result = await handleAccessRequest(requestId, action, adminResponse, token)
      if (result) {
        toast.success(`Request ${action}d successfully`)
        await fetchAccessRequests()
      }
    } catch (error) {
      toast.error(`Failed to ${action} request`)
      console.error('Error handling status change:', error)
    }
    setProcessingId(null)
  }

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'bg-academic-gold-100 text-academic-gold-800 border-academic-gold-300',
      Approved: 'bg-green-100 text-green-800 border-green-300',
      Rejected: 'bg-red-100 text-red-800 border-red-300'
    }
    return badges[status] || 'bg-academic-slate-100 text-academic-slate-800 border-academic-slate-300'
  }

  return (
    <div className="space-y-6">
      {/* Academic Header Section */}
      <motion.div 
        className="classic-card p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-academic-navy-100 rounded-xl">
              <FaClipboardList className="text-2xl text-academic-navy-600" />
            </div>
            <div>
              <h1 className="elegant-heading text-3xl text-academic-navy-900">
                Course Access Requests
              </h1>
              <p className="text-academic-slate-600 mt-1">
                Manage student course access requests
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-academic-navy-100 rounded-lg">
              <FiFilter className="text-academic-navy-600" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="bg-white border-2 border-academic-slate-200 rounded-xl px-4 py-3 text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter font-medium relative z-20"
            >
              <option value="Pending">Pending Requests</option>
              <option value="Approved">Approved Requests</option>
              <option value="Rejected">Rejected Requests</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Academic Content Section */}
      <motion.div 
        className="classic-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-academic-slate-200 border-t-academic-navy-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-academic-gold-600 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="p-6 bg-academic-slate-100 rounded-full mb-6">
              <FiMessageSquare className="w-12 h-12 text-academic-slate-400" />
            </div>
            <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">
              No {selectedStatus.toLowerCase()} requests found
            </h3>
            <p className="text-academic-slate-600 text-center max-w-md leading-relaxed">
              {selectedStatus === 'Pending' 
                ? "All caught up! No pending requests to review at the moment."
                : `No ${selectedStatus.toLowerCase()} requests to display.`
              }
            </p>
          </div>
        ) : (
          <>
            {/* Academic Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-academic-navy-50 border-b border-academic-slate-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-academic-navy-800 font-inter">
                      <div className="flex items-center gap-2">
                        <FaUserGraduate className="w-4 h-4" />
                        Student
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-academic-navy-800 font-inter">
                      <div className="flex items-center gap-2">
                        <FaBookOpen className="w-4 h-4" />
                        Course
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-academic-navy-800 font-inter">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-academic-navy-800 font-inter">
                      <div className="flex items-center gap-2">
                        <FiMessageSquare className="w-4 h-4" />
                        Message
                      </div>
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-academic-navy-800 font-inter min-w-[200px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-academic-slate-200">
                  {requests.map((request) => (
                    <tr key={request._id} className="hover:bg-academic-slate-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={request.user?.image || '/default-avatar.png'}
                              alt={request.user?.firstName || 'User'}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-academic-slate-200"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div>
                            <p className="font-semibold text-academic-navy-900 font-inter">
                              {request.user?.firstName || 'Unknown'} {request.user?.lastName || 'User'}
                            </p>
                            <p className="text-sm text-academic-slate-600 font-inter">{request.user?.email || 'No email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={request.course?.thumbnail || '/default-course.png'}
                            alt={request.course?.courseName || 'Course'}
                            className="w-12 h-8 rounded-lg object-cover ring-1 ring-academic-slate-200"
                          />
                          <div>
                            <p className="font-semibold text-academic-navy-900 line-clamp-1 font-inter">
                              {request.course?.courseName || 'Unknown Course'}
                            </p>
                            <p className="text-sm text-academic-slate-600 font-inter">
                              {request.course?.category?.name || 'No category'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-academic-navy-900 font-medium font-inter">{getRelativeTime(request.requestDate)}</p>
                          <p className="text-xs text-academic-slate-500 font-inter">{formatDate(request.requestDate)}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm text-academic-slate-700 max-w-xs line-clamp-2 font-inter">
                          {request.requestMessage || "No message provided"}
                        </p>
                      </td>
                      <td className="py-4 px-6">
                        {selectedStatus === 'Pending' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStatusChange(request._id, 'approve')}
                              disabled={processingId === request._id}
                              className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium"
                            >
                              <FaCheckCircle className="w-4 h-4" />
                              <span className="text-sm">Approve</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(request._id, 'reject')}
                              disabled={processingId === request._id}
                              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium"
                            >
                              <FaTimesCircle className="w-4 h-4" />
                              <span className="text-sm">Reject</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border font-inter ${getStatusBadge(selectedStatus)}`}>
                              {selectedStatus}
                            </span>
                            {request.adminResponse && (
                              <p className="text-xs text-academic-slate-600 max-w-xs line-clamp-1 font-inter">
                                {request.adminResponse}
                              </p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Academic Mobile Card View */}
            <div className="lg:hidden space-y-4 p-6">
              {requests.map((request, index) => (
                <motion.div 
                  key={request._id} 
                  className="classic-card bg-academic-cream-50 p-4 space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  {/* Academic Student Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={request.user?.image || '/default-avatar.png'}
                      alt={request.user?.firstName || 'User'}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-academic-slate-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-academic-navy-900 font-inter">
                        {request.user?.firstName || 'Unknown'} {request.user?.lastName || 'User'}
                      </p>
                      <p className="text-sm text-academic-slate-600 font-inter">{request.user?.email || 'No email'}</p>
                    </div>
                  </div>

                  {/* Academic Course Info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={request.course?.thumbnail || '/default-course.png'}
                      alt={request.course?.courseName || 'Course'}
                      className="w-16 h-10 rounded-lg object-cover ring-1 ring-academic-slate-200"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-academic-navy-900 line-clamp-1 font-inter">
                        {request.course?.courseName || 'Unknown Course'}
                      </p>
                      <p className="text-sm text-academic-slate-600 font-inter">
                        {getRelativeTime(request.requestDate)}
                      </p>
                    </div>
                  </div>

                  {/* Academic Message */}
                  {request.requestMessage && (
                    <div className="bg-academic-navy-50 border border-academic-navy-200 rounded-lg p-3">
                      <p className="text-sm text-academic-slate-700 font-inter">
                        {request.requestMessage}
                      </p>
                    </div>
                  )}

                  {/* Academic Actions */}
                  {selectedStatus === 'Pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(request._id, 'approve')}
                        disabled={processingId === request._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 rounded-lg transition-colors disabled:opacity-50 font-inter font-medium"
                      >
                        <FaCheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(request._id, 'reject')}
                        disabled={processingId === request._id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-lg transition-colors disabled:opacity-50 font-inter font-medium"
                      >
                        <FaTimesCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border font-inter ${getStatusBadge(selectedStatus)}`}>
                        {selectedStatus}
                      </span>
                      {request.adminResponse && (
                        <p className="text-sm text-academic-slate-600 flex-1 ml-3 font-inter">
                          {request.adminResponse}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Academic Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="border-t border-academic-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-academic-slate-600 font-inter font-medium">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-academic-slate-50 text-academic-navy-900 border border-academic-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </button>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-academic-slate-50 text-academic-navy-900 border border-academic-slate-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-inter font-medium"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
