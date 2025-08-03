import React from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
import { RxCross2 } from "react-icons/rx"
import { FiUploadCloud, FiCheck, FiX, FiPause, FiPlay } from "react-icons/fi"

const VideoUploadProgress = ({ 
  progress = 0, 
  fileName = '', 
  fileSize = 0, 
  status = 'uploading', // 'idle', 'uploading', 'completed', 'error', 'cancelled', 'paused'
  onCancel = null,
  onPause = null,
  onResume = null,
  error = null,
  isChunked = false,
  currentChunk = 0,
  totalChunks = 0,
  uploadType = 'direct' // 'direct' or 'resumable'
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <FiCheck className="text-green-600 text-xl" />
      case 'error':
      case 'cancelled':
        return <FiX className="text-red-600 text-xl" />
      case 'paused':
        return <FiPause className="text-academic-gold-600 text-xl" />
      case 'uploading':
        return <FiUploadCloud className="text-academic-navy-600 text-xl animate-pulse" />
      default:
        return <FiUploadCloud className="text-academic-slate-400 text-xl" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Upload completed successfully'
      case 'error':
        return error || 'Upload failed'
      case 'cancelled':
        return 'Upload cancelled'
      case 'paused':
        return 'Upload paused'
      case 'uploading':
        if (isChunked && totalChunks > 0) {
          return `Uploading chunk ${currentChunk + 1} of ${totalChunks}...`
        }
        return uploadType === 'resumable' ? 'Uploading video (resumable)...' : 'Uploading video...'
      default:
        return 'Ready to upload'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'error':
      case 'cancelled':
        return 'text-red-600'
      case 'paused':
        return 'text-academic-gold-600'
      case 'uploading':
        return 'text-academic-navy-600'
      default:
        return 'text-academic-slate-500'
    }
  }

  const getProgressBarColor = () => {
    switch (status) {
      case 'completed':
        return '#16a34a' // green-600
      case 'error':
      case 'cancelled':
        return '#dc2626' // red-600
      case 'paused':
        return '#d97706' // academic-gold-600
      case 'uploading':
        return '#1e3a8a' // academic-navy-800
      default:
        return '#64748b' // academic-slate-500
    }
  }

  return (
    <div className="classic-card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-academic-slate-100 rounded-full flex items-center justify-center">
            {getStatusIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-academic-navy-900 truncate">
              {fileName}
            </p>
            <p className="text-xs text-academic-slate-600 mt-1">
              {formatFileSize(fileSize)}
            </p>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center gap-2">
          {/* Pause/Resume button for resumable uploads */}
          {uploadType === 'resumable' && status === 'uploading' && onPause && (
            <button
              onClick={onPause}
              className="p-2 hover:bg-academic-slate-100 rounded-lg transition-colors border border-academic-slate-200"
              title="Pause upload"
            >
              <FiPause className="text-academic-slate-600 hover:text-academic-navy-700 text-lg" />
            </button>
          )}
          
          {uploadType === 'resumable' && status === 'paused' && onResume && (
            <button
              onClick={onResume}
              className="p-2 hover:bg-academic-gold-100 rounded-lg transition-colors border border-academic-gold-200"
              title="Resume upload"
            >
              <FiPlay className="text-academic-gold-600 hover:text-academic-gold-700 text-lg" />
            </button>
          )}

          {/* Cancel button */}
          {(status === 'uploading' || status === 'paused') && onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              title="Cancel upload"
            >
              <RxCross2 className="text-red-600 hover:text-red-700 text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="bg-academic-slate-100 rounded-full overflow-hidden">
          <ProgressBar
            completed={Math.min(progress, 100)}
            height="12px"
            bgColor={getProgressBarColor()}
            baseBgColor="#e2e8f0"
            borderRadius="6px"
            isLabelVisible={false}
            animateOnRender={true}
            transitionDuration="0.4s"
          />
        </div>
        
        {/* Progress Info */}
        <div className="flex items-center justify-between text-sm">
          <span className={`${getStatusColor()} font-medium`}>
            {getStatusText()}
          </span>
          <span className="text-academic-slate-600 font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Error Details */}
      {status === 'error' && error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiX className="text-red-600" />
            <span className="text-sm font-semibold text-red-800">Upload Error</span>
          </div>
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {/* Upload Type Info */}
      {uploadType === 'resumable' && (status === 'uploading' || status === 'paused') && (
        <div className="bg-academic-navy-50 border-2 border-academic-navy-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FiUploadCloud className="text-academic-navy-600" />
              <span className="text-sm font-semibold text-academic-navy-800">Resumable Upload</span>
            </div>
            {status === 'paused' && (
              <span className="text-xs bg-academic-gold-100 text-academic-gold-800 px-2 py-1 rounded-full font-medium">
                Can be resumed anytime
              </span>
            )}
          </div>
          <p className="text-sm text-academic-navy-700">
            {isChunked && totalChunks > 0 
              ? `Processing ${totalChunks} chunks (${(fileSize / totalChunks / 1024 / 1024).toFixed(1)}MB each) for reliable upload`
              : 'Large file upload with automatic resume capability for maximum reliability'
            }
          </p>
          
          {isChunked && totalChunks > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-4 text-xs text-academic-navy-600">
              <div className="text-center">
                <span className="font-semibold">Chunks</span>
                <br />
                {currentChunk}/{totalChunks}
              </div>
              <div className="text-center">
                <span className="font-semibold">Size</span>
                <br />
                {formatFileSize(fileSize)}
              </div>
              <div className="text-center">
                <span className="font-semibold">Storage</span>
                <br />
                Cloud Direct
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct Upload Info */}
      {uploadType === 'direct' && status === 'uploading' && (
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <FiCheck className="text-green-600" />
            <span className="text-sm font-semibold text-green-800">Direct Upload</span>
          </div>
          <p className="text-sm text-green-700">
            Fast and efficient direct upload to cloud storage
          </p>
        </div>
      )}
    </div>
  )
}

export default VideoUploadProgress
