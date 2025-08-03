import { useState } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import CouponForm from './components/CouponForm';
import CouponList from './components/CouponList';

export default function Coupons() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateCoupon = () => {
    setShowCreateForm(true);
  };

  const handleBackToList = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
          <div>
            <h1 className="classic-heading text-3xl md:text-4xl mb-2">
              Coupon Management
            </h1>
            <p className="section-subtitle text-lg">
              Create and manage discount coupons for your courses
            </p>
          </div>
          {!showCreateForm && (
            <button
              onClick={handleCreateCoupon}
              className="btn-elegant flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Create Coupon
            </button>
          )}
        </div>

        {showCreateForm ? (
          <div className="space-y-6">
            {/* Create Form Header */}
            <div className="classic-card p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h2 className="elegant-heading mb-2">Create New Coupon</h2>
                  <p className="text-academic-slate-600">
                    Fill in the details below to create a new discount coupon
                  </p>
                </div>
                <button
                  onClick={handleBackToList}
                  className="btn-classic-secondary flex items-center gap-2 self-start sm:self-auto"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back to List
                </button>
              </div>
            </div>

            {/* Create Form */}
            <div className="classic-card p-8">
              <CouponForm onSuccess={handleBackToList} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <CouponList />
          </div>
        )}
      </div>
    </div>
  );
}
