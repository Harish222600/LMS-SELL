import { useState, useEffect } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { FaLock, FaShieldAlt } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { motion } from "framer-motion"
import { resetPassword } from "../services/operations/authAPI"
import HighlightText from "../components/core/HomePage/HighlightText"

function UpdatePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { loading } = useSelector((state) => state.auth)
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState("")
  const [tokenValid, setTokenValid] = useState(null)

  const { password, confirmPassword } = formData

  // Check password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength("")
    } else {
      const hasLower = /[a-z]/.test(password)
      const hasUpper = /[A-Z]/.test(password)
      const hasNumber = /\d/.test(password)
      const hasSpecial = /[@$!%*?&]/.test(password)
      const isLongEnough = password.length >= 8

      if (!isLongEnough) {
        setPasswordStrength("weak")
      } else if (hasLower && hasUpper && hasNumber && hasSpecial) {
        setPasswordStrength("strong")
      } else if ((hasLower || hasUpper) && hasNumber) {
        setPasswordStrength("medium")
      } else {
        setPasswordStrength("weak")
      }
    }
  }, [password])

  // Verify token on component mount
  useEffect(() => {
    const token = location.pathname.split("/").at(-1)
    if (!token || token === "update-password") {
      setTokenValid(false)
      toast.error("Invalid reset link. Please request a new password reset.")
      setTimeout(() => navigate("/forgot-password"), 2000)
    } else {
      setTokenValid(true)
    }
  }, [location, navigate])

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    
    // Validate password length
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    // Check password strength
    if (passwordStrength === "weak") {
      toast.error("Please choose a stronger password")
      return
    }

    const token = location.pathname.split("/").at(-1)
    dispatch(resetPassword(password, confirmPassword, token, navigate))
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak": return "text-red-600"
      case "medium": return "text-academic-gold-600"
      case "strong": return "text-green-600"
      default: return ""
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak": return "Weak - Add more characters and complexity"
      case "medium": return "Medium - Add special characters for better security"
      case "strong": return "Strong password ✓"
      default: return ""
    }
  }

  const getPasswordRequirements = () => {
    const requirements = [
      { text: "At least 8 characters", met: password.length >= 8 },
      { text: "One lowercase letter", met: /[a-z]/.test(password) },
      { text: "One uppercase letter", met: /[A-Z]/.test(password) },
      { text: "One number", met: /\d/.test(password) },
      { text: "One special character (@$!%*?&)", met: /[@$!%*?&]/.test(password) },
    ]
    return requirements
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center p-4">
        <motion.div 
          className="classic-card p-12 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaShieldAlt className="text-2xl text-red-600" />
          </div>
          <h1 className="classic-heading text-2xl text-academic-navy-900 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-academic-slate-600 mb-8 leading-relaxed">
            This password reset link is invalid or has expired. Please request a new password reset to continue.
          </p>
          <Link 
            to="/forgot-password"
            className="btn-elegant"
          >
            Request New Reset Link
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center p-4">
      <motion.div 
        className="classic-card p-12 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="text-2xl text-academic-gold-600" />
          </div>
          <h1 className="classic-heading text-2xl text-academic-navy-900 mb-3">
            Choose New
            <HighlightText text=" Password" variant="gold" />
          </h1>
          <p className="text-academic-slate-600 leading-relaxed">
            Almost done. Enter your new password and you're all set to continue your learning journey.
          </p>
        </div>

        <form onSubmit={handleOnSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter new password"
                className="classic-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {password && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
            >
              <p className={`text-sm font-medium ${getPasswordStrengthColor()}`}>
                {getPasswordStrengthText()}
              </p>
              <div className="bg-academic-slate-50 p-4 rounded-lg space-y-2">
                <p className="text-xs font-medium text-academic-slate-700 mb-2">Password Requirements:</p>
                {getPasswordRequirements().map((req, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <span className={`mr-2 font-bold ${req.met ? 'text-green-600' : 'text-academic-slate-400'}`}>
                      {req.met ? '✓' : '○'}
                    </span>
                    <span className={req.met ? 'text-green-600' : 'text-academic-slate-600'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm new password"
                className="classic-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-400 hover:text-academic-slate-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={20} />
                ) : (
                  <AiOutlineEye size={20} />
                )}
              </button>
            </div>
          </div>

          {confirmPassword && password !== confirmPassword && (
            <motion.p 
              className="text-red-600 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Passwords do not match
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading || passwordStrength === "weak" || password !== confirmPassword}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
              loading || passwordStrength === "weak" || password !== confirmPassword
                ? 'bg-academic-slate-300 text-academic-slate-500 cursor-not-allowed'
                : 'bg-academic-gold-500 text-white hover:bg-academic-gold-600 shadow-elegant hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link 
            to="/login"
            className="inline-flex items-center gap-2 text-academic-slate-600 hover:text-academic-gold-600 transition-colors duration-300 font-medium"
          >
            <BiArrowBack className="text-lg" /> 
            Back to Login
          </Link>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-academic-navy-50 rounded-lg border border-academic-navy-200">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-academic-navy-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-academic-navy-900 text-sm mb-1">Security Notice</h4>
              <p className="text-academic-navy-700 text-xs leading-relaxed">
                For your security, this reset link will expire after use. Choose a strong password that you haven't used before.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UpdatePassword
