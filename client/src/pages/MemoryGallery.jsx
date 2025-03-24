import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiSearch, FiX, FiPlus } from "react-icons/fi";
import TiltedCard from "../components/TiltedCard";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const getAllMemories = async () => {
  const data = await axios.get(`${import.meta.env.VITE_BACKEND}/memory`);
  return data.data;
};

// CSS to hide scrollbar
const noScrollbarCSS = `
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const MemoryGallery = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [memories, setMemories] = useState([]);
  const [role, setRole] = useState("user");

  const getAll = async () => {
    try {
      const data = await getAllMemories();
      console.log(data);
      if (data.success) {
        setMemories(Array.isArray(data.data) ? data.data : []);
      } else {
        setMemories([]);
      }
    } catch (error) {
      console.log(error);
      setMemories([]);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const { auth } = useContext(AuthContext);
  useEffect(() => {
    setRole(auth.role);
    console.log(auth);
  }, [auth]);

  // Extract year from date string (format: "YYYY-MM-DD")
  const extractYear = (dateStr) => {
    if (!dateStr) return null;
    return parseInt(dateStr.split("-")[0], 10);
  };

  // Get unique years from memories for the filter dropdown
  const uniqueYears =
    Array.isArray(memories) && memories.length > 0
      ? [
          ...new Set(
            memories.map((memory) => extractYear(memory.date)).filter(Boolean)
          ),
        ].sort((a, b) => b - a)
      : [];

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Filter memories based on search term and selected year
  const filteredMemories = Array.isArray(memories)
    ? memories.filter((memory) => {
        const memoryYear = extractYear(memory.date);
        const titleMatch = memory.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const descriptionMatch =
          memory.description &&
          memory.description.toLowerCase().includes(searchTerm.toLowerCase());
        const yearMatch = selectedYear
          ? memoryYear === Number(selectedYear)
          : true;

        return (titleMatch || descriptionMatch) && yearMatch;
      })
    : [];

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedYear("");
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen mt-12 bg-black text-white p-4 md:p-8 lg:p-12 no-scrollbar overflow-x-hidden">
      {/* Inject the no-scrollbar CSS */}
      <style>{noScrollbarCSS}</style>

      {/* Page Header */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our Memories
            </h1>

            <button
              className="md:hidden flex items-center bg-black text-white px-3 py-1 text-sm rounded border border-white hover:bg-white hover:text-black transition-all duration-300"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <FiX className="mr-1" />
              ) : (
                <FiFilter className="mr-1" />
              )}
              {showFilters ? "Close" : "Filter"}
            </button>
          </div>

          {/* Add Memory Button */}
          {role === "admin" && (
            <button
              className="flex items-center bg-white text-black px-4 py-2 text-sm rounded border border-black hover:bg-black hover:text-white transition-all duration-300"
              onClick={() => navigate("/add-memory")}
            >
              <FiPlus className="mr-1" />
              Add Memory
            </button>
          )}
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {(showFilters || isDesktop) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-black rounded-md p-4 shadow-lg border border-zinc-800">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <div className="relative flex items-center justify-center flex-grow">
                    <FiSearch className="absolute top-2.5 left-3 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search memories..."
                      value={searchTerm}
                      className="w-full text-sm pl-9 p-2 bg-black text-white rounded border border-zinc-800 focus:outline-none focus:border-white"
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <select
                    value={selectedYear}
                    className="text-sm p-2 bg-black text-white rounded border border-zinc-800 focus:outline-none focus:border-white min-w-[100px]"
                    onChange={(e) => setSelectedYear(e.target.value)}
                  >
                    <option value="">All Years</option>
                    {uniqueYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>

                  {(searchTerm || selectedYear) && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1 text-sm border border-white text-white hover:bg-white hover:text-black rounded transition-colors duration-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="mt-3 text-zinc-400 text-xs">
                  Showing {filteredMemories.length} of{" "}
                  {Array.isArray(memories) ? memories.length : 0} memories
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Container - Using flexbox for better control */}
        {filteredMemories.length > 0 ? (
          <div className="flex flex-wrap justify-center md:justify-start">
            {filteredMemories.map((memory, index) => (
              <motion.div
                key={memory._id}
                custom={index}
                initial="hidden"
                animate="visible"
                onClick={() => navigate(`/memory/${memory._id}`)}
                variants={cardVariants}
                className="w-full sm:w-1/2 md:w-1/3 p-3"
                style={{ maxWidth: "350px" }}
              >

                <TiltedCard
                  imageSrc={memory.thumbnailImage}
                  altText={memory.title}
                  captionText={memory.title}
                  containerHeight="300px"
                  containerWidth="100%"
                  imageHeight="300px"
                  imageWidth="100%"
                  rotateAmplitude={12}
                  scaleOnHover={1.1}
                  showMobileWarning={false}
                  showTooltip={true}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="bg-black/70 backdrop-blur-sm w-full p-3">
                      <p className="tilted-card-demo-text text-white text-lg font-semibold">
                        {memory.title}
                      </p>
                      <p className="text-zinc-300 text-sm">
                        {extractYear(memory.date)}
                      </p>
                    </div>
                  }
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="bg-black rounded-md p-6 max-w-md mx-auto border border-zinc-800">
              <FiSearch className="mx-auto text-3xl mb-4 text-zinc-500" />
              <h3 className="text-xl font-semibold mb-2">No memories found</h3>
              <p className="text-zinc-400">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-1 text-sm border border-white text-white hover:bg-white hover:text-black rounded transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MemoryGallery;
