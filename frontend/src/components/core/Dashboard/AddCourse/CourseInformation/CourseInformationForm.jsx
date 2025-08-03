import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"
import { FaBook, FaTag, FaImage, FaList, FaUser, FaExclamationTriangle, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa"

import { editCourseDetails, fetchCourseCategories, addCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { getAllInstructors, createCourseAsAdmin } from "../../../../../services/operations/adminAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [instructors, setInstructors] = useState([])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      const categories = await fetchCourseCategories();
      if (categories.length > 0) {
        setCourseCategories(categories)
      }
      setLoading(false)
    }

    const getInstructors = async () => {
      if (user?.accountType === 'Admin') {
        setLoading(true)
        const instructorsData = await getAllInstructors(token);
        if (instructorsData) {
          setInstructors(instructorsData)
        }
        setLoading(false)
      }
    }
    
    // if form is in edit mode 
    if (editCourse) {
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseTags", course.tag)
      setValue("courseBenefits", course.whatYouWillLearn)
      setValue("courseCategory", course.category)
      setValue("courseRequirements", course.instructions)
      setValue("courseImage", course.thumbnail)
      if (user?.accountType === 'Admin' && course.instructor) {
        setValue("instructorId", course.instructor._id)
      }
    }

    getCategories()
    getInstructors()
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    if (
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags.toString() !== course.tag.toString() ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() ||
      currentValues.courseImage !== course.thumbnail) {
      return true
    }
    return false
  }

  const onSubmit = async (data) => {
    if (editCourse) {
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice)
        }
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }
        if (currentValues.courseRequirements.toString() !== course.instructions.toString()) {
          formData.append("instructions", JSON.stringify(data.courseRequirements))
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          toast.success("Course updated successfully")
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    try {
      // Validate required fields first
      if (!data.courseTitle || !data.courseShortDesc || !data.coursePrice || 
          !data.courseCategory || !data.courseImage || 
          (user?.accountType === 'Admin' && !data.instructorId)) {
        throw new Error("Please fill all required fields")
      }

      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags || []))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseRequirements || []))
      formData.append("thumbnailImage", data.courseImage)

      if (user?.accountType === 'Admin' && data.instructorId) {
        formData.append("instructorId", data.instructorId)
      }
    
      setLoading(true)
      let result
      
      if (user?.accountType === 'Admin') {
        result = await createCourseAsAdmin(formData, token)
      } else {
        result = await addCourseDetails(formData, token)
      }
      
      if (result) {
        toast.success("Course created successfully")
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-300 shadow-sm">
      {/* CSS Styles for Classic Theme Override */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* ChipInput Component Overrides */
          .classic-chip-input * {
            color: #374151 !important;
          }
          .classic-chip-input input {
            background-color: white !important;
            border: 2px solid #d1d5db !important;
            color: #374151 !important;
            padding: 12px 16px !important;
          }
          .classic-chip-input input:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
          }
          .classic-chip-input div[class*="bg-yellow"] {
            background-color: #3b82f6 !important;
            color: white !important;
          }
          .classic-chip-input span,
          .classic-chip-input label {
            color: #374151 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* RequirementsField Component Overrides */
          .classic-requirements-field * {
            color: #374151 !important;
          }
          .classic-requirements-field input {
            background-color: white !important;
            border: 2px solid #d1d5db !important;
            color: #374151 !important;
            padding: 12px 16px !important;
          }
          .classic-requirements-field input:focus {
            outline: none !important;
            border-color: #3b82f6 !important;
          }
          .classic-requirements-field button {
            color: #3b82f6 !important;
            font-weight: 600 !important;
            background: transparent !important;
          }
          .classic-requirements-field li {
            color: #374151 !important;
          }
          .classic-requirements-field span,
          .classic-requirements-field label {
            color: #374151 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
          
          /* Upload Component Overrides */
          .classic-upload-field * {
            color: #374151 !important;
          }
          .classic-upload-field div[class*="bg-richblack"] {
            background-color: #f3f4f6 !important;
            border: 2px dashed #d1d5db !important;
          }
          .classic-upload-field span[class*="text-yellow"] {
            color: #3b82f6 !important;
          }
          .classic-upload-field span,
          .classic-upload-field label {
            color: #374151 !important;
            opacity: 1 !important;
            visibility: visible !important;
          }
        `
      }} />

      <div className="bg-gray-50 border-b border-gray-300 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FaBook className="text-blue-600" />
          Course Information
        </h2>
        <p className="text-sm text-gray-600">Provide basic details about your course</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Form Progress Indicator */}
        <div className="bg-blue-50 border border-blue-200 p-4">
          <div className="flex items-center gap-3">
            <FaCheckCircle className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-800">Course Information Form</h3>
              <p className="text-sm text-blue-600">Complete all required fields to proceed to the next step</p>
            </div>
          </div>
        </div>

        {/* Basic Course Details Section */}
        <div className="bg-gray-50 border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBook className="text-blue-600" />
            Basic Course Details
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Course Title */}
            <div className="lg:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="courseTitle">
                Course Title <span className="text-red-500">*</span>
              </label>
              <input
                id="courseTitle"
                placeholder="Enter an engaging course title"
                {...register("courseTitle", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200"
              />
              {errors.courseTitle && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Course title is required</span>
                </div>
              )}
            </div>

            {/* Course Price */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="coursePrice">
                Course Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="coursePrice"
                  placeholder="Enter course price"
                  {...register("coursePrice", {
                    required: true,
                    valueAsNumber: true,
                    pattern: {
                      value: /^(0|[1-9]\d*)(\.\d+)?$/,
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200"
                />
                <HiOutlineCurrencyRupee className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl text-gray-400" />
              </div>
              {errors.coursePrice && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Course price is required</span>
                </div>
              )}
            </div>

            {/* Course Category */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="courseCategory">
                Course Category <span className="text-red-500">*</span>
              </label>
              <select
                {...register("courseCategory", { required: true })}
                defaultValue=""
                id="courseCategory"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 cursor-pointer"
              >
                <option value="" disabled>
                  Choose a Category
                </option>
                {!loading &&
                  courseCategories?.map((category, indx) => (
                    <option key={indx} value={category?._id}>
                      {category?.name}
                    </option>
                  ))}
              </select>
              {errors.courseCategory && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Course category is required</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Description Section */}
        <div className="bg-gray-50 border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaList className="text-green-600" />
            Course Description
          </h3>
          
          <div className="space-y-6">
            {/* Course Short Description */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="courseShortDesc">
                Course Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="courseShortDesc"
                placeholder="Provide a compelling description of your course"
                {...register("courseShortDesc", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 resize-none min-h-[120px]"
              />
              {errors.courseShortDesc && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Course description is required</span>
                </div>
              )}
            </div>

            {/* Benefits of the course */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="courseBenefits">
                Benefits of the course <span className="text-red-500">*</span>
              </label>
              <textarea
                id="courseBenefits"
                placeholder="Describe what students will gain from this course"
                {...register("courseBenefits", { required: true })}
                className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 resize-none min-h-[120px]"
              />
              {errors.courseBenefits && (
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Course benefits are required</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaTag className="text-purple-600" />
            Additional Information
          </h3>
          
          <div className="space-y-6">
            {/* Course Tags */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Course Tags
              </label>
              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <div className="classic-chip-input">
                  <ChipInput
                    label=""
                    name="courseTags"
                    placeholder="Enter Tags and press Enter or Comma"
                    register={register}
                    errors={errors}
                    setValue={setValue}
                  />
                </div>
              </div>
            </div>

            {/* Requirements/Instructions */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Requirements/Instructions
              </label>
              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <div className="classic-requirements-field">
                  <RequirementsField
                    name="courseRequirements"
                    label=""
                    register={register}
                    setValue={setValue}
                    errors={errors}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Media Section */}
        <div className="bg-white border border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaImage className="text-orange-600" />
            Course Media
          </h3>
          
          <div className="bg-gray-50 border-2 border-gray-300 p-4">
            <div className="classic-upload-field">
              <Upload
                name="courseImage"
                label="Course Thumbnail"
                register={register}
                setValue={setValue}
                errors={errors}
                editData={editCourse ? course?.thumbnail : null}
              />
            </div>
          </div>
        </div>

        {/* Instructor Selection - Only for Admin */}
        {user?.accountType === 'Admin' && (
          <div className="bg-white border border-gray-300 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser className="text-green-600" />
              Instructor Assignment
            </h3>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block" htmlFor="instructorId">
                Select Instructor <span className="text-red-500">*</span>
              </label>
              <select
                id="instructorId"
                defaultValue=""
                {...register("instructorId", { required: user?.accountType === 'Admin' })}
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
                <div className="flex items-center gap-2 text-red-600 mt-2">
                  <FaExclamationTriangle size={12} />
                  <span className="text-sm font-medium">Instructor selection is required</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white border-t-2 border-gray-300 p-6 flex flex-col sm:flex-row gap-4 justify-end">
          {editCourse && (
            <button
              onClick={() => dispatch(setStep(2))}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 border border-gray-400 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
            >
              <FaArrowLeft size={14} />
              Continue Without Saving
            </button>
          )}
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
                Processing...
              </>
            ) : (
              <>
                {!editCourse ? "Next Step" : "Save Changes"}
                <FaArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
