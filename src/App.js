import React from 'react';
import ProductImageCarousel from './ProductImageCarousel';
import { motion } from 'framer-motion';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-12">
      <div className="container mx-auto px-4">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Meliotech Product Management</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Effortlessly upload, manage, and showcase your product images with our interactive image carousel
          </p>
        </motion.header>
        
        <main>
          <ProductImageCarousel />
        </main>
        
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-gray-500 text-sm"
        >
          <p>Created for Meliotech Talent Challenge - April 2025</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">About</a>
            <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">Contact</a>
            <a href="#" className="text-blue-500 hover:text-blue-700 transition-colors">Help</a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;