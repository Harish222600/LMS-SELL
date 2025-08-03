import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as Icons from 'react-icons/fa'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTags, FaEye, FaChartBar, FaTimes, FaBook, FaCheckCircle, FaExclamationTriangle, FaSave, FaArrowLeft, FaCopy, FaFileCsv, FaFileExcel, FaFilePdf, FaPrint, FaCalendarAlt } from 'react-icons/fa'
import { MdCategory, MdDescription } from 'react-icons/md'
import IconBtn from '../../../common/IconBtn'
import ConfirmationModal from '../../../common/ConfirmationModal'
import { createCategory, updateCategory, deleteCategory } from '../../../../services/operations/categoryAPI'
import { fetchCourseCategories } from '../../../../services/operations/courseDetailsAPI'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function CourseCategories() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState('FaBook')
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [editingCategory, setEditingCategory] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter categories based on search term
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Popular icons for categories
  const availableIcons = [
    'FaBook', 'FaCode', 'FaDesktop', 'FaPaintBrush', 'FaCamera', 'FaMusic',
    'FaCalculator', 'FaFlask', 'FaGraduationCap', 'FaLanguage', 'FaChartBar',
    'FaRocket', 'FaLightbulb', 'FaHeart', 'FaGamepad', 'FaCog', 'FaDatabase',
    'FaMobile', 'FaCloud', 'FaShield', 'FaUsers', 'FaBriefcase', 'FaGlobe',
    'FaAtom', 'FaDna', 'FaMicroscope', 'FaTheaterMasks', 'FaFilm', 'FaPalette',
    'FaLaptopCode', 'FaServer', 'FaNetworkWired', 'FaRobot', 'FaBrain',
    'FaChalkboardTeacher', 'FaBookReader', 'FaCertificate', 'FaAward', 'FaMedal',
    'FaProjectDiagram', 'FaSitemap', 'FaCodeBranch', 'FaTerminal', 'FaKeyboard',
    'FaMicrochip', 'FaMemory', 'FaHdd', 'FaWifi', 'FaBluetooth',
    'FaAndroid', 'FaApple', 'FaLinux', 'FaWindows', 'FaUbuntu',
    'FaReact', 'FaNodeJs', 'FaPython', 'FaJava', 'FaJs',
    'FaHtml5', 'FaCss3Alt', 'FaBootstrap', 'FaSass', 'FaVuejs',
    'FaAngular', 'FaPhp', 'FaLaravel', 'FaWordpress', 'FaDrupal',
    'FaGitAlt', 'FaGithub', 'FaBitbucket', 'FaDocker', 'FaAws'
  ]

  // Fetch existing categories
  const loadCategories = async () => {
    setCategoriesLoading(true)
    try {
      const result = await fetchCourseCategories()
      setCategories(result || [])
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    
    const categoryData = {
      name: data.categoryName,
      description: data.categoryDescription,
      icon: selectedIcon
    }
    
    try {
      let result
      if (editingCategory) {
        categoryData.categoryId = editingCategory._id
        result = await updateCategory(categoryData, token)
        if (result) {
          toast.success('Category updated successfully')
        }
      } else {
        result = await createCategory(categoryData, token)
        if (result) {
          toast.success('Category created successfully')
        }
      }
      
      if (result) {
        reset()
        setSelectedIcon('FaBook')
        setShowCreateForm(false)
        setShowIconPicker(false)
        setEditingCategory(null)
        loadCategories()
      }
    } catch (error) {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName]
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Icons.FaBook className="w-6 h-6" />
  }

  const handleReset = () => {
    reset()
    setSelectedIcon('FaBook')
    setShowIconPicker(false)
  }

  const handleCreateNew = () => {
    setEditingCategory(null)
    setShowCreateForm(true)
    handleReset()
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingCategory(null)
    handleReset()
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowCreateForm(true)
    setSelectedIcon(category.icon || 'FaBook')
    reset({
      categoryName: category.name,
      categoryDescription: category.description
    })
  }

  const handleDelete = async (categoryId) => {
    try {
      const result = await deleteCategory(categoryId, token)
      if (result) {
        setConfirmationModal(null)
        toast.success('Category deleted successfully')
        loadCategories()
      }
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  // Export functions
  const formatCategoryData = (category, index) => ({
    'S.No': index + 1,
    'Category ID': category._id,
    'Category Name': category.name,
    'Description': category.description,
    'Icon': category.icon || 'FaBook',
    'Total Courses': category.courses?.length || 0,
    'Created Date': new Date(category.createdAt).toLocaleDateString()
  })

  const handleCopy = () => {
    const data = filteredCategories.map((category, index) => formatCategoryData(category, index))
    const headers = Object.keys(data[0] || {}).join('\t')
    const rows = data.map(row => Object.values(row).join('\t'))
    const finalString = [headers, ...rows].join('\n')
    
    navigator.clipboard.writeText(finalString)
    toast.success('Category data copied to clipboard')
  }

  const handleCSV = () => {
    const data = filteredCategories.map((category, index) => formatCategoryData(category, index))
    const headers = Object.keys(data[0] || {}).join(',')
    const rows = data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'categories.csv')
    toast.success('CSV file downloaded')
  }

  const handleExcel = () => {
    const data = filteredCategories.map((category, index) => formatCategoryData(category, index))
    const ws = XLSX.utils.json_to_sheet(data)
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Categories')
    XLSX.writeFile(wb, 'categories.xlsx')
    toast.success('Excel file downloaded')
  }

  const handlePDF = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4')
    const data = filteredCategories.map((category, index) => {
      const formattedCategory = formatCategoryData(category, index)
      return Object.values(formattedCategory)
    })

    autoTable(doc, {
      head: [Object.keys(formatCategoryData(filteredCategories[0] || {}, 0))],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    })
    
    doc.save('categories.pdf')
    toast.success('PDF file downloaded')
  }

  const handlePrint = () => {
    const doc = new jsPDF('landscape', 'mm', 'a4')
    const data = filteredCategories.map((category, index) => {
      const formattedCategory = formatCategoryData(category, index)
      return Object.values(formattedCategory)
    })

    autoTable(doc, {
      head: [Object.keys(formatCategoryData(filteredCategories[0] || {}, 0))],
      body: data,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 37, 41] }
    })
    
    doc.autoPrint()
    window.open(doc.output('bloburl'), '_blank')
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  // Calculate statistics
  const categoryStats = {
    totalCategories: categories.length,
    activeCategories: categories.filter(cat => cat.courses?.length > 0).length,
    averageCourses: categories.length > 0 
      ? Math.round(categories.reduce((acc, cat) => acc + (cat.courses?.length || 0), 0) / categories.length)
      : 0
  }

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Course Categories</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              {showCreateForm && (
                <button
                  onClick={handleCancel}
                  className="btn-classic-secondary flex items-center gap-2"
                  title="Back to Categories"
                >
                  <FaArrowLeft size={14} />
                  Back
                </button>
              )}
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <MdCategory className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  {showCreateForm 
                    ? (editingCategory ? 'Edit Category' : 'Create New Category')
                    : 'Course Categories Management'
                  }
                </h1>
                <p className="section-subtitle text-lg">
                  {showCreateForm 
                    ? 'Configure category details and academic settings'
                    : 'Organize and manage your academic course categories'
                  }
                </p>
              </div>
            </div>
            {!showCreateForm && (
              <button
                onClick={handleCreateNew}
                className="btn-elegant flex items-center gap-3"
              >
                <FaPlus size={16} />
                Create Category
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {!showCreateForm && (
          <>
            {/* Academic Statistics Panel */}
            <div className="classic-card mb-8">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <h2 className="elegant-heading text-academic-navy-900">Category Statistics</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Overview of your academic categories</p>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center group">
                    <div className="classic-card bg-academic-gold-50 border-academic-gold-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                      <FaTags className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{categoryStats.totalCategories}</div>
                      <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Categories</div>
                    </div>
                    <div className="text-xs text-academic-slate-500 font-inter">
                      All categories in system
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="classic-card bg-academic-navy-50 border-academic-navy-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                      <FaEye className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{categoryStats.activeCategories}</div>
                      <div className="text-sm font-semibold text-academic-slate-700 font-inter">Active Categories</div>
                    </div>
                    <div className="text-xs text-academic-slate-500 font-inter">
                      Categories with courses
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="classic-card bg-academic-cream-100 border-academic-cream-300 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                      <FaChartBar className="text-academic-gold-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">{categoryStats.averageCourses}</div>
                      <div className="text-sm font-semibold text-academic-slate-700 font-inter">Average Courses</div>
                    </div>
                    <div className="text-xs text-academic-slate-500 font-inter">
                      Per category
                    </div>
                  </div>

                  <div className="text-center group">
                    <div className="classic-card bg-academic-slate-50 border-academic-slate-200 p-6 mb-4 group-hover:shadow-elegant transition-all duration-300">
                      <FaBook className="text-academic-navy-700 text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-3xl font-bold text-academic-navy-900 mb-1 font-playfair">
                        {categories.reduce((acc, cat) => acc + (cat.courses?.length || 0), 0)}
                      </div>
                      <div className="text-sm font-semibold text-academic-slate-700 font-inter">Total Courses</div>
                    </div>
                    <div className="text-xs text-academic-slate-500 font-inter">
                      Across all categories
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Tools Panel */}
            <div className="classic-card mb-8">
              <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
                <h2 className="elegant-heading text-academic-navy-900">Management Tools</h2>
                <p className="text-sm text-academic-slate-600 font-inter">Export data and search categories</p>
              </div>
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-academic-navy-800 mb-4 font-inter uppercase tracking-wide">Export Data</h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 bg-academic-slate-100 hover:bg-academic-slate-200 text-academic-slate-700 border border-academic-slate-300 text-sm transition-all duration-200 font-inter font-medium rounded-lg hover:shadow-classic"
                        title="Copy to Clipboard"
                      >
                        <FaCopy size={12} className="inline mr-2" /> Copy
                      </button>
                      <button
                        onClick={handleCSV}
                        className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-800 border border-green-300 text-sm transition-all duration-200 font-inter font-medium rounded-lg hover:shadow-classic"
                        title="Export as CSV"
                      >
                        <FaFileCsv size={12} className="inline mr-2" /> CSV
                      </button>
                      <button
                        onClick={handleExcel}
                        className="px-4 py-2 bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-800 border border-academic-navy-300 text-sm transition-all duration-200 font-inter font-medium rounded-lg hover:shadow-classic"
                        title="Export as Excel"
                      >
                        <FaFileExcel size={12} className="inline mr-2" /> Excel
                      </button>
                      <button
                        onClick={handlePDF}
                        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300 text-sm transition-all duration-200 font-inter font-medium rounded-lg hover:shadow-classic"
                        title="Export as PDF"
                      >
                        <FaFilePdf size={12} className="inline mr-2" /> PDF
                      </button>
                      <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-academic-gold-100 hover:bg-academic-gold-200 text-academic-gold-800 border border-academic-gold-300 text-sm transition-all duration-200 font-inter font-medium rounded-lg hover:shadow-classic"
                        title="Print"
                      >
                        <FaPrint size={12} className="inline mr-2" /> Print
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-academic-navy-800 mb-4 font-inter uppercase tracking-wide">Search Categories</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search categories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="classic-input w-full sm:w-72"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400" size={16} />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors duration-200"
                          >
                            <FaTimes size={14} />
                          </button>
                        )}
                      </div>

                      {searchTerm && (
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
            {searchTerm && (
              <div className="classic-card mb-8">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <FaSearch className="text-academic-gold-600" size={16} />
                    <div className="text-sm text-academic-slate-700 font-inter">
                      Showing <span className="font-bold text-academic-navy-900">{filteredCategories.length}</span> of <span className="font-bold text-academic-navy-900">{categoryStats.totalCategories}</span> categories
                      <span className="text-academic-gold-700 font-semibold"> matching "{searchTerm}"</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Academic Create/Edit Form */}
        {showCreateForm && (
          <div className="classic-card">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
              <h2 className="elegant-heading text-academic-navy-900 flex items-center gap-3">
                <MdCategory className="text-academic-gold-700" />
                {editingCategory ? 'Edit Category Details' : 'Create New Category'}
              </h2>
              <p className="section-subtitle text-academic-slate-600 font-inter">
                {editingCategory ? 'Update category information and academic settings' : 'Fill in the details to create a new academic category'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-10">
              {/* Academic Form Progress Indicator */}
              <div className="bg-academic-gold-50 border border-academic-gold-200 p-6 rounded-xl">
                <div className="flex items-center gap-4">
                  <FaCheckCircle className="text-academic-gold-700 text-xl" />
                  <div>
                    <h3 className="font-bold text-academic-gold-800 font-playfair text-lg">Category Information Form</h3>
                    <p className="text-sm text-academic-gold-700 font-inter">Complete all required fields to save the academic category</p>
                  </div>
                </div>
              </div>

              {/* Academic Basic Category Details Section */}
              <div className="classic-card bg-academic-cream-50 p-8">
                <h3 className="elegant-heading text-academic-navy-900 mb-6 flex items-center gap-3">
                  <MdCategory className="text-academic-gold-700" />
                  Basic Category Details
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Category Name */}
                  <div className="lg:col-span-2">
                    <label className="classic-label" htmlFor="categoryName">
                      Category Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="categoryName"
                      placeholder="Enter academic category name"
                      {...register("categoryName", { required: true })}
                      className="classic-input"
                    />
                    {errors.categoryName && (
                      <div className="flex items-center gap-2 text-red-600 mt-3">
                        <FaExclamationTriangle size={14} />
                        <span className="text-sm font-medium font-inter">Category name is required</span>
                      </div>
                    )}
                  </div>

                  {/* Category Description */}
                  <div className="lg:col-span-2">
                    <label className="classic-label" htmlFor="categoryDescription">
                      Category Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="categoryDescription"
                      placeholder="Provide a detailed description of this academic category"
                      {...register("categoryDescription", { required: true })}
                      className="classic-textarea"
                    />
                    {errors.categoryDescription && (
                      <div className="flex items-center gap-2 text-red-600 mt-3">
                        <FaExclamationTriangle size={14} />
                        <span className="text-sm font-medium font-inter">Category description is required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Icon Selection Section */}
              <div className="classic-card bg-white p-8">
                <h3 className="elegant-heading text-academic-navy-900 mb-6 flex items-center gap-3">
                  <FaTags className="text-academic-gold-700" />
                  Category Icon
                </h3>
                
                {/* Selected Icon Display */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center justify-center w-20 h-20 bg-academic-gold-50 border-2 border-academic-gold-300 p-4 rounded-xl">
                    <div className="text-academic-gold-700 text-2xl">
                      {renderIcon(selectedIcon)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-academic-navy-800 font-inter uppercase tracking-wide">Selected Icon</p>
                    <p className="text-academic-slate-600 font-inter font-medium">{selectedIcon}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="btn-elegant"
                  >
                    {showIconPicker ? 'Hide Icons' : 'Choose Icon'}
                  </button>
                </div>

                {/* Icon Picker Grid */}
                {showIconPicker && (
                  <div className="bg-academic-slate-50 border-2 border-academic-slate-200 p-6 rounded-xl">
                    <h4 className="text-sm font-bold text-academic-navy-800 mb-4 font-inter uppercase tracking-wide">Select an Icon</h4>
                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-16 gap-3 max-h-80 overflow-y-auto">
                      {availableIcons.map((iconName) => (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => {
                            setSelectedIcon(iconName)
                            setShowIconPicker(false)
                          }}
                          className={`flex items-center justify-center w-12 h-12 border-2 transition-all hover:scale-110 rounded-lg ${
                            selectedIcon === iconName
                              ? 'border-academic-gold-500 bg-academic-gold-50 text-academic-gold-700 shadow-classic'
                              : 'border-academic-slate-300 bg-white text-academic-slate-600 hover:border-academic-gold-300 hover:shadow-classic'
                          }`}
                          title={iconName}
                        >
                          {renderIcon(iconName)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Action Buttons */}
              <div className="bg-academic-navy-50 border-t-2 border-academic-slate-200 p-8 flex flex-col sm:flex-row gap-4 justify-end rounded-b-lg">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="btn-classic-secondary flex items-center justify-center gap-3"
                >
                  <FaTimes size={14} />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`btn-elegant flex items-center justify-center gap-3 ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <FaSave size={16} />
                      {editingCategory ? "Update Category" : "Create Category"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Academic Categories List */}
        {!showCreateForm && (
          <div className="classic-card">
            <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="elegant-heading text-academic-navy-900">Category Directory</h2>
                  <p className="text-sm text-academic-slate-600 font-inter">Manage your academic categories</p>
                </div>
                <div className="text-sm text-academic-slate-700 font-inter">
                  Showing <span className="font-bold text-academic-navy-900">{filteredCategories.length}</span> of <span className="font-bold text-academic-navy-900">{categoryStats.totalCategories}</span> categories
                </div>
              </div>
            </div>

            {/* Academic Loading State */}
            {categoriesLoading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 animate-spin rounded-full border-3 border-academic-gold-600 border-t-transparent"/>
                  <span className="text-academic-slate-700 font-medium font-inter">Loading categories...</span>
                </div>
              </div>
            )}

            {/* Academic Empty State */}
            {!categoriesLoading && filteredCategories.length === 0 && (
              <div className="p-16 text-center">
                <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 inline-block mb-6 rounded-xl">
                  <FaTags className="text-5xl text-academic-gold-700" />
                </div>
                <h3 className="classic-heading text-2xl text-academic-navy-900 mb-3">No Categories Found</h3>
                <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md mx-auto">
                  {searchTerm ? 'Try adjusting your search criteria to find the categories you\'re looking for.' : 'Create your first academic category to get started with organizing your courses.'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreateNew}
                    className="btn-elegant flex items-center gap-3 mx-auto"
                  >
                    <FaPlus size={16} />
                    Create First Category
                  </button>
                )}
              </div>
            )}

            {/* Academic Categories Grid */}
            {!categoriesLoading && filteredCategories.length > 0 && (
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCategories.map((category) => (
                    <div
                      key={category._id}
                      className="classic-card bg-academic-cream-50 hover:shadow-elegant group transition-all duration-300 p-6"
                    >
                      {/* Header with Icon, Title and Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="bg-white border-2 border-academic-gold-300 p-3 rounded-xl group-hover:border-academic-gold-400 transition-colors duration-300 flex-shrink-0">
                            <div className="text-academic-gold-700 group-hover:text-academic-gold-800 transition-colors duration-300 text-xl">
                              {category.icon ? renderIcon(category.icon) : <FaBook />}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-academic-navy-900 mb-1 font-playfair group-hover:text-academic-navy-800 transition-colors duration-300 line-clamp-2">
                              {category.name}
                            </h3>
                            <p className="text-sm text-academic-slate-600 font-inter font-medium">
                              {category.courses?.length || 0} Course{category.courses?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0 ml-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-academic-navy-100 hover:bg-academic-navy-200 text-academic-navy-700 p-2 border border-academic-navy-200 transition-all duration-200 rounded-lg hover:shadow-classic"
                            title="Edit Category"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setConfirmationModal({
                                text1: "Delete Category?",
                                text2: `Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`,
                                btn1Text: "Delete Category",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDelete(category._id),
                                btn2Handler: () => setConfirmationModal(null),
                              })
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 border border-red-200 transition-all duration-200 rounded-lg hover:shadow-classic"
                            title="Delete Category"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-sm text-academic-slate-700 line-clamp-3 font-inter leading-relaxed">
                          {category.description}
                        </p>
                      </div>

                      {/* Footer with ID and Date */}
                      <div className="pt-4 border-t border-academic-slate-200">
                        <div className="flex items-center justify-between text-xs text-academic-slate-500 font-inter">
                          <span className="font-medium">ID: {category._id.slice(-8).toUpperCase()}</span>
                          <span className="font-medium">
                            {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
  )
}
