import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className='flex flex-col justify-center items-center gap-6 p-8'>
            {/* Academic-themed loading spinner */}
            <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 border-4 border-academic-slate-200 rounded-full"></div>
                {/* Spinning ring */}
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-academic-gold-500 rounded-full animate-spin"></div>
                {/* Inner dot */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-academic-gold-500 rounded-full"></div>
            </div>

            {/* Loading text with academic styling */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
            >
                <h3 className="elegant-heading text-lg text-academic-navy-900 mb-2">
                    Loading...
                </h3>
                <p className="text-sm text-academic-slate-600">
                    Please wait while we prepare your content
                </p>
            </motion.div>

            {/* Academic-themed progress dots */}
            <div className="flex gap-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className="w-2 h-2 bg-academic-gold-500 rounded-full"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Loading;
