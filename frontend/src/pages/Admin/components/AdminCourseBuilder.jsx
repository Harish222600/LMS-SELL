import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { IoAddCircleOutline } from "react-icons/io5"
import { useSelector } from "react-redux"
import { AiFillCaretDown, AiFillCaretRight } from "react-icons/ai"
import { FaPlus, FaBook, FaVideo, FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaChevronDown, FaChevronRight, FaExclamationTriangle, FaCheckCircle, FaClock, FaPlay } from "react-icons/fa"
import { MdEdit, MdVideoLibrary, MdQuiz } from "react-icons/md"
import { RiDeleteBin6Line } from "react-icons/ri"
import { RxDropdownMenu } from "react-icons/rx"

import { createSection, updateSection, deleteSection, createSubSection, updateSubSection, deleteSubSection, getFullDetailsOfCourse } from "../../../services/operations/courseDetailsAPI"
import ConfirmationModal from "../../../components/common/ConfirmationModal"
import AdminSubSectionModal from "./AdminSubSectionModal"

export default function AdminCourseBuilder({ course, onCourseUpdate }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm()
  const { token } = useSelector((state) => state.auth)
  
  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)
  const [courseData, setCourseData] = useState(course)
  const [originalCourseData, setOriginalCourseData] = useState(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSavingAll, setIsSavingAll] = useState(false)
  const [expandedSections, setExpandedSections] = useState({})
  
  // States for SubSection Modal
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  // Fetch full course details with sections and subsections
  useEffect(() => {
    const fetchFullCourseDetails = async () => {
      if (course?._id && token) {
        try {
          setLoading(true)
          console.log("Fetching course details for course ID:", course._id)
          const fullCourseDetails = await getFullDetailsOfCourse(course._id, token)
          console.log("API Response:", fullCourseDetails)
          
          if (fullCourseDetails) {
            // Handle different response structures
            let courseData;
            if (fullCourseDetails.data && fullCourseDetails.data.courseDetails) {
              courseData = fullCourseDetails.data.courseDetails;
            } else if (fullCourseDetails.courseDetails) {
              courseData = fullCourseDetails.courseDetails;
            } else if (fullCourseDetails.data) {
              courseData = fullCourseDetails.data;
            } else {
              courseData = fullCourseDetails;
            }
            
            console.log("Processed course data:", courseData)
            console.log("Course content:", courseData.courseContent)
            
            setCourseData(courseData)
            setOriginalCourseData(JSON.parse(JSON.stringify(courseData))) // Deep copy for comparison
            setHasUnsavedChanges(false)
            
            // Expand all sections by default
            const initialExpanded = {}
            courseData.courseContent?.forEach(section => {
              initialExpanded[section._id] = true
            })
            setExpandedSections(initialExpanded)
          } else {
            console.log("No course details returned, using original course data")
            setCourseData(course)
            setOriginalCourseData(JSON.parse(JSON.stringify(course)))
          }
        } catch (error) {
          console.error("Error fetching full course details:", error)
          console.error("Error details:", error.response?.data || error.message)
          setCourseData(course)
          setOriginalCourseData(JSON.parse(JSON.stringify(course)))
        } finally {
          setLoading(false)
        }
      } else {
        console.log("No course ID or token, using original course data")
        setCourseData(course)
        setOriginalCourseData(JSON.parse(JSON.stringify(course)))
        setLoading(false)
      }
    }

    fetchFullCourseDetails()
  }, [course, token])

  // Check for unsaved changes whenever courseData changes
  useEffect(() => {
    if (originalCourseData && courseData) {
      const hasChanges = JSON.stringify(originalCourseData.courseContent) !== JSON.stringify(courseData.courseContent)
      setHasUnsavedChanges(hasChanges)
    }
  }, [courseData, originalCourseData])

  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Handle form submission for section creation/update (local state only)
  const onSubmit = async (data) => {
    setLoading(true)

    try {
      if (editSectionName) {
        // Update section name locally
        const updatedCourseContent = courseData.courseContent.map((section) =>
          section._id === editSectionName 
            ? { ...section, sectionName: data.sectionName }
            : section
        )
        const updatedCourse = { ...courseData, courseContent: updatedCourseContent }
        setCourseData(updatedCourse)
        setEditSectionName(null)
        setValue("sectionName", "")
      } else {
        // Create new section locally
        const newSection = {
          _id: `temp_${Date.now()}`, // Temporary ID
          sectionName: data.sectionName,
          subSection: [],
          isNew: true // Flag to identify new sections
        }
        const updatedCourse = { 
          ...courseData, 
          courseContent: [...courseData.courseContent, newSection] 
        }
        setCourseData(updatedCourse)
        setValue("sectionName", "")
        
        // Expand the new section
        setExpandedSections(prev => ({
          ...prev,
          [newSection._id]: true
        }))
      }
    } catch (error) {
      console.error("Error with section operation:", error)
      toast.error("Failed to update section")
    } finally {
      setLoading(false)
    }
  }

  // Cancel edit mode
  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  // Handle edit section name
  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  // Delete Section (local state only)
  const handleDeleteSection = (sectionId) => {
    try {
      const updatedCourseContent = courseData.courseContent.filter(
        section => section._id !== sectionId
      )
      const updatedCourse = { ...courseData, courseContent: updatedCourseContent }
      setCourseData(updatedCourse)
    } catch (error) {
      console.error("Error deleting section:", error)
      toast.error("Failed to remove section")
    }
    setConfirmationModal(null)
  }

  // Delete SubSection (local state only)
  const handleDeleteSubSection = (subSectionId, sectionId) => {
    try {
      const updatedCourseContent = courseData.courseContent.map((section) =>
        section._id === sectionId 
          ? { 
              ...section, 
              subSection: section.subSection.filter(sub => sub._id !== subSectionId)
            }
          : section
      )
      const updatedCourse = { ...courseData, courseContent: updatedCourseContent }
      setCourseData(updatedCourse)
    } catch (error) {
      console.error("Error deleting subsection:", error)
      toast.error("Failed to remove lecture")
    }
    setConfirmationModal(null)
  }

  // Handle SubSection Modal Close and Update (local state only)
  const handleSubSectionUpdate = (updatedSubSection, sectionId, isNew = false) => {
    console.log("🔄 Handling subsection update:", {
      sectionId,
      isNew,
      title: updatedSubSection.title,
      hasVideoFile: !!updatedSubSection.videoFile,
      hasVideoUrlDirect: !!updatedSubSection.videoUrlDirect,
      videoFile: updatedSubSection.videoFile ? {
        name: updatedSubSection.videoFile.name,
        size: updatedSubSection.videoFile.size,
        type: updatedSubSection.videoFile.type
      } : null,
      videoUrlDirect: updatedSubSection.videoUrlDirect
    })
    
    const updatedCourseContent = courseData.courseContent.map((section) => {
      if (section._id === sectionId) {
        if (isNew) {
          // Add new subsection
          const newSubSection = {
            ...updatedSubSection,
            _id: `temp_sub_${Date.now()}`,
            isNew: true
          }
          console.log("📝 Adding new subsection to local state:", newSubSection)
          return {
            ...section,
            subSection: [...section.subSection, newSubSection]
          }
        } else {
          // Update existing subsection
          console.log("📝 Updating existing subsection in local state")
          return {
            ...section,
            subSection: section.subSection.map(sub => 
              sub._id === updatedSubSection._id ? { ...updatedSubSection, isModified: true } : sub
            )
          }
        }
      }
      return section
    })
    
    const updatedCourse = { ...courseData, courseContent: updatedCourseContent }
    setCourseData(updatedCourse)
    setHasUnsavedChanges(true) // Explicitly set unsaved changes
    
    console.log("✅ Local state updated successfully")
  }

  // Save all changes to database
  const saveAllChanges = async () => {
    setIsSavingAll(true)
    
    try {
      console.log("🔄 Starting save all changes process...")
      let hasErrors = false
      let errorMessages = []

      // 1. Handle new sections
      for (const section of courseData.courseContent) {
        if (section.isNew) {
          try {
            console.log("Creating new section:", section.sectionName)
            const result = await createSection({
              sectionName: section.sectionName,
              courseId: courseData._id,
            }, token)
            
            console.log("Section creation result:", result)
            console.log("🔍 Section creation result structure:", {
              hasResult: !!result,
              hasUpdatedCourseDetails: !!(result && result.updatedCourseDetails),
              resultKeys: result ? Object.keys(result) : [],
              resultType: typeof result
            })
            
            // The result might be the updated course directly, not wrapped in updatedCourseDetails
            let updatedCourse = null;
            if (result && result.updatedCourseDetails) {
              updatedCourse = result.updatedCourseDetails;
            } else if (result && result.courseContent) {
              updatedCourse = result;
            } else if (result && result._id) {
              updatedCourse = result;
            }
            
            console.log("🔍 Updated course structure:", {
              hasUpdatedCourse: !!updatedCourse,
              courseId: updatedCourse?._id,
              courseName: updatedCourse?.courseName,
              courseContentLength: updatedCourse?.courseContent?.length || 0
            })
            
            if (updatedCourse && updatedCourse.courseContent) {
              // Find the newly created section from the updated course content
              const newSection = updatedCourse.courseContent.find(s => s.sectionName === section.sectionName)
              console.log("🔍 Found newly created section:", {
                sectionId: newSection?._id,
                sectionName: newSection?.sectionName,
                hasNewSection: !!newSection
              })
              
              console.log("🔍 Original section subsections:", {
                sectionName: section.sectionName,
                subSectionCount: section.subSection?.length || 0,
                subSections: section.subSection?.map(sub => ({
                  title: sub.title,
                  isNew: sub.isNew,
                  hasVideoFile: !!sub.videoFile
                })) || []
              })
              
              if (newSection) {
                // Handle new subsections in this new section
                console.log("🔄 Processing subsections for new section...")
                for (const subSection of section.subSection) {
                  if (subSection.isNew) {
                    try {
                      console.log("🔄 Creating new subsection in new section:", {
                        sectionId: newSection._id,
                        title: subSection.title,
                        description: subSection.description,
                        hasVideoFile: !!subSection.videoFile,
                        hasVideoUrlDirect: !!subSection.videoUrlDirect,
                        videoFileName: subSection.videoFile ? subSection.videoFile.name : 'No file',
                        videoFileSize: subSection.videoFile ? (subSection.videoFile.size / (1024 * 1024)).toFixed(2) + 'MB' : 'No file'
                      })
                      
                      // Prepare FormData for createSubSection to handle file uploads
                      const subSectionFormData = new FormData()
                      subSectionFormData.append('sectionId', newSection._id)
                      subSectionFormData.append('title', subSection.title)
                      subSectionFormData.append('description', subSection.description)
                      
                      // Handle video - either file or direct URL
                      if (subSection.videoFile) {
                        console.log("🚀 Adding video file for upload:", subSection.videoFile.name)
                        subSectionFormData.append('video', subSection.videoFile)
                      } else if (subSection.videoUrlDirect) {
                        console.log("Using existing video URL:", subSection.videoUrlDirect)
                        subSectionFormData.append('videoUrl', subSection.videoUrlDirect)
                      }
                      
                      if (subSection.quiz) {
                        subSectionFormData.append('quiz', subSection.quiz._id || subSection.quiz)
                      }
                      
                      console.log("🚀 About to call createSubSection API...")
                      const subSectionResult = await createSubSection(subSectionFormData, token)
                      console.log("✅ Subsection creation result:", subSectionResult)
                    } catch (subError) {
                      console.error("❌ Error creating subsection in new section:", subError)
                      hasErrors = true
                      errorMessages.push(`Failed to create lecture "${subSection.title}": ${subError.message}`)
                    }
                  }
                }
              }
            }
          } catch (sectionError) {
            console.error("Error creating section:", sectionError)
            hasErrors = true
            errorMessages.push(`Failed to create section "${section.sectionName}": ${sectionError.message}`)
          }
        }
      }

      // 2. Handle section updates
      for (const section of courseData.courseContent) {
        if (!section.isNew) {
          const originalSection = originalCourseData.courseContent.find(s => s._id === section._id)
          if (originalSection && originalSection.sectionName !== section.sectionName) {
            try {
              console.log("Updating section name:", section.sectionName)
              await updateSection({
                sectionName: section.sectionName,
                sectionId: section._id,
                courseId: courseData._id,
              }, token)
            } catch (updateError) {
              console.error("Error updating section:", updateError)
              hasErrors = true
              errorMessages.push(`Failed to update section "${section.sectionName}": ${updateError.message}`)
            }
          }
          
          // Handle subsection changes in existing sections
          for (const subSection of section.subSection) {
            if (subSection.isNew) {
              try {
                console.log("Creating new subsection in existing section:", {
                  sectionId: section._id,
                  title: subSection.title,
                  description: subSection.description,
                  hasVideoFile: !!subSection.videoFile,
                  hasVideoUrlDirect: !!subSection.videoUrlDirect
                })
                
                // Prepare FormData for createSubSection to handle file uploads
                const subSectionFormData = new FormData()
                subSectionFormData.append('sectionId', section._id)
                subSectionFormData.append('title', subSection.title)
                subSectionFormData.append('description', subSection.description)
                
                // Handle video - either file or direct URL
                if (subSection.videoFile) {
                  console.log("🚀 Adding video file for upload:", subSection.videoFile.name)
                  subSectionFormData.append('video', subSection.videoFile)
                } else if (subSection.videoUrlDirect) {
                  console.log("Using existing video URL:", subSection.videoUrlDirect)
                  subSectionFormData.append('videoUrl', subSection.videoUrlDirect)
                }
                
                if (subSection.quiz) {
                  subSectionFormData.append('quiz', subSection.quiz._id || subSection.quiz)
                }
                
                const subSectionResult = await createSubSection(subSectionFormData, token)
                console.log("Subsection creation result:", subSectionResult)
              } catch (subError) {
                console.error("Error creating subsection:", subError)
                hasErrors = true
                errorMessages.push(`Failed to create lecture "${subSection.title}": ${subError.message}`)
              }
            } else if (subSection.isModified) {
              try {
                console.log("Updating subsection:", {
                  sectionId: section._id,
                  subSectionId: subSection._id,
                  title: subSection.title,
                  description: subSection.description,
                  hasVideoFile: !!subSection.videoFile,
                  hasVideoUrlDirect: !!subSection.videoUrlDirect
                })
                
                // Prepare FormData for updateSubSection to handle file uploads
                const updateFormData = new FormData()
                updateFormData.append('sectionId', section._id)
                updateFormData.append('subSectionId', subSection._id)
                updateFormData.append('title', subSection.title)
                updateFormData.append('description', subSection.description)
                
                // Handle video - either file or direct URL
                if (subSection.videoFile) {
                  console.log("🚀 Adding video file for update:", subSection.videoFile.name)
                  updateFormData.append('videoFile', subSection.videoFile)
                } else if (subSection.videoUrlDirect) {
                  console.log("Using existing video URL:", subSection.videoUrlDirect)
                  updateFormData.append('videoUrl', subSection.videoUrlDirect)
                }
                
                if (subSection.quiz) {
                  updateFormData.append('quiz', subSection.quiz._id || subSection.quiz)
                }
                
                const updateResult = await updateSubSection(updateFormData, token)
                console.log("Subsection update result:", updateResult)
              } catch (updateError) {
                console.error("Error updating subsection:", updateError)
                hasErrors = true
                errorMessages.push(`Failed to update lecture "${subSection.title}": ${updateError.message}`)
              }
            }
          }
        }
      }

      // 3. Handle deleted sections
      for (const originalSection of originalCourseData.courseContent) {
        const stillExists = courseData.courseContent.find(s => s._id === originalSection._id)
        if (!stillExists) {
          try {
            console.log("Deleting section:", originalSection.sectionName)
            await deleteSection({
              sectionId: originalSection._id,
              courseId: courseData._id,
            }, token)
          } catch (deleteError) {
            console.error("Error deleting section:", deleteError)
            hasErrors = true
            errorMessages.push(`Failed to delete section "${originalSection.sectionName}": ${deleteError.message}`)
          }
        }
      }

      // 4. Handle deleted subsections
      for (const originalSection of originalCourseData.courseContent) {
        const currentSection = courseData.courseContent.find(s => s._id === originalSection._id)
        if (currentSection) {
          for (const originalSubSection of originalSection.subSection || []) {
            const stillExists = currentSection.subSection.find(s => s._id === originalSubSection._id)
            if (!stillExists) {
              try {
                console.log("Deleting subsection:", originalSubSection.title)
                await deleteSubSection({
                  subSectionId: originalSubSection._id,
                  sectionId: originalSection._id,
                }, token)
              } catch (deleteError) {
                console.error("Error deleting subsection:", deleteError)
                hasErrors = true
                errorMessages.push(`Failed to delete lecture "${originalSubSection.title}": ${deleteError.message}`)
              }
            }
          }
        }
      }

      // Refresh course data
      console.log("🔄 Refreshing course data...")
      try {
        const result = await getFullDetailsOfCourse(courseData._id, token)
        console.log("Full course details result:", result)
        
        if (result) {
          // Handle different response structures
          let refreshedCourseData;
          if (result.data && result.data.courseDetails) {
            refreshedCourseData = result.data.courseDetails;
          } else if (result.courseDetails) {
            refreshedCourseData = result.courseDetails;
          } else if (result.data) {
            refreshedCourseData = result.data;
          } else {
            refreshedCourseData = result;
          }
          
          console.log("Processed refreshed course data:", refreshedCourseData)
          
          if (refreshedCourseData && refreshedCourseData._id) {
            setCourseData(refreshedCourseData)
            setOriginalCourseData(JSON.parse(JSON.stringify(refreshedCourseData)))
            onCourseUpdate(refreshedCourseData)
            setHasUnsavedChanges(false)
            
            if (hasErrors) {
              toast.error(`Some changes failed to save:\n${errorMessages.join('\n')}`)
            } else {
              toast.success("All changes saved successfully!")
            }
          } else {
            console.error("Invalid course data structure after refresh:", refreshedCourseData)
            toast.error("Changes saved but failed to refresh course data. Please reload the page.")
          }
        } else {
          console.error("No result from getFullDetailsOfCourse")
          toast.error("Changes may have been saved but failed to refresh course data. Please reload the page.")
        }
      } catch (refreshError) {
        console.error("Error refreshing course data:", refreshError)
        toast.error("Changes may have been saved but failed to refresh course data. Please reload the page.")
      }

    } catch (error) {
      console.error("Critical error in saveAllChanges:", error)
      toast.error("Failed to save changes. Please try again.")
    } finally {
      setIsSavingAll(false)
    }
  }

  // Discard all changes
  const discardChanges = () => {
    setConfirmationModal({
      text1: "Discard Changes?",
      text2: "All unsaved changes will be lost. This action cannot be undone.",
      btn1Text: "Discard",
      btn2Text: "Cancel",
      btn1Handler: () => {
        setCourseData(JSON.parse(JSON.stringify(originalCourseData)))
        setHasUnsavedChanges(false)
        setConfirmationModal(null)
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // Calculate course statistics
  const courseStats = {
    totalSections: courseData?.courseContent?.length || 0,
    totalLectures: courseData?.courseContent?.reduce((acc, section) => acc + (section.subSection?.length || 0), 0) || 0,
    unsavedSections: courseData?.courseContent?.filter(section => section.isNew)?.length || 0,
    unsavedLectures: courseData?.courseContent?.reduce((acc, section) => 
      acc + (section.subSection?.filter(sub => sub.isNew || sub.isModified)?.length || 0), 0) || 0
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Classic Header */}
      <div className="bg-white border-b-2 border-gray-300 shadow-sm">
        <div className="px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 border-2 border-blue-200 p-3">
                <FaBook className="text-blue-600 text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Course Builder</h1>
                <p className="text-gray-600">Build and organize your course content structure</p>
              </div>
            </div>
            
            {/* Course Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center bg-blue-50 border border-blue-200 p-3">
                <div className="text-lg font-bold text-blue-800">{courseStats.totalSections}</div>
                <div className="text-xs font-medium text-blue-600">Sections</div>
              </div>
              <div className="text-center bg-green-50 border border-green-200 p-3">
                <div className="text-lg font-bold text-green-800">{courseStats.totalLectures}</div>
                <div className="text-xs font-medium text-green-600">Lectures</div>
              </div>
              <div className="text-center bg-yellow-50 border border-yellow-200 p-3">
                <div className="text-lg font-bold text-yellow-800">{courseStats.unsavedSections}</div>
                <div className="text-xs font-medium text-yellow-600">New Sections</div>
              </div>
              <div className="text-center bg-orange-50 border border-orange-200 p-3">
                <div className="text-lg font-bold text-orange-800">{courseStats.unsavedLectures}</div>
                <div className="text-xs font-medium text-orange-600">Unsaved Changes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Unsaved Changes Alert */}
        {hasUnsavedChanges && (
          <div className="bg-yellow-50 border-2 border-yellow-200 p-4 mb-6 flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-600 text-xl" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800">Unsaved Changes</h3>
              <p className="text-sm text-yellow-700">You have unsaved changes. Remember to save your work before leaving.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={discardChanges}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 border border-gray-400 flex items-center gap-2 transition-colors duration-200 font-medium text-sm"
              >
                <FaTimes size={12} />
                Discard
              </button>
              <button
                onClick={saveAllChanges}
                disabled={isSavingAll}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 border border-blue-700 flex items-center gap-2 transition-colors duration-200 font-medium text-sm ${
                  isSavingAll ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isSavingAll ? (
                  <>
                    <div className="w-3 h-3 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave size={12} />
                    Save All
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Section Creation Form */}
        <div className="bg-white border border-gray-300 shadow-sm mb-6">
          <div className="bg-gray-50 border-b border-gray-300 px-6 py-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaPlus className="text-blue-600" />
              {editSectionName ? "Edit Section" : "Add New Section"}
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Section Name Input */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700" htmlFor="sectionName">
                  Section Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="sectionName"
                  disabled={loading}
                  placeholder="Enter section name (e.g., Introduction, Getting Started)"
                  {...register("sectionName", { required: true })}
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:outline-none focus:border-blue-500 bg-white transition-colors duration-200"
                />
                {errors.sectionName && (
                  <div className="flex items-center gap-2 text-red-600">
                    <FaExclamationTriangle size={12} />
                    <span className="text-sm font-medium">Section name is required</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 border border-blue-700 flex items-center gap-2 transition-colors duration-200 font-medium"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>
                      Processing...
                    </>
                  ) : (
                    <>
                      <IoAddCircleOutline size={18} />
                      {editSectionName ? "Update Section" : "Create Section"}
                    </>
                  )}
                </button>
                {editSectionName && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 border border-gray-400 flex items-center gap-2 transition-colors duration-200 font-medium"
                  >
                    <FaTimes size={14} />
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-300 shadow-sm p-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700 font-medium">Loading course content...</span>
            </div>
          </div>
        )}

        {/* Course Content Structure */}
        {!loading && courseData?.courseContent?.length > 0 && (
          <div className="bg-white border border-gray-300 shadow-sm">
            <div className="bg-gray-50 border-b border-gray-300 px-6 py-3">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MdVideoLibrary className="text-blue-600" />
                Course Content Structure
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {courseData.courseContent.map((section, sectionIndex) => (
                  <div key={section._id} className="border border-gray-300 bg-gray-50">
                    {/* Section Header */}
                    <div className="bg-white border-b border-gray-300 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleSection(section._id)}
                            className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                          >
                            {expandedSections[section._id] ? (
                              <FaChevronDown size={16} />
                            ) : (
                              <FaChevronRight size={16} />
                            )}
                          </button>
                          <div className="bg-blue-50 border border-blue-200 p-2">
                            <FaBook className="text-blue-600 text-sm" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                              Section {sectionIndex + 1}: {section.sectionName}
                              {section.isNew && (
                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 border border-yellow-300 font-medium">
                                  UNSAVED
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {section.subSection?.length || 0} lecture{section.subSection?.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 border border-blue-200 transition-colors duration-200"
                            title="Edit Section Name"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setConfirmationModal({
                                text1: "Delete Section?",
                                text2: `Are you sure you want to delete "${section.sectionName}"? All lectures in this section will be permanently deleted.`,
                                btn1Text: "Delete Section",
                                btn2Text: "Cancel",
                                btn1Handler: () => handleDeleteSection(section._id),
                                btn2Handler: () => setConfirmationModal(null),
                              })
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-700 p-2 border border-red-200 transition-colors duration-200"
                            title="Delete Section"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section Content */}
                    {expandedSections[section._id] && (
                      <div className="p-4">
                        {/* Lectures List */}
                        {section.subSection && section.subSection.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {section.subSection.map((lecture, lectureIndex) => (
                              <div
                                key={lecture._id}
                                className="bg-white border border-gray-300 p-4 hover:shadow-sm transition-shadow duration-200"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="bg-green-50 border border-green-200 p-2">
                                      <FaVideo className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                        Lecture {lectureIndex + 1}: {lecture.title}
                                        {(lecture.isNew || lecture.isModified) && (
                                          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 border border-orange-300 font-medium">
                                            {lecture.isNew ? 'NEW' : 'MODIFIED'}
                                          </span>
                                        )}
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {lecture.description || 'No description provided'}
                                      </p>
                                      <div className="flex items-center gap-4 mt-1">
                                        {lecture.videoUrl && (
                                          <span className="text-xs text-green-600 flex items-center gap-1">
                                            <FaCheckCircle size={10} />
                                            Video Available
                                          </span>
                                        )}
                                        {lecture.timeDuration && (
                                          <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FaClock size={10} />
                                            {lecture.timeDuration}
                                          </span>
                                        )}
                                        {lecture.quiz && (
                                          <span className="text-xs text-purple-600 flex items-center gap-1">
                                            <MdQuiz size={12} />
                                            Quiz Attached
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setViewSubSection(lecture)}
                                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-2 border border-gray-200 transition-colors duration-200"
                                      title="View Lecture"
                                    >
                                      <FaEye size={14} />
                                    </button>
                                    <button
                                      onClick={() => setEditSubSection({ ...lecture, sectionId: section._id })}
                                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 border border-blue-200 transition-colors duration-200"
                                      title="Edit Lecture"
                                    >
                                      <FaEdit size={14} />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setConfirmationModal({
                                          text1: "Delete Lecture?",
                                          text2: `Are you sure you want to delete "${lecture.title}"? This action cannot be undone.`,
                                          btn1Text: "Delete Lecture",
                                          btn2Text: "Cancel",
                                          btn1Handler: () => handleDeleteSubSection(lecture._id, section._id),
                                          btn2Handler: () => setConfirmationModal(null),
                                        })
                                      }
                                      className="bg-red-50 hover:bg-red-100 text-red-700 p-2 border border-red-200 transition-colors duration-200"
                                      title="Delete Lecture"
                                    >
                                      <FaTrash size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500 bg-white border border-gray-200 mb-4">
                            <FaVideo className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="font-medium">No lectures in this section</p>
                            <p className="text-sm">Add your first lecture to get started</p>
                          </div>
                        )}

                        {/* Add Lecture Button */}
                        <button
                          onClick={() => setAddSubsection(section._id)}
                          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 border-2 border-dashed border-blue-300 hover:border-blue-400 flex items-center justify-center gap-2 transition-all duration-200 font-medium"
                        >
                          <FaPlus size={16} />
                          Add New Lecture to This Section
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Content Message */}
        {!loading && (!courseData?.courseContent || courseData.courseContent.length === 0) && (
          <div className="bg-white border border-gray-300 shadow-sm p-12">
            <div className="text-center">
              <div className="bg-gray-100 border-2 border-gray-300 p-6 inline-block mb-4">
                <FaBook className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Course Content Yet</h3>
              <p className="text-gray-600 mb-6">Start building your course by creating your first section above.</p>
              <div className="bg-blue-50 border border-blue-200 p-4 max-w-md mx-auto">
                <h4 className="font-semibold text-blue-800 mb-2">Getting Started Tips:</h4>
                <ul className="text-sm text-blue-700 text-left space-y-1">
                  <li>• Create sections to organize your content</li>
                  <li>• Add lectures with videos and descriptions</li>
                  <li>• Use clear, descriptive names</li>
                  <li>• Save your changes regularly</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SubSection Modals */}
      {addSubSection && (
        <AdminSubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
          onUpdate={(updatedSubSection) => {
            handleSubSectionUpdate(updatedSubSection, addSubSection, true)
          }}
        />
      )}
      {viewSubSection && (
        <AdminSubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
          onUpdate={() => {}} // View mode doesn't need updates
        />
      )}
      {editSubSection && (
        <AdminSubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
          onUpdate={(updatedSubSection) => {
            handleSubSectionUpdate(updatedSubSection, editSubSection.sectionId, false)
          }}
        />
      )}

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
