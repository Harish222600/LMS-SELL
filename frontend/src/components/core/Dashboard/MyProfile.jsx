import { useEffect } from "react"
import { useSelector } from "react-redux"
import { formatDate, formatDateShort } from "../../../utils/dateFormatter"
import Img from './../../common/Img';
import { motion } from "framer-motion";
import { fadeIn } from "../../common/motionFrameVarients";
import HighlightText from "../HomePage/HighlightText";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaBirthdayCake, 
  FaGraduationCap, 
  FaVenusMars,
  FaEdit,
  FaCalendarAlt,
  FaIdCard,
  FaInfoCircle,
  FaUserCircle,
  FaCog,
  FaShieldAlt,
  FaBookOpen,
  FaAward,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section with Breadcrumb */}
        <motion.div 
          variants={fadeIn('down', 0.2)}
          initial='hidden'
          animate='show'
          className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-academic-slate-500 mb-2">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-academic-navy-600 font-medium">My Profile</span>
              </div>
              <h1 className="classic-heading text-3xl md:text-4xl text-academic-navy-900 mb-2">
                My <HighlightText text="Profile" variant="gold" />
              </h1>
              <p className="section-subtitle text-academic-slate-600 mb-0">
                Manage your personal information and account preferences
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-classic-secondary text-sm px-4 py-2 flex items-center gap-2">
                <FaEdit className="w-4 h-4" />
                Edit Profile
              </button>
              <button className="btn-classic-primary text-sm px-4 py-2 flex items-center gap-2">
                <FaCog className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <motion.div 
              variants={fadeIn('right', 0.3)}
              initial='hidden'
              animate='show'
              className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200 text-center"
            >
              {/* Profile Image */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-academic-gold-200 shadow-classic mx-auto">
                  <Img
                    src={user?.image}
                    alt={`profile-${user?.firstName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-academic-gold-500 p-3 rounded-full shadow-classic cursor-pointer hover:bg-academic-gold-600 transition-colors duration-200">
                  <FaEdit className="text-white text-sm" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-academic-navy-900 capitalize">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-academic-slate-600 break-all text-sm">
                  {user?.email}
                </p>
                <div className="inline-flex items-center gap-2 bg-academic-gold-100 text-academic-gold-700 px-3 py-1 rounded-full text-sm font-medium">
                  <FaGraduationCap className="w-4 h-4" />
                  {user?.accountType}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-academic-slate-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-academic-navy-900">12</div>
                  <div className="text-sm text-academic-slate-600">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-academic-navy-900">85%</div>
                  <div className="text-sm text-academic-slate-600">Progress</div>
                </div>
              </div>
            </motion.div>

            {/* Account Status Card */}
            <motion.div 
              variants={fadeIn('right', 0.4)}
              initial='hidden'
              animate='show'
              className="bg-white rounded-2xl p-6 shadow-elegant border border-academic-slate-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaShieldAlt className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-academic-navy-900">Account Status</h3>
                  <p className="text-sm text-academic-slate-600">Verified & Active</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-slate-600">Email Verified</span>
                  <span className="text-green-600 font-medium">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-slate-600">Profile Complete</span>
                  <span className="text-academic-gold-600 font-medium">75%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-academic-slate-600">Member Since</span>
                  <span className="text-academic-slate-700 font-medium">
                    {formatDate(user?.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <motion.div 
              variants={fadeIn('left', 0.3)}
              initial='hidden'
              animate='show'
              className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-academic-navy-100 p-3 rounded-lg">
                  <FaInfoCircle className="text-academic-navy-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="elegant-heading text-academic-navy-900">About Me</h3>
                  <p className="text-sm text-academic-slate-600">Tell others about yourself</p>
                </div>
              </div>
              <div className="bg-academic-slate-50 rounded-xl p-6 border border-academic-slate-200">
                <p className={`${user?.additionalDetails?.about ? "text-academic-slate-700" : "text-academic-slate-500 italic"} leading-relaxed`}>
                  {user?.additionalDetails?.about ?? "Write something about yourself to let others know more about your background, interests, and goals."}
                </p>
              </div>
            </motion.div>

            {/* Personal Information */}
            <motion.div 
              variants={fadeIn('left', 0.4)}
              initial='hidden'
              animate='show'
              className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-academic-gold-100 p-3 rounded-lg">
                  <FaUser className="text-academic-gold-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="elegant-heading text-academic-navy-900">Personal Information</h3>
                  <p className="text-sm text-academic-slate-600">Your basic profile details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailCard 
                  label="First Name"
                  value={user?.firstName}
                  icon={<FaUser className="text-academic-navy-600" />}
                />
                <DetailCard 
                  label="Last Name"
                  value={user?.lastName}
                  icon={<FaUser className="text-academic-navy-600" />}
                />
                <DetailCard 
                  label="Email Address"
                  value={user?.email}
                  icon={<FaEnvelope className="text-academic-gold-600" />}
                  isEmail={true}
                />
                <DetailCard 
                  label="Account Type"
                  value={user?.accountType}
                  icon={<FaGraduationCap className="text-academic-navy-600" />}
                />
                <DetailCard 
                  label="Phone Number"
                  value={user?.additionalDetails?.contactNumber ?? "Not provided"}
                  icon={<FaPhone className="text-academic-gold-600" />}
                />
                <DetailCard 
                  label="Date of Birth"
                  value={formatDateShort(user?.additionalDetails?.dateOfBirth) ?? "Not provided"}
                  icon={<FaBirthdayCake className="text-academic-navy-600" />}
                />
                <DetailCard 
                  label="Gender"
                  value={user?.additionalDetails?.gender ?? "Not specified"}
                  icon={<FaVenusMars className="text-academic-gold-600" />}
                />
                <DetailCard 
                  label="Member Since"
                  value={formatDate(user?.createdAt)}
                  icon={<FaCalendarAlt className="text-academic-navy-600" />}
                />
              </div>
            </motion.div>

            {/* Academic Progress */}
            <motion.div 
              variants={fadeIn('left', 0.5)}
              initial='hidden'
              animate='show'
              className="bg-white rounded-2xl p-8 shadow-elegant border border-academic-slate-200"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-academic-gold-100 p-3 rounded-lg">
                  <FaBookOpen className="text-academic-gold-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="elegant-heading text-academic-navy-900">Academic Progress</h3>
                  <p className="text-sm text-academic-slate-600">Your learning journey overview</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-academic-slate-50 rounded-xl p-6 border border-academic-slate-200 text-center">
                  <div className="bg-academic-navy-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <FaBookOpen className="text-academic-navy-600 w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-academic-navy-900 mb-1">12</div>
                  <div className="text-sm text-academic-slate-600">Courses Enrolled</div>
                </div>
                <div className="bg-academic-slate-50 rounded-xl p-6 border border-academic-slate-200 text-center">
                  <div className="bg-academic-gold-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <FaAward className="text-academic-gold-600 w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-academic-navy-900 mb-1">8</div>
                  <div className="text-sm text-academic-slate-600">Certificates Earned</div>
                </div>
                <div className="bg-academic-slate-50 rounded-xl p-6 border border-academic-slate-200 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <FaShieldAlt className="text-green-600 w-6 h-6" />
                  </div>
                  <div className="text-2xl font-bold text-academic-navy-900 mb-1">85%</div>
                  <div className="text-sm text-academic-slate-600">Overall Progress</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced Detail Card Component
function DetailCard({ label, value, icon, isEmail = false }) {
  return (
    <div className="bg-academic-slate-50 rounded-xl p-6 border border-academic-slate-200 hover:border-academic-gold-300 transition-all duration-300 hover:shadow-classic">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-lg">{icon}</div>
        <p className="text-sm text-academic-slate-600 font-medium">{label}</p>
      </div>
      <div className="pl-0">
        <p className={`text-base font-semibold text-academic-navy-900 ${
          isEmail 
            ? "break-all lowercase" 
            : "capitalize break-words"
        }`}>
          {value || "Not provided"}
        </p>
      </div>
    </div>
  )
}
