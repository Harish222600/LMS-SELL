import { useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FiUploadCloud } from "react-icons/fi"
import { useSelector } from "react-redux"
import { uploadVideoToS3, uploadImageToS3 } from "../../../../utils/clientUpload"
import VideoUploadProgress from "../../../common/VideoUploadProgress"



export default function Upload({ name, label, register, setValue, errors, video = false, viewData = null, editData = null, setImageFile = null, subSectionId = null }) {
  const { token } = useSelector((state) => state.auth)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewSource, setPreviewSource] = useState("")
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState(null)
  const inputRef = useRef(null)
  const videoRef = useRef(null)
  
  // Debug props
  console.log("📤 Upload Component Props:", {
    name,
    video,
    viewData,
    editData,
    subSectionId,
    hasToken: !!token
  })

  // Handle existing video data when component mounts or data changes
  useEffect(() => {
    const existingVideoUrl = viewData || editData
    console.log("🔍 Upload useEffect triggered:", {
      existingVideoUrl,
      viewData,
      editData,
      name,
      video
    })
    
    if (existingVideoUrl && typeof existingVideoUrl === 'string') {
      console.log("📹 Setting existing video preview:", existingVideoUrl)
      setPreviewSource(existingVideoUrl)
      setValue(name, existingVideoUrl)
      setUploadStatus('completed')
      
      // Set upload result to show the video is already uploaded
      setUploadResult({
        secure_url: existingVideoUrl,
        resource_type: video ? 'video' : 'image'
      })
    } else {
      console.log("⚠️ No existing video URL found or invalid format")
    }
  }, [viewData, editData, name, setValue, video])
  
  // CLIENT-SIDE Upload state management
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploadStatus, setUploadStatus] = useState('idle') // 'idle', 'uploading', 'completed', 'error'

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      console.log("📁 File dropped:", {
        name: file.name,
        type: file.type,
        size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
      })
      
      // Reset upload state
      resetUploadState()
      
      previewFile(file)
      setSelectedFile(file)
      
      // CLIENT-SIDE UPLOAD: Start upload immediately for both images and videos
      startClientSideUpload(file)
    }
  }

  // Reset upload state
  const resetUploadState = () => {
    setIsUploading(false)
    setUploadProgress(0)
    setUploadError(null)
    setUploadResult(null)
    setUploadStatus('idle')
  }

  // CLIENT-SIDE UPLOAD: Simple and fast for all file sizes
  const startClientSideUpload = async (file) => {
    try {
      console.log('🚀 Starting CLIENT-SIDE upload for:', file.name, `(${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
      setIsUploading(true)
      setUploadStatus('uploading')
      setUploadError(null)
      setUploadProgress(0)
      
      const folder = video ? 'videos' : 'images'
      
      // Use client-side upload utility
      const result = video 
        ? await uploadVideoToS3(file, folder, (progress) => {
            setUploadProgress(progress)
            console.log(`📹 Video upload progress: ${progress}%`)
          })
        : await uploadImageToS3(file, folder, (progress) => {
            setUploadProgress(progress)
            console.log(`🖼️ Image upload progress: ${progress}%`)
          })
      
      console.log('✅ CLIENT-SIDE upload completed:', {
        url: result.secure_url,
        duration: result.duration,
        size: `${(result.size / (1024 * 1024)).toFixed(2)}MB`
      })
      
      setUploadResult(result)
      setUploadStatus('completed')
      setIsUploading(false)
      setUploadProgress(100)
      
      // Set the result URL in the form
      setValue(name, result.secure_url)
      
      // Store duration for videos (if available)
      if (video && result.duration !== undefined) {
        // Store duration in a hidden field or component state for later use
        setValue(`${name}Duration`, result.duration)
        console.log('📹 Video duration stored:', result.duration, 'seconds')
        console.log('📹 Duration field name:', `${name}Duration`)
        console.log('📹 Duration type:', typeof result.duration)
      } else if (video) {
        console.log('⚠️ Video upload completed but no duration found in result:', result)
      }
      
    } catch (error) {
      console.error('❌ CLIENT-SIDE upload failed:', error)
      setUploadError(error.message || 'Upload failed')
      setUploadStatus('error')
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  // Handle upload retry
  const retryUpload = () => {
    if (selectedFile) {
      startClientSideUpload(selectedFile)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
    onDrop,
    maxSize: video ? undefined : 10 * 1024 * 1024, // 10MB for images, unlimited for videos
    noClick: false, // Enable click behavior on the entire dropzone
    noKeyboard: true, // Disable keyboard events to prevent conflicts
  })

  // Handle browse button click
  const handleBrowseClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Browse button clicked, triggering file input")
    
    // Create a new file input element if ref doesn't work
    if (inputRef.current) {
      console.log("File input ref found, triggering click")
      try {
        inputRef.current.click()
      } catch (error) {
        console.error("Error clicking file input:", error)
        // Fallback: create a temporary file input
        createTemporaryFileInput()
      }
    } else {
      console.error("File input ref not found, creating temporary input")
      createTemporaryFileInput()
    }
  }

  // Fallback method to create temporary file input
  const createTemporaryFileInput = () => {
    const tempInput = document.createElement('input')
    tempInput.type = 'file'
    tempInput.accept = !video ? "image/*" : "video/*"
    tempInput.style.display = 'none'
    
    tempInput.onchange = (e) => {
      const files = e.target.files
      if (files && files.length > 0) {
        const file = files[0]
        console.log("Selected file via temporary input:", {
          name: file.name,
          type: file.type,
          size: file.size
        })
        onDrop([file])
      }
      // Clean up
      document.body.removeChild(tempInput)
    }
    
    document.body.appendChild(tempInput)
    tempInput.click()
  }

  const previewFile = (file) => {
    setIsLoadingPreview(true)
    setPreviewError(null)
    
    if (video) {
      // For video files, create object URL for better performance
      try {
        const objectUrl = URL.createObjectURL(file)
        setPreviewSource(objectUrl)
        setIsLoadingPreview(false)
        
        // Clean up the object URL when component unmounts or file changes
        return () => URL.revokeObjectURL(objectUrl)
      } catch (error) {
        console.error("Error creating object URL:", error)
        setPreviewError("Failed to preview video")
        setIsLoadingPreview(false)
      }
    } else {
      // For images, use FileReader as before
      const reader = new FileReader()
      reader.onloadstart = () => setIsLoadingPreview(true)
      reader.onloadend = () => {
        setPreviewSource(reader.result)
        setIsLoadingPreview(false)
      }
      reader.onerror = () => {
        setPreviewError("Failed to preview image")
        setIsLoadingPreview(false)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    register(name, { required: !video }) // Make video upload optional
  }, [register, video])

  useEffect(() => {
    if (selectedFile && !video) {
      // For images, set the file object directly (will be uploaded on form submission)
      setValue(name, selectedFile)
      if (setImageFile) {
        setImageFile(selectedFile)
      }
      console.log("Selected file set in form:", {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      })
    } else if (uploadResult && video) {
      // For videos, set the uploaded URL
      setValue(name, uploadResult.secure_url)
      console.log("Upload result URL set in form:", uploadResult.secure_url)
    }
  }, [selectedFile, uploadResult, setValue, name, setImageFile, video])

  // Handle initial video URL validation for edit/view mode
  useEffect(() => {
    const initialVideoUrl = viewData || editData
    if (initialVideoUrl && video && !selectedFile) {
      console.log("Processing initial video URL:", initialVideoUrl)
      setIsLoadingPreview(true)
      
      // Check if it's an S3 URL that needs streaming endpoint
      if (initialVideoUrl.includes('amazonaws.com') || initialVideoUrl.includes('cloudfront.net')) {
        console.log("Detected S3 video URL, using streaming endpoint")
        
        // If we don't have subSectionId but we have an S3 URL, try to find subSectionId from the current course context
        let actualSubSectionId = subSectionId;
        
        if (!actualSubSectionId && (viewData || editData)) {
          // Try to extract subSectionId from the current page context or URL
          // This is a fallback when SubSectionModal doesn't pass subSectionId properly
          const currentPath = window.location.pathname;
          const pathParts = currentPath.split('/');
          
          // Look for patterns that might contain subSectionId
          // This is a temporary workaround until we fix the modal data passing
          console.log("🔍 Attempting to find subSectionId from context:", {
            currentPath,
            pathParts,
            hasViewData: !!viewData,
            hasEditData: !!editData
          });
          
          // For now, show a more user-friendly message
          setPreviewError("Video preview is temporarily unavailable in edit mode. The video will be accessible when viewing the course.")
          setIsLoadingPreview(false)
          return;
        }
        
        // For S3 URLs, we need to use our streaming endpoint
        if (actualSubSectionId && token) {
          const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                         (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                           ? `${window.location.protocol}//${window.location.hostname}:5001` 
                           : 'http://localhost:5001');
          const streamingUrl = `${baseUrl}/api/v1/video/direct/${actualSubSectionId}?token=${token}`
          console.log("🎥 S3 Video Preview Debug:", {
            originalUrl: initialVideoUrl,
            subSectionId: actualSubSectionId,
            streamingUrl: streamingUrl,
            token: token ? `${token.substring(0, 20)}...` : 'No token'
          })
          
          // Test the streaming endpoint first
          fetch(streamingUrl, {
            method: 'HEAD',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => {
            console.log("🎥 Streaming endpoint test response:", {
              status: response.status,
              statusText: response.statusText,
              headers: Object.fromEntries(response.headers.entries())
            })
            
            if (response.ok) {
              setPreviewSource(streamingUrl)
              setIsLoadingPreview(false)
            } else {
              console.error("❌ Streaming endpoint failed:", response.status, response.statusText)
              setPreviewError(`Video streaming failed (${response.status}). Video will be accessible in course view.`)
              setIsLoadingPreview(false)
            }
          })
          .catch(error => {
            console.error("❌ Streaming endpoint error:", error)
            setPreviewError("Video preview temporarily unavailable. Video will be accessible in course view.")
            setIsLoadingPreview(false)
          })
        } else {
          console.log("SubSectionId or token not available for S3 streaming", {
            subSectionId: actualSubSectionId,
            hasToken: !!token
          })
          setPreviewError("Video preview is temporarily unavailable in edit mode. The video will be accessible when viewing the course.")
          setIsLoadingPreview(false)
        }
      } else if (initialVideoUrl.includes('supabase') || initialVideoUrl.includes('storage')) {
        console.log("Detected Supabase video URL, using direct URL")
        // For Supabase URLs, try to use them directly first
        setPreviewSource(initialVideoUrl)
        setIsLoadingPreview(false)
      } else if (initialVideoUrl.includes('http')) {
        // For other HTTP URLs, test accessibility
        const testVideo = document.createElement('video')
        testVideo.preload = 'metadata'
        
        testVideo.onloadedmetadata = () => {
          console.log("Video URL is valid and accessible")
          setPreviewSource(initialVideoUrl)
          setPreviewError(null)
          setIsLoadingPreview(false)
        }
        
        testVideo.onerror = (e) => {
          console.error("Video URL failed to load:", e)
          setPreviewError("Video file not found or inaccessible")
          setPreviewSource("")
          setIsLoadingPreview(false)
        }
        
        testVideo.src = initialVideoUrl
      } else {
        // For other formats, assume it's a video ID and construct streaming URL
        console.log("Assuming video ID, constructing streaming URL")
        let videoId = initialVideoUrl
        
        // Remove _manifest suffix if present
        if (videoId.endsWith('_manifest')) {
          videoId = videoId.replace('_manifest', '')
        }
        
        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                       (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                         ? `${window.location.protocol}//${window.location.hostname}:5001` 
                         : 'http://localhost:5001');
        const streamingUrl = `${baseUrl}/api/v1/video/stream/${videoId}?token=${token}`
        setPreviewSource(streamingUrl)
        setIsLoadingPreview(false)
      }
    }
  }, [viewData, editData, video, selectedFile, token, subSectionId])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (previewSource && previewSource.startsWith('blob:')) {
        URL.revokeObjectURL(previewSource)
      }
    }
  }, [previewSource])

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && !video && <sup className="text-pink-200">*</sup>}
        {video && <span className="text-xs text-richblack-300 ml-2">(optional)</span>}
      </label>

      <div
        className={`${
          isDragActive ? "border-yellow-50 bg-richblack-600" : "border-richblack-500 bg-richblack-700"
        } relative flex min-h-[200px] cursor-pointer items-center justify-center rounded-md border-2 border-dashed transition-all duration-200 hover:border-yellow-50`}
      >
        {isLoadingPreview ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-8 h-8 border-2 border-yellow-50 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-richblack-200">Loading preview...</p>
          </div>
        ) : previewError ? (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-sm text-pink-200 mb-2">⚠️ {previewError}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setPreviewError(null)
                  setPreviewSource("")
                  setSelectedFile(null)
                  setValue(name, null)
                }}
                className="text-sm text-yellow-50 underline hover:text-yellow-100"
              >
                Upload new {video ? "video" : "image"}
              </button>
              {(viewData || editData) && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewError(null)
                    setIsLoadingPreview(true)
                    
                    // Try different URL formats
                    const originalUrl = viewData || editData
                    console.log("Retrying with original URL:", originalUrl)
                    
                    if (originalUrl.includes('amazonaws.com') || originalUrl.includes('cloudfront.net')) {
                      // For S3 URLs, try streaming endpoint if we have subSectionId
                      if (subSectionId && token) {
                        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                                       (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                                         ? `${window.location.protocol}//${window.location.hostname}:5001` 
                                         : 'http://localhost:5001');
                        const streamingUrl = `${baseUrl}/api/v1/video/direct/${subSectionId}?token=${token}`
                        console.log("Retrying with S3 streaming URL:", streamingUrl)
                        setPreviewSource(streamingUrl)
                        setIsLoadingPreview(false)
                      } else {
                        setPreviewError("S3 video preview not available in edit mode. Video will be accessible in course view.")
                        setIsLoadingPreview(false)
                      }
                    } else if (originalUrl.includes('supabase')) {
                      // Try direct Supabase URL first
                      setPreviewSource(originalUrl)
                      setIsLoadingPreview(false)
                    } else if (token) {
                      // Try streaming endpoint
                      let videoId = originalUrl
                      
                      // If it's a Supabase manifest URL, extract the video ID
                      if (originalUrl.includes('supabase') && originalUrl.includes('manifest')) {
                        const urlParts = originalUrl.split('/')
                        videoId = urlParts[urlParts.length - 1].split('.')[0]
                        
                        // Remove _manifest suffix if present
                        if (videoId.endsWith('_manifest')) {
                          videoId = videoId.replace('_manifest', '')
                        }
                      }
                      
                      const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                                     (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                                       ? `${window.location.protocol}//${window.location.hostname}:5001` 
                                       : 'http://localhost:5001');
                      const streamingUrl = `${baseUrl}/api/v1/video/stream/${videoId}?token=${token}`
                      console.log("Trying streaming URL:", streamingUrl)
                      setPreviewSource(streamingUrl)
                      setIsLoadingPreview(false)
                    } else {
                      setPreviewSource(originalUrl)
                      setIsLoadingPreview(false)
                    }
                  }}
                  className="text-sm text-richblack-300 underline hover:text-richblack-100"
                >
                  Retry loading
                </button>
              )}
            </div>
          </div>
        ) : previewSource ? (
          <div className="flex w-full flex-col p-4 md:p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
                onError={() => setPreviewError("Failed to load image preview")}
              />
            ) : (
              <div className="relative aspect-video w-full">
                <video 
                  ref={videoRef}
                  className="h-full w-full rounded-md object-cover" 
                  controls
                  playsInline 
                  preload="metadata"
                  src={previewSource}
                  crossOrigin="anonymous"
                  onError={(e) => {
                    console.error("Video preview error:", e)
                    console.error("Failed URL:", previewSource)
                    
                    // If it's an S3 URL that failed, show appropriate error
                    if (previewSource.includes('amazonaws.com') || previewSource.includes('cloudfront.net')) {
                      console.log("S3 URL failed - this is expected due to CORS restrictions")
                      setPreviewError("Video preview not available for S3 videos in edit mode. Video will be accessible after saving.")
                      setPreviewSource("")
                      return
                    }
                    
                    // If it's a Supabase URL that failed, try alternative approaches
                    if (previewSource.includes('supabase') && !previewSource.includes('/stream/')) {
                      console.log("Supabase URL failed, trying to extract video ID")
                      // Try to extract video ID from URL and use streaming endpoint
                      const urlParts = previewSource.split('/')
                      let possibleVideoId = urlParts[urlParts.length - 1].split('.')[0]
                      
                      // Remove _manifest suffix if present
                      if (possibleVideoId.endsWith('_manifest')) {
                        possibleVideoId = possibleVideoId.replace('_manifest', '')
                      }
                      
                      if (possibleVideoId && token) {
                        const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL || 
                                       (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
                                         ? `${window.location.protocol}//${window.location.hostname}:5001` 
                                         : 'http://localhost:5001');
                        const streamingUrl = `${baseUrl}/api/v1/video/stream/${possibleVideoId}?token=${token}`
                        console.log("Trying streaming URL:", streamingUrl)
                        setPreviewSource(streamingUrl)
                        return
                      }
                    }
                    
                    setPreviewError("Failed to load video preview")
                    setPreviewSource("")
                  }}
                  onLoadedMetadata={() => {
                    console.log("Video metadata loaded successfully for:", previewSource)
                    setPreviewError(null)
                  }}
                  onLoadStart={() => {
                    console.log("Video loading started for:", previewSource)
                  }}
                >
                  Your browser does not support the video tag.
                </video>
                {selectedFile && (
                  <div className="absolute bottom-2 right-2 rounded bg-richblack-800 px-2 py-1 text-xs text-richblack-50">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                )}
                {!selectedFile && (viewData || editData) && (
                  <div className="absolute bottom-2 right-2 rounded bg-richblack-800 px-2 py-1 text-xs text-richblack-50">
                    Existing Video
                  </div>
                )}
              </div>
            )}

            {!viewData && (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Clean up object URL if it exists
                    if (previewSource && previewSource.startsWith('blob:')) {
                      URL.revokeObjectURL(previewSource)
                    }
                    setPreviewSource("")
                    setSelectedFile(null)
                    setPreviewError(null)
                    setValue(name, null)
                    resetUploadState()
                  }}
                  className="text-sm font-medium text-richblack-400 underline hover:text-yellow-50"
                >
                  {selectedFile ? 'Remove' : 'Replace'} {video ? "Video" : "Image"}
                </button>
                
                {video && uploadStatus === 'error' && (
                  <button
                    type="button"
                    onClick={retryUpload}
                    className="text-sm font-medium text-blue-400 underline hover:text-blue-300"
                  >
                    Retry Upload
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-4 md:p-6"
            {...getRootProps()}
          >
            {/* Use dropzone input for both drag and click functionality */}
            <input {...getInputProps()} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-richblack-800 transition-all duration-200 hover:bg-richblack-700">
              <FiUploadCloud className="text-2xl text-yellow-50" />
            </div>
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop {!video ? "an image" : "a video"}, or{" "}
              <span 
                className="font-semibold text-yellow-50 cursor-pointer hover:text-yellow-100 transition-colors"
                onClick={handleBrowseClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleBrowseClick(e)
                  }
                }}
              >
                browse
              </span>
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-richblack-200">
              {video ? (
                <>
                  <li className="flex items-center gap-1">
                    <span>•</span> Formats: MP4, MOV, AVI, MKV, WebM
                  </li>
                  <li className="flex items-center gap-1">
                    <span>•</span> No size limit - Direct upload to cloud storage
                  </li>
                  <li className="flex items-center gap-1">
                    <span>•</span> Large files use resumable upload
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-1">
                    <span>•</span> Aspect ratio 16:9
                  </li>
                  <li className="flex items-center gap-1">
                    <span>•</span> Recommended: 1024x576
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* CLIENT-SIDE Upload Progress for Videos */}
      {video && isUploading && (
        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-blue-400 font-medium">
              📹 Uploading {selectedFile?.name}
            </p>
            <span className="text-xs text-blue-300">
              {uploadProgress}%
            </span>
          </div>
          
          <div className="w-full bg-blue-800/30 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-blue-300">
            <span>
              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
            </span>
            <span>
              Client-side upload • Direct to S3
            </span>
          </div>
        </div>
      )}

      {video && uploadStatus === 'completed' && uploadResult && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <p className="text-sm text-green-400 flex items-center gap-2">
            <span>✅</span>
            Video uploaded successfully! Ready to save course.
          </p>
        </div>
      )}

      {video && uploadStatus === 'error' && uploadError && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-sm text-red-400 flex items-center gap-2">
            <span>❌</span>
            Upload failed: {uploadError}
          </p>
          <button
            type="button"
            onClick={retryUpload}
            className="mt-2 text-sm text-blue-400 underline hover:text-blue-300"
          >
            Try Again
          </button>
        </div>
      )}

      {errors[name] && (
        <span className="flex items-center text-xs text-pink-200">
          <span className="mr-1">⚠️</span>
          {label} is required
        </span>
      )}
    </div>
  )
}
