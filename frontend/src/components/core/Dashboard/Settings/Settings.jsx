import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"
import { FaCog, FaUser, FaLock, FaTrash, FaCamera } from "react-icons/fa"

export default function Settings() {
  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Settings</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
              <FaCog className="text-academic-gold-700 text-2xl" />
            </div>
            <div>
              <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                Account Settings
              </h1>
              <p className="section-subtitle text-lg">
                Manage your profile, security, and account preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Academic Settings Navigation */}
        <div className="classic-card bg-white p-6">
          <h2 className="elegant-heading text-academic-navy-900 mb-6">Profile Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-4 bg-academic-cream-50 rounded-lg border border-academic-slate-200">
              <FaCamera className="text-academic-gold-600" size={20} />
              <span className="font-medium text-academic-slate-700 font-inter">Profile Picture</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-academic-cream-50 rounded-lg border border-academic-slate-200">
              <FaUser className="text-academic-gold-600" size={20} />
              <span className="font-medium text-academic-slate-700 font-inter">Personal Info</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-academic-cream-50 rounded-lg border border-academic-slate-200">
              <FaLock className="text-academic-gold-600" size={20} />
              <span className="font-medium text-academic-slate-700 font-inter">Security</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
              <FaTrash className="text-red-600" size={20} />
              <span className="font-medium text-red-700 font-inter">Delete Account</span>
            </div>
          </div>
        </div>

        {/* Academic Settings Sections */}
        <div className="space-y-8">
          {/* Change Profile Picture */}
          <ChangeProfilePicture />
          {/* Profile */}
          <EditProfile />
          {/* Password */}
          <UpdatePassword />
          {/* Delete Account */}
          <DeleteAccount />
        </div>
      </div>
    </div>
  )
}
