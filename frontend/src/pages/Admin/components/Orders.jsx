import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FiDownload, FiEye, FiSearch } from 'react-icons/fi'
import { getAllOrders, updateOrderStatus, generateOrdersPDF } from '../../../services/operations/orderAPI'
import OrderViewModal from './OrderViewModal'

export default function Orders() {
  const { token } = useSelector((state) => state.auth)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'purchaseDate', direction: 'desc' })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const data = await getAllOrders(token)
      if (data) {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [token])

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  // Filter and sort orders
  const filteredAndSortedOrders = orders
    .filter((order) => {
      const searchString = searchQuery.toLowerCase()
      return (
        order.user?.firstName?.toLowerCase().includes(searchString) ||
        order.user?.lastName?.toLowerCase().includes(searchString) ||
        order.user?.email?.toLowerCase().includes(searchString) ||
        order.course?.courseName?.toLowerCase().includes(searchString) ||
        order.transactionId?.toLowerCase().includes(searchString)
      )
    })
    .sort((a, b) => {
      if (sortConfig.key === 'purchaseDate') {
        return sortConfig.direction === 'asc'
          ? new Date(a.purchaseDate) - new Date(b.purchaseDate)
          : new Date(b.purchaseDate) - new Date(a.purchaseDate)
      }
      // Add more sorting logic for other columns if needed
      return 0
    })

  // Handle status toggle
  const handleStatusToggle = async (orderId, newStatus) => {
    const success = await updateOrderStatus(token, orderId, newStatus)
    if (success) {
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      )
    }
  }

  // Generate PDF
  const handleGeneratePDF = () => {
    generateOrdersPDF(token)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-3 border-academic-navy-300 border-t-academic-navy-700 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="classic-heading mb-3">Loading Orders...</h2>
          <p className="text-academic-slate-600">Please wait while we fetch your data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="classic-heading text-3xl md:text-4xl mb-2">
              Orders Management
            </h1>
            <p className="section-subtitle text-lg">Manage and track all customer orders</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-academic-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders, users, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="classic-input pl-12 pr-12 w-full sm:w-80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleGeneratePDF}
              className="btn-elegant flex items-center justify-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="classic-card overflow-hidden">
          {/* Mobile Card View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-6">
              {filteredAndSortedOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-academic-cream-50 rounded-xl p-4 space-y-4 border border-academic-cream-200"
                >
                  {/* Order Number and Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-academic-gold-500 text-sm font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold text-academic-slate-700">Order #{index + 1}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleStatusToggle(order._id, !order.status)}
                        className={`${
                          order.status 
                            ? 'bg-green-600' 
                            : 'bg-academic-slate-300'
                        } relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300`}
                      >
                        <span
                          className={`${
                            order.status ? 'translate-x-6' : 'translate-x-1'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300`}
                        />
                      </button>
                      <span className={`text-sm font-medium ${order.status ? 'text-green-700' : 'text-academic-slate-500'}`}>
                        {order.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* User Details */}
                  <div className="space-y-2">
                    <p className="text-base font-bold text-academic-navy-900">
                      {order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'N/A'}
                    </p>
                    <p className="text-sm text-blue-700">{order.user?.email || 'N/A'}</p>
                    <p className="text-sm text-green-700 font-medium">{order.course?.courseName || 'N/A'}</p>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-2">
                    <p className="text-sm text-academic-slate-600">
                      <span className="font-medium">Transaction ID:</span> 
                      <span className="font-mono text-purple-700 ml-2">{order.transactionId}</span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-academic-slate-200 px-3 py-1 rounded-full text-orange-700 font-medium">
                        {order.paymentMethod}
                      </span>
                      <span className="text-lg font-bold text-green-700">₹{order.amount}</span>
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-academic-cream-200">
                    <div className="text-sm text-academic-slate-600 font-medium">
                      {new Date(order.purchaseDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setShowViewModal(true)
                      }}
                      className="p-2 bg-academic-navy-600 text-white rounded-lg hover:bg-academic-navy-700 transition-colors"
                      title="View Order"
                    >
                      <FiEye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-academic-navy-50">
                <tr className="border-b border-academic-slate-200">
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-academic-gold-500 text-sm font-bold text-white">#</span>
                      <span>S.No</span>
                    </div>
                  </th>
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">👤</span>
                      User Details
                    </div>
                  </th>
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900">
                    <div className="flex items-center gap-3">
                      <span className="text-green-600">💳</span>
                      Payment Details
                    </div>
                  </th>
                  <th
                    className="cursor-pointer p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900 transition-all duration-200 hover:text-academic-gold-700"
                    onClick={() => handleSort('purchaseDate')}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-purple-600">📅</span>
                      <span>Date of Purchase</span>
                      {sortConfig.key === 'purchaseDate' && (
                        <span className="text-academic-gold-600">
                          {sortConfig.direction === 'asc' ? '▲' : '▼'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900">
                    <div className="flex items-center gap-3">
                      <span className="text-orange-600">⚡</span>
                      Status
                    </div>
                  </th>
                  <th className="p-6 text-left text-sm font-bold uppercase tracking-wider text-academic-navy-900">
                    <div className="flex items-center gap-3">
                      <span className="text-pink-600">⚙️</span>
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-academic-slate-200">
                {filteredAndSortedOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="group relative text-base font-medium text-academic-navy-900 transition-all duration-300 hover:bg-academic-cream-50"
                  >
                    <td className="p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-academic-gold-500 text-sm font-bold text-white shadow-classic">
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 font-bold text-sm">
                          <span className="text-academic-slate-600">User:</span> 
                          <span className="text-academic-navy-900">{order.user ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() : 'N/A'}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm text-academic-slate-600">
                          <span className="text-academic-slate-500">Email:</span> 
                          <span className="text-blue-700">{order.user?.email || 'N/A'}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm text-academic-slate-600">
                          <span className="text-academic-slate-500">Course:</span> 
                          <span className="text-green-700 font-medium">{order.course?.courseName || 'N/A'}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm text-academic-slate-600">
                          <span className="text-academic-slate-500">ID:</span> 
                          <span className="font-mono text-purple-700">{order.transactionId}</span>
                        </p>
                        <p className="flex items-center gap-2 text-sm text-academic-slate-600">
                          <span className="text-academic-slate-500">Method:</span> 
                          <span className="rounded-full bg-academic-slate-200 px-3 py-1 text-sm text-orange-700 font-medium">{order.paymentMethod}</span>
                        </p>
                        <p className="flex items-center gap-2 text-lg font-bold">
                          <span className="text-academic-slate-500 text-sm font-normal">Amount:</span> 
                          <span className="text-green-700">₹{order.amount}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="bg-academic-slate-100 rounded-xl px-4 py-3 text-center border border-academic-slate-200">
                        <p className="text-sm font-bold text-academic-navy-900">
                          {new Date(order.purchaseDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-xs text-academic-slate-600">
                          {new Date(order.purchaseDate).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col items-start gap-3">
                        <button
                          onClick={() => handleStatusToggle(order._id, !order.status)}
                          className={`${
                            order.status 
                              ? 'bg-green-600' 
                              : 'bg-academic-slate-300'
                          } relative inline-flex h-7 w-12 items-center rounded-full shadow-classic transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:ring-offset-2 focus:ring-offset-white`}
                        >
                          <span
                            className={`${
                              order.status ? 'translate-x-6' : 'translate-x-1'
                            } inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300`}
                          />
                        </button>
                        <span className={`text-sm font-semibold ${order.status ? 'text-green-700' : 'text-academic-slate-500'}`}>
                          {order.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowViewModal(true)
                          }}
                          className="p-3 bg-academic-navy-600 text-white rounded-lg shadow-classic transition-all duration-200 hover:bg-academic-navy-700 hover:scale-110 active:scale-95"
                          title="View Order"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Empty State */}
          {filteredAndSortedOrders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-academic-slate-100 rounded-2xl flex items-center justify-center mb-6">
                <FiSearch className="w-10 h-10 text-academic-slate-400" />
              </div>
              <h3 className="elegant-heading mb-3">No Orders Found</h3>
              <p className="text-academic-slate-600 text-center max-w-md leading-relaxed mb-6">
                {searchQuery 
                  ? `No orders match your search for "${searchQuery}". Try adjusting your search terms.` 
                  : 'No orders have been placed yet. Orders will appear here once customers make purchases.'
                }
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn-classic-secondary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* View Order Modal */}
        {showViewModal && selectedOrder && (
          <OrderViewModal
            order={selectedOrder}
            onClose={() => {
              setShowViewModal(false)
              setSelectedOrder(null)
            }}
          />
        )}
      </div>
    </div>
  )
}
