import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';
import IconBtn from './IconBtn';

export default function ConfirmationModal({
  modalData,
  closeModal,
  // Direct props for backward compatibility
  text1,
  text2,
  btn1Text,
  btn2Text,
  btn1Handler,
  btn2Handler,
}) {
  // Support both modalData object and direct props
  const data = modalData || {
    text1,
    text2,
    btn1Text,
    btn2Text,
    btn1Handler,
    btn2Handler,
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-black/50 backdrop-blur-sm">
      <motion.div 
        className="w-11/12 max-w-md classic-card p-8"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-academic-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaExclamationTriangle className="text-2xl text-academic-gold-600" />
          </div>
          <h2 className="elegant-heading text-xl text-academic-navy-900 mb-3">
            {data?.text1}
          </h2>
          <p className="text-academic-slate-600 leading-relaxed">
            {data?.text2}
          </p>
        </div>
        
        <div className="flex items-center gap-4 justify-center">
          <button
            onClick={data?.btn1Handler}
            className="btn-elegant px-6 py-3"
          >
            {data?.btn1Text}
          </button>
          <button
            className="btn-classic-secondary px-6 py-3"
            onClick={data?.btn2Handler}
          >
            {data?.btn2Text}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
