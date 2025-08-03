import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createCoupon } from '../../../services/operations/couponAPI';
import { toast } from 'react-hot-toast';
import { FiTag, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiShoppingCart, FiLink, FiEye, FiClock } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../../styles/datepicker.css";
import CustomTimePicker from '../../../components/common/CustomTimePicker';

export default function CouponForm({ onSuccess }) {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showOnFront, setShowOnFront] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Default expiry date is 7 days from now
    return date;
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      linkedTo: 'course',
      showOnFront: false,
      isActive: true,
      priority: 0,
      isCombinable: false
    }
  });

  const watchDiscountType = watch('discountType');
  const watchLinkedTo = watch('linkedTo');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Handle dates properly to avoid timezone issues
      const formData = {
        ...data,
        // Use the state dates instead of form data
        startDate: startDate,
        expiryDate: expiryDate,
        // Convert string numbers to actual numbers
        discountValue: parseFloat(data.discountValue),
        minimumOrderAmount: parseFloat(data.minimumOrderAmount || 0),
        maxDiscountAmount: parseFloat(data.maxDiscountAmount || 0),
        usageLimit: parseInt(data.usageLimit || 0),
        perUserLimit: parseInt(data.perUserLimit || 0),
        priority: parseInt(data.priority || 0),
        showOnFront: showOnFront,
        isCombinable: !!data.isCombinable,
      };

      const result = await dispatch(createCoupon(formData, token));
      
      if (result) {
        reset(); // Reset form after successful submission
        setShowOnFront(false);
        const newStartDate = new Date();
        const newExpiryDate = new Date();
        newExpiryDate.setDate(newExpiryDate.getDate() + 7);
        setStartDate(newStartDate);
        setExpiryDate(newExpiryDate);
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Failed to create coupon");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-cream-50 via-white to-academic-navy-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="classic-card p-8 shadow-elegant">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-academic-gold-100 rounded-xl flex items-center justify-center shadow-classic">
              <FiTag className="text-academic-gold-700 text-2xl" />
            </div>
            <div>
              <h1 className="classic-heading text-3xl md:text-4xl mb-2">
                Create New Coupon
              </h1>
              <p className="section-subtitle text-lg">
                Set up discount codes for your courses and bundles with precision
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="elegant-card p-6">
              <h3 className="elegant-heading mb-6 flex items-center gap-3 border-b border-academic-slate-200 pb-3">
                <div className="w-8 h-8 bg-academic-navy-100 rounded-lg flex items-center justify-center">
                  <FiTag className="text-academic-navy-700" />
                </div>
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiTag className="text-academic-gold-600 text-sm" />
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., WELCOME50"
                    {...register("code", {
                      required: "Coupon code is required",
                      pattern: {
                        value: /^[A-Z0-9]+$/,
                        message: "Only uppercase letters and numbers allowed"
                      }
                    })}
                    className={`classic-input ${errors.code ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.code && <span className="text-red-600 text-sm font-medium">{errors.code.message}</span>}
                </div>

                {/* Linked To */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiLink className="text-academic-navy-600 text-sm" />
                    Linked To
                  </label>
                  <select
                    {...register("linkedTo", { required: "Please select what this coupon is linked to" })}
                    className={`classic-input ${errors.linkedTo ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="course">Link to Course</option>
                    <option value="bundle">Link to Bundle Course</option>
                  </select>
                  {errors.linkedTo && <span className="text-red-600 text-sm font-medium">{errors.linkedTo.message}</span>}
                  <p className="text-sm text-academic-slate-500">
                    {watchLinkedTo === 'course' 
                      ? 'This coupon will only be valid for individual course purchases' 
                      : 'This coupon will only be valid for bundle course purchases'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Discount Configuration Section */}
            <div className="elegant-card p-6">
              <h3 className="elegant-heading mb-6 flex items-center gap-3 border-b border-academic-slate-200 pb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiPercent className="text-green-700" />
                </div>
                Discount Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Discount Type */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiPercent className="text-green-600 text-sm" />
                    Discount Type
                  </label>
                  <select
                    {...register("discountType", { required: "Discount type is required" })}
                    className={`classic-input ${errors.discountType ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  >
                    <option value="">Select discount type</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                  {errors.discountType && <span className="text-red-600 text-sm font-medium">{errors.discountType.message}</span>}
                </div>

                {/* Discount Value */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiDollarSign className="text-green-600 text-sm" />
                    Discount Value
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder={watchDiscountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                      {...register("discountValue", {
                        required: "Discount value is required",
                        min: {
                          value: 0,
                          message: "Value must be positive"
                        },
                        max: watchDiscountType === 'percentage' ? {
                          value: 100,
                          message: "Percentage cannot exceed 100%"
                        } : undefined
                      })}
                      className={`classic-input pr-8 ${errors.discountValue ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      onWheel={(e) => e.target.blur()}
                    />
                    {watchDiscountType && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 text-sm font-medium">
                        {watchDiscountType === 'percentage' ? '%' : '₹'}
                      </span>
                    )}
                  </div>
                  {errors.discountValue && <span className="text-red-600 text-sm font-medium">{errors.discountValue.message}</span>}
                </div>

                {/* Max Discount Amount (only for percentage) */}
                {watchDiscountType === 'percentage' && (
                  <div className="space-y-2">
                    <label className="classic-label flex items-center gap-2">
                      <FiDollarSign className="text-orange-600 text-sm" />
                      Max Discount Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0 for unlimited"
                        {...register("maxDiscountAmount", {
                          min: {
                            value: 0,
                            message: "Value must be positive"
                          }
                        })}
                        className={`classic-input pr-8 ${errors.maxDiscountAmount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                        onWheel={(e) => e.target.blur()}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 text-sm font-medium">₹</span>
                    </div>
                    {errors.maxDiscountAmount && <span className="text-red-600 text-sm font-medium">{errors.maxDiscountAmount.message}</span>}
                    <p className="text-sm text-academic-slate-500">Maximum discount amount for percentage coupons</p>
                  </div>
                )}

                {/* Minimum Order Amount */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiShoppingCart className="text-blue-600 text-sm" />
                    Minimum Order Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0 for no minimum"
                      {...register("minimumOrderAmount", {
                        min: {
                          value: 0,
                          message: "Value must be positive"
                        }
                      })}
                      className={`classic-input pr-8 ${errors.minimumOrderAmount ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      onWheel={(e) => e.target.blur()}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-academic-slate-500 text-sm font-medium">₹</span>
                  </div>
                  {errors.minimumOrderAmount && <span className="text-red-600 text-sm font-medium">{errors.minimumOrderAmount.message}</span>}
                </div>
              </div>
            </div>

            {/* Usage Limits Section */}
            <div className="elegant-card p-6">
              <h3 className="elegant-heading mb-6 flex items-center gap-3 border-b border-academic-slate-200 pb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-purple-700" />
                </div>
                Usage Limits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usage Limit */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiUsers className="text-purple-600 text-sm" />
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    placeholder="0 for unlimited"
                    {...register("usageLimit", {
                      min: {
                        value: 0,
                        message: "Value must be positive"
                      }
                    })}
                    className={`classic-input ${errors.usageLimit ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    onWheel={(e) => e.target.blur()}
                  />
                  {errors.usageLimit && <span className="text-red-600 text-sm font-medium">{errors.usageLimit.message}</span>}
                  <p className="text-sm text-academic-slate-500">Maximum number of times this coupon can be used</p>
                </div>

                {/* Per User Limit */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiUsers className="text-orange-600 text-sm" />
                    Per User Limit
                  </label>
                  <input
                    type="number"
                    placeholder="0 for unlimited"
                    {...register("perUserLimit", {
                      min: {
                        value: 0,
                        message: "Value must be positive"
                      }
                    })}
                    className={`classic-input ${errors.perUserLimit ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                    onWheel={(e) => e.target.blur()}
                  />
                  {errors.perUserLimit && <span className="text-red-600 text-sm font-medium">{errors.perUserLimit.message}</span>}
                  <p className="text-sm text-academic-slate-500">Maximum uses per individual user</p>
                </div>
              </div>
            </div>

            {/* Validity Period Section */}
            <div className="elegant-card p-6">
              <h3 className="elegant-heading mb-6 flex items-center gap-3 border-b border-academic-slate-200 pb-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="text-cyan-700" />
                </div>
                Validity Period
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiCalendar className="text-cyan-600 text-sm" />
                    Start Date & Time
                  </label>
                  <div className="relative">
                    <div className="space-y-3">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          const newDate = new Date(date);
                          newDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
                          setStartDate(newDate);
                          setValue("startDate", newDate);
                          // If expiry date is before the new start date, update it
                          if (expiryDate < newDate) {
                            const newExpiryDate = new Date(newDate);
                            newExpiryDate.setDate(newDate.getDate() + 7);
                            setExpiryDate(newExpiryDate);
                            setValue("expiryDate", newExpiryDate);
                          }
                        }}
                        showTimeSelect={false}
                        dateFormat="MMMM d, yyyy"
                        calendarStartDay={0}
                        className="classic-input"
                        calendarClassName="bg-white border border-academic-slate-300 rounded-xl shadow-elegant text-academic-slate-900"
                        popperClassName="react-datepicker-popper"
                        withPortal
                        portalId="start-date-picker-portal"
                        customInput={
                          <div className="relative w-full">
                            <input
                              type="text"
                              className="classic-input pr-10"
                              value={startDate ? startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                              readOnly
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <FiCalendar className="text-cyan-600" />
                            </div>
                          </div>
                        }
                      />
                      <CustomTimePicker
                        selectedTime={startDate}
                        onChange={(time) => {
                          const newDate = new Date(startDate);
                          newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
                          setStartDate(newDate);
                          setValue("startDate", newDate);
                        }}
                      />
                    </div>
                  </div>
                  {errors.startDate && <span className="text-red-600 text-sm font-medium">{errors.startDate.message}</span>}
                </div>

                {/* Expiry Date */}
                <div className="space-y-2">
                  <label className="classic-label flex items-center gap-2">
                    <FiCalendar className="text-red-600 text-sm" />
                    Expiry Date & Time
                  </label>
                  <div className="relative">
                    <div className="space-y-3">
                      <DatePicker
                        selected={expiryDate}
                        onChange={(date) => {
                          const newDate = new Date(date);
                          newDate.setHours(expiryDate.getHours(), expiryDate.getMinutes(), 0, 0);
                          setExpiryDate(newDate);
                          setValue("expiryDate", newDate);
                        }}
                        showTimeSelect={false}
                        dateFormat="MMMM d, yyyy"
                        calendarStartDay={0}
                        minDate={new Date(startDate.getTime() + 24 * 60 * 60 * 1000)} // At least 1 day after start date
                        className="classic-input"
                        calendarClassName="bg-white border border-academic-slate-300 rounded-xl shadow-elegant text-academic-slate-900"
                        popperClassName="react-datepicker-popper"
                        withPortal
                        portalId="expiry-date-picker-portal"
                        customInput={
                          <div className="relative w-full">
                            <input
                              type="text"
                              className="classic-input pr-10"
                              value={expiryDate ? expiryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                              readOnly
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <FiCalendar className="text-red-600" />
                            </div>
                          </div>
                        }
                      />
                      <CustomTimePicker
                        selectedTime={expiryDate}
                        onChange={(time) => {
                          const newDate = new Date(expiryDate);
                          newDate.setHours(time.getHours(), time.getMinutes(), 0, 0);
                          setExpiryDate(newDate);
                          setValue("expiryDate", newDate);
                        }}
                      />
                    </div>
                  </div>
                  {errors.expiryDate && <span className="text-red-600 text-sm font-medium">{errors.expiryDate.message}</span>}
                </div>
              </div>
            </div>

            {/* Display Settings Section */}
            <div className="elegant-card p-6">
              <h3 className="elegant-heading mb-6 flex items-center gap-3 border-b border-academic-slate-200 pb-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FiEye className="text-indigo-700" />
                </div>
                Display Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Show on Front Toggle */}
                <div className="space-y-3">
                  <label className="classic-label flex items-center gap-2">
                    <FiEye className="text-indigo-600 text-sm" />
                    Display on Frontend
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowOnFront(!showOnFront)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white ${
                        showOnFront
                          ? 'bg-academic-navy-600 focus:ring-academic-navy-500'
                          : 'bg-academic-slate-300 focus:ring-academic-slate-500'
                      }`}
                    >
                      <span className="sr-only">Toggle frontend display</span>
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                          showOnFront ? 'translate-x-8' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <span className={`text-sm font-medium ${showOnFront ? 'text-academic-navy-700' : 'text-academic-slate-500'}`}>
                      {showOnFront ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <p className="text-sm text-academic-slate-500">
                    {showOnFront 
                      ? 'Coupon code will be displayed on checkout page as an available coupon' 
                      : 'Coupon code will remain hidden from frontend'
                    }
                  </p>
                </div>

                {/* Priority Setting */}
                <div className="space-y-3">
                  <label className="classic-label flex items-center gap-2">
                    <FiTag className="text-purple-600 text-sm" />
                    Priority Level
                  </label>
                  <input
                    type="number"
                    placeholder="0 (lowest) to 10 (highest)"
                    {...register("priority", {
                      min: {
                        value: 0,
                        message: "Priority must be between 0 and 10"
                      },
                      max: {
                        value: 10,
                        message: "Priority must be between 0 and 10"
                      }
                    })}
                    className={`classic-input ${errors.priority ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  />
                  {errors.priority && <span className="text-red-600 text-sm font-medium">{errors.priority.message}</span>}
                  <p className="text-sm text-academic-slate-500">Higher priority coupons are applied first when multiple coupons are valid</p>
                </div>

                {/* Combinable Setting */}
                <div className="space-y-3">
                  <label className="classic-label flex items-center gap-2">
                    <FiTag className="text-cyan-600 text-sm" />
                    Combinable with Other Coupons
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...register("isCombinable")}
                      className="h-5 w-5 text-academic-navy-600 bg-white border-academic-slate-300 rounded focus:ring-academic-navy-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-sm text-academic-slate-700">Allow combining with other coupons</span>
                  </div>
                  <p className="text-sm text-academic-slate-500">If checked, this coupon can be used together with other combinable coupons</p>
                </div>

                {/* Active Status */}
                <div className="space-y-3">
                  <label className="classic-label flex items-center gap-2">
                    <FiTag className="text-green-600 text-sm" />
                    Coupon Status
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      {...register("isActive")}
                      className="h-5 w-5 text-green-600 bg-white border-academic-slate-300 rounded focus:ring-green-500 focus:ring-2 transition-all duration-200"
                    />
                    <span className="text-sm text-academic-slate-700">Activate coupon immediately</span>
                  </div>
                  <p className="text-sm text-academic-slate-500">Uncheck to create as inactive coupon</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn-elegant disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiTag className="text-lg" />
                    Create Coupon
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
