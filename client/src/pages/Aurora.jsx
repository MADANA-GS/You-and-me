import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const videoArray = [
  // "https://cdn.pixabay.com/video/2016/12/16/6797-196071980_large.mp4",
  "https://cdn.pixabay.com/video/2023/10/29/186969-879222062_large.mp4",
  "https://cdn.pixabay.com/video/2024/03/10/203646-921832579_large.mp4",
  "https://cdn.pixabay.com/video/2024/03/10/203646-921832579_large.mp4",
  "https://cdn.pixabay.com/video/2024/02/05/199325-910162293_large.mp4",
  "https://cdn.pixabay.com/video/2025/03/20/266233_large.mp4",
  "https://videos.pexels.com/video-files/5700940/5700940-uhd_2560_1440_25fps.mp4",
  "https://cdn.pixabay.com/video/2024/02/05/199325-910162293_large.mp4",
];

const videoArray2 = [
  "https://cdn.pixabay.com/video/2016/12/16/6797-196071980_large.mp4",
]

const Aurora = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [loading, setLoading] = useState(false); // Initially false
  const [message, setMessage] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((error) => console.error("Autoplay failed:", error));
    }
  }, []);

  const messages = ["Hey babe, Love you ❤️", "Baby, can we go to Aurora now?"];

  useEffect(() => {
    if (!videoLoaded) return;

    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = "";

    const typeText = () => {
      if (!showMessage) return;

      if (charIndex < messages[messageIndex].length) {
        currentMessage += messages[messageIndex][charIndex];
        setMessage(currentMessage);
        charIndex++;
        setTimeout(typeText, 50);
      } else if (messageIndex < messages.length - 1) {
        setTimeout(() => {
          currentMessage = "";
          charIndex = 0;
          messageIndex++;
          typeText();
        }, 2000);
      } else {
        setTimeout(() => setShowButtons(true), 500);
      }
    };

    typeText();
  }, [showMessage, videoLoaded]);

  const nextVideo = () => {
    setShowMessage(false);
    setMessage("");
    setShowButtons(false);
    setLoading(true); // Show loading before video switch

    setTimeout(() => {
      if (videoRef.current) {
        const currentSrc = videoRef.current.src;
        const newIndex =
          (videoArray.indexOf(currentSrc) + 1) % videoArray.length;
        videoRef.current.src = videoArray[newIndex];

        videoRef.current.onloadeddata = () => {
          setLoading(false); // Hide loading after video loads
          setVideoLoaded(true);
          videoRef.current.play();
        };
      }
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Show loading only when switching videos */}
      {loading && (
        <div className="absolute top-90 inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-3xl text-center font-semibold mb-6">
            Ninna ethkandu hogake churu time agatte tadka Nayi... 😘
          </p>
          <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        src={videoArray2[0]}
        autoPlay
        muted
        playsInline
        loop
        onLoadedData={() => setVideoLoaded(true)} // Set videoLoaded only after first video loads
      />

      {videoLoaded && showMessage && (
        <p className="absolute top-90 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold text-center animate-pulse">
          {message}
        </p>
      )}

      {videoLoaded && showButtons && (
        <div className="absolute bottom-35 top-96 flex gap-6">
          <button
            onClick={nextVideo}
            className="border border-green-300 text-black px-8 py-3 rounded-full text-2xl font-semibold shadow-lg hover:bg-gray-300 transition-transform transform hover:scale-110"
          >
            Yes
          </button>
          <button
            onClick={() => navigate("/")}
            className="border border-red-300 text-white px-8 py-3 rounded-full text-2xl font-semibold shadow-lg hover:bg-red-800 transition-transform transform hover:scale-110"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default Aurora;
