import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { apiConnector } from '../../../services/apiConnector';
import { courseAccessEndpoints } from '../../../services/apis';
import { FiCheck, FiX, FiFilter } from 'react-icons/fi';
import { FaGraduationCap, FaLayerGroup, FaUserGraduate, FaBookOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const BundleAccessRequests = () => {
  const { token } = useSelector((state) => state.auth);
  const [bundleRequests, setBundleRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('pending');

  useEffect(() => {
    fetchBundleRequests();
  }, [selectedStatus]);

  const fetchBundleRequests = async () => {
    setLoading(true);
    try {
      const response = await apiConnector(
        "GET",
        courseAccessEndpoints.GET_BUNDLE_REQUESTS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );
      // Filter requests based on selected status
      const filteredRequests = response.data.data.filter(
        request => request.status.toLowerCase() === selectedStatus.toLowerCase()
      );
      setBundleRequests(filteredRequests);
    } catch (error) {
      console.error("Error fetching bundle requests:", error);
      toast.error("Failed to fetch bundle requests");
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (bundleId, status) => {
    try {
      const url = courseAccessEndpoints.UPDATE_BUNDLE_REQUEST_STATUS_API.replace(':bundleId', bundleId);
      await apiConnector(
        "POST",
        url,
        {
          status
        },
        { Authorization: `Bearer ${token}` }
      );
      toast.success(`Bundle request ${status} successfully`);
      fetchBundleRequests(); // Refresh the list
    } catch (error) {
      console.error("Error updating bundle request:", error);
      toast.error("Failed to update bundle request");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-academic-slate-200 border-t-academic-navy-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-academic-gold-600 rounded-full animate-spin" style={{ animationDelay: '0.15s' }}></div>
        </div>
      </div>
    );
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
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-academic-navy-100 rounded-xl">
              <FaLayerGroup className="text-2xl text-academic-navy-600" />
            </div>
            <div>
              <h2 className="elegant-heading text-3xl text-academic-navy-900">Bundle Access Requests</h2>
              <p className="text-academic-slate-600 mt-1">Manage bundle access requests from students</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-academic-navy-100 rounded-lg">
              <FiFilter className="text-academic-navy-600" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-white border-2 border-academic-slate-200 rounded-xl px-4 py-3 text-academic-navy-900 focus:outline-none focus:border-academic-navy-400 transition-colors font-inter font-medium relative z-20"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
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
        {bundleRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="p-6 bg-academic-slate-100 rounded-full mb-6">
              <FaLayerGroup className="w-12 h-12 text-academic-slate-400" />
            </div>
            <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-3">
              No {selectedStatus} bundle requests found
            </h3>
            <p className="text-academic-slate-600 text-center max-w-md leading-relaxed">
              {selectedStatus === 'pending' 
                ? "All caught up! No pending bundle requests to review at the moment."
                : `No ${selectedStatus} bundle requests to display.`
              }
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {bundleRequests.map((request, index) => (
              <motion.div
                key={request._id}
                className="classic-card bg-academic-cream-50 p-6 space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {/* Academic User Info */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={request.user.image}
                      alt={request.user.firstName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-academic-slate-200"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-academic-navy-900 truncate font-inter">
                      {request.user.firstName} {request.user.lastName}
                    </h3>
                    <p className="text-sm text-academic-slate-600 truncate font-inter">{request.user.email}</p>
                  </div>
                </div>

                {/* Academic Courses List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="w-4 h-4 text-academic-navy-600" />
                    <h4 className="text-sm font-semibold text-academic-navy-800 font-inter">Requested Courses:</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {request.courses.map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center space-x-3 bg-white border border-academic-slate-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.courseName}
                          className="w-10 h-10 rounded-lg object-cover ring-1 ring-academic-slate-200 flex-shrink-0"
                        />
                        <span className="text-sm text-academic-navy-900 truncate font-inter font-medium">
                          {course.courseName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Request Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pt-4 border-t border-academic-slate-200">
                  <div className="text-sm text-academic-slate-600 font-inter">
                    <span className="font-medium">Requested:</span> {new Date(request.requestedAt).toLocaleDateString()}
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {request.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'approved')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 rounded-lg transition-colors font-inter font-medium"
                        >
                          <FaCheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 rounded-lg transition-colors font-inter font-medium"
                        >
                          <FaTimesCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span className={`px-4 py-2 rounded-full text-center text-sm font-semibold font-inter border ${
                        request.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border-green-300' 
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BundleAccessRequests;
