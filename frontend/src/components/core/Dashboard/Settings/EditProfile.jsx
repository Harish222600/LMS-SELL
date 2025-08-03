import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaUser, FaSave, FaTimes } from "react-icons/fa"

import { updateProfile } from "../../../../services/operations/SettingsAPI"
import IconBtn from "../../../common/IconBtn"

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"]

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { register, handleSubmit, formState: { errors } } = useForm()

  const submitProfileForm = async (data) => {
    // console.log("Form Data - ", data)
    try {
      dispatch(updateProfile(token, data))
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }
  return (
    <div className="classic-card bg-white">
      {/* Academic Header */}
      <div className="bg-academic-navy-50 border-b border-academic-slate-200 px-8 py-4">
        <div className="flex items-center gap-3">
          <FaUser className="text-academic-gold-600 text-xl" />
          <div>
            <h3 className="elegant-heading text-academic-navy-900">Personal Information</h3>
            <p className="text-sm text-academic-slate-600 font-inter">Update your personal details and preferences</p>
          </div>
        </div>
      </div>

      {/* Academic Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit(submitProfileForm)} className="space-y-8">
          {/* Name Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="firstName" className="classic-label">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                {...register("firstName", { required: true })}
                defaultValue={user?.firstName}
              />
              {errors.firstName && (
                <span className="text-sm text-red-600 font-inter">
                  Please enter your first name.
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="classic-label">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                placeholder="Enter your last name"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                {...register("lastName", { required: true })}
                defaultValue={user?.lastName}
              />
              {errors.lastName && (
                <span className="text-sm text-red-600 font-inter">
                  Please enter your last name.
                </span>
              )}
            </div>
          </div>

          {/* Date and Gender Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="classic-label">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                {...register("dateOfBirth", {
                  required: {
                    value: true,
                    message: "Please enter your Date of Birth.",
                  },
                  max: {
                    value: new Date().toISOString().split("T")[0],
                    message: "Date of Birth cannot be in the future.",
                  },
                })}
                defaultValue={user?.additionalDetails?.dateOfBirth}
              />
              {errors.dateOfBirth && (
                <span className="text-sm text-red-600 font-inter">
                  {errors.dateOfBirth.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="gender" className="classic-label">
                Gender *
              </label>
              <select
                name="gender"
                id="gender"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter bg-white"
                {...register("gender", { required: true })}
                defaultValue={user?.additionalDetails?.gender}
              >
                <option value="">Select Gender</option>
                {genders.map((ele, i) => {
                  return (
                    <option key={i} value={ele}>
                      {ele}
                    </option>
                  )
                })}
              </select>
              {errors.gender && (
                <span className="text-sm text-red-600 font-inter">
                  Please select your gender.
                </span>
              )}
            </div>
          </div>

          {/* Contact and About Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="contactNumber" className="classic-label">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                id="contactNumber"
                placeholder="Enter your contact number"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                {...register("contactNumber", {
                  required: {
                    value: true,
                    message: "Please enter your Contact Number.",
                  },
                  maxLength: { value: 12, message: "Invalid Contact Number" },
                  minLength: { value: 10, message: "Invalid Contact Number" },
                })}
                defaultValue={user?.additionalDetails?.contactNumber}
              />
              {errors.contactNumber && (
                <span className="text-sm text-red-600 font-inter">
                  {errors.contactNumber.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="about" className="classic-label">
                About *
              </label>
              <input
                type="text"
                name="about"
                id="about"
                placeholder="Tell us about yourself"
                className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:ring-2 focus:ring-academic-gold-500 focus:border-academic-gold-500 transition-colors duration-200 font-inter"
                {...register("about", { required: true })}
                defaultValue={user?.additionalDetails?.about}
              />
              {errors.about && (
                <span className="text-sm text-red-600 font-inter">
                  Please enter information about yourself.
                </span>
              )}
            </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}