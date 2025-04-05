import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Trash2,
  Maximize2,
  Download,
  Share2,
  Filter,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const ProductImageCarousel = ({ isDarkMode }) => {
  const [images, setImages] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);
  const popoverRef = useRef(null);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Handle file selection
  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Simulating upload delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create URL objects for previewing images
      const newImages = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: file.type,
        size: file.size,
        date: new Date().toISOString(),
        dimensions: { width: 0, height: 0 }, // Will be updated after image loads
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);

      toast.success(
        `Successfully added ${selectedFiles.length} ${
          selectedFiles.length === 1 ? "image" : "images"
        }!`,
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );

      // Automatically switch to preview mode if this is the first image(s)
      if (images.length === 0) {
        setTimeout(() => setPreviewMode(true), 500);
      }
    } catch (error) {
      toast.error("Failed to process images. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Update image dimensions after load
  const updateImageDimensions = (imageId, width, height) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === imageId ? { ...img, dimensions: { width, height } } : img
      )
    );
  };

  // Handle image removal
  const removeImage = (indexToRemove) => {
    const imageToRemove = images[indexToRemove];

    setImages(images.filter((_, index) => index !== indexToRemove));

    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imageToRemove.url);

    toast.info("Image removed", {
      position: "bottom-right",
      autoClose: 2000,
    });

    // If removing the last image, switch back to upload mode
    if (images.length === 1) {
      setPreviewMode(false);
    }
  };

  // Handle image download
  const downloadImage = (image) => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle image sharing
  const shareImage = async (image) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.name,
          text: "Check out this image!",
          url: image.url,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(image.url);
        toast.success("Image URL copied to clipboard!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Filter and sort images
  const getFilteredAndSortedImages = () => {
    let filteredImages = [...images];

    // Apply filter
    if (filterType !== "all") {
      filteredImages = filteredImages.filter((img) =>
        img.type.startsWith(`image/${filterType}`)
      );
    }

    // Apply sorting
    filteredImages.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "size") {
        return b.size - a.size;
      }
      return 0;
    });

    return filteredImages;
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  // Enhanced carousel settings
  const sliderSettings = {
    dots: true,
    infinite: images.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    accessibility: true,
    prevArrow: <CustomPrevArrow isDarkMode={isDarkMode} />,
    nextArrow: <CustomNextArrow isDarkMode={isDarkMode} />,
    autoplay: images.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    adaptiveHeight: true,
    fade: true,
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)",
    beforeChange: (current, next) => {
      setCurrentSlide(next);
      document.querySelectorAll(".slide-content").forEach((slide) => {
        slide.classList.add("opacity-0");
        slide.classList.remove("opacity-100");
      });
    },
    afterChange: (current) => {
      const activeSlide = document.querySelector(
        `.slide-${current} .slide-content`
      );
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
        },
      },
    ],
  };

  // Custom arrow components for accessibility and styling
  function CustomPrevArrow(props) {
    const { className, onClick } = props;
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute left-4 top-1/2 z-10 -translate-y-1/2 ${
          props.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } bg-opacity-90 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={onClick}
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </motion.button>
    );
  }

  function CustomNextArrow(props) {
    const { className, onClick } = props;
    return (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute right-4 top-1/2 z-10 -translate-y-1/2 ${
          props.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        } bg-opacity-90 p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
        onClick={onClick}
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
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
      const imageFiles = droppedFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        toast.warning(
          "No valid image files found. Please upload JPG, PNG, or GIF files.",
          {
            position: "bottom-right",
            autoClose: 3000,
          }
        );
        setIsUploading(false);
        return;
      }

      // Simulating upload delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Create URL objects for previewing images
      const newImages = imageFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: file.type,
        size: file.size,
        date: new Date().toISOString(),
        dimensions: { width: 0, height: 0 },
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);

      toast.success(
        `Successfully added ${imageFiles.length} ${
          imageFiles.length === 1 ? "image" : "images"
        }!`,
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );

      // Automatically switch to preview mode if this is the first image(s)
      if (images.length === 0) {
        setTimeout(() => setPreviewMode(true), 500);
      }
    } catch (error) {
      toast.error("Failed to process dropped images. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Toggle between upload and preview modes
  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };

  // Handle image click for fullscreen view
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Close fullscreen view
  const closeFullscreen = () => {
    setSelectedImage(null);
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image before submitting");
      return;
    }
    setIsSubmitted(true);
    setShowPopover(true);
    toast.success("Images submitted successfully!");
  };

  const handleClosePopover = () => {
    setShowPopover(false);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle carousel drag
  const handleCarouselDragStart = (e) => {
    setIsDraggingCarousel(true);
    setDragStartX(e.clientX);
    setDragStartY(e.clientY);
  };

  const handleCarouselDragEnd = (e) => {
    if (!isDraggingCarousel) return;

    const dragEndX = e.clientX;
    const dragEndY = e.clientY;
    const deltaX = dragEndX - dragStartX;
    const deltaY = dragEndY - dragStartY;

    // Only handle horizontal drags
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        sliderRef.current?.slickPrev();
      } else if (deltaX < -50) {
        sliderRef.current?.slickNext();
      }
    }

    setIsDraggingCarousel(false);
  };

  return (
    <div
      className={`max-w-5xl mx-auto p-6 ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}
    >
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-3xl font-bold mb-8 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
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
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all transform hover:scale-105 shadow-md font-medium flex items-center space-x-2 ${
              isDarkMode ? "shadow-blue-900/30" : ""
            }`}
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
              className={`border-2 ${
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-dashed border-gray-300 dark:border-gray-700"
              } rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex="0"
              role="button"
              aria-label="Upload images by clicking or dragging and dropping"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  fileInputRef.current.click();
                }
              }}
            >
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <Upload
                    className={`h-16 w-16 ${
                      isDarkMode ? "text-blue-400" : "text-blue-500"
                    } mb-4`}
                  />
                </motion.div>
                <p
                  className={`text-xl font-medium mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Click to upload or drag and drop
                </p>
                <p
                  className={`text-sm mb-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Support for JPG, PNG, GIF (Max 10MB each)
                </p>
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-40 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                    <p
                      className={`text-sm mt-2 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Processing...
                    </p>
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
                  <h2
                    className={`text-xl font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Gallery ({images.length})
                  </h2>
                  <div className="flex items-center space-x-4">
                    {/* Filter and Sort Controls */}
                    <div className="flex items-center space-x-2">
                      <Filter
                        className={`h-4 w-4 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className={`px-2 py-1 rounded-md text-sm ${
                          isDarkMode
                            ? "bg-gray-800 text-white border-gray-700"
                            : "bg-white text-gray-800 border-gray-300"
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="all">All Types</option>
                        <option value="jpeg">JPG</option>
                        <option value="png">PNG</option>
                        <option value="gif">GIF</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-2 py-1 rounded-md text-sm ${
                          isDarkMode
                            ? "bg-gray-800 text-white border-gray-700"
                            : "bg-white text-gray-800 border-gray-300"
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="date">Date Added</option>
                        <option value="name">Name</option>
                        <option value="size">Size</option>
                      </select>
                    </div>
                    {images.length > 0 && (
                      <button
                        onClick={() => {
                          setImages([]);
                          toast.info("All images removed", {
                            position: "bottom-right",
                            autoClose: 2000,
                          });
                        }}
                        className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        aria-label="Remove all images"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>Clear all</span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {getFilteredAndSortedImages().map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`relative group ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg overflow-hidden shadow-md`}
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={image.url}
                            alt={`Preview ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            onLoad={(e) => {
                              updateImageDimensions(
                                image.id,
                                e.target.naturalWidth,
                                e.target.naturalHeight
                              );
                            }}
                            onClick={() => handleImageClick(image)}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleImageClick(image)}
                            className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg"
                            aria-label="View full size"
                          >
                            <Maximize2 className="h-4 w-4 text-gray-800" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => downloadImage(image)}
                            className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg"
                            aria-label="Download image"
                          >
                            <Download className="h-4 w-4 text-gray-800" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => shareImage(image)}
                            className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg"
                            aria-label="Share image"
                          >
                            <Share2 className="h-4 w-4 text-gray-800" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeImage(index)}
                            className="p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow-lg"
                            aria-label={`Remove image ${image.name}`}
                          >
                            <X className="h-4 w-4 text-gray-800" />
                          </motion.button>
                        </div>
                        <div
                          className={`p-2 ${
                            isDarkMode ? "bg-gray-800" : "bg-white"
                          }`}
                        >
                          <p className="text-sm truncate">{image.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
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
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-xl shadow-xl p-8 border ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <h2
              className={`text-2xl font-semibold mb-6 text-center ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Image Showcase
            </h2>

            {images.length > 0 ? (
              <div className="carousel-container">
                <div className="relative">
                  <Slider ref={sliderRef} {...sliderSettings}>
                    {images.map((image, index) => (
                      <div
                        key={image.id}
                        className={`focus:outline-none slide-${index}`}
                      >
                        <div className="relative pb-[56.25%]">
                          {" "}
                          {/* 16:9 aspect ratio container */}
                          <img
                            src={image.url}
                            alt={`Product image ${index + 1}`}
                            className="absolute top-0 left-0 w-full h-full object-contain rounded-md"
                            onClick={() => handleImageClick(image)}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={`slide-content text-center mt-4 ${
                            isDarkMode
                              ? "bg-gray-800 text-white"
                              : "bg-white text-gray-800"
                          } bg-opacity-70 backdrop-blur-sm py-2 px-4 rounded-full mx-auto max-w-max opacity-0 transition-opacity duration-500`}
                        >
                          <p className="font-medium">{image.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
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
                              sliderRef.current &&
                              sliderRef.current.innerSlider.state
                                .currentSlide === index
                                ? "ring-2 ring-blue-500 shadow-md"
                                : "opacity-70 hover:opacity-100"
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
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No images to display. Please upload some images first.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {images.length > 0 && !isSubmitted && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-48 mx-auto mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          onClick={handleSubmit}
        >
          <CheckCircle2 className="w-4 h-4" />
          Submit Images
        </motion.button>
      )}

      {/* Submitted Success Message */}
      {isSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          Images submitted successfully!
        </motion.div>
      )}

      {/* Popover with Submitted Images */}
      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={popoverRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Submitted Images
                </h3>
                <button
                  onClick={handleClosePopover}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Popover Content */}
              <div className="p-3">
                <Slider {...sliderSettings} className="submitted-carousel">
                  {images.map((image, index) => (
                    <div key={index} className="px-2">
                      <div className="relative aspect-square rounded-lg overflow-hidden group">
                        <img
                          src={image.url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                          onClick={() => handleImageClick(image)}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleImageClick(image)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <Maximize2 className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={() => downloadImage(image)}
                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                          >
                            <Download className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <p>Size: {(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p>
                          Dimensions: {image.dimensions.width}x
                          {image.dimensions.height}
                        </p>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
            onClick={closeFullscreen}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl mx-auto p-4"
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-h-[90vh] w-auto mx-auto rounded-lg shadow-2xl"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => downloadImage(selectedImage)}
                  className="p-2 bg-white rounded-full shadow-lg"
                  aria-label="Download image"
                >
                  <Download className="h-5 w-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => shareImage(selectedImage)}
                  className="p-2 bg-white rounded-full shadow-lg"
                  aria-label="Share image"
                >
                  <Share2 className="h-5 w-5 text-gray-800" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeFullscreen}
                  className="p-2 bg-white rounded-full shadow-lg"
                  aria-label="Close fullscreen"
                >
                  <X className="h-5 w-5 text-gray-800" />
                </motion.button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-gray-800">
                  {selectedImage.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-sm text-gray-600">
                  Dimensions: {selectedImage.dimensions.width} x{" "}
                  {selectedImage.dimensions.height}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility and information note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-12 text-sm ${
          isDarkMode ? "text-gray-400 bg-gray-800" : "text-gray-500 bg-gray-50"
        } p-4 rounded-lg`}
      >
        <p>
          <span className="font-semibold">Accessibility features:</span>{" "}
          Keyboard navigation, focus indicators, ARIA labels, and screen reader
          support are implemented for an inclusive user experience.
        </p>
      </motion.div>

      {/* Enhanced Carousel */}
      {previewMode && images.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          onMouseDown={handleCarouselDragStart}
          onMouseUp={handleCarouselDragEnd}
          onMouseLeave={handleCarouselDragEnd}
          onTouchStart={handleCarouselDragStart}
          onTouchEnd={handleCarouselDragEnd}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: isDraggingCarousel ? 0.98 : 1 }}
                  transition={{ duration: 0.2 }}
                  className="relative aspect-[16/9] overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onClick={() => handleImageClick(image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h3 className="text-lg font-semibold">{image.name}</h3>
                        <p className="text-sm opacity-80">
                          {(image.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {image.dimensions.width}x{image.dimensions.height}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleImageClick(image)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                        >
                          <Maximize2 className="w-5 h-5 text-white" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => downloadImage(image)}
                          className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                        >
                          <Download className="w-5 h-5 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-center gap-2 overflow-x-auto py-2 px-4 scrollbar-hide">
                {images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sliderRef.current?.slickGoTo(index)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      currentSlide === index
                        ? "ring-2 ring-primary-500 shadow-lg"
                        : "opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {currentSlide === index && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 bg-primary-500/20"
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductImageCarousel;
