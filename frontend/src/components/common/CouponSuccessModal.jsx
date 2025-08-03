import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { FaGift, FaCheckCircle } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const CouponSuccessModal = ({ isOpen, onClose, discountAmount }) => {
  // Function to trigger confetti
  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1500
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen) {
      triggerConfetti();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative classic-card p-10 max-w-lg w-full mx-4 text-center shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button with improved positioning and styling */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 text-academic-slate-500 hover:text-academic-slate-700 transition-colors p-3 hover:bg-academic-slate-100 rounded-full z-50"
            >
              <FiX size={24} />
            </button>

            {/* Party poppers animation */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="absolute top-6 left-6 text-4xl"
              >
                <FaGift className="text-academic-gold-500 transform rotate-[-45deg] drop-shadow-lg" />
              </motion.div>
            </div>

            {/* Animated confetti */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ 
                    y: [null, Math.random() * 400],
                    x: [null, (Math.random() - 0.5) * 200],
                    rotate: [0, Math.random() * 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 2
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    ['bg-academic-gold-400', 'bg-academic-gold-500', 'bg-green-400'][i % 3]
                  }`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10px'
                  }}
                />
              ))}
            </div>

            {/* Discount badge */}
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10 }}
              className="relative mb-8"
            >
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-academic-gold-100 to-academic-gold-200 rounded-full flex items-center justify-center shadow-elegant border-4 border-academic-gold-300">
                <div className="w-20 h-20 bg-gradient-to-br from-academic-gold-400 to-academic-gold-500 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-white font-bold">₹{discountAmount}</span>
                </div>
              </div>
            </motion.div>

            {/* Success message with animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="classic-heading text-3xl text-academic-navy-900 mb-4">
                Awesome! Coupon Applied
              </h2>
              
              <div className="mb-6">
                <p className="text-xl text-academic-slate-700 mb-2 font-semibold">
                  You saved ₹{discountAmount} on this course!
                </p>
                <p className="text-academic-slate-600">
                  The discount has been applied to your order
                </p>
              </div>

              {/* Success checkmark animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-300"
              >
                <FaCheckCircle className="text-3xl text-green-600" />
              </motion.div>
            </motion.div>

            {/* Celebration message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-academic-gold-50 border border-academic-gold-200 rounded-xl p-4"
            >
              <p className="text-academic-gold-800 font-medium">
                🎉 Congratulations on your savings! 🎉
              </p>
              <p className="text-sm text-academic-gold-700 mt-1">
                Continue to checkout to complete your purchase
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponSuccessModal;
