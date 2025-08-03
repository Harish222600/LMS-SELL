import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCertificate, FaSearch, FaCheckCircle, FaArrowLeft, FaEye, FaShieldAlt } from 'react-icons/fa';
import { verifyCertificate } from '../services/operations/certificateAPI';
import CleanInternshipCertificate from '../components/core/Certificate/CleanInternshipCertificate';
import QuickLinks from '../components/common/QuickLinks';
import HighlightText from '../components/core/HomePage/HighlightText';
import { formatDate } from '../utils/dateFormatter';

export default function VerifyCertificate() {
  const { certificateId: urlCertificateId } = useParams();
  const [certificateId, setCertificateId] = useState('');
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleVerification = async (id) => {
    if (!id.trim()) {
      setError("Please enter a certificate ID");
      return;
    }

    setLoading(true);
    setError(null);
    setCertificateData(null);

    try {
      const data = await verifyCertificate(id);
      setCertificateData(data);
      setError(null);
    } catch (error) {
      setError(error.message || "Invalid certificate ID");
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-verify if certificateId is in URL
  useEffect(() => {
    if (urlCertificateId) {
      setCertificateId(urlCertificateId);
      handleVerification(urlCertificateId);
    }
  }, [urlCertificateId]);

  const handleSearch = async () => {
    handleVerification(certificateId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50 pt-16">
      {/* Hero Section */}
      <motion.div 
        className="relative bg-gradient-to-br from-academic-navy-900 via-academic-navy-800 to-academic-navy-900 py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-academic-gold-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-academic-gold-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-academic-gold-500 w-20 h-20 rounded-full flex items-center justify-center shadow-elegant">
              <FaCertificate className="text-3xl text-academic-navy-900" />
            </div>
          </motion.div>
          <motion.h1 
            className="classic-heading text-4xl md:text-6xl text-white mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Certificate
            <HighlightText text=" Verification" variant="gold" />
          </motion.h1>
          <motion.p 
            className="section-subtitle text-academic-slate-300 text-xl max-w-4xl mx-auto leading-relaxed"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Verify the authenticity of Beeja Academy certificates with our secure verification system. 
            Enter the certificate ID to confirm its validity and view detailed information.
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Section */}
        <motion.div 
          className="max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="classic-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSearch className="text-2xl text-academic-gold-600" />
              </div>
              <h2 className="elegant-heading text-2xl text-academic-navy-900 mb-2">
                Verify Certificate
              </h2>
              <p className="text-academic-slate-600">
                Enter the certificate ID to verify its authenticity
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-academic-slate-700 mb-2">
                  Certificate ID
                </label>
                <input
                  type="text"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter Certificate ID (e.g., BA-25FJ2849)"
                  className="classic-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <button
                onClick={handleSearch}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ${
                  loading 
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
                  <span className="flex items-center justify-center gap-2">
                    <FaSearch className="text-lg" />
                    Verify Certificate
                  </span>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            className="max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-red-50 border border-red-300 p-6 rounded-xl text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-xl text-red-600" />
              </div>
              <h3 className="font-bold text-red-800 mb-2">Verification Failed</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Certificate Results */}
        {certificateData && !showCertificate && (
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="classic-card p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-3xl text-green-600" />
                </div>
                <h2 className="classic-heading text-2xl text-academic-navy-900 mb-2">
                  Certificate Verified
                  <HighlightText text=" Successfully" variant="gold" />
                </h2>
                <p className="text-academic-slate-600">
                  This certificate is authentic and has been issued by Beeja Academy
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div className="bg-academic-slate-50 p-6 rounded-xl">
                    <label className="block text-sm font-medium text-academic-slate-600 mb-2">Student Name</label>
                    <p className="text-xl font-bold text-academic-navy-900">{certificateData.studentName}</p>
                  </div>
                  
                  <div className="bg-academic-slate-50 p-6 rounded-xl">
                    <label className="block text-sm font-medium text-academic-slate-600 mb-2">Certificate ID</label>
                    <p className="text-lg font-mono text-academic-navy-900 bg-white px-3 py-2 rounded border">
                      {certificateData.certificateId}
                    </p>
                  </div>
                  
                  <div className="bg-academic-slate-50 p-6 rounded-xl">
                    <label className="block text-sm font-medium text-academic-slate-600 mb-2">Email Address</label>
                    <p className="text-lg text-academic-navy-900">{certificateData.email}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-academic-gold-50 p-6 rounded-xl border border-academic-gold-200">
                    <label className="block text-sm font-medium text-academic-gold-700 mb-2">Course Name</label>
                    <p className="text-xl font-bold text-academic-gold-800">{certificateData.courseName}</p>
                  </div>
                  
                  <div className="bg-academic-slate-50 p-6 rounded-xl">
                    <label className="block text-sm font-medium text-academic-slate-600 mb-2">Completion Date</label>
                    <p className="text-lg text-academic-navy-900">{formatDate(certificateData.completionDate)}</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <label className="block text-sm font-medium text-green-700 mb-2">Status</label>
                    <div className="flex items-center gap-2">
                      <FaCheckCircle className="text-green-600" />
                      <p className="text-lg font-semibold text-green-800">Verified & Authentic</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowCertificate(true)}
                  className="btn-elegant"
                >
                  <span className="flex items-center gap-2">
                    <FaEye className="text-lg" />
                    View Full Certificate
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Certificate Display */}
        {showCertificate && certificateData && (
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <button
                onClick={() => setShowCertificate(false)}
                className="flex items-center gap-2 text-academic-slate-600 hover:text-academic-gold-600 transition-colors duration-300 font-medium"
              >
                <FaArrowLeft className="text-lg" />
                Back to Details
              </button>
            </div>
            
            <div className="classic-card p-8 bg-white shadow-elegant">
              <div className="text-center mb-6">
                <h3 className="elegant-heading text-2xl text-academic-navy-900 mb-2">
                  Official Certificate
                </h3>
                <p className="text-academic-slate-600">
                  This is the official certificate issued by Beeja Academy
                </p>
              </div>
              
              <div className="flex justify-center items-center overflow-auto">
                <div style={{ minWidth: '1100px', minHeight: '800px' }} className="flex justify-center items-center">
                  <CleanInternshipCertificate certificateData={certificateData} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div 
          className="max-w-4xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-academic-navy-50 border border-academic-navy-200 p-8 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-academic-navy-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FaShieldAlt className="text-xl text-academic-navy-600" />
              </div>
              <div>
                <h4 className="font-bold text-academic-navy-900 text-lg mb-2">Security & Authenticity</h4>
                <p className="text-academic-navy-700 leading-relaxed mb-4">
                  All Beeja Academy certificates are digitally signed and verified through our secure system. 
                  Each certificate contains unique identifiers that cannot be forged or duplicated.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span className="text-academic-navy-700">Digitally Signed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span className="text-academic-navy-700">Tamper Proof</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span className="text-academic-navy-700">Instantly Verifiable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Links Footer */}
      <QuickLinks />
    </div>
  );
}
