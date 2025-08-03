import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { FaEnvelope, FaShieldAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";
import Loading from './../components/common/Loading';
import HighlightText from "../components/core/HomePage/HighlightText";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    const { accountType, firstName, lastName, email, password, confirmPassword } = signupData;

    try {
      await dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    } catch (error) {
      // Clear OTP input on error
      setOtp("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 flex items-center justify-center">
        <Loading />
      </div>
    );
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
            <FaEnvelope className="text-2xl text-academic-gold-600" />
          </div>
          <h1 className="classic-heading text-2xl text-academic-navy-900 mb-3">
            Verify Your
            <HighlightText text=" Email" variant="gold" />
          </h1>
          <p className="text-academic-slate-600 leading-relaxed">
            A verification code has been sent to your email address. Enter the 6-digit code below to complete your registration.
          </p>
        </div>

        <form onSubmit={handleVerifyAndSignup} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-academic-slate-700 mb-4 text-center">
              Enter Verification Code
            </label>
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  className="w-12 h-12 lg:w-14 lg:h-14 border-2 border-academic-slate-300 bg-white rounded-lg text-academic-navy-900 text-xl font-bold text-center focus:border-academic-gold-500 focus:outline-none focus:ring-2 focus:ring-academic-gold-200 transition-all duration-300"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "8px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
              otp.length !== 6
                ? 'bg-academic-slate-300 text-academic-slate-500 cursor-not-allowed'
                : 'bg-academic-gold-500 text-white hover:bg-academic-gold-600 shadow-elegant hover:shadow-lg transform hover:scale-[1.02]'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 text-academic-slate-600 hover:text-academic-gold-600 transition-colors duration-300 font-medium"
          >
            <BiArrowBack className="text-lg" />
            Back To Signup
          </Link>

          <button
            className="inline-flex items-center gap-2 text-academic-navy-600 hover:text-academic-gold-600 transition-colors duration-300 font-medium"
            onClick={() => {
              dispatch(sendOtp(signupData.email, navigate));
              setOtp('');
            }}
          >
            <RxCountdownTimer className="text-lg" />
            Resend Code
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-8 p-4 bg-academic-navy-50 rounded-lg border border-academic-navy-200">
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-academic-navy-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-academic-navy-900 text-sm mb-1">Security Notice</h4>
              <p className="text-academic-navy-700 text-xs leading-relaxed">
                This verification code will expire in 10 minutes. If you didn't receive the code, check your spam folder or request a new one.
              </p>
            </div>
          </div>
        </div>

        {/* Email Display */}
        {signupData?.email && (
          <div className="mt-6 p-4 bg-academic-gold-50 rounded-lg border border-academic-gold-200">
            <div className="text-center">
              <p className="text-sm text-academic-gold-700 mb-1">Code sent to:</p>
              <p className="font-semibold text-academic-gold-800">{signupData.email}</p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
