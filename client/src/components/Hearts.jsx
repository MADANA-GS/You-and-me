import React, { useState } from "react";
import { motion } from "framer-motion";

const heartVariants = ["💝", "💖", "💕", "💓", "💞", "💘", "❤️"];

const Heart = ({ id, onClick }) => {
  const [speed] = useState(3 + Math.random() * 4);
  const [left] = useState(Math.random() * 100 + "%");
  const [heartType] = useState(heartVariants[Math.floor(Math.random() * heartVariants.length)]);
  const [clicked, setClicked] = useState(false);

  const handleHeartClick = (e) => {
    setClicked(true);
    onClick(e, id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -100, rotate: 0 }}
      animate={{
        opacity: 1,
        y: clicked ? "120vh" : "100vh",
        rotate: clicked ? 30 : [0, 10, -10, 0], // Tilts when clicked
      }}
      exit={{ opacity: 0 }}
      transition={{
        duration: clicked ? 3 : speed, // Slow fall when clicked
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.3,
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 1.1 }}
      className="absolute z-10 text-pink-400 top-0 text-6xl cursor-pointer select-none drop-shadow-lg"
      style={{ left }}
      onClick={handleHeartClick}
    >
      {/* {heartType} */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="#ff004f"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

export default Heart;
