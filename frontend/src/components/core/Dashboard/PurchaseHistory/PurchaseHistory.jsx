import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { FiFileText } from "react-icons/fi";
import { FaReceipt, FaShoppingCart, FaCalendarAlt, FaRupeeSign, FaCheckCircle, FaDownload } from "react-icons/fa";
import { apiConnector } from "../../../../services/apiConnector";
import { courseEndpoints } from "../../../../services/apis";
import OrderViewModal from "../../../../pages/Admin/components/OrderViewModal";
import Img from "../../../common/Img";

const { COURSE_PURCHASE_HISTORY_API } = courseEndpoints;

export default function PurchaseHistory() {
  const { token } = useSelector((state) => state.auth);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      try {
        const response = await apiConnector(
          "GET",
          COURSE_PURCHASE_HISTORY_API,
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        if (response?.data?.success) {
          setPurchases(response.data.data);
        } else {
          throw new Error("Could not fetch purchase history");
        }
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    };

    fetchPurchaseHistory();
  }, [token]);

  const handleViewInvoice = (purchase) => {
    // Convert purchase data to order format for the admin invoice modal
    const orderData = {
      _id: purchase._id,
      transactionId: purchase.transactionId || `TXN_${purchase._id.slice(-8)}`,
      purchaseDate: purchase.purchaseDate,
      amount: purchase.price,
      originalPrice: purchase.originalPrice || purchase.price,
      discountAmount: purchase.discountAmount || 0,
      couponUsed: purchase.couponUsed || null,
      paymentMethod: purchase.paymentMethod || 'Online',
      course: {
        courseName: purchase.courseName,
        instructor: {
          firstName: purchase.instructor || 'DineshKumar'
        }
      },
      user: {
        firstName: purchase.userFirstName || 'Student',
        lastName: purchase.userLastName || '',
        email: purchase.userEmail || 'N/A',
        additionalDetails: {
          contactNumber: purchase.userPhone || 'N/A'
        }
      }
    };
    
    setSelectedOrder(orderData);
    setShowInvoiceModal(true);
  };

  return (
    <div className="bg-academic-cream-50 min-h-screen">
      {/* Academic Header */}
      <div className="bg-white border-b-2 border-academic-slate-200 shadow-elegant">
        <div className="px-8 py-8">
          <div className="text-sm text-academic-slate-500 mb-4 font-inter">
            <span>Dashboard</span> <span className="mx-2 text-academic-gold-600">›</span> <span className="text-academic-navy-800 font-semibold">Purchase History</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-4 rounded-xl">
                <FaReceipt className="text-academic-gold-700 text-2xl" />
              </div>
              <div>
                <h1 className="classic-heading text-3xl lg:text-4xl mb-2">
                  Purchase History
                </h1>
                <p className="section-subtitle text-lg">
                  View your academic course purchases and invoices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-academic-slate-700 font-inter">
              <span className="flex items-center gap-2 bg-academic-gold-100 px-3 py-2 rounded-lg border border-academic-gold-200">
                <FaShoppingCart className="text-academic-gold-600" />
                <span className="font-medium">{purchases?.length || 0} Purchases</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academic-gold-600"></div>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-16">
            <div className="bg-academic-gold-100 border-2 border-academic-gold-300 p-8 rounded-xl mb-8">
              <FaShoppingCart className="w-16 h-16 text-academic-gold-700 mx-auto" />
            </div>
            <h2 className="classic-heading text-3xl text-academic-navy-900 mb-4">No Purchase History</h2>
            <p className="section-subtitle text-academic-slate-600 mb-8 max-w-md">
              You haven't purchased any courses yet. Start exploring our academic programs and make your first purchase.
            </p>
          </div>
        ) : (
          <>
            {/* Academic Desktop Table View */}
            <div className="hidden lg:block">
              <div className="classic-card bg-white overflow-hidden">
                <div className="bg-academic-navy-800 text-white">
                  <div className="flex px-8 py-4 font-semibold font-inter">
                    <p className="w-[40%]">Course Details</p>
                    <p className="w-[18%] text-center">Purchase Date</p>
                    <p className="w-[15%] text-center">Price</p>
                    <p className="w-[15%] text-center">Status</p>
                    <p className="w-[12%] text-center">Invoice</p>
                  </div>
                </div>
                <div className="divide-y divide-academic-slate-200">
                  {purchases.map((purchase, i) => (
                    <div
                      className="flex items-center px-8 py-6 hover:bg-academic-cream-50 transition-colors duration-200"
                      key={purchase._id}
                    >
                      <div className="flex w-[40%] items-center gap-6">
                        <Img
                          src={purchase.thumbnail}
                          alt="course_img"
                          className="h-16 w-16 rounded-xl object-cover border-2 border-academic-slate-200 shadow-classic"
                        />
                        <div className="flex flex-col gap-2 min-w-0">
                          <p className="font-bold text-academic-navy-900 font-playfair text-lg">
                            {purchase.courseName}
                          </p>
                          <p className="text-sm text-academic-slate-600 font-inter line-clamp-2">
                            {purchase.courseDescription?.length > 60
                              ? `${purchase.courseDescription.slice(0, 60)}...`
                              : purchase.courseDescription}
                          </p>
                        </div>
                      </div>
                      <div className="w-[18%] text-center">
                        <div className="flex items-center justify-center gap-2 text-academic-slate-700">
                          <FaCalendarAlt className="text-academic-gold-600" size={14} />
                          <p className="text-sm font-medium font-inter">
                            {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="w-[15%] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FaRupeeSign className="text-academic-gold-600" size={12} />
                          <p className="text-sm font-bold text-academic-gold-700 font-inter">
                            {purchase.price === 0 ? "Free" : purchase.price}
                          </p>
                        </div>
                      </div>
                      <div className="w-[15%] text-center">
                        <div className="flex items-center justify-center gap-2">
                          <FaCheckCircle className="text-green-600" size={14} />
                          <p className="text-sm font-medium text-green-700 font-inter">
                            {purchase.status}
                          </p>
                        </div>
                      </div>
                      <div className="w-[12%] text-center">
                        <button
                          onClick={() => handleViewInvoice(purchase)}
                          className="flex items-center gap-2 px-4 py-2 bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-300 rounded-lg hover:bg-academic-gold-200 transition-colors duration-200 text-sm font-medium font-inter"
                        >
                          <FaDownload size={12} />
                          Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Academic Mobile Card View */}
            <div className="lg:hidden space-y-6">
              {purchases.map((purchase) => (
                <div key={purchase._id} className="classic-card bg-white p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Img
                      src={purchase.thumbnail}
                      alt="course_img"
                      className="h-20 w-20 rounded-xl object-cover border-2 border-academic-slate-200 shadow-classic"
                    />
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="font-bold text-academic-navy-900 font-playfair text-lg">
                        {purchase.courseName}
                      </p>
                      <p className="text-sm text-academic-slate-600 font-inter line-clamp-2">
                        {purchase.courseDescription?.length > 60
                          ? `${purchase.courseDescription.slice(0, 60)}...`
                          : purchase.courseDescription}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-academic-cream-50 p-4 rounded-lg border border-academic-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendarAlt className="text-academic-gold-600" size={14} />
                        <p className="font-semibold text-academic-slate-700 font-inter text-sm">Purchase Date</p>
                      </div>
                      <p className="text-academic-navy-900 font-medium font-inter">
                        {new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-academic-cream-50 p-4 rounded-lg border border-academic-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <FaRupeeSign className="text-academic-gold-600" size={14} />
                        <p className="font-semibold text-academic-slate-700 font-inter text-sm">Price</p>
                      </div>
                      <p className="text-academic-gold-700 font-bold font-inter">
                        {purchase.price === 0 ? "Free" : `₹${purchase.price}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCheckCircle className="text-green-600" size={14} />
                      <p className="font-semibold text-green-700 font-inter text-sm">Status</p>
                    </div>
                    <p className="text-green-800 font-medium font-inter">{purchase.status}</p>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      onClick={() => handleViewInvoice(purchase)}
                      className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-academic-gold-100 text-academic-gold-800 border border-academic-gold-300 rounded-lg hover:bg-academic-gold-200 transition-colors duration-200 font-medium font-inter"
                    >
                      <FaDownload size={16} />
                      Download Invoice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      {/* Invoice Modal */}
      {showInvoiceModal && selectedOrder && (
        <OrderViewModal
          order={selectedOrder}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
