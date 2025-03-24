import React from "react";
import { motion } from "framer-motion";

const MessagePopup = ({ text, x, y }) => {
  if (!text) return null;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const adjustedX = Math.min(x, screenWidth - 220);
  const adjustedY = Math.min(y, screenHeight - 120);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="absolute z-50 p-4 rounded-xl shadow-lg text-white text-center no-scrollbar"
      style={{
        top: adjustedY,
        left: adjustedX,
        maxWidth: "250px",
        background: "linear-gradient(135deg, #ff758c, #ff004f)",
        boxShadow: "0px 0px 15px rgba(255, 0, 79, 0.6)",
        border: "2px solid rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.p
        className="font-semibold text-lg"
        style={{
          fontFamily: "'Dancing Script', cursive",
          textShadow: "2px 2px 8px rgba(255, 255, 255, 0.3)",
        }}
      >
        {text}
      </motion.p>
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="text-2xl mt-2"
      >
        ❤️
      </motion.div>
    </motion.div>
  );
};

export default MessagePopup;
