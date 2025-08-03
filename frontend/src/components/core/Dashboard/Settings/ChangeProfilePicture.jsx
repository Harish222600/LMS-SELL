import { useEffect, useRef, useState } from "react"
import { FiUpload } from "react-icons/fi"
import { FaCamera, FaUser } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"

import { updateUserProfileImage } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"
import Img from './../../../common/Img';



export default function ChangeProfilePicture() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    // console.log(file)
    if (file) {
      // Validate file size (5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > MAX_SIZE) {
        toast.error(`Profile image must be 5MB or less. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
        e.target.value = ''; // Clear the input
        return;
      }

      // Validate file type - Allow any image type
      if (!file.type.startsWith('image/')) {
        toast.error('Invalid file type. Please upload an image file.');
        e.target.value = ''; // Clear the input
        return;
      }

      setProfileImage(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = () => {
    try {
      // console.log("uploading...")
      setLoading(true)
      const formData = new FormData()
      formData.append("profileImage", profileImage)

      dispatch(updateUserProfileImage(token, formData)).then(() => {
        setLoading(false)
        // Clear the preview and selected file after successful upload
        setProfileImage(null)
        setPreviewSource(null)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        
        // Additional logging to debug the issue
        console.log("Profile image upload completed successfully");
        console.log("Current user from Redux after upload:", user);
        
        // Force a small delay to ensure Redux state has updated
        setTimeout(() => {
          console.log("User state after timeout:", user);
        }, 100);
      }).catch((error) => {
        console.error("Profile image upload failed:", error);
        setLoading(false)
      })
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (profileImage) {
      previewFile(profileImage)
    }
  }, [profileImage])

  // Monitor user changes to debug the issue
  useEffect(() => {
    console.log("👤 User state changed in ChangeProfilePicture:", user);
    console.log("👤 User image URL:", user?.image);
  }, [user])


  return (
    <div className="classic-card bg-white">
      {/* Academic Header */}
      <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
        <div className="flex items-center gap-3">
          <FaCamera className="text-academic-gold-600 text-xl" />
          <div>
            <h3 className="elegant-heading text-academic-navy-900">Profile Picture</h3>
            <p className="text-sm text-academic-slate-600 font-inter">Update your profile photo</p>
          </div>
        </div>
      </div>

      {/* Academic Content */}
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Profile Picture Display */}
          <div className="relative">
            <div className="relative">
              <Img
                src={previewSource || user?.image}
                alt={`profile-${user?.firstName}`}
                className="aspect-square w-32 h-32 rounded-full object-cover border-4 border-academic-slate-200 shadow-classic"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <FaCamera className="text-white text-2xl" />
              </div>
            </div>
            {previewSource && (
              <div className="absolute -top-2 -right-2 bg-academic-gold-600 text-white rounded-full p-2">
                <FaCamera size={12} />
              </div>
            )}
          </div>

          {/* Profile Picture Controls */}
          <div className="flex-1 space-y-6">
            <div>
              <h4 className="text-xl font-bold text-academic-navy-900 font-playfair mb-2">
                Update Profile Picture
              </h4>
              <p className="text-academic-slate-600 font-inter">
                Choose a professional photo that represents you. Supported formats: JPG, PNG, GIF (max 5MB)
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              <button
                onClick={handleClick}
                disabled={loading}
                className="flex items-center gap-3 px-6 py-3 bg-academic-slate-100 text-academic-slate-700 border border-academic-slate-300 rounded-lg hover:bg-academic-slate-200 transition-colors duration-200 font-medium font-inter disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUser size={16} />
                Select Photo
              </button>

              <button
                onClick={handleFileUpload}
                disabled={loading || !profileImage}
                className="btn-elegant flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <FiUpload size={16} />
                )}
                {loading ? "Uploading..." : "Upload Photo"}
              </button>
            </div>

            {profileImage && (
              <div className="bg-academic-gold-50 border border-academic-gold-200 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FaCamera className="text-academic-gold-600" />
                  <div>
                    <p className="font-medium text-academic-gold-800 font-inter">Photo Selected</p>
                    <p className="text-sm text-academic-gold-700 font-inter">
                      {profileImage.name} ({(profileImage.size / (1024 * 1024)).toFixed(2)}MB)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}