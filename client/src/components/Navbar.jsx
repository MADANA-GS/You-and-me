import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Zap,
  Heart,
  Settings,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const checkAuth = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND}/auth/check`,
      {
        withCredentials: true,
      }
    );
    return response;
  } catch (error) {
    console.error("Auth Check Error:", error.response?.data || error.message);
    return null;
  }
};

const getAllMemories = async () => {
  const data = await axios.get(`${import.meta.env.VITE_BACKEND}/memory`);
  return data.data;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const { authPop, setAuthPop } = useContext(AuthContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
    isAuth: false,
  });
  const [imageError, setImageError] = useState(false);

  // Get moodsResponse directly from context instead of local state
  const { setNavMemories, moodsResponse, setMoodsResponse } =
    useContext(AuthContext);

  // Use a function to get the current mood from moodsResponse
  const getCurrentMood = () => {
    if (moodsResponse?.data && moodsResponse.data.length > 0) {
      // Get the most recent main mood
      const latestMood = moodsResponse.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )[0];
      return latestMood.type || "sunny";
    }
    return "sunny"; // Default mood
  };

  // Fetch moods on initial load
  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const moodsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND}/mood`
        );
        console.log("moodsResponse", moodsResponse);
        if (moodsResponse.status === 200) {
          setMoodsResponse(moodsResponse);
        } else {
          setMoodsResponse({ data: [] });
        }
      } catch (error) {
        console.error("Error fetching moods:", error);
        setMoodsResponse({ data: [] });
      }
    };

      fetchMoods();

  }, []);

  // Poll for mood updates
  useEffect(() => {
    // Set up interval to periodically check for mood updates
    const moodUpdateInterval = setInterval(async () => {
      try {
        const moodsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND}/mood`
        );
        if (moodsResponse.status === 200) {
          setMoodsResponse(moodsResponse);
        }
      } catch (error) {
        console.error("Error polling moods:", error);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(moodUpdateInterval);
  }, []);

  const getAll = async () => {
    try {
      const data = await getAllMemories();
      console.log(data);
      if (data.success) {
        setNavMemories(Array.isArray(data.data) ? data.data : []);
      } else {
        setNavMemories([]);
      }
    } catch (error) {
      console.log(error);
      setNavMemories([]);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const getdata = async () => {
    if (auth.isAuthenticated) return;
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
        setTimeout(() => {
          setAuthPop(true);
        }, 10000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  // Improved avatar handling in user state update
  useEffect(() => {
    console.log(auth, "auth");

    // Check if the avatar URL exists and properly decode it if needed
    let avatarUrl = auth?.user?.avatar;

    if (avatarUrl && typeof avatarUrl === "string") {
      // Try to decode the URL if it appears to be encoded
      try {
        if (avatarUrl.includes("%")) {
          avatarUrl = decodeURIComponent(avatarUrl);
        }
      } catch (e) {
        console.error("Error decoding avatar URL:", e);
      }
    }

    // If avatar is missing or invalid, use a default avatar
    if (!avatarUrl || avatarUrl === "undefined" || avatarUrl === "") {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        auth?.user?.username || "User"
      )}`;
    }

    setUser((prev) => {
      return {
        ...prev,
        isAuth: auth?.isAuthenticated,
        name: auth?.user?.username,
        email: auth?.user?.email,
        avatar: avatarUrl,
      };
    });

    // Reset image error state when avatar changes
    setImageError(false);
  }, [auth]);

  useEffect(() => {
    console.log(user);
  }, [auth, user]);

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Toggle user menu for mobile
  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Toggle more dropdown (changed from hover to click)
  const toggleMoreDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Scroll to Hero Section Smoothly
  const scrollToHero = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const scrollIntoFooter = () => {
    document
      .getElementById("footer-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const onclickHandler = () => {
    if (location.pathname === "/") {
      document
        .getElementById("landing")
        ?.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    } else {
      navigate("/");
    }
  };

  // Fixed logout function - Ensuring credentials are passed properly
  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Logout response:", response);
      return response;
    } catch (error) {
      console.error("Logout request failed:", error);
      throw error;
    }
  };

  // Direct logout handler without popup for desktop
  const handleLogout = async (e) => {
    // Stop event propagation to prevent bubbling
    e.stopPropagation();
    console.log("Logout clicked");

    try {
      const response = await logout();
      console.log("Logout response received:", response);

      // Regardless of server response, log out the user client-side
      setAuth({
        isAuthenticated: false,
        user: null,
        role: null,
        id: null,
      });

      // Close menus and redirect to home
      setShowUserMenu(false);
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // If there's an error, still log the user out client-side
      setAuth({
        isAuthenticated: false,
        user: null,
        role: null,
        id: null,
      });
      setShowUserMenu(false);
      setIsOpen(false);
      navigate("/");
    }
  };

  // Mood icon component with improved colors
  const MoodIcon = ({ type, size = 24, isActive = false }) => {
    const getIconColor = (type, isActive = false) => {
      // If in weather route, always show filled
      const isWeatherRoute = location.pathname === "/weather";
      if (isActive || isWeatherRoute) return "#FFFFFF";

      // Return mood-specific colors
      switch (type) {
        case "sunny":
          return "#FFD700"; // Gold
        case "cloudy":
          return "#A9A9A9"; // Gray
        case "rainy":
          return "#4682B4"; // Steel Blue
        case "stormy":
          return "#9370DB"; // Medium Purple
        case "snowy":
          return "#F0F8FF"; // Alice Blue
        case "electric":
          return "#FFD700"; // Gold
        case "loving":
          return "#FF69B4"; // Hot Pink
        default:
          return "#ADADAD";
      }
    };

    const color = getIconColor(type, isActive);

    switch (type) {
      case "sunny":
        return <Sun size={size} color={color} />;
      case "cloudy":
        return <Cloud size={size} color={color} />;
      case "rainy":
        return <CloudRain size={size} color={color} />;
      case "stormy":
        return <CloudLightning size={size} color={color} />;
      case "snowy":
        return <CloudSnow size={size} color={color} />;
      case "electric":
        return <Zap size={size} color={color} />;
      case "loving":
        return <Heart size={size} color={color} />;
      default:
        return <Heart size={size} color={color} />;
    }
  };

  // Get current mood dynamically
  const currentMood = getCurrentMood();

  // Function to create a default avatar URL if image fails to load
  const getDefaultAvatar = (username) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      username || "User"
    )}`;
  };

  // Handle image error by setting fallback
  const handleImageError = (e) => {
    console.log("Image failed to load, using default avatar");
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = getDefaultAvatar(user.name);
    setImageError(true);
  };

  return (
    <div className="w-full overflow-visible z-50 fixed top-0">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-3 bg-black text-white transition-all duration-300">
        <h1
          onClick={onclickHandler}
          className="text-2xl md:text-4xl font-bold cursor-pointer"
        >
          You&Me
        </h1>

        <div className="flex items-center justify-center gap-4">
          {/* Only show user related controls if authenticated */}
          {user.isAuth && (
            <div className="flex items-center gap-4 md:hidden">
              {/* Mood Icon for Mobile */}
              <Link to="/weather" className="flex items-center justify-center">
                {currentMood && (
                  <MoodIcon
                    type={currentMood}
                    size={24}
                    isActive={isActive("/weather")}
                  />
                )}
              </Link>
            </div>
          )}
          <button onClick={toggleMenu} className="text-white md:hidden flex">
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>

        <ul className="hidden md:flex items-center space-x-6 md:text-xl text-lg">
          <h1
            onClick={onclickHandler}
            className={`cursor-pointer transition-all ${
              isActive("/")
                ? "text-green-400 drop-shadow-glow"
                : "hover:text-green-400"
            }`}
          >
            Home
          </h1>
          <Link
            to="/music-room"
            className={`cursor-pointer transition-all ${
              isActive("/music-room")
                ? "text-blue-400 drop-shadow-glow"
                : "hover:text-blue-400"
            }`}
          >
            Music Room
          </Link>
          {/* Added Goal Link - Desktop */}
          <Link
            to="/goal"
            className={`cursor-pointer transition-all ${
              isActive("/goal")
                ? "text-orange-400 drop-shadow-glow"
                : "hover:text-orange-400"
            }`}
          >
            Goal
          </Link>
          {isHome && (
            <>
              <button
                onClick={scrollToHero}
                className="cursor-pointer transition-all hover:text-yellow-400 hover:drop-shadow-glow"
              >
                Stories
              </button>
              <button
                onClick={scrollIntoFooter}
                className="cursor-pointer transition-all hover:text-red-400 hover:drop-shadow-glow"
              >
                Footer
              </button>
            </>
          )}

          {/* Mood Icon for Desktop */}
          <Link
            to="/weather"
            className={`cursor-pointer transition-all flex items-center ${
              isActive("/weather")
                ? "text-cyan-400 drop-shadow-glow"
                : "hover:text-cyan-400"
            }`}
          >
            {currentMood && (
              <MoodIcon
                type={currentMood}
                size={20}
                isActive={isActive("/weather")}
              />
            )}
          </Link>

          {/* Dropdown for Additional Items - Click for Desktop */}
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-1 cursor-pointer transition-all hover:text-purple-400"
              onClick={toggleMoreDropdown}
            >
              More{" "}
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showDropdown && (
              <div
                className="fixed w-40 bg-black border border-gray-700 rounded-md shadow-lg z-50"
                style={{ top: "50px", marginLeft: "-10px" }}
              >
                <Link
                  to="/aurora"
                  className={`block px-4 py-2 text-sm ${
                    isActive("/aurora")
                      ? "text-purple-400 drop-shadow-glow"
                      : "hover:text-purple-400"
                  }`}
                  onClick={() => setShowDropdown(false)}
                >
                  Aurora
                </Link>
                <Link
                  to="/countdown"
                  className={`block px-4 py-2 text-sm ${
                    isActive("/countdown")
                      ? "text-yellow-400 drop-shadow-glow"
                      : "hover:text-yellow-400"
                  }`}
                  onClick={() => setShowDropdown(false)}
                >
                  Countdown
                </Link>
                <Link
                  to="/angryroom"
                  className={`block px-4 py-2 text-sm ${
                    isActive("/angryroom")
                      ? "text-red-500 drop-shadow-glow"
                      : "hover:text-red-500"
                  }`}
                  onClick={() => setShowDropdown(false)}
                >
                  AngryRoom
                </Link>
              </div>
            )}
          </div>

          {/* User Profile for Desktop - Only show if authenticated */}
          {user.isAuth && (
            <div className="flex items-center gap-2">
              {/* Direct logout button without dropdown */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

              {/* User avatar as simple display, not dropdown trigger */}
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-600 hover:border-gray-400">
                {!imageError ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                )}
              </div>
            </div>
          )}
        </ul>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 w-full h-full bg-black/90 backdrop-blur-lg flex flex-col justify-center items-center text-white z-50"
        >
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-white"
          >
            <X size={35} />
          </button>

          <ul className="text-2xl flex items-center justify-center flex-col space-y-6">
            <Link
              onClick={toggleMenu}
              to="/"
              className={`cursor-pointer transition-all ${
                isActive("/")
                  ? "text-green-400 drop-shadow-glow"
                  : "hover:text-green-400"
              }`}
            >
              Home
            </Link>
            <Link
              onClick={toggleMenu}
              to="/music-room"
              className={`cursor-pointer transition-all ${
                isActive("/music-room")
                  ? "text-blue-400 drop-shadow-glow"
                  : "hover:text-blue-400"
              }`}
            >
              Music Room
            </Link>
            {/* Added Goal Link - Mobile */}
            <Link
              onClick={toggleMenu}
              to="/goal"
              className={`cursor-pointer transition-all ${
                isActive("/goal")
                  ? "text-orange-400 drop-shadow-glow"
                  : "hover:text-orange-400"
              }`}
            >
              Goal
            </Link>

            {/* Added Weather/Mood Link for Mobile Menu */}
            <Link
              onClick={toggleMenu}
              to="/weather"
              className={`cursor-pointer transition-all flex items-center gap-2 ${
                isActive("/weather")
                  ? "text-cyan-400 drop-shadow-glow"
                  : "hover:text-cyan-400"
              }`}
            >
              Weather
              {currentMood && (
                <MoodIcon
                  type={currentMood}
                  size={20}
                  isActive={isActive("/weather")}
                />
              )}
            </Link>

            <Link
              onClick={toggleMenu}
              to="/aurora"
              className={`cursor-pointer transition-all ${
                isActive("/aurora")
                  ? "text-purple-400 drop-shadow-glow"
                  : "hover:text-purple-400"
              }`}
            >
              Aurora
            </Link>
            <Link
              onClick={toggleMenu}
              to="/countdown"
              className={`cursor-pointer transition-all ${
                isActive("/countdown")
                  ? "text-yellow-400 drop-shadow-glow"
                  : "hover:text-yellow-400"
              }`}
            >
              Countdown
            </Link>
            <Link
              onClick={toggleMenu}
              to="/angryroom"
              className={`cursor-pointer transition-all ${
                isActive("/angryroom")
                  ? "text-red-500 drop-shadow-glow"
                  : "hover:text-red-500"
              }`}
            >
              AngryRoom
            </Link>

            {/* User Profile Info in Mobile Menu - Only show if authenticated */}
            {user.isAuth && (
              <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col items-center">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-16 h-16 rounded-full mb-2 overflow-hidden">
                    {!imageError ? (
                      <img
                        src={user.avatar}
                        alt={user.name || "User"}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center text-white text-2xl">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-medium">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-2 text-red-400 border border-red-500 rounded-full hover:bg-red-500/10"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            )}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
