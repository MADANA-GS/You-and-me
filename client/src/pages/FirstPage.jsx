import { useContext, useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import gsap from "gsap";
import { useGoogleLogin } from "@react-oauth/google";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import CountdownTimer from "../components/CountdownTimer";
import FlipCountdown from "../components/CountdownTimer";
import FlowingMenu from "../components/FlowingMenu";
import Hero from "../components/Hero";
import Landing from "../components/Landing";
// import ImageTrail from "../components/ImageTrail";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const checkAuth = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}/auth/check`,
      {
        withCredentials: true, // Ensure cookies are sent with the request
      }
    );
    return response;
  } catch (error) {
    console.error("Auth Check Error:", error.response?.data || error.message);
    return null;
  }
};

const googleAuth = async (code) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}/auth/google?code=${code}`,
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    console.error("Error during Google Login:", error.response?.data || error);
    throw error; // Re-throw to handle in the calling function
  }
};

const FirstPage = () => {
  // Register ScrollTrigger plugin
  const { authPop, setAuthPop } = useContext(AuthContext);
  const { auth, setAuth } = useContext(AuthContext);

  const getdata = async () => {
    if (auth.isAuthenticated) {
      setAuthPop(false); // Ensure popup is hidden if already authenticated
      return;
    }

    try {
      const data = await checkAuth();

      if (data?.data?.success) {
        setAuthPop(false);
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: true,
          user: data.data.user,
          id: data.data.user._id,
          role: data.data.user.role || "user",
        }));
      } else {
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: false,
          user: null,
          role: null,
          id: null,
        }));

        // Only show auth popup if not authenticated
        setTimeout(() => {
          if (!auth.isAuthenticated) {
            // Check again before showing
            setAuthPop(true);
          }
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Only run getdata when component mounts, not on every auth change
  useEffect(() => {
    getdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  }, []);

  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { margin: "-20% 0px 0px 0px" });
  const racesRef = useRef(null);
  const containerRef = useRef(null);
  const itemsRef = useRef([]);

  const [message, setMessage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [letter, setLetter] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Smooth scrolling effect
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 20, // Lower stiffness for smoother motion
    damping: 25, // Higher damping to prevent bouncing
    mass: 0.8,
  });

  // Text movement effect
  const x = useTransform(smoothScroll, [0, 1], ["-2.7%", "-200%"]);

  // Messages (with placeholders for images)
  const data = [
    "I’d be your wings if you let me lift you up all night.",
    "I don’t need a ticket, baby—I just want a one-way trip to you.",
    "Let’s break some flight rules because I’m ready for turbulence with you.",
    "Are you a long-haul flight? Because I want to be inside you all night.",
    "Fasten your seatbelt, baby—this ride is about to get wild.",
    "Your body must be first class, because I’d love to experience every inch of it.",
    "I’ll be your pilot if you promise to be my favorite destination.",
    "Let’s skip the layovers and go straight to the nonstop action.",
    "Are you a black box? Because I want to know all your secrets.",
    "Your curves should come with a navigation system—I’d love to explore every turn.",
    "Damn, I think I just hit turbulence because you got me all shaken up.",
    "Let’s break some airspace rules—I want to invade your zone tonight.",
    "You be my landing strip, and I’ll make sure to touch down nice and slow.",
    "If loving you was a flight, I’d never want to land.",
    "Your body is the only first-class experience I need tonight.",
    "Are you an emergency exit? Because I need a quick way out of my clothes.",
    "I don’t need an in-flight meal—I just want to feast on you.",
    "My flight plan? Straight to your heart, with no diversions.",
    "Are you my final destination? Because I never want to leave.",
    "You’re like in-flight WiFi—connecting with you makes everything better.",
    "The way you look should be a no-fly zone—because you're too dangerous to resist.",
    "I’ll be your autopilot—just tell me where you want me to take you.",
    "Let’s go on a private jet ride—just you, me, and no distractions.",
    "Your body’s got more curves than a flight path, and I’m ready to navigate them all.",
    "Are you an airport lounge? Because I could spend all night inside you.",
    "I think I just got jet lag from falling so hard for you.",
    "Are we experiencing cabin pressure? Because things are heating up fast.",
    "I don’t need a flight attendant—I just need you to take care of me tonight.",
    "Your body must be a runway, because I’m ready for takeoff.",
    "Let’s take this to new altitudes, just you and me.",
  ];

  // Image URLs
  const images = [
    "https://res.cloudinary.com/dhvxzjkki/image/upload/v1742827716/xcmd5b530kzo0ny077gq.jpg",
    "https://res.cloudinary.com/dhvxzjkki/image/upload/v1742827797/knglkh6pjz5sv7clhovb.jpg",
    "https://res.cloudinary.com/dhvxzjkki/image/upload/v1742827898/yijelpvhrlxqjt7hu34i.jpg",
  ];

  // Select a random message and image when component loads
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setMessage(data[randomIndex]);
    setSelectedImage(images[randomIndex]);
  }, []);

  useEffect(() => {
    const messages = ["Muddu", "Chinnu", "Bangara", "Papu", "Baby", "Kanda"];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const formattedMessage = messages[randomIndex]
      .split("")
      .map((val, index) => (
        <span key={index} className="sp">
          {val}
        </span>
      ));
    setLetter(formattedMessage);
  }, []);

  // Open popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  const googleResponse = async (authResult) => {
    if (authResult["code"]) {
      try {
        const res = await googleAuth(authResult["code"]);
        console.log("Server Response:", res.data.user);

        // Update auth state
        setAuth((prevAuth) => ({
          ...prevAuth,
          isAuthenticated: true,
          user: res.data.user,
          role: res.data.user.role || "user",
          id: res.data.user._id,
        }));

        // Hide popup immediately after successful authentication
        setAuthPop(false);
      } catch (error) {
        console.error("Error during Google login process:", error);
      }
    } else {
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuthenticated: false,
        user: null,
        role: null,
        id: null,
      }));
      console.error("Google Login Failed:", authResult);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleResponse,
    onError: (error) => {
      console.error("Google Login Error:", error);
      // Ensure auth state is updated on error
      setAuth((prevAuth) => ({
        ...prevAuth,
        isAuthenticated: false,
        user: null,
        role: null,
        id: null,
      }));
    },
    flow: "auth-code",
    prompt: "select_account",
  });

  // Effect to hide auth popup whenever user becomes authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      setAuthPop(false);
    }
  }, [auth.isAuthenticated, setAuthPop]);

  return (
    <div ref={containerRef}>
      {authPop && !auth.isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: 0.5,
            stiffness: 100,
          }}
          className="fixed top-14 z-50 right-6 bg-white shadow-xl rounded-lg border border-gray-200 transition-all duration-300 w-72"
        >
          <div className="p-5">
            <h3 className="text-center font-semibold text-gray-800 mb-4">
              Sign in Required
            </h3>
            <div className="flex justify-center">
              <button
                className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 w-full"
                onClick={() => handleGoogleLogin()}
                type="button"
                aria-label="Continue with Google"
              >
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="#4285F4"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  />
                </svg>
                <span className="font-medium text-gray-700">
                  Continue with Google
                </span>
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              By continuing, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </motion.div>
      )}
      <div
        ref={scrollRef}
        className="w-full h-screen bg-black text-white overflow-x-hidden no-scrollbar"
      >
        <div
          id="landing"
          className="relative w-full overflow-hidden mt-3 md:mt-5"
        >
          <Landing />
          <div className="flex nav h-auto flex-col  items-center justify-center w-full">
            <FlipCountdown
              targetDate="2022-11-09"
              message={"From that day to this, my heart still races for you."}
            />
            <div id="hero" className="relative mt-44 md:mt-60 bg-red-600">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex absolute bottom-0 z-10 whitespace-nowrap will-change-transform cursor-pointer"
                  style={{ x }}
                  onClick={openPopup}
                >
                  <h1
                    className="md:text-[7vw] text-3xl alber uppercase px-10 tracking-tight p-10 flex items-center"
                    style={{ transform: `translateX(${i * 100}%)` }}
                  >
                    {message &&
                      message.split("*").map((part, index) => (
                        <span key={index} className="flex items-center">
                          {part + " "}
                          {index === 0 && selectedImage && (
                            <div className="w-32 h-12 mx-3 rounded-full overflow-hidden">
                              <img
                                src={selectedImage}
                                alt="Inserted Image"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </span>
                      ))}
                  </h1>
                </motion.div>
              ))}
            </div>

            <div className="mb-4 mt-16 md:mt-40 flex flex-col items-center justify-center text-center p-1">
              <p className="text-lg md:text-base text-gray-500">I Love</p>
              <h1 className="relative text-3xl md:text-5xl font-bold">
                The Journey of Memories <br className="hidden md:block" />
                We{" "}
                <span className="rounded-full bg-black text-white text-[20px] md:text-base font-semibold">
                  Share
                </span>
              </h1>
            </div>
          </div>
        </div>

        {isPopupOpen && (
          <div
            className="fixed overflow-hidden top-0 left-[-10%] w-[120%] h-full bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setIsPopupOpen(false)}
          >
            <div
              className="backdrop-blur-sm text-white p-8 rounded-lg w-3/4 max-w-xl relative border border-white/30 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Full Message</h2>
              <p className="text-lg">{message?.split("*")[0]}</p>
              {selectedImage && (
                <div className="w-full flex justify-center mt-4">
                  <img
                    src={selectedImage}
                    alt="Selected Image"
                    className="w-48 h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
              <button
                className="mt-4 px-2 py-0 bg-white/30 text-white rounded border border-white/50 hover:bg-white/40"
                onClick={() => setIsPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Hero section */}
        <div className="">
          <Hero />
        </div>

        <div
          id="footer-section"
          className="w-full h-auto bg-black text-white flex flex-col items-center justify-center relative py-10"
        >
          <h1
            ref={footerRef}
            className="text-[24vw] md:text-[15vw] tracking-wider flex items-center justify-center overflow-hidden md:leading-[19vw] leading-[24vw] font-[550]"
          >
            {letter.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 1,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                {char}
              </motion.span>
            ))}
          </h1>
          <h1 className="mt-4">
            Made With <span className="heart">❤</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
