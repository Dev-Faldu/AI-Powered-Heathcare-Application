
import React from 'react';
import { motion } from 'framer-motion';
import Logo from '@/components/ui/Logo';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-medical-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
        >
          <Logo size="lg" showText={false} linkTo="" />
        </motion.div>
        
        <motion.div 
          className="mt-6 bg-white/20 dark:bg-black/20 h-1 w-48 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: "12rem" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-medical-500 to-teal-500"
            animate={{ x: ["0%", "100%", "0%"] }}
            transition={{ 
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut" 
            }}
          />
        </motion.div>
        
        <motion.p 
          className="mt-4 text-gray-600 dark:text-gray-300 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
