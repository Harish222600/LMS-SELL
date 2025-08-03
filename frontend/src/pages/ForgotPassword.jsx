import React, { useState, useEffect } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { getPasswordResetToken } from "../services/operations/authAPI"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleOnSubmit = (e) => {
    e.preventDefault()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    dispatch(getPasswordResetToken(email, setEmailSent))
    setResendTimer(60) // Set 60 seconds cooldown for resend
  }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      <div className="max-w-[500px] p-4 lg:p-8">
        <div className="classic-card p-8 lg:p-12">
          <div className="flex flex-col items-center">
            <h1 className="classic-heading text-3xl lg:text-4xl text-academic-navy-900 text-center mb-6">
              {!emailSent ? "Reset your password" : "Check your email"}
            </h1>
            
            <div className="mb-8 text-lg leading-relaxed text-academic-slate-600 text-center">
              {!emailSent ? (
                <div>
                  <p className="mb-4">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  <p className="text-sm text-academic-slate-500">
                    Make sure to check your spam folder if you don't see the email.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="mb-4">
                    Password reset instructions have been sent to:
                    <br />
                    <span className="text-academic-gold-700 font-bold">{email}</span>
                  </p>
                  <p className="text-sm text-academic-slate-500">
                    Please check both your inbox and spam folder.
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleOnSubmit} className="w-full">
              {!emailSent && (
                <label className="w-full block mb-6">
                  <p className="mb-3 text-sm font-medium text-academic-slate-700">
                    Email Address <sup className="text-red-500">*</sup>
                  </p>
                  <input
                    required
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="classic-input"
                  />
                </label>
              )}

              <button
                type="submit"
                disabled={loading || (emailSent && resendTimer > 0)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-classic
                  ${loading || (emailSent && resendTimer > 0)
                    ? 'bg-academic-slate-300 text-academic-slate-500 cursor-not-allowed'
                    : 'btn-elegant hover:shadow-elegant'
                  }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : emailSent ? (
                  resendTimer > 0 ? (
                    `Resend available in ${resendTimer}s`
                  ) : (
                    "Resend Email"
                  )
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center justify-center">
              <Link 
                to="/login"
                className="flex items-center gap-2 text-academic-slate-600 hover:text-academic-gold-600 transition-all duration-200 font-medium"
              >
                <BiArrowBack className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
