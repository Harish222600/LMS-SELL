import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { getAllCourses, approveCourse, deleteCourse, toggleCourseVisibility, setCourseType } from "../../../services/operations/adminAPI";
import { moveToRecycleBin } from "../../../services/operations/recycleBinAPI";
import { getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI";
import { FaCheck, FaTrash, FaEye, FaEyeSlash, FaPlus, FaEdit, FaSearch, FaTimes, FaDollarSign, FaTag, FaBook, FaGraduationCap, FaChartLine, FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint } from "react-icons/fa";
import { toast } from "react-hot-toast";
import CreateCourse from "./CreateCourse/CreateCourse";
import EditCourse from "./EditCourse";
import ConfirmationModal from "../../../components/common/ConfirmationModal";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const CourseManagement = () => {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmationModal, setConfirmationModal] = useState(null);

  // Optimized fetch courses with caching and debouncing
  const fetchCourses = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing");
      return;
    }

    setLoading(true);
    try {
      const response = await getAllCourses(token);
      
      if (!response || !response.courses) {
        throw new Error("No courses data received");
      }

      setCourses(response.courses);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch courses';
      setError(errorMessage);
      // Only show toast for unexpected errors, not for missing token
      if (err.message !== "No authentication token found") {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCourses();
    } else {
      setError("Authentication token is missing");
      // Remove duplicate toast - this will be handled by auth system
    }
  }, [token]);

  const handleApproveCourse = async (courseId) => {
    try {
      await approveCourse(courseId, token);
      fetchCourses(); // Refresh course list
    } catch (error) {
      setError(error.message);
    }
  };

  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [togglingCourseId, setTogglingCourseId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const handleDeleteCourse = useCallback((course) => {
    setConfirmationModal({
      text1: "Move Course to Recycle Bin?",
      text2: `Are you sure you want to move the course "${course.courseName}" to recycle bin? It will be automatically deleted after 30 days, but you can restore it anytime before that.`,
      btn1Text: "Move to Recycle Bin",
      btn2Text: "Cancel",
      btn1Handler: () => confirmDeleteCourse(course._id, course.courseName),
      btn2Handler: () => setConfirmationModal(null),
    });
  }, []);

  const confirmDeleteCourse = useCallback(async (courseId, courseName) => {
    if (!token) {
      return;
    }

    try {
      setDeletingCourseId(courseId);
      setError(null);
      setConfirmationModal(null);
      
      const result = await moveToRecycleBin(token, 'Course', courseId, `Course moved to recycle bin by admin`);
      
      if (result) {
        toast.success("Course moved to recycle bin successfully");
        // Optimistic update - remove from local state immediately
        setCourses(prevCourses => prevCourses.filter(course => course._id !== courseId));
      }
      
    } catch (error) {
      console.error('Move to recycle bin operation failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to move course to recycle bin';
      toast.error(errorMessage);
    } finally {
      setDeletingCourseId(null);
    }
  }, [token]);

  const handleToggleVisibility = useCallback(async (courseId) => {
    if (!token) {
      return;
    }
    try {
      setTogglingCourseId(courseId);
      const response = await toggleCourseVisibility(courseId, token);
      if (response) {
        // Optimistic update - update local state immediately with both isVisible and status
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId 
              ? { 
                  ...course, 
                  isVisible: !course.isVisible,
                  status: !course.isVisible ? 'Published' : 'Draft'
                }
              : course
          )
        );
      }
    } catch (error) {
      console.error('Toggle course visibility failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update course visibility');
    } finally {
      setTogglingCourseId(null);
    }
  }, [token]);

  const handleEditCourse = async (course) => {
    try {
      console.log("Fetching full course details for editing...");
      const fullCourseDetails = await getFullDetailsOfCourse(course._id, token);
      if (fullCourseDetails?.data) {
        console.log("Full course details fetched:", fullCourseDetails.data);
        setEditingCourse(fullCourseDetails.data);
      } else {
        console.log("Using basic course details:", course);
        setEditingCourse(course);
      }
    } catch (error) {
      console.error("Error fetching full course details:", error);
      // Only show toast for critical errors, fallback to basic course details
      if (error.response?.status !== 404) {
        toast.error("Error loading course details");
      }
      setEditingCourse(course);
    }
    setShowCreateCourse(false);
  };

  const handleCourseTypeChange = useCallback(async (courseId, newType) => {
    if (!token) {
      return;
    }
    try {
      setProcessingId(courseId);
      const response = await setCourseType(courseId, newType, token);
      if (response) {
        // Optimistic update - update local state immediately
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course._id === courseId 
              ? { ...course, courseType: newType }
              : course
          )
        );
      }
    } catch (error) {
      console.error('Change course type failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change course type');
    } finally {
      setProcessingId(null);
    }
  }, [token]);

  const handleViewCourse = (courseId) => {
    // Implement course preview/details view
    console.log("View course:", courseId);
  };

  // Memoized filtered courses for better performance
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = searchTerm === "" || 
        course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${course.instructor?.firstName} ${course.instructor?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "published" && course.status === "Published") ||
        (statusFilter === "draft" && course.status === "Draft") ||
        (statusFilter === "visible" && course.isVisible) ||
        (statusFilter === "hidden" && !course.isVisible);
      
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchTerm, statusFilter]);

  // Memoized statistics calculation
  const courseStats = useMemo(() => {
    const totalCourses = courses.length;
    const pendingCourses = courses.filter(course => 
      course.status === 'Draft' && course.isVisible
    ).length;
    const activeCourses = courses.filter(course => course.status === 'Published').length;
    
    return { totalCourses, pendingCourses, activeCourses };
  }, [courses]);

  // Export functions
  const formatCourseData = (course, index) => ({
    'S.No': index + 1,
    'Course ID': course._id,
    'Course Name': course.courseName,
    'Instructor': `${course.instructor?.firstName || ''} ${course.instructor?.lastName || ''}`.trim(),
    'Category': course.category?.name || 'N/A',
    'Price': `₹${course.price}`,
    'Type': course.courseType || 'Paid',
    'Status': course.status || 'Draft',
    'Visibility': course.isVisible ? 'Visible' : 'Hidden'
  });

  const handleCopy = () => {
    const data = filteredCourses.map((course, index) => formatCourseData(course, index));
    const headers = Object.keys(data[0] || {}).join('\t');
    const rows = data.map(row => Object.values(row).join('\t'));
    const finalString = [headers, ...rows].join('\n');
    
    navigator.clipboard.writeText(finalString);
    toast.success('Course data copied to clipboard');
  };

  const handleCSV = () => {
    const data = filteredCourses.map((course, index) => formatCourseData(course, index));
    const headers = Object.keys(data[0] || {}).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','));
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'courses.csv');
    toast.success('CSV file downloaded');
  };

  const handleExcel = () => {
    const data = filteredCourses.map((course, index) => formatCourseData(course, index));
    const ws = XLSX.utils.json_to_sheet(data);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Courses');
    XLSX.writeFile(wb, 'courses.xlsx');
    toast.success('Excel file downloaded');
  };

  const handlePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const data = filteredCourses.map((course, index) => {
      const formattedCourse = formatCourseData(course, index);
      return Object.values(formattedCourse);
    });

    autoTable(doc, {
      head: [Object.keys(formatCourseData(filteredCourses[0] || {}, 0))],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    });
    
    doc.save('courses.pdf');
    toast.success('PDF file downloaded');
  };

  const handlePrint = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const data = filteredCourses.map((course, index) => {
      const formattedCourse = formatCourseData(course, index);
      return Object.values(formattedCourse);
    });

    autoTable(doc, {
      head: [Object.keys(formatCourseData(filteredCourses[0] || {}, 0))],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    });
    
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header with Navigation Breadcrumb */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Course Management</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
              <FaBook className="text-academic-gold-700 text-2xl" />
            </div>
            <div>
              <h1 className="classic-heading text-3xl lg:text-4xl mb-2">Course Administration Panel</h1>
              <p className="section-subtitle text-lg">Manage courses, instructors, and course settings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Statistics Panel */}
      <div className="px-8 py-6">
        <div className="classic-card mb-8">
          <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
            <h2 className="elegant-heading text-academic-navy-900">Course Statistics</h2>
            <p className="text-sm text-academic-slate-600 font-inter">Academic course management overview and analytics</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaBook className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.totalCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Courses</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  All courses in system
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaChartLine className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.activeCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Published Courses</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Live and available
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaGraduationCap className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{courseStats.pendingCourses}</div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Pending Approval</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  Awaiting review
                </div>
              </div>

              <div className="text-center group">
                <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                  <FaTag className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                    {courses.filter(course => course.courseType === 'Free').length}
                  </div>
                  <div className="text-sm font-semibold text-academic-slate-700 font-inter">Free Courses</div>
                </div>
                <div className="text-xs text-academic-slate-500 font-inter">
                  No cost courses
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
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="classic-input w-full sm:w-64 pl-12"
                    />
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={14} />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
                      >
                        <FaTimes size={12} />
                      </button>
                    )}
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="classic-input"
                  >
                    <option value="all">All Courses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>

                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={clearSearch}
                      className="btn-classic-secondary text-sm"
                    >
                      <FaTimes size={12} className="inline mr-2" /> Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Search Results Info */}
        {(searchTerm || statusFilter !== "all") && (
          <div className="classic-card mb-8">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <FaSearch className="text-academic-gold-600" size={16} />
                <div className="text-sm text-academic-slate-700 font-inter">
                  Showing <span className="font-bold text-academic-navy-900">{filteredCourses.length}</span> of <span className="font-bold text-academic-navy-900">{courseStats.totalCourses}</span> courses
                  {searchTerm && (
                    <span className="text-academic-gold-700 font-semibold"> matching "{searchTerm}"</span>
                  )}
                  {statusFilter !== "all" && (
                    <span className="text-academic-gold-700 font-semibold"> with status "{statusFilter}"</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Academic Loading State */}
        {loading && (
          <div className="classic-card mb-8">
            <div className="flex justify-center items-center py-16">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                <span className="text-academic-slate-700 font-medium font-inter">Loading course data...</span>
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

        {/* Course Directory */}
        {editingCourse ? (
          <EditCourse
            course={editingCourse}
            onCancel={() => setEditingCourse(null)}
            onSave={(updatedCourse) => {
              setEditingCourse(null);
              fetchCourses();
            }}
          />
        ) : showCreateCourse ? (
          <CreateCourse onCancel={() => setShowCreateCourse(false)} />
        ) : !loading && !error && (
          <div className="classic-card mb-8">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="elegant-heading text-academic-navy-900">Course Directory</h2>
                  <p className="text-sm text-academic-slate-600 font-inter">Academic course management and administration</p>
                </div>
                <div className="text-sm text-academic-slate-700 font-inter">
                  Showing <span className="font-bold text-academic-navy-900">{filteredCourses.length}</span> of <span className="font-bold text-academic-navy-900">{courseStats.totalCourses}</span> courses
                </div>
              </div>
            </div>

            {/* Academic Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-academic-navy-100 border-b-2 border-academic-navy-300">
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Course Details</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Instructor</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Category</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Price & Type</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 border-r border-academic-navy-200 font-inter">Status</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-academic-navy-800 font-inter">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-8 py-16 text-center">
                        <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                          <FaBook className="text-5xl text-academic-gold-700" />
                        </div>
                        <h4 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Courses Found</h4>
                        <p className="section-subtitle text-academic-slate-600 max-w-md mx-auto">
                          {courseStats.totalCourses === 0 ? 'No courses have been created yet.' : 'Try adjusting your search criteria to find the courses you\'re looking for.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, index) => (
                      <tr key={course._id} className={`border-b border-academic-slate-200 hover:bg-academic-cream-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-academic-cream-25'}`}>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <div>
                            <div className="font-bold text-academic-navy-900 text-base mb-1 font-playfair">
                              {course.courseName}
                            </div>
                            <div className="text-sm text-academic-slate-500 font-inter">
                              Course ID: {course._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-academic-slate-700 border-r border-academic-slate-200 font-medium font-inter">
                          {course.instructor?.firstName} {course.instructor?.lastName}
                        </td>
                        <td className="px-8 py-6 text-academic-slate-700 border-r border-academic-slate-200 font-inter">
                          {course.category?.name || 'N/A'}
                        </td>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <div className="flex flex-col gap-2">
                            <span className="font-bold text-academic-navy-900 font-playfair">₹{course.price}</span>
                            <span className={`px-3 py-1 text-xs font-bold border-2 rounded-lg font-inter ${
                              course.courseType === 'Free'
                                ? 'bg-academic-navy-50 text-academic-navy-700 border-academic-navy-200'
                                : 'bg-academic-gold-50 text-academic-gold-700 border-academic-gold-200'
                            }`}>
                              {course.courseType || 'PAID'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 border-r border-academic-slate-200">
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 text-xs font-bold border-2 rounded-lg font-inter ${
                              course.status === 'Published'
                                ? 'bg-academic-navy-50 text-academic-navy-700 border-academic-navy-200'
                                : 'bg-academic-cream-100 text-academic-slate-700 border-academic-cream-300'
                            }`}>
                              {course.status || 'DRAFT'}
                            </span>
                            <span className={`px-3 py-1 text-xs font-bold border-2 rounded-lg font-inter ${
                              course.isVisible ? 'bg-academic-gold-50 text-academic-gold-700 border-academic-gold-200' : 'bg-academic-slate-50 text-academic-slate-700 border-academic-slate-200'
                            }`}>
                              {course.isVisible ? 'VISIBLE' : 'HIDDEN'}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleToggleVisibility(course._id)}
                              className={`px-3 py-2 border-2 text-sm font-medium transition-colors duration-200 rounded-lg font-inter ${
                                course.isVisible 
                                  ? 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100' 
                                  : 'text-academic-navy-700 border-academic-navy-300 bg-academic-navy-50 hover:bg-academic-navy-100'
                              }`}
                              disabled={togglingCourseId === course._id}
                              title={course.isVisible ? 'Hide Course' : 'Show Course'}
                            >
                              {togglingCourseId === course._id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                              ) : (
                                course.isVisible ? <FaEyeSlash size={12} /> : <FaEye size={12} />
                              )}
                            </button>
                            <button
                              onClick={() => handleCourseTypeChange(course._id, course.courseType === 'Free' ? 'Paid' : 'Free')}
                              className={`px-3 py-2 border-2 text-sm font-medium transition-colors duration-200 rounded-lg font-inter ${
                                course.courseType === 'Free'
                                  ? 'text-academic-gold-700 border-academic-gold-300 bg-academic-gold-50 hover:bg-academic-gold-100'
                                  : 'text-academic-navy-700 border-academic-navy-300 bg-academic-navy-50 hover:bg-academic-navy-100'
                              }`}
                              disabled={processingId === course._id}
                              title={course.courseType === 'Free' ? 'Make Paid' : 'Make Free'}
                            >
                              {processingId === course._id ? (
                                <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                              ) : (
                                course.courseType === 'Free' ? <FaDollarSign size={12} /> : <FaTag size={12} />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="px-3 py-2 border-2 border-academic-gold-300 text-academic-gold-700 bg-academic-gold-50 hover:bg-academic-gold-100 text-sm font-medium transition-colors duration-200 rounded-lg font-inter"
                              title="Edit Course"
                            >
                              <FaEdit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course)}
                              disabled={deletingCourseId === course._id}
                              className={`px-3 py-2 border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-medium transition-colors duration-200 rounded-lg font-inter ${
                                deletingCourseId === course._id ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Move to Recycle Bin"
                            >
                              {deletingCourseId === course._id ? (
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
              {filteredCourses.length === 0 ? (
                <div className="p-8 text-center">
                  <FaBook className="mx-auto text-4xl mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-500 mb-2">No Courses Found</p>
                  <p className="text-sm text-gray-400">
                    {courseStats.totalCourses === 0 ? 'No courses have been created yet.' : 'Try adjusting your search criteria.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y-2 divide-gray-200">
                  {filteredCourses.map((course) => (
                    <div key={course._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 text-lg truncate">{course.courseName}</h3>
                              <p className="text-sm text-gray-600 truncate">
                                {course.instructor?.firstName} {course.instructor?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">ID: {course._id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                course.status === 'Published'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }`}>
                                {course.status || 'DRAFT'}
                              </span>
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                course.courseType === 'Free'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}>
                                {course.courseType || 'PAID'}
                              </span>
                              <span className={`px-2 py-1 text-xs font-bold border ${
                                course.isVisible ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                              }`}>
                                {course.isVisible ? 'VISIBLE' : 'HIDDEN'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-4 grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold">Category:</span> {course.category?.name || 'N/A'}
                        </div>
                        <div>
                          <span className="font-semibold">Price:</span> <span className="font-bold text-gray-900">₹{course.price}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center gap-3 pt-4 border-t-2 border-gray-200">
                        <button
                          onClick={() => handleToggleVisibility(course._id)}
                          className={`px-4 py-2 border-2 text-sm font-medium transition-colors duration-200 ${
                            course.isVisible 
                              ? 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100' 
                              : 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100'
                          }`}
                          disabled={togglingCourseId === course._id}
                          title={course.isVisible ? 'Hide Course' : 'Show Course'}
                        >
                          {togglingCourseId === course._id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                          ) : (
                            <>
                              {course.isVisible ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                              <span className="ml-2">{course.isVisible ? 'Hide' : 'Show'}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleCourseTypeChange(course._id, course.courseType === 'Free' ? 'Paid' : 'Free')}
                          className={`px-4 py-2 border-2 text-sm font-medium transition-colors duration-200 ${
                            course.courseType === 'Free'
                              ? 'text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100'
                              : 'text-green-700 border-green-300 bg-green-50 hover:bg-green-100'
                          }`}
                          disabled={processingId === course._id}
                          title={course.courseType === 'Free' ? 'Make Paid' : 'Make Free'}
                        >
                          {processingId === course._id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"/>
                          ) : (
                            <>
                              {course.courseType === 'Free' ? <FaDollarSign size={12} /> : <FaTag size={12} />}
                              <span className="ml-2">{course.courseType === 'Free' ? 'Make Paid' : 'Make Free'}</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="px-4 py-2 border-2 border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 text-sm font-medium transition-colors duration-200"
                          title="Edit Course"
                        >
                          <FaEdit size={12} />
                          <span className="ml-2">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course)}
                          disabled={deletingCourseId === course._id}
                          className={`px-4 py-2 border-2 border-red-300 text-red-700 bg-red-50 hover:bg-red-100 text-sm font-medium transition-colors duration-200 ${
                            deletingCourseId === course._id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Move to Recycle Bin"
                        >
                          {deletingCourseId === course._id ? (
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

export default CourseManagement;
