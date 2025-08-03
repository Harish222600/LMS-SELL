import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { FaPaperPlane, FaSpinner } from "react-icons/fa"

import CountryCode from '../../../../data/countrycode.json'
import { apiConnector } from "../../../services/apiConnector"
import { contactusEndpoint } from "../../../services/apis"

const ContactUsForm = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitContactForm = async (data) => {
    console.log("Form Data - ", data)
    try {
      setLoading(true)
      const res = await apiConnector(
        "POST",
        contactusEndpoint.CONTACT_US_API,
        data
      )
      console.log("Email Res - ", res)
      
      if (res.data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
      } else {
        toast.error(res.data.message || "Failed to send message")
      }
      setLoading(false)
    } catch (error) {
      console.log("ERROR WHILE CONTACT US - ", error.message)
      toast.error("Failed to send message. Please try again.")
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        firstname: "",
        lastname: "",
        message: "",
        phoneNo: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      className="space-y-6"
      onSubmit={handleSubmit(submitContactForm)}
    >
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="firstname" className="block text-sm font-semibold text-academic-navy-900">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="firstname"
            id="firstname"
            placeholder="Enter your first name"
            className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 placeholder-academic-slate-400"
            {...register("firstname", { required: true })}
          />
          {errors.firstname && (
            <span className="text-sm text-red-500 flex items-center gap-1">
              Please enter your first name
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="lastname" className="block text-sm font-semibold text-academic-navy-900">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            id="lastname"
            placeholder="Enter your last name"
            className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 placeholder-academic-slate-400"
            {...register("lastname")}
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-academic-navy-900">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 placeholder-academic-slate-400"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-sm text-red-500 flex items-center gap-1">
            Please enter a valid email address
          </span>
        )}
      </div>

      {/* Phone Number Field */}
      <div className="space-y-2">
        <label htmlFor="phonenumber" className="block text-sm font-semibold text-academic-navy-900">
          Phone Number <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-3">
          <div className="w-32">
            <select
              name="countrycode"
              className="w-full px-3 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 text-sm"
              {...register("countrycode", { required: true })}
            >
              {CountryCode.map((ele, i) => {
                return (
                  <option key={i} value={ele.code}>
                    {ele.code} - {ele.country}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="flex-1">
            <input
              type="tel"
              name="phonenumber"
              id="phonenumber"
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 placeholder-academic-slate-400"
              {...register("phoneNo", {
                required: {
                  value: true,
                  message: "Please enter your phone number",
                },
                maxLength: { value: 12, message: "Invalid phone number" },
                minLength: { value: 10, message: "Invalid phone number" },
              })}
            />
          </div>
        </div>
        {errors.phoneNo && (
          <span className="text-sm text-red-500 flex items-center gap-1">
            {errors.phoneNo.message}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-academic-navy-900">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          id="message"
          rows="6"
          placeholder="Tell us about your inquiry, course interests, or any questions you have..."
          className="w-full px-4 py-3 border border-academic-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-academic-gold-500 focus:border-transparent transition-all duration-300 bg-white text-academic-navy-900 placeholder-academic-slate-400 resize-vertical"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <span className="text-sm text-red-500 flex items-center gap-1">
            Please enter your message
          </span>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        disabled={loading}
        type="submit"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className={`w-full flex items-center justify-center gap-3 px-8 py-4 bg-academic-gold-500 text-academic-navy-900 font-semibold rounded-lg shadow-elegant hover:bg-academic-gold-400 transition-all duration-300 ${
          loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'
        }`}
      >
        {loading ? (
          <>
            <FaSpinner className="w-5 h-5 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <FaPaperPlane className="w-5 h-5" />
            <span>Send Message</span>
          </>
        )}
      </motion.button>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-sm text-academic-slate-500">
          We typically respond within 24 hours during business days
        </p>
      </div>
    </form>
  )
}

export default ContactUsForm
