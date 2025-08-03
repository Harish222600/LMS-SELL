import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserCertificates } from '../../services/operations/certificateAPI';
import CertificateModal from '../../components/core/Certificate/CertificateModal';
import { formatDate } from '../../utils/dateFormatter';
import { FaCertificate, FaAward, FaCalendarAlt, FaIdCard, FaEye, FaGraduationCap } from 'react-icons/fa';

export default function Certificates() {
  const { token } = useSelector((state) => state.auth);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getUserCertificates(token);
        setCertificates(data);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-academic-cream-50 min-h-screen">
        <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
          <div className="px-8 py-8">
            <div className="text-sm text-academic-slate-500 mb-4 font-inter">
              <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">My Certificates</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaCertificate className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  My Academic Certificates
                </h1>
                <p className="section-subtitle text-lg">
                  View and download your earned certificates
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academic-gold-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">My Certificates</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaCertificate className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  My Academic Certificates
                </h1>
                <p className="section-subtitle text-lg">
                  View and download your earned certificates
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-academic-slate-700 font-inter">
              <span className="flex items-center gap-2 bg-academic-gold-100 px-3 py-2 rounded-lg border border-academic-gold-200">
                <FaAward className="text-academic-gold-600" />
                <span className="font-medium">{certificates?.length || 0} Certificates</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 rounded-xl mb-8">
              <FaGraduationCap className="w-16 h-16 text-academic-gold-700 mx-auto" />
            </div>
            <h2 className="classic-heading text-3xl text-academic-navy-900 mb-4">No Certificates Yet</h2>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md">
              You haven't earned any certificates yet. Complete a course to earn your first academic certificate and showcase your achievements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.certificateId}
                onClick={() => setSelectedCertificate(certificate)}
                className="classic-card bg-white cursor-pointer hover:shadow-elegant transition-all duration-300 group"
              >
                {/* Certificate Header */}
                <div className="bg-academic-gold-100 border-b border-academic-gold-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-academic-gold-200 border border-academic-gold-300 p-2 rounded-lg">
                        <FaCertificate className="text-academic-gold-700 text-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-academic-navy-900 font-playfair text-sm">
                          Academic Certificate
                        </h3>
                        <p className="text-xs text-academic-slate-600 font-inter">
                          Course Completion
                        </p>
                      </div>
                    </div>
                    <FaEye className="text-academic-gold-600 group-hover:text-academic-gold-700 transition-colors duration-200" />
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="p-6 space-y-4">
                  <h4 className="text-xl font-bold text-academic-navy-900 font-playfair leading-tight">
                    {certificate.courseName}
                  </h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-academic-slate-700">
                      <FaIdCard className="text-academic-gold-600 flex-shrink-0" size={14} />
                      <div>
                        <p className="text-xs font-semibold text-academic-slate-600 font-inter">Certificate ID</p>
                        <p className="text-sm font-mono text-academic-navy-800">{certificate.certificateId}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-academic-slate-700">
                      <FaCalendarAlt className="text-academic-gold-600 flex-shrink-0" size={14} />
                      <div>
                        <p className="text-xs font-semibold text-academic-slate-600 font-inter">Completed On</p>
                        <p className="text-sm font-medium text-academic-navy-800 font-inter">
                          {formatDate(certificate.completionDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-academic-slate-200">
                    <button className="w-full flex items-center justify-center gap-2 text-academic-gold-700 hover:text-academic-gold-800 font-medium text-sm font-inter group-hover:gap-3 transition-all duration-200">
                      <FaEye size={14} />
                      View Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCertificate && (
        <CertificateModal
          certificateData={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
}
