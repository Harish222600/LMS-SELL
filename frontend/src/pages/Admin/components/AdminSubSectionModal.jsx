import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"
import { FaVideo, FaEdit, FaEye, FaPlus, FaSave, FaTimes, FaExclamationTriangle, FaCheckCircle, FaPlay, FaClock, FaFileVideo, FaUpload } from "react-icons/fa"
import { MdVideoLibrary, MdDescription, MdTitle } from "react-icons/md"

import {
  createSubSection,
  updateSubSection,
} from "../../../services/operations/courseDetailsAPI"
import { getAllQuizzes } from "../../../services/operations/quizAPI"
import Upload from "../../../components/core/Dashboard/AddCourse/Upload"

export default function AdminSubSectionModal({ 
  modalData, 
  setModalData, 
  add = false, 
  view = false, 
  edit = false,
  onUpdate 
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm()

  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (view || edit) {
      console.log("🎬 AdminSubSectionModal Debug:", {
        mode: view ? 'view' : 'edit',
        modalData: modalData,
        subSectionId: modalData?._id,
        videoUrl: modalData?.videoUrl,
        title: modalData?.title
      })
      setValue("lectureTitle", modalData.title)
      setValue("lectureDesc", modalData.description)
      setValue("lectureVideo", modalData.videoUrl)
    }
  }, [])

  // detect whether form is updated or not
  const isFormUpdated = () => {
    const currentValues = getValues()
    
    // Check if title or description changed
    const titleChanged = currentValues.lectureTitle !== modalData.title
    const descChanged = currentValues.lectureDesc !== modalData.description
    const quizChanged = currentValues.quiz !== (modalData.quiz?._id || "")
    
    // Check if video changed - compare File object vs URL string
    const videoChanged = currentValues.lectureVideo instanceof File || 
                        (currentValues.lectureVideo && 
                         typeof currentValues.lectureVideo === 'string' && 
                         currentValues.lectureVideo !== modalData.videoUrl)
    
    return titleChanged || descChanged || videoChanged || quizChanged
  }

  // handle the editing of subsection - only update local state, not database
  const handleEditSubsection = () => {
    const currentValues = getValues()
    
    // Create updated subsection object for local state
    const updatedSubSection = {
      ...modalData,
      title: currentValues.lectureTitle,
      description: currentValues.lectureDesc,
      quiz: currentValues.quiz ? { _id: currentValues.quiz } : null,
      // Handle video URL - support both File objects and direct upload URLs
      videoUrl: currentValues.lectureVideo instanceof File ? 
        URL.createObjectURL(currentValues.lectureVideo) : 
        (typeof currentValues.lectureVideo === 'string' ? currentValues.lectureVideo : modalData.videoUrl),
      // Store the video file or URL for batch save
      videoFile: currentValues.lectureVideo instanceof File ? currentValues.lectureVideo : null,
      videoUrlDirect: typeof currentValues.lectureVideo === 'string' ? currentValues.lectureVideo : null,
      // Mark as modified for batch save
      isModified: true
    }
    
    // Update local state through parent component
    onUpdate(updatedSubSection)
    setModalData(null)
    toast.success("Lecture updated (unsaved)")
  }

  const onSubmit = async (data) => {
    if (view) return

    if (edit) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
      } else {
        handleEditSubsection()
      }
      return
    }

    // File size validation removed - unlimited video upload size allowed

    // Debug the form data first
    console.log("AdminSubSectionModal - Form data received:", {
      lectureTitle: data.lectureTitle,
      lectureDesc: data.lectureDesc,
      lectureVideo: data.lectureVideo,
      lectureVideoType: typeof data.lectureVideo,
      lectureVideoIsFile: data.lectureVideo instanceof File,
      lectureVideoIsString: typeof data.lectureVideo === 'string',
      lectureVideoValue: data.lectureVideo
    })

    // For new lectures, only update local state (don't save to database)
    const newSubSection = {
      title: data.lectureTitle,
      description: data.lectureDesc,
      quiz: data.quiz ? { _id: data.quiz } : null,
      // Handle video URL - support both File objects and direct upload URLs
      videoUrl: data.lectureVideo instanceof File ? 
        URL.createObjectURL(data.lectureVideo) : 
        (typeof data.lectureVideo === 'string' ? data.lectureVideo : null),
      // Store the video file or URL for batch save
      videoFile: data.lectureVideo instanceof File ? data.lectureVideo : null,
      videoUrlDirect: typeof data.lectureVideo === 'string' ? data.lectureVideo : null,
      isNew: true
    }
    
    // Debug logging
    console.log("AdminSubSectionModal - Creating new subsection:", {
      title: newSubSection.title,
      description: newSubSection.description,
      hasVideoFile: !!newSubSection.videoFile,
      hasVideoUrlDirect: !!newSubSection.videoUrlDirect,
      videoUrlDirect: newSubSection.videoUrlDirect,
      originalVideoData: data.lectureVideo,
      videoType: typeof data.lectureVideo,
      videoFileName: newSubSection.videoFile ? newSubSection.videoFile.name : 'No file',
      videoFileSize: newSubSection.videoFile ? (newSubSection.videoFile.size / (1024 * 1024)).toFixed(2) + 'MB' : 'No file'
    })
    
    onUpdate(newSubSection)
    setModalData(null)
  }

  // Get modal title and icon based on mode
  const getModalInfo = () => {
    if (view) return { title: "View Lecture", icon: FaEye, color: "text-blue-600" }
    if (add) return { title: "Add New Lecture", icon: FaPlus, color: "text-green-600" }
    if (edit) return { title: "Edit Lecture", icon: FaEdit, color: "text-orange-600" }
    return { title: "Lecture", icon: FaVideo, color: "text-gray-600" }
  }

  const modalInfo = getModalInfo()

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-gray-800">
      <div className="my-10 w-11/12 max-w-[800px] bg-white border-2 border-gray-400 shadow-2xl">
        {/* CSS Styles for Classic Theme Override */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Upload Component Overrides for Modal */
            .classic-upload-modal * {
              color: #374151 !important;
            }
            .classic-upload-modal label {
              color: #374151 !important;
            }
            .classic-upload-modal div[class*="bg-richblack"] {
              background-color: #f3f4f6 !important;
              border: 2px dashed #d1d5db !important;
            }
            .classic-upload-modal span[class*="text-richblack"] {
              color: #374151 !important;
            }
            .classic-upload-modal span[class*="text-yellow"] {
              color: #3b82f6 !important;
            }
            .classic-upload-modal button {
              color: #3b82f6 !important;
              background-color: transparent !important;
            }
            .classic-upload-modal span,
            .classic-upload-modal label {
              color: #374151 !important;
              opacity: 1 !important;
              visibility: visible !important;
            }
          `
        }} />

        {/* Modal Header */}
        <div className="bg-white border-b-2 border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 p-3">
                <modalInfo.icon className={`text-xl ${modalInfo.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{modalInfo.title}</h2>
                <p className="text-gray-600">
                  {view && "Review lecture content and details"}
                  {add && "Create a new lecture for this section"}
                  {edit && "Modify lecture information and content"}
                </p>
              </div>
            </div>
            <button 
              onClick={() => (!loading ? setModalData(null) : {})}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 border border-gray-400 transition-colors duration-200"
              title="Close Modal"
            >
              <RxCross2 className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Form Progress Indicator */}
            {!view && (
              <div className="bg-blue-50 border border-blue-200 p-4">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-800">
                      {add ? "Lecture Creation Form" : "Lecture Update Form"}
                    </h3>
                    <p className="text-sm text-blue-600">
                      {add ? "Fill in the details to create a new lecture" : "Modify the fields you want to update"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Lecture Video Upload Section */}
            <div className="bg-white border border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaVideo className="text-blue-600" />
                Lecture Video
                {!view && <span className="text-red-500 text-sm">*</span>}
              </h3>
              
              <div className="bg-gray-50 border-2 border-gray-300 p-4">
                <div className="classic-upload-modal">
                  <Upload
                    name="lectureVideo"
                    label=""
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    video={true}
                    viewData={view ? modalData.videoUrl : null}
                    editData={edit ? modalData.videoUrl : null}
                    subSectionId={(edit || view) && modalData?._id ? modalData._id : null}
                  />
                </div>
              </div>
              
              {view && modalData.videoUrl && (
                <div className="mt-4 bg-green-50 border border-green-200 p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <FaCheckCircle size={14} />
                    <span className="text-sm font-medium">Video is available for this lecture</span>
                  </div>
                </div>
              )}
            </div>

            {/* Lecture Information Section */}
            <div className="bg-white border border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MdDescription className="text-blue-600" />
                Lecture Information
              </h3>
              
              <div className="space-y-6">
                {/* Lecture Title */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="lectureTitle">
                    <MdTitle className="text-blue-600" size={14} />
                    Lecture Title
                    {!view && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    disabled={view || loading}
                    id="lectureTitle"
                    placeholder="Enter a descriptive title for your lecture"
                    {...register("lectureTitle", { required: true })}
                    className={`w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 ${
                      view ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {errors.lectureTitle && (
                    <div className="flex items-center gap-2 text-red-600">
                      <FaExclamationTriangle size={12} />
                      <span className="text-sm font-medium">Lecture title is required</span>
                    </div>
                  )}
                </div>
                
                {/* Lecture Description */}
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2" htmlFor="lectureDesc">
                    <MdDescription className="text-green-600" size={14} />
                    Lecture Description
                    {!view && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    disabled={view || loading}
                    id="lectureDesc"
                    placeholder="Provide a detailed description of what students will learn in this lecture"
                    {...register("lectureDesc", { required: true })}
                    className={`w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200 resize-none min-h-[120px] ${
                      view ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                  />
                  {errors.lectureDesc && (
                    <div className="flex items-center gap-2 text-red-600">
                      <FaExclamationTriangle size={12} />
                      <span className="text-sm font-medium">Lecture description is required</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* View Mode Additional Information */}
            {view && (
              <div className="bg-white border border-gray-300 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  Lecture Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaVideo className="text-blue-600" />
                      <span className="font-semibold text-blue-800">Video Status</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {modalData.videoUrl ? 'Video uploaded and ready' : 'No video uploaded'}
                    </p>
                  </div>
                  
                  {modalData.timeDuration && (
                    <div className="bg-green-50 border border-green-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock className="text-green-600" />
                        <span className="font-semibold text-green-800">Duration</span>
                      </div>
                      <p className="text-sm text-green-700">{modalData.timeDuration}</p>
                    </div>
                  )}
                  
                  {modalData.quiz && (
                    <div className="bg-purple-50 border border-purple-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCheckCircle className="text-purple-600" />
                        <span className="font-semibold text-purple-800">Quiz</span>
                      </div>
                      <p className="text-sm text-purple-700">Quiz attached to this lecture</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaFileVideo className="text-gray-600" />
                      <span className="font-semibold text-gray-800">Lecture ID</span>
                    </div>
                    <p className="text-sm text-gray-700 font-mono">{modalData._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!view && (
              <div className="bg-white border-t-2 border-gray-300 p-6 flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 border border-gray-400 flex items-center justify-center gap-2 transition-colors duration-200 font-medium"
                >
                  <FaTimes size={14} />
                  Cancel
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      {edit ? "Update Lecture" : "Create Lecture"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* View Mode Close Button */}
            {view && (
              <div className="bg-white border-t-2 border-gray-300 p-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setModalData(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 border border-blue-700 flex items-center gap-2 transition-colors duration-200 font-medium"
                >
                  <FaTimes size={14} />
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
