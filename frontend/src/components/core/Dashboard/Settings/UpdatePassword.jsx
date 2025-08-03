import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { FaLock, FaSave, FaTimes } from "react-icons/fa"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { changePassword } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

export default function UpdatePassword() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const submitPasswordForm = async (data) => {
    console.log("password Data - ", data)
    try {
      await changePassword(token, data)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <div className="classic-card bg-white">
      {/* Academic Header */}
      <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
        <div className="flex items-center gap-3">
          <FaLock className="text-academic-gold-600 text-xl" />
          <div>
            <h3 className="elegant-heading text-academic-navy-900">Security Settings</h3>
            <p className="text-sm text-academic-slate-600 font-inter">Update your password to keep your account secure</p>
          </div>
        </div>
      </div>

      {/* Academic Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit(submitPasswordForm)} className="space-y-8">
          {/* Password Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Password */}
            <div className="space-y-2">
              <label htmlFor="oldPassword" className="classic-label">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 pr-12 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                  {...register("oldPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 hover:text-academic-slate-700 transition-colors duration-200"
                >
                  {showOldPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.oldPassword && (
                <span className="text-sm text-red-600 font-inter">
                  Please enter your current password.
                </span>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label htmlFor="newPassword" className="classic-label">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                  {...register("newPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 hover:text-academic-slate-700 transition-colors duration-200"
                >
                  {showNewPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <span className="text-sm text-red-600 font-inter">
                  Please enter your new password.
                </span>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="space-y-2">
              <label htmlFor="confirmNewPassword" className="classic-label">
                Confirm New Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                  {...register("confirmNewPassword", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 hover:text-academic-slate-700 transition-colors duration-200"
                >
                  {showConfirmNewPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <span className="text-sm text-red-600 font-inter">
                  Please confirm your new password.
                </span>
              )}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-academic-gold-50 border border-academic-gold-200 p-6 rounded-lg">
            <h4 className="font-bold text-academic-gold-800 mb-3 font-playfair">Password Requirements</h4>
            <ul className="space-y-2 text-sm text-academic-gold-700 font-inter">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-academic-gold-600 rounded-full"></div>
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-academic-gold-600 rounded-full"></div>
                Include uppercase and lowercase letters
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-academic-gold-600 rounded-full"></div>
                Include at least one number
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-academic-gold-600 rounded-full"></div>
                Include at least one special character
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-academic-slate-200">
            <button
              type="button"
              onClick={() => { navigate("/dashboard/my-profile") }}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-academic-slate-100 text-academic-slate-700 border border-academic-slate-300 rounded-lg hover:bg-academic-slate-200 transition-colors duration-200 font-medium font-inter"
            >
              <FaTimes size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-elegant flex items-center gap-3"
            >
              <FaSave size={16} />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}