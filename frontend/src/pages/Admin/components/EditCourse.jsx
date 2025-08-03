import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import { FaBook, FaCog, FaSave, FaTimes, FaUser, FaTag, FaImage, FaList, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaEdit } from "react-icons/fa";
import { showAllCategories } from "../../../services/operations/categoryAPI";
import { getAllInstructors } from "../../../services/operations/adminAPI";
import { editCourseDetails } from "../../../services/operations/courseDetailsAPI";
import Upload from "../../../components/core/Dashboard/AddCourse/Upload";
import ChipInput from "../../../components/core/Dashboard/AddCourse/CourseInformation/ChipInput";
import RequirementsField from "../../../components/core/Dashboard/AddCourse/CourseInformation/RequirementField";
import AdminCourseBuilder from "./AdminCourseBuilder";

export default function EditCourse({ course, onCancel, onSave }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [activeTab, setActiveTab] = useState('information');
  const [currentCourse, setCurrentCourse] = useState(course);
  
  // Refs for form fields to scroll to on validation error
  const fieldRefs = useRef({});
  
  // State to track validation errors for visual indicators
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const getCategories = async () => {
      const categories = await showAllCategories();
      setCategories(categories);
    };

    const getInstructors = async () => {
      const instructorsData = await getAllInstructors(token);
      if (instructorsData) {
        setInstructors(instructorsData);
      }
    };

    // Pre-populate form with course data
    if (course) {
      setCurrentCourse(course);
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseCategory", course.category?._id);
      setValue("courseTags", course.tag || []);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseRequirements", course.instructions || []);
      setValue("courseImage", course.thumbnail);
      if (course.instructor) {
        setValue("instructorId", course.instructor._id);
      }
    }

    getCategories();
    getInstructors();
  }, [course, setValue, token]);

  // Force styling after component mounts
  useEffect(() => {
    const applyClassicStyling = () => {
      // Apply styles to ChipInput elements
      const chipInputs = document.querySelectorAll('.classic-chip-input');
      chipInputs.forEach(container => {
        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          // Make all text visible
          el.style.color = '#374151';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          
          // Style labels specifically
          if (el.tagName === 'LABEL') {
            el.style.color = '#374151';
            el.style.fontWeight = '600';
            el.style.fontSize = '14px';
            el.style.marginBottom = '8px';
            el.style.display = 'block';
          }
          
          // Style inputs
          if (el.tagName === 'INPUT') {
            el.style.backgroundColor = 'white';
            el.style.border = '2px solid #d1d5db';
            el.style.color = '#374151';
            el.style.padding = '12px 16px';
          }
          
          // Style chip tags
          if (el.classList.contains('bg-yellow-400') || (el.className && (el.className.toString().includes('yellow') || el.className.toString().includes('bg-yellow')))) {
            el.style.backgroundColor = '#3b82f6';
            el.style.color = 'white';
          }
          
          // Style spans and text elements
          if (el.tagName === 'SPAN') {
            el.style.color = '#374151';
          }
        });
      });

      // Apply styles to RequirementsField elements
      const reqFields = document.querySelectorAll('.classic-requirements-field');
      reqFields.forEach(container => {
        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          // Make all text visible
          el.style.color = '#374151';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          
          // Style labels specifically
          if (el.tagName === 'LABEL') {
            el.style.color = '#374151';
            el.style.fontWeight = '600';
            el.style.fontSize = '14px';
            el.style.marginBottom = '8px';
            el.style.display = 'block';
          }
          
          // Style inputs
          if (el.tagName === 'INPUT') {
            el.style.backgroundColor = 'white';
            el.style.border = '2px solid #d1d5db';
            el.style.color = '#374151';
            el.style.padding = '12px 16px';
          }
          
          // Style buttons (Add button)
          if (el.tagName === 'BUTTON' && !el.querySelector('svg')) {
            el.style.color = '#3b82f6';
            el.style.fontWeight = '600';
            el.style.background = 'transparent';
            el.style.border = 'none';
            el.style.cursor = 'pointer';
          }
          
          // Style list items
          if (el.tagName === 'LI') {
            el.style.color = '#374151';
          }
          
          // Style spans and text elements
          if (el.tagName === 'SPAN') {
            el.style.color = '#374151';
          }
        });
      });

      // Apply styles to Upload component elements
      const uploadFields = document.querySelectorAll('.classic-upload-field');
      uploadFields.forEach(container => {
        const allElements = container.querySelectorAll('*');
        allElements.forEach(el => {
          // Make all text visible
          el.style.color = '#374151';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          
          // Style labels specifically
          if (el.tagName === 'LABEL') {
            el.style.color = '#374151';
            el.style.fontWeight = '600';
            el.style.fontSize = '14px';
            el.style.marginBottom = '8px';
            el.style.display = 'block';
          }
          
          // Style the upload area
          if (el.className && (el.className.toString().includes('bg-richblack') || el.className.toString().includes('richblack'))) {
            el.style.backgroundColor = '#f3f4f6';
            el.style.border = '2px dashed #d1d5db';
            el.style.color = '#374151';
          }
          
          // Style buttons and links
          if (el.tagName === 'BUTTON' || (el.tagName === 'SPAN' && el.className && el.className.toString().includes('text-yellow'))) {
            el.style.color = '#3b82f6';
            el.style.fontWeight = '600';
            el.style.background = 'transparent';
            el.style.textDecoration = 'underline';
            el.style.cursor = 'pointer';
          }
          
          // Style spans and text elements
          if (el.tagName === 'SPAN') {
            el.style.color = '#374151';
          }
          
          // Style paragraphs
          if (el.tagName === 'P') {
            el.style.color = '#374151';
          }
        });
      });
    };

    // Apply styling immediately and with multiple delays to catch all renders
    applyClassicStyling();
    const timer1 = setTimeout(applyClassicStyling, 100);
    const timer2 = setTimeout(applyClassicStyling, 500);
    const timer3 = setTimeout(applyClassicStyling, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [activeTab]);

  const onSubmit = async (data, e) => {
    // Clear previous validation errors
    setValidationErrors({});

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      // Set validation errors for visual indicators
      const newValidationErrors = {};
      Object.keys(errors).forEach(field => {
        newValidationErrors[field] = errors[field].message;
      });
      setValidationErrors(newValidationErrors);

      // Find the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      // Scroll to the field
      if (fieldRefs.current[firstErrorField]) {
        fieldRefs.current[firstErrorField].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
      return;
    }

    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("courseId", course._id);
      
      // Only append changed fields
      if (data.courseTitle !== course.courseName) {
        formData.append("courseName", data.courseTitle);
      }
      if (data.courseShortDesc !== course.courseDescription) {
        formData.append("courseDescription", data.courseShortDesc);
      }
      if (data.coursePrice !== course.price) {
        formData.append("price", data.coursePrice);
      }
      if (data.courseCategory !== course.category?._id) {
        formData.append("category", data.courseCategory);
      }
      if (JSON.stringify(data.courseTags) !== JSON.stringify(course.tag)) {
        formData.append("tag", JSON.stringify(data.courseTags));
      }
      if (data.courseBenefits !== course.whatYouWillLearn) {
        formData.append("whatYouWillLearn", data.courseBenefits);
      }
      if (JSON.stringify(data.courseRequirements) !== JSON.stringify(course.instructions)) {
        formData.append("instructions", JSON.stringify(data.courseRequirements));
      }
      if (data.courseImage !== course.thumbnail) {
        formData.append("thumbnailImage", data.courseImage);
      }
      if (data.instructorId !== course.instructor?._id) {
        formData.append("instructorId", data.instructorId);
      }

      const result = await editCourseDetails(formData, token);
      
      if (result) {
        toast.success("Course updated successfully!");
        setCurrentCourse(result);
        onSave(result); // Callback to refresh course list
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course update from Course Builder
  const handleCourseUpdate = (updatedCourse) => {
    setCurrentCourse(updatedCourse);
    onSave(updatedCourse);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Aggressive CSS Styles for Classic Theme Override */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Global overrides for all text elements */
          .classic-chip-input *,
          .classic-requirements-field * {
            color: #374151 !important;
          }
          
          /* Input field overrides */
          .classic-chip-input input,
          .classic-requirements-field input,
          input[class*="form-style"] {
            background-color: white !important;
            border: 2px solid #d1d5db !important;
            color: #374151 !important;
            padding: 12px 16px !important;
          }
          
          .classic-chip-input input:focus,
          .classic-requirements-field input:focus,
          input[class*="form-style"]:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
          }
          
          .classic-chip-input input::placeholder,
          .classic-requirements-field input::placeholder {
            color: #9ca3af !important;
          }
          
          /* Chip styling */
          .classic-chip-input div[class*="bg-yellow"],
          .classic-chip-input div[class*="yellow"] {
            background-color: #3b82f6 !important;
            color: white !important;
          }
          
          /* Button styling */
          .classic-requirements-field button {
            color: #3b82f6 !important;
            font-weight: 600 !important;
            background: transparent !important;
          }
          
          /* List item styling */
          .classic-requirements-field li,
          .classic-requirements-field li span {
            color: #374151 !important;
          }
          
          /* SVG icon styling */
          .classic-requirements-field svg {
            color: #dc2626 !important;
          }
          
          /* Tailwind class overrides */
          .classic-chip-input .text-richblack-5,
          .classic-requirements-field .text-richblack-5 {
            color: #374151 !important;
          }
          
          .classic-chip-input .text-pink-200,
          .classic-requirements-field .text-pink-200 {
            color: #dc2626 !important;
          }
          
          .classic-requirements-field .text-yellow-50 {
            color: #3b82f6 !important;
          }
          
          /* Upload Component Overrides */
          .classic-upload-field * {
            color: #374151 !important;
          }
          .classic-upload-field label {
            color: #374151 !important;
          }
          .classic-upload-field div[class*="bg-richblack"] {
            background-color: #f3f4f6 !important;
            border: 2px dashed #d1d5db !important;
          }
          .classic-upload-field span[class*="text-richblack"] {
            color: #374151 !important;
          }
          .classic-upload-field span[class*="text-yellow"] {
            color: #3b82f6 !important;
          }
          .classic-upload-field button {
            color: #3b82f6 !important;
            background-color: transparent !important;
          }
          
          /* Force visibility for all text */
          .classic-chip-input span,
          .classic-chip-input label,
          .classic-requirements-field span,
          .classic-requirements-field label,
          .classic-upload-field span,
          .classic-upload-field label {
            color: #374151 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        `
      }} />

      {/* Classic Header with Navigation */}
      <div className="bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="px-8 py-6">
          <div className="text-sm text-gray-500 mb-3">
            <span>Dashboard</span> <span className="mx-2">›</span> 
            <span>Course Management</span> <span className="mx-2">›</span> 
            <span className="text-gray-800 font-medium">Edit Course</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 border border-gray-400 flex items-center gap-2 transition-colors duration-200 font-medium"
                title="Back to Course List"
              >
                <FaArrowLeft size={14} />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Course</h1>
                <p className="text-gray-600">Modify course details and content structure</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Course ID: <span className="font-mono font-semibold">{course?._id?.slice(-8).toUpperCase()}</span>
              </div>
              <div className={`px-3 py-1 text-xs font-bold border ${
                course?.status === 'Published'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
              }`}>
                {course?.status || 'DRAFT'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Overview Panel */}
      <div className="px-8 py-6">
        <div className="bg-white border border-gray-300 shadow-sm mb-6">
          <div className="bg-gray-50 border-b border-gray-300 px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaEdit className="text-blue-600" />
              Course Overview
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-blue-50 border-2 border-blue-200 p-4 mb-3">
                  <FaBook className="text-blue-600 text-2xl mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">{course?.courseName || 'Course Title'}</div>
                  <div className="text-sm font-medium text-gray-600">Course Name</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-green-50 border-2 border-green-200 p-4 mb-3">
                  <FaUser className="text-green-600 text-2xl mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">
                    {course?.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'No Instructor'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">Instructor</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-purple-50 border-2 border-purple-200 p-4 mb-3">
                  <HiOutlineCurrencyRupee className="text-purple-600 text-2xl mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">₹{course?.price || '0'}</div>
                  <div className="text-sm font-medium text-gray-600">Course Price</div>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-orange-50 border-2 border-orange-200 p-4 mb-3">
                  <FaTag className="text-orange-600 text-2xl mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">{course?.category?.name || 'No Category'}</div>
                  <div className="text-sm font-medium text-gray-600">Category</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Classic Tab Navigation */}
        <div className="bg-white border border-gray-300 shadow-sm mb-6">
          <div className="border-b border-gray-300">
            <div className="flex">
              <button
                onClick={() => setActiveTab('information')}
                className={`px-6 py-4 text-sm font-semibold border-r border-gray-300 transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === 'information'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <FaBook size={14} />
                Course Information
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-6 py-4 text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === 'builder'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <FaCog size={14} />
                Course Builder
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'information' ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Form Progress Indicator */}
                <div className="bg-blue-50 border border-blue-200 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-blue-800">Course Information Form</h3>
                      <p className="text-sm text-blue-600">Complete all required fields to update the course</p>
                    </div>
                  </div>
                </div>

                {/* Basic Information Section */}
                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaBook className="text-blue-600" />
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Course Title */}
                    <div 
                      className={`flex flex-col space-y-2 ${
                        validationErrors.courseTitle ? 'p-3 border-2 border-red-400 bg-red-50' : ''
                      }`}
                      ref={el => fieldRefs.current['courseTitle'] = el}
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="courseTitle">
                        <FaEdit className="text-blue-600" size={12} />
                        Course Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="courseTitle"
                        placeholder="Enter Course Title"
                        {...register("courseTitle", { required: "Course title is required" })}
                        className={`w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 ${
                          validationErrors.courseTitle ? 'border-red-400 focus:border-red-500' : ''
                        }`}
                      />
                      {errors.courseTitle && (
                        <div className="flex items-center gap-2 text-red-600">
                          <FaExclamationTriangle size={12} />
                          <span className="text-sm font-medium">{errors.courseTitle.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Course Price */}
                    <div 
                      className="flex flex-col space-y-2"
                      ref={el => fieldRefs.current['coursePrice'] = el}
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="coursePrice">
                        <HiOutlineCurrencyRupee className="text-green-600" size={14} />
                        Course Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          id="coursePrice"
                          placeholder="Enter Course Price"
                          {...register("coursePrice", {
                            required: "Course price is required",
                            valueAsNumber: true,
                            pattern: {
                              value: /^(0|[1-9]\d*)(\.\d+)?$/,
                              message: "Please enter a valid price"
                            },
                          })}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200"
                        />
                        <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" />
                      </div>
                      {errors.coursePrice && (
                        <div className="flex items-center gap-2 text-red-600">
                          <FaExclamationTriangle size={12} />
                          <span className="text-sm font-medium">{errors.coursePrice.message}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {/* Course Category */}
                    <div 
                      className="flex flex-col space-y-2"
                      ref={el => fieldRefs.current['courseCategory'] = el}
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="courseCategory">
                        <FaTag className="text-purple-600" size={12} />
                        Course Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("courseCategory", { required: "Course category is required" })}
                        id="courseCategory"
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 cursor-pointer"
                      >
                        <option value="" disabled>
                          Choose a Category
                        </option>
                        {categories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.courseCategory && (
                        <div className="flex items-center gap-2 text-red-600">
                          <FaExclamationTriangle size={12} />
                          <span className="text-sm font-medium">{errors.courseCategory.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Select Instructor */}
                    <div 
                      className="flex flex-col space-y-2"
                      ref={el => fieldRefs.current['instructorId'] = el}
                    >
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="instructorId">
                        <FaUser className="text-green-600" size={12} />
                        Select Instructor <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="instructorId"
                        {...register("instructorId", { required: "Instructor selection is required" })}
                        className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 cursor-pointer"
                      >
                        <option value="" disabled>
                          Choose an Instructor
                        </option>
                        {instructors?.map((instructor) => (
                          <option key={instructor._id} value={instructor._id}>
                            {instructor.firstName} {instructor.lastName}
                          </option>
                        ))}
                      </select>
                      {errors.instructorId && (
                        <div className="flex items-center gap-2 text-red-600">
                          <FaExclamationTriangle size={12} />
                          <span className="text-sm font-medium">{errors.instructorId.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Course Description Section */}
                <div className="bg-gray-50 border border-gray-300 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaList className="text-blue-600" />
                    Course Description
                  </h3>
                  
                  {/* Course Short Description */}
                  <div 
                    className="flex flex-col space-y-2 mb-6"
                    ref={el => fieldRefs.current['courseShortDesc'] = el}
                  >
                    <label className="text-sm font-semibold text-gray-700" htmlFor="courseShortDesc">
                      Course Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="courseShortDesc"
                      placeholder="Enter a brief description of the course"
                      {...register("courseShortDesc", { required: "Course description is required" })}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 resize-none min-h-[120px]"
                    />
                    {errors.courseShortDesc && (
                      <div className="flex items-center gap-2 text-red-600">
                        <FaExclamationTriangle size={12} />
                        <span className="text-sm font-medium">{errors.courseShortDesc.message}</span>
                      </div>
                    )}
                  </div>

                  {/* Benefits of the course */}
                  <div 
                    className="flex flex-col space-y-2"
                    ref={el => fieldRefs.current['courseBenefits'] = el}
                  >
                    <label className="text-sm font-semibold text-gray-700" htmlFor="courseBenefits">
                      Benefits of the course <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="courseBenefits"
                      placeholder="Enter benefits students will gain from this course"
                      {...register("courseBenefits", { required: "Course benefits are required" })}
                      className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 resize-none min-h-[120px]"
                    />
                    {errors.courseBenefits && (
                      <div className="flex items-center gap-2 text-red-600">
                        <FaExclamationTriangle size={12} />
                        <span className="text-sm font-medium">{errors.courseBenefits.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-white border border-gray-300 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaTag className="text-blue-600" />
                    Additional Information
                  </h3>
                  
                  {/* Course Tags */}
                  <div className="mb-6">
                    <div className="bg-white border-2 border-gray-300 p-4">
                      <div 
                        className="classic-chip-input"
                        style={{
                          color: '#374151',
                          '--text-richblack-5': '#374151',
                          '--text-pink-200': '#dc2626',
                          '--bg-yellow-400': '#3b82f6'
                        }}
                      >
                        <div style={{ color: '#374151' }}>
                          <ChipInput
                            label="Course Tags"
                            name="courseTags"
                            placeholder="Enter Tags and press Enter or Comma"
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            initialData={course?.tag || []}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.courseTags && (
                      <div className="flex items-center gap-2 text-red-600 mt-2">
                        <FaExclamationTriangle size={12} />
                        <span className="text-sm font-medium">Course tags are required</span>
                      </div>
                    )}
                  </div>

                  {/* Requirements/Instructions */}
                  <div ref={el => fieldRefs.current['courseRequirements'] = el}>
                    <div className="bg-white border-2 border-gray-300 p-4">
                      <div 
                        className="classic-requirements-field"
                        style={{
                          color: '#374151',
                          '--text-richblack-5': '#374151',
                          '--text-pink-200': '#dc2626',
                          '--text-yellow-50': '#3b82f6'
                        }}
                      >
                        <div style={{ color: '#374151' }}>
                          <RequirementsField
                            name="courseRequirements"
                            label="Requirements/Instructions"
                            register={register}
                            setValue={setValue}
                            errors={errors}
                            initialData={course?.instructions || []}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.courseRequirements && (
                      <div className="flex items-center gap-2 text-red-600 mt-2">
                        <FaExclamationTriangle size={12} />
                        <span className="text-sm font-medium">Course requirements are required</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Media Section */}
                <div className="bg-white border border-gray-300 p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaImage className="text-blue-600" />
                    Course Media
                  </h3>
                  
                  {/* Course Thumbnail Image */}
                  <div className="bg-white border-2 border-gray-300 p-4">
                    <div className="classic-upload-field">
                      <Upload
                        name="courseImage"
                        label="Course Thumbnail"
                        register={register}
                        setValue={setValue}
                        errors={errors}
                        editData={course?.thumbnail}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white border-t-2 border-gray-300 p-6 flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 border border-gray-400 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
                  >
                    <FaTimes size={14} />
                    Cancel Changes
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 border border-blue-700 flex items-center justify-center gap-2 transition-colors duration-200 font-medium ${
                      loading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                        Updating Course...
                      </>
                    ) : (
                      <>
                        <FaSave size={14} />
                        Update Course
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <AdminCourseBuilder
                course={currentCourse}
                onCourseUpdate={handleCourseUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
