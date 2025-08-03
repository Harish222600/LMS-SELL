import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, createUser, updateUser, deleteUser, toggleUserStatus } from "../../../services/operations/adminAPI";
import { moveToRecycleBin } from "../../../services/operations/recycleBinAPI";
import { FaEdit, FaTrash, FaEye, FaEyeSlash, FaUser, FaPlus, FaSearch, FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaUsers, FaUserGraduate, FaUserTie, FaUserShield } from "react-icons/fa";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import { toast } from "react-hot-toast";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const UserManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [togglingUserId, setTogglingUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "Student",
    contactNumber: ""
  });

  // Helper function to generate profile picture
  const getProfilePicture = (user) => {
    if (user.image) {
      return user.image;
    }
    return null;
  };

  // Helper function to get initials
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Helper function to get account type color
  const getAccountTypeColor = (accountType) => {
    switch (accountType) {
      case 'Admin':
        return 'bg-red-500 text-white';
      case 'Instructor':
        return 'bg-blue-500 text-white';
      case 'Student':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Filter users based on search term and status filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.accountType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.active) ||
      (statusFilter === "inactive" && !user.active);
    
    return matchesSearch && matchesStatus;
  });

  const loadUsers = useCallback(async (mounted = true) => {
    try {
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      setLoading(true);
      const response = await getAllUsers(token);
      
      if (mounted) {
        setUsers(response || []);
        setError(null);
      }
    } catch (err) {
      if (mounted) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  }, [token]);

  useEffect(() => {
    let mounted = true;
    
    if (!token) {
      setError("Authentication required");
      return;
    }

    loadUsers(mounted);
    return () => {
      mounted = false;
    };
  }, [loadUsers, token]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser(formData, token);
      setShowCreateModal(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        accountType: "Student",
        contactNumber: ""
      });
      await loadUsers(true);
      toast.success("User created successfully");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await updateUser(selectedUser._id, formData, token);
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        accountType: "Student",
        contactNumber: ""
      });
      await loadUsers(true);
      toast.success("User updated successfully");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }

    try {
      setDeletingUserId(userId);
      setError(null);
      
      const result = await moveToRecycleBin(token, 'User', userId, 'User moved to recycle bin by admin');
      
      if (result) {
        setConfirmationModal(null);
        await loadUsers(true);
        toast.success("User moved to recycle bin");
      }
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to move user to recycle bin';
      setError(errorMessage);
      setConfirmationModal(null);
      toast.error(errorMessage);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    if (!token) {
      toast.error("Authentication token is missing");
      return;
    }
    try {
      setTogglingUserId(userId);
      await toggleUserStatus(userId, token);
      await loadUsers(true);
      toast.success("User status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user status');
    } finally {
      setTogglingUserId(null);
    }
  };

  // Helper function to format user data for export
  const formatUserData = (user, index) => ({
    'S.No': index + 1,
    'User ID': user._id,
    'User Name': `${user.firstName} ${user.lastName}`,
    'Email': user.email,
    'Role': user.accountType,
    'Contact': user.additionalDetails?.contactNumber || 'N/A',
    'Status': user.active ? 'Active' : 'Inactive'
  });

  // Column width configuration for exports
  const columnConfig = [
    { width: 12, field: 'S.No', minWidth: 18 },
    { width: 45, field: 'User ID', minWidth: 50 },
    { width: 50, field: 'User Name', minWidth: 55 },
    { width: 65, field: 'Email', minWidth: 70 },
    { width: 25, field: 'Role', minWidth: 30 },
    { width: 35, field: 'Contact', minWidth: 40 },
    { width: 25, field: 'Status', minWidth: 30 }
  ];

  // Copy to clipboard
  const handleCopy = () => {
    const data = filteredUsers.map((user, index) => formatUserData(user, index));
    const headers = columnConfig.map(col => col.field).join('\t');
    const rows = data.map(row => columnConfig.map(col => row[col.field]).join('\t'));
    const finalString = [headers, ...rows].join('\n');
    
    navigator.clipboard.writeText(finalString);
    toast.success('User data copied to clipboard');
  };

  // Export as CSV
  const handleCSV = () => {
    const data = filteredUsers.map((user, index) => formatUserData(user, index));
    const headers = columnConfig.map(col => col.field).join(',');
    const rows = data.map(row => columnConfig.map(col => `"${row[col.field]}"`).join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users.csv');
    toast.success('CSV file downloaded');
  };

  // Export as Excel
  const handleExcel = () => {
    const data = filteredUsers.map((user, index) => formatUserData(user, index));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = columnConfig.map(col => ({ wch: col.width }));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
    toast.success('Excel file downloaded');
  };

  // Export as PDF
  const handlePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const data = filteredUsers.map((user, index) => {
      const formattedUser = formatUserData(user, index);
      return columnConfig.map(col => formattedUser[col.field]);
    });

    autoTable(doc, {
      head: [columnConfig.map(col => col.field)],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    });
    
    doc.save('users.pdf');
    toast.success('PDF file downloaded');
  };

  // Print
  const handlePrint = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const data = filteredUsers.map((user, index) => {
      const formattedUser = formatUserData(user, index);
      return columnConfig.map(col => formattedUser[col.field]);
    });

    autoTable(doc, {
      head: [columnConfig.map(col => col.field)],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    });
    
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accountType: user.accountType,
      contactNumber: user.additionalDetails?.contactNumber || ""
    });
    setShowEditModal(true);
  };

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header with Navigation Breadcrumb */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">User Management</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaUsers className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">User Administration Panel</h1>
                <p className="section-subtitle text-lg">Manage system users, roles, and permissions</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-elegant flex items-center gap-3"
            >
              <FaPlus size={16} />
              Create New User
            </button>
          </div>
        </div>
      </div>

      {/* Academic Statistics Panel */}
      <div className="px-8 py-6">
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">System Statistics</h2>
            <p className="text-sm text-academic-slate-600 font-inter">User management overview and analytics</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaUsers className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{users.length}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Users</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Active: {users.filter(u => u.active).length} | Inactive: {users.filter(u => !u.active).length}
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaUserGraduate className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                    {users.filter(u => u.accountType === 'Student').length}
                  </div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Students</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Active: {users.filter(u => u.accountType === 'Student' && u.active).length}
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaUserTie className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                    {users.filter(u => u.accountType === 'Instructor').length}
                  </div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Instructors</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Active: {users.filter(u => u.accountType === 'Instructor' && u.active).length}
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaUserShield className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                    {users.filter(u => u.accountType === 'Admin').length}
                  </div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Administrators</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Active: {users.filter(u => u.accountType === 'Admin' && u.active).length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Tools Panel */}
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Management Tools</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Export data and search functionality</p>
          </div>
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-academic-navy-800 mb-4 font-inter">Export Data</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleCopy}
                    className="btn-classic-secondary text-sm"
                    title="Copy to Clipboard"
                  >
                    <FaCopy size={12} className="inline mr-2" /> Copy
                  </button>
                  <button
                    onClick={handleCSV}
                    className="px-4 py-2 bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-800 border border-academic-navy-200 text-sm transition-colors duration-200 rounded-lg font-inter font-medium"
                    title="Export as CSV"
                  >
                    <FaFileCsv size={12} className="inline mr-2" /> CSV
                  </button>
                  <button
                    onClick={handleExcel}
                    className="px-4 py-2 bg-academic-gold-100 hover:bg-academic-gold-200 text-academic-gold-800 border border-academic-gold-200 text-sm transition-colors duration-200 rounded-lg font-inter font-medium"
                    title="Export as Excel"
                  >
                    <FaFileExcel size={12} className="inline mr-2" /> Excel
                  </button>
                  <button
                    onClick={handlePDF}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-200 text-sm transition-colors duration-200 rounded-lg font-inter font-medium"
                    title="Export as PDF"
                  >
                    <FaFilePdf size={12} className="inline mr-2" /> PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-academic-slate-100 hover:bg-academic-slate-200 text-academic-slate-800 border border-academic-slate-200 text-sm transition-colors duration-200 rounded-lg font-inter font-medium"
                    title="Print"
                  >
                    <FaPrint size={12} className="inline mr-2" /> Print
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-academic-navy-800 mb-4 font-inter">Search & Filter</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="classic-input w-full sm:w-64 pl-12"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={14} />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="classic-input"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Loading State */}
        {loading && (
          <div className="classic-card mb-8">
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                <span className="text-academic-slate-700 font-medium font-inter">Loading user data...</span>
              </div>
            </div>
          </div>
        )}

        {/* Academic Error State */}
        {error && (
          <div className="classic-card mb-8">
            <div className="bg-red-50 border-b border-red-200 px-8 py-4">
              <h3 className="text-lg font-bold text-red-800 font-playfair">System Error</h3>
            </div>
            <div className="p-8">
              <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-4 rounded-lg font-inter">
                <strong>Error Details:</strong> {error}
              </div>
            </div>
          </div>
        )}

        {/* Academic User Directory */}
        {!loading && !error && (
          <div className="classic-card mb-8">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="elegant-heading text-academic-navy-900">User Directory</h2>
                  <p className="text-sm text-academic-slate-600 font-inter">System user management and administration</p>
                </div>
                <div className="text-sm text-academic-slate-700 font-inter">
                  Showing <span className="font-bold text-academic-navy-900">{filteredUsers.length}</span> of <span className="font-bold text-academic-navy-900">{users.length}</span> users
                </div>
              </div>
            </div>

            {/* Academic Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-academic-navy-100 border-b-2 border-academic-navy-300">
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">User Profile</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Email Address</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Role</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Contact Info</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 font-inter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-16 text-center">
                        <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                          <FaUser className="text-5xl text-academic-gold-700" />
                        </div>
                        <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Users Found</h4>
                        <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                          {searchTerm ? 'Try adjusting your search criteria to find the users you\'re looking for.' : 'No users have been added to the system yet.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id} className={`border-b border-academic-slate-200 hover:bg-academic-cream-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-academic-cream-25'}`}>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {getProfilePicture(user) ? (
                                <img
                                  src={getProfilePicture(user)}
                                  alt={`${user.firstName} ${user.lastName}`}
                                  className="w-14 h-14 rounded-full object-cover border-2 border-academic-gold-300"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-academic-navy-600 flex items-center justify-center text-white font-bold text-sm border-2 border-academic-gold-300">
                                  {getInitials(user.firstName, user.lastName)}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-academic-navy-900 text-base font-playfair">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-academic-slate-500 font-inter">
                                User ID: {user._id.slice(-8).toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-academic-slate-700 border-r border-academic-slate-200 font-medium font-inter">{user.email}</td>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <span className={`px-3 py-1 text-xs font-bold border-2 rounded-lg font-inter ${
                            user.accountType === 'Admin' ? 'bg-red-50 text-red-700 border-red-200' :
                            user.accountType === 'Instructor' ? 'bg-academic-gold-50 text-academic-gold-700 border-academic-gold-200' :
                            'bg-academic-navy-50 text-academic-navy-700 border-academic-navy-200'
                          }`}>
                            {user.accountType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-academic-slate-700 border-r border-academic-slate-200 font-inter">
                          {user.additionalDetails?.contactNumber || 'Not provided'}
                        </td>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <span className={`px-3 py-1 text-xs font-bold border-2 rounded-lg font-inter ${
                            user.active ? 'bg-academic-navy-50 text-academic-navy-700 border-academic-navy-200' : 'bg-academic-slate-50 text-academic-slate-700 border-academic-slate-200'
                          }`}>
                            {user.active ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleUserStatus(user._id)}
                              className={`px-3 py-2 border-2 text-sm font-medium transition-colors duration-200 rounded-lg font-inter ${
                                user.active 
                                  ? 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100' 
                                  : 'text-academic-navy-700 border-academic-navy-300 bg-academic-navy-50 hover:bg-academic-navy-100'
                              }`}
                              disabled={togglingUserId === user._id}
                              title={user.active ? 'Deactivate User' : 'Activate User'}
                            >
                              {togglingUserId === user._id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                              ) : (
                                user.active ? <FaEyeSlash size={12} /> : <FaEye size={12} />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditClick(user)}
                              className="px-3 py-2 border-2 border-academic-gold-300 text-academic-gold-700 bg-academic-gold-50 hover:bg-academic-gold-100 text-sm font-medium transition-colors duration-200 rounded-lg font-inter"
                              title="Edit User"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmationModal({
                                  text1: "Move User to Recycle Bin?",
                                  text2: `Are you sure you want to move "${user.firstName} ${user.lastName}" to recycle bin? The user will be automatically deleted after 30 days, but you can restore them anytime before that.`,
                                  btn1Text: "Move to Recycle Bin",
                                  btn2Text: "Cancel",
                                  btn1Handler: () => handleDeleteUser(user._id),
                                  btn2Handler: () => setConfirmationModal(null),
                                })
                              }}
                              disabled={deletingUserId === user._id}
                              className={`px-3 py-2 border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-medium transition-colors duration-200 rounded-lg font-inter ${
                                deletingUserId === user._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Move to Recycle Bin"
                            >
                              {deletingUserId === user._id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                              ) : (
                                <FaTrash size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <FaUser className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No Users Found</p>
                  <p className="text-sm text-gray-400">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'No users have been added to the system yet.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y-2 divide-gray-200">
                  {filteredUsers.map((user) => (
                    <div key={user._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative flex-shrink-0">
                          {getProfilePicture(user) ? (
                            <img
                              src={getProfilePicture(user)}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold border-2 border-gray-300">
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg truncate">{user.firstName} {user.lastName}</h3>
                              <p className="text-sm text-gray-600 truncate">{user.email}</p>
                              <p className="text-xs text-gray-500">ID: {user._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                user.accountType === 'Admin' ? 'bg-red-50 text-red-700 border-red-200' :
                                user.accountType === 'Instructor' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                'bg-green-50 text-green-700 border-green-200'
                              }`}>
                                {user.accountType.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                user.active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {user.active ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4 pl-20">
                        <p><span className="font-semibold">Contact:</span> {user.additionalDetails?.contactNumber || 'Not provided'}</p>
                      </div>
                      
                      <div className="flex justify-center gap-3 pt-4 border-t-2 border-gray-200">
                        <button
                          onClick={() => handleToggleUserStatus(user._id)}
                          className={`px-4 py-2 border-2 text-sm font-medium transition-colors duration-200 ${
                            user.active 
                              ? 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100' 
                              : 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100'
                          }`}
                          disabled={togglingUserId === user._id}
                          title={user.active ? 'Deactivate User' : 'Activate User'}
                        >
                          {togglingUserId === user._id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                          ) : (
                            <>
                              {user.active ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                              <span className="ml-2">{user.active ? 'Deactivate' : 'Activate'}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="px-4 py-2 border-2 border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium transition-colors duration-200"
                          title="Edit User"
                        >
                          <FaEdit size={12} />
                          <span className="ml-2">Edit</span>
                        </button>
                        <button
                          onClick={() => {
                            setConfirmationModal({
                              text1: "Move User to Recycle Bin?",
                              text2: `Are you sure you want to move "${user.firstName} ${user.lastName}" to recycle bin? The user will be automatically deleted after 30 days, but you can restore them anytime before that.`,
                              btn1Text: "Move to Recycle Bin",
                              btn2Text: "Cancel",
                              btn1Handler: () => handleDeleteUser(user._id),
                              btn2Handler: () => setConfirmationModal(null),
                            })
                          }}
                          disabled={deletingUserId === user._id}
                          className={`px-4 py-2 border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-medium transition-colors duration-200 ${
                            deletingUserId === user._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Move to Recycle Bin"
                        >
                          {deletingUserId === user._id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                          ) : (
                            <>
                              <FaTrash size={12} />
                              <span className="ml-2">Delete</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Classic Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded shadow-lg w-full max-w-md">
            <div className="bg-gray-100 border-b border-gray-300 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Create New User</h3>
            </div>
            <form onSubmit={handleCreateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded border border-blue-700 transition-colors duration-200"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Classic Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-300 rounded shadow-lg w-full max-w-md">
            <div className="bg-gray-100 border-b border-gray-300 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-800">Edit User</h3>
            </div>
            <form onSubmit={handleUpdateUser} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="Student">Student</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded border border-blue-700 transition-colors duration-200"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal && (
        <ConfirmationModal
          modalData={confirmationModal}
          closeModal={() => setConfirmationModal(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;
