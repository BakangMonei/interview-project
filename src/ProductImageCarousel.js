import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Upload, X, ChevronLeft, ChevronRight, Image as ImageIcon, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const ProductImageCarousel = () => {
  const [images, setImages] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);
  
  // Handle file selection
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Simulating upload delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create URL objects for previewing images
      const newImages = selectedFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      setImages(prevImages => [...prevImages, ...newImages]);
      
      toast.success(`Successfully added ${selectedFiles.length} ${selectedFiles.length === 1 ? 'image' : 'images'}!`, {
        position: "bottom-right",
        autoClose: 3000
      });
      
      // Automatically switch to preview mode if this is the first image(s)
      if (images.length === 0) {
        setTimeout(() => setPreviewMode(true), 500);
      }
    } catch (error) {
      toast.error("Failed to process images. Please try again.", {
        position: "bottom-right",
        autoClose: 3000
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle image removal
  const removeImage = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];
    
    setImages(images.filter((_, index) => index !== indexToRemove));
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imageToRemove.url);
    
    toast.info("Image removed", {
      position: "bottom-right",
      autoClose: 2000
    });
    
    // If removing the last image, switch back to upload mode
    if (images.length === 1) {
      setPreviewMode(false);
    }
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);
  
  // Settings for the react-slick carousel
  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    accessibility: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    autoplay: images.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    beforeChange: (current, next) => {
      document.querySelectorAll(".slide-content").forEach(slide => {
        slide.classList.add("opacity-0");
        slide.classList.remove("opacity-100");
      });
    },
    afterChange: current => {
      const activeSlide = document.querySelector(`.slide-${current} .slide-content`);
      if (activeSlide) {
        activeSlide.classList.add("opacity-100");
        activeSlide.classList.remove("opacity-0");
      }
    },
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        }
      }
    ]
  };
  
  // Custom arrow components for accessibility and styling
  function CustomPrevArrow(props) {
    const { className, onClick } = props;
    return (
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-white bg-opacity-90 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onClick}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6 text-blue-600" />
      </motion.button>
    );
  }
  
  function CustomNextArrow(props) {
    const { className, onClick } = props;
    return (
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-white bg-opacity-90 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={onClick}
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6 text-blue-600" />
      </motion.button>
    );
  }
  
  // Handle drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setIsUploading(true);
    
    try {
      const droppedFiles = Array.from(e.dataTransfer.files);
      
      // Only process image files
      const imageFiles = droppedFiles.filter(file => 
        file.type.startsWith('image/')
      );
      
      if (imageFiles.length === 0) {
        toast.warning("No valid image files found. Please upload JPG, PNG, or GIF files.", {
          position: "bottom-right",
          autoClose: 3000
        });
        setIsUploading(false);
        return;
      }
      
      // Simulating upload delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create URL objects for previewing images
      const newImages = imageFiles.map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      setImages(prevImages => [...prevImages, ...newImages]);
      
      toast.success(`Successfully added ${imageFiles.length} ${imageFiles.length === 1 ? 'image' : 'images'}!`, {
        position: "bottom-right",
        autoClose: 3000
      });
      
      // Automatically switch to preview mode if this is the first image(s)
      if (images.length === 0) {
        setTimeout(() => setPreviewMode(true), 500);
      }
    } catch (error) {
      toast.error("Failed to process dropped images. Please try again.", {
        position: "bottom-right",
        autoClose: 3000
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  // Toggle between upload and preview modes
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <ToastContainer />
      
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800"
      >
        Product Image Showcase
      </motion.h1>
      
      {/* Mode toggle button */}
      {images.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <button
            onClick={togglePreviewMode}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:scale-105 shadow-md font-medium flex items-center space-x-2"
            aria-pressed={previewMode}
          >
            {previewMode ? (
              <>
                <Upload className="h-5 w-5" />
                <span>Back to Upload Mode</span>
              </>
            ) : (
              <>
                <ImageIcon className="h-5 w-5" />
                <span>Preview Carousel</span>
              </>
            )}
          </button>
        </motion.div>
      )}
      
      <AnimatePresence mode="wait">
        {!previewMode ? (
          /* Upload Mode */
          <motion.div
            key="upload-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Drag and drop area */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300'} rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex="0"
              role="button"
              aria-label="Upload images by clicking or dragging and dropping"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current.click();
                }
              }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Upload className="h-16 w-16 text-blue-500 mb-4" />
                </motion.div>
                <p className="text-xl font-medium text-gray-800 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Support for JPG, PNG, GIF (Max 10MB each)
                </p>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-40 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Processing...</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                multiple
                className="hidden"
                aria-hidden="true"
                disabled={isUploading}
              />
            </motion.div>
            
            {/* Preview of selected images */}
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Gallery ({images.length})</h2>
                  {images.length > 0 && (
                    <button 
                      onClick={() => {
                        setImages([]);
                        toast.info("All images removed", {
                          position: "bottom-right",
                          autoClose: 2000
                        });
                      }}
                      className="flex items-center text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Remove all images"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      <span>Clear all</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {images.map((image, index) => (
                      <motion.div 
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative group bg-white rounded-lg overflow-hidden shadow-md"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg"
                          aria-label={`Remove image ${image.name}`}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                        <div className="p-2 bg-white">
                          <p className="text-sm truncate text-gray-600">{image.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Preview Carousel Mode */
          <motion.div
            key="preview-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-xl p-8 border border-gray-100"
          >
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Image Showcase</h2>
            
            {images.length > 0 ? (
              <div className="carousel-container">
                <div className="relative">
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {images.map((image, index) => (
                      <div key={image.id} className={`focus:outline-none slide-${index}`}>
                        <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio container */}
                          <img
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            className="absolute top-0 left-0 w-full h-full object-contain rounded-md"
                          />
                        </div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="slide-content text-center mt-4 bg-white bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-full mx-auto max-w-max opacity-0 transition-opacity duration-500"
                        >
                          <p className="text-gray-800 font-medium">{image.name}</p>
                        </motion.div>
                      </div>
                    ))}
                  </Slider>
                  
                  {/* Thumbnail navigator */}
                  {images.length > 1 && (
                    <div className="mt-6">
                      <div className="flex justify-center flex-wrap gap-2">
                        {images.map((image, index) => (
                          <motion.button
                            key={`thumb-${image.id}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => sliderRef.current.slickGoTo(index)}
                            className={`focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md overflow-hidden transition-all ${
                              sliderRef.current && sliderRef.current.innerSlider.state.currentSlide === index
                                ? 'ring-2 ring-blue-500 shadow-md'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          >
                            <div className="w-16 h-16">
                              <img
                                src={image.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No images to display. Please upload some images first.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Accessibility and information note */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg"
      >
        <p>
          <span className="font-semibold">Accessibility features:</span> Keyboard navigation, 
          focus indicators, ARIA labels, and screen reader support are implemented for an inclusive user experience.
        </p>
      </motion.div>
    </div>
  );
};

export default ProductImageCarousel;