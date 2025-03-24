import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiShare2,
  FiCalendar,
  FiImage,
  FiX,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// Sample data structure for fallback/testing
const sampleStoryData = {
  id: "memory-123",
  title: "Kendrick Lamar - GNX Tour",
  year: 2023,
  thumbnailImage:
    "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
  description:
    "An unforgettable night experiencing Kendrick Lamar's groundbreaking GNX tour. The energy, the visuals, and the crowd made this a truly special memory.",
  date: "August 15, 2023",
  isLiked: false,
  images: [
    {
      id: 1,
      image: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
      message: "The stage setup before the show started",
      timestamp: "7:30 PM",
    },
    {
      id: 2,
      image: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
      message: "Opening act performance with incredible light show",
      timestamp: "8:15 PM",
    },
    {
      id: 3,
      image: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
      message: "Kendrick performing 'Count Me Out'",
      timestamp: "9:45 PM",
    },
    {
      id: 4,
      image: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
      message: "The crowd going wild during 'Money Trees'",
      timestamp: "10:20 PM",
    },
    {
      id: 5,
      image: "https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58",
      message: "Finale with full visual effects and confetti",
      timestamp: "10:45 PM",
    },
  ],
};

const getDataById = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}/memory/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching memory:", error);
    return { success: false };
  }
};

const getRelatedMemories = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}/memory?limit=3`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching related memories:", error);
    return { success: false, data: [] };
  }
};

const ThumbnailImage = ({ image, isActive, onClick }) => {
  if (!image || !image.image) {
    return <div className="aspect-square bg-zinc-800 rounded-md"></div>;
  }

  return (
    <button
      onClick={onClick}
      className={`aspect-square overflow-hidden rounded-md ${
        isActive ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
      } transition-all duration-300`}
    >
      <img
        src={image.image}
        alt={image.message || "Memory image"}
        className="w-full h-full object-cover"
      />
    </button>
  );
};

const MemoryStoryPage = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [relatedMemories, setRelatedMemories] = useState([]);
  const [thumbnailView, setThumbnailView] = useState("grid");
  const { auth } = useContext(AuthContext);
  const [modalImage, setModalImage] = useState(null); // New state for modal image

  const { id } = useParams() || { id: "memory-123" };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching memory with ID:", id);

        if (import.meta.env.VITE_USE_SAMPLE_DATA === "true") {
          await new Promise((resolve) => setTimeout(resolve, 800));
          setStory(sampleStoryData);
        } else {
          const memoryData = await getDataById(id);
          if (memoryData && memoryData.success) {
            const processedData = {
              ...memoryData.data,
              images: memoryData.data.images.map((img, index) => ({
                ...img,
                id: img._id || index + 1,
                timestamp: img.timestamp || `Time ${index + 1}`,
              })),
            };
            setStory(processedData);

            const relatedData = await getRelatedMemories();
            if (relatedData && relatedData.success) {
              const filtered = relatedData.data.filter(
                (memory) => memory._id !== id
              );
              setRelatedMemories(filtered.slice(0, 3));
            }
          } else {
            setStory(null);
          }
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Completely revised: Handle opening modal from hero image
  const handleHeroImageClick = () => {
    if (!story) return;

    // Create a special modal image object for the thumbnail
    const thumbnailModalImage = {
      image: story.thumbnailImage,
      message: story.title || "Memory thumbnail",
      timestamp: story.date || "",
      isHeroImage: true,
    };

    // Set this as the current modal image
    setModalImage(thumbnailModalImage);
    setModalOpen(true);
  };

  // New function: Handle opening modal from gallery images
  const handleGalleryImageClick = (index) => {
    if (!story || !story.images || !story.images[index]) return;

    setActiveImageIndex(index);
    setModalImage(null); // Clear any special modal image
    setModalOpen(true);
  };

  const toggleThumbnailView = () => {
    setThumbnailView((prev) => (prev === "grid" ? "carousel" : "grid"));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: story?.title,
        text: `Check out this memory: ${story?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Updated: navigation should reset to gallery images when in hero image mode
  const navigateModal = (direction) => {
    if (!story || !story.images || story.images.length === 0) return;

    // If we're viewing the hero/thumbnail image, switch to gallery images
    if (modalImage && modalImage.isHeroImage) {
      setModalImage(null);
      setActiveImageIndex(0);
      return;
    }

    // Otherwise navigate normally through gallery images
    if (direction === "next") {
      setActiveImageIndex((prev) =>
        prev === story.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setActiveImageIndex((prev) =>
        prev === 0 ? story.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setModalImage(null);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const modalVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 rounded-full border-4 border-t-white border-r-zinc-800 border-b-zinc-800 border-l-zinc-800 animate-spin"></div>
          <p className="mt-4 text-zinc-400">Loading memory...</p>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen mt-36 bg-black text-white flex items-center justify-center p-4">
        <div className="bg-zinc-900 rounded-md p-8 max-w-md mx-auto border border-zinc-800 text-center">
          <h2 className="text-2xl font-bold mb-4">Memory Not Found</h2>
          <p className="text-zinc-400 mb-6">
            The memory you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/memories"
            className="inline-block px-6 py-2 border border-white text-white hover:bg-white hover:text-black rounded transition-all duration-300"
          >
            Back to Memories
          </Link>
        </div>
      </div>
    );
  }

  const hasImages =
    story.images && Array.isArray(story.images) && story.images.length > 0;
  const currentImage =
    hasImages && activeImageIndex < story.images.length
      ? story.images[activeImageIndex]
      : null;

  return (
    <div className="min-h-screen mt-16 md:mt-12 bg-black text-white p-4 md:p-8 lg:p-12">
      {!auth.isAuthenticated || auth.role !== "admin" ? (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 shadow-2xl border border-red-700 animate-fadeIn">
            <div className="text-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-xl font-bold text-white mt-4">
                Access Restricted
              </h2>
              <p className="text-gray-300 mt-2">
                You do not have access to see this
              </p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {/* Back button */}
      <div className="max-w-6xl mx-auto mb-6">
        <Link
          to="/memory"
          className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors duration-300"
        >
          <FiChevronLeft className="mr-1" />
          Back to all memories
        </Link>
      </div>

      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              {story.title}
            </h1>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 rounded-full border border-zinc-700 hover:border-white transition-all duration-300"
              >
                <FiShare2 />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span>{story.date}</span>
            </div>
            <div className="flex items-center">
              <FiImage className="mr-2" />
              <span>{hasImages ? story.images.length : 0} images</span>
            </div>
          </div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          variants={itemVariants}
          onClick={handleHeroImageClick}
          className="w-full mt-16 md:mt-12 aspect-auto overflow-hidden rounded-md mb-8 cursor-pointer"
        >
          <img
            src={story.thumbnailImage}
            alt={story.title}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </motion.div>

        {/* Description */}
        <motion.div variants={itemVariants} className="mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">The Story</h2>
          <p className="text-zinc-300 leading-relaxed max-w-4xl">
            {story.description}
          </p>
        </motion.div>

        {/* Image Gallery - Only show if we have images */}
        {hasImages && (
          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-semibold">
                Memory Timeline
              </h2>
              <button
                onClick={toggleThumbnailView}
                className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 rounded transition-colors duration-300"
              >
                {thumbnailView === "grid" ? "Carousel View" : "Grid View"}
              </button>
            </div>

            {/* Main Image Display */}
            {currentImage && (
              <div className="mb-4">
                <div
                  onClick={() => handleGalleryImageClick(activeImageIndex)}
                  className="w-full aspect-video md:aspect-[16/9] overflow-hidden rounded-md mb-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                >
                  <img
                    src={currentImage.image}
                    alt={currentImage.message}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium">{currentImage.message}</p>
                  {/* <p className="text-zinc-400">
                    {currentImage.timestamp}
                  </p> */}
                </div>
              </div>
            )}

            {/* Thumbnail View - Toggle between Grid and Carousel */}
            {thumbnailView === "grid" ? (
              // Grid View
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
                {story.images.map((image, index) => (
                  <ThumbnailImage
                    key={image.id || index}
                    image={image}
                    isActive={activeImageIndex === index}
                    onClick={() => setActiveImageIndex(index)}
                  />
                ))}
              </div>
            ) : (
              // Carousel View
              <div className="mt-4 relative">
                <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
                  {story.images.map((image, index) => (
                    <div
                      key={image.id || index}
                      className="flex-shrink-0 w-32 md:w-40"
                    >
                      <ThumbnailImage
                        image={image}
                        isActive={activeImageIndex === index}
                        onClick={() => setActiveImageIndex(index)}
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute right-0 bottom-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {activeImageIndex + 1} / {story.images.length}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Related Memories */}
        <motion.div variants={itemVariants} className="mt-12 mb-20">
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            Related Memories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedMemories.length > 0
              ? relatedMemories.map((memory) => (
                  <Link
                    key={memory._id}
                    to={`/memory/${memory._id}`}
                    className="bg-zinc-900 rounded-md overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={memory.thumbnailImage}
                        alt={memory.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{memory.title}</h3>
                      <p className="text-zinc-400 text-sm">{memory.date}</p>
                    </div>
                  </Link>
                ))
              : // Fallback placeholders
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-zinc-900 rounded-md p-4 border border-zinc-800 h-64 flex items-center justify-center"
                  >
                    <p className="text-zinc-500">Related Memory {item}</p>
                  </div>
                ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm"
        >
          <p>© {new Date().getFullYear()} Memory Collection</p>
        </motion.div>
      </motion.div>

      {/* Modal View */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col justify-center items-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setModalOpen(false);
                setModalImage(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <FiX size={24} />
            </button>

            {/* Navigation buttons */}
            <button
              onClick={() => navigateModal("prev")}
              className="absolute left-4 md:left-8 z-10 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <FiChevronLeft size={24} />
            </button>
            <button
              onClick={() => navigateModal("next")}
              className="absolute right-4 md:right-8 z-10 p-2 rounded-full bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <FiChevronRight size={24} />
            </button>

            {/* Image container */}
            <div className="w-full  h-full md:h-auto max-h-screen flex items-center justify-center">
              <img
              // className="w-full h-full object-contain"
                src={
                  modalImage
                    ? modalImage.image
                    : currentImage
                    ? currentImage.image
                    : ""
                }
                alt={
                  modalImage
                    ? modalImage.message
                    : currentImage
                    ? currentImage.message
                    : "Memory image"
                }
                className="max-w-full max-h-full object-cover "
              />
            </div>

            {/* Caption */}
            {/* <div className="w-full max-w-4xl bg-zinc-900 p-4 rounded-md mt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">
                  {modalImage
                    ? modalImage.message
                    : currentImage
                    ? currentImage.message
                    : ""}
                </p>
                <p className="text-zinc-400">
                  {modalImage
                    ? modalImage.timestamp
                    : currentImage
                    ? currentImage.timestamp
                    : ""}
                </p>
              </div>
            </div> */}

            {/* Image counter - Only show for gallery images, not for hero image */}
            {!modalImage && (
              <div className="absolute bottom-4 left-0 right-0 text-center text-zinc-400 text-sm">
                {activeImageIndex + 1} / {story.images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemoryStoryPage;
