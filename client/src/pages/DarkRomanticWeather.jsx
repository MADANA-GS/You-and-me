import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  CloudSnow,
  Zap,
  Heart,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

// Global API URL variable
const API_BASE_URL = import.meta.env.VITE_BACKEND;

const ModernMoodTracker = () => {
  const { auth,moodsResponse } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);
  // const [moodsResponse, setMoodsResponse] = useState([]);

  // Mood state with moods
  const [mood, setMood] = useState({
    current: null, // Will be set from backend, no default
    updated: new Date().toISOString(),
    history: [],
  });

  // Track selected mood separately (for pending changes)
  const [selectedMood, setSelectedMood] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // New note input
  const [newNote, setNewNote] = useState("");

  // Mobile view toggle for filters
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // setMoodsResponse(moodResponse);
    setUserId(auth.id);
  }, [auth ]);

  // Fetch all moods
  const fetchMoods = async () => {
    setIsLoading(true);
    try {
      const moodsResponse = await axios.get(`${API_BASE_URL}/mood`);
      console.log("moodsResponse", moodsResponse);
      const recordedMoodsResponse = await axios.get(
        `${API_BASE_URL}/mood/recorded-moods`
      );

      if (moodsResponse.data && moodsResponse.data.length > 0) {
        // Get the most recent main mood
        const latestMood = moodsResponse.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];

        const currentMoodType = latestMood.type || "sunny";

        // Format recorded moods for history display
        const formattedHistory = recordedMoodsResponse.data
          .map((rm) => ({
            type: rm.type,
            date: rm.date,
            note: rm.note,
            id: rm._id,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setMood({
          current: currentMoodType,
          updated: latestMood.updatedAt || new Date().toISOString(),
          history: formattedHistory,
        });

        // Initialize selectedMood with current mood from backend
        setSelectedMood(currentMoodType);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
      setError("Failed to load mood data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mood selection (locally only, no API call)
  const handleMoodSelection = (newMood) => {
    setSelectedMood(newMood);
  };

  // Save mood and note to backend
  const saveMoodEntry = async () => {
    if (!selectedMood) return;

    try {
      const moodData = {
        type: selectedMood,
        userId: userId,
        note: newNote.trim() ? newNote : "Mood updated", // Use note if provided
      };

      // Save to backend
      await axios.post(`${API_BASE_URL}/mood`, moodData);

      // Update local state
      setMood((prev) => ({
        ...prev,
        current: selectedMood,
        updated: new Date().toISOString(),
      }));

      // Clear note input
      setNewNote("");

      // Refresh mood history
      fetchMoods();
    } catch (err) {
      console.error("Failed to update mood:", err);
      setError("Failed to update mood. Please try again later.");
    }
  };

  // Filter recorded moods by date range
  const filterMoodsByDate = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/mood/recorded-moods`);

      // Manual filtering on the client side
      const filteredMoods = response.data.filter((mood) => {
        const moodDate = new Date(mood.date);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59, 999); // Include the full end day

        return moodDate >= startDate && moodDate <= endDate;
      });

      // Format for display
      const formattedHistory = filteredMoods
        .map((rm) => ({
          type: rm.type,
          date: rm.date,
          note: rm.note,
          id: rm._id,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setMood((prev) => ({
        ...prev,
        history: formattedHistory,
      }));

      // Hide filters on mobile after applying them
      setShowFilters(false);
    } catch (err) {
      console.error("Failed to filter moods:", err);
      setError("Failed to filter mood data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get icon color based on theme
  const getIconColor = (type, isActive = false) => {
    return isActive ? "#FFFFFF" : "#ADADAD";
  };

  // Display the right icon for each mood type with color
  const MoodIcon = ({ type, size = 24, isActive = false }) => {
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Mood description
  const getMoodDescription = (type) => {
    const descriptions = {
      sunny: "We are bright and positive today",
      cloudy: "We have a few things to discuss",
      rainy: "We're feeling disconnected",
      stormy: "Passionate disagreement",
      snowy: "Quiet, peaceful connection",
      electric: "Passionate and intense",
      loving: "Deep connection and warmth",
    };
    return descriptions[type] || "Our connection is evolving";
  };

  // Date filter state
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  // Handle date filter change
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Load data from database on initial mount
  useEffect(() => {
    fetchMoods();
  }, []);

  // Check if the mood has been changed from current
  const hasMoodChanged = selectedMood !== mood.current;

  // Determine if save button should be enabled
  const shouldEnableSave = hasMoodChanged || newNote.trim().length > 0;

  // Get background gradient based on mood
  const getMoodBackground = (type) => {
    const backgrounds = {
      sunny: "bg-gradient-to-b from-yellow-900 to-black",
      cloudy: "bg-gradient-to-b from-gray-800 to-black",
      rainy: "bg-gradient-to-b from-blue-900 to-black",
      stormy: "bg-gradient-to-b from-purple-900 to-black",
      snowy: "bg-gradient-to-b from-blue-800 to-black",
      electric: "bg-gradient-to-b from-indigo-900 to-black",
      loving: "bg-gradient-to-b from-pink-900 to-black",
    };
    return backgrounds[type] || "bg-black";
  };

  return (
    <div
      className={`min-h-screen md:mt-12 mt-16 overflow-x-hidden text-white p-2 sm:p-4 w-full transition-all duration-500 ${getMoodBackground(
        selectedMood || mood.current
      )}`}
    >
      <div className="max-w-6xl mx-auto my-2 md:my-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-center">
          Mood Monitor
        </h1>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6">
          {/* Current Mood Display */}
          <div className="md:col-span-4 bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-6">
            <div className="flex flex-col items-center">
              {isLoading ? (
                <div className="flex justify-center items-center h-32 md:h-40">
                  <p>Loading...</p>
                </div>
              ) : (
                <>
                  <div className="mb-2 md:mb-6 mt-2 md:mt-4">
                    <MoodIcon type={mood.current} size={56} isActive={true} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-medium capitalize mb-2">
                    {mood.current}
                  </h3>
                  <p className="text-base md:text-lg text-zinc-300 italic mb-3 md:mb-6 text-center">
                    "{getMoodDescription(mood.current)}"
                  </p>
                  <p className="text-xs md:text-sm text-zinc-500">
                    Last updated: {new Date(mood.updated).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Middle: Mood Selection and New Entry */}
          <div className="md:col-span-4 space-y-3 md:space-y-6">
            {/* Mood Selection */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-6">
              <h4 className="font-medium mb-3 md:mb-6 text-center">
                Change Mood
              </h4>
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {[
                  "sunny",
                  "cloudy",
                  "rainy",
                  "stormy",
                  "snowy",
                  "electric",
                  "loving",
                ].map((type) => (
                  <MoodButton
                    key={type}
                    type={type}
                    onClick={() => handleMoodSelection(type)}
                    currentMood={selectedMood}
                  />
                ))}
              </div>
              {hasMoodChanged && (
                <div className="mt-3 text-yellow-500 text-sm text-center">
                  *Changes not saved yet
                </div>
              )}
            </div>

            {/* Add New Entry */}
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-6">
              <h4 className="font-medium mb-2 md:mb-4 text-center">
                Record Today's Mood
              </h4>
              <textarea
                className="w-full p-2 md:p-3 rounded-lg border border-zinc-700 bg-zinc-800/90 text-white mb-3 resize-none"
                placeholder="How are you feeling today?"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <button
                onClick={saveMoodEntry}
                className={`w-full py-2 md:py-3 px-4 rounded-lg font-medium transition-colors ${
                  shouldEnableSave
                    ? "bg-white text-black hover:bg-zinc-200"
                    : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                }`}
                disabled={!shouldEnableSave}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Mood History */}
          <div className="md:col-span-4">
            <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg shadow-lg p-3 md:p-6 h-full">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-center flex-1">
                  Recent History
                </h4>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-xs bg-zinc-800 px-2 py-1 rounded md:hidden"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              {/* Date range filter - responsive */}
              <div
                className={`${showFilters ? "block" : "hidden"} md:block mb-3`}
              >
                <div className="flex flex-col md:flex-row gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-zinc-400 block mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={dateFilter.startDate}
                      onChange={handleDateChange}
                      className="w-full p-2 rounded-lg border border-zinc-700 bg-zinc-800/90 text-white text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-zinc-400 block mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={dateFilter.endDate}
                      onChange={handleDateChange}
                      className="w-full p-2 rounded-lg border border-zinc-700 bg-zinc-800/90 text-white text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={filterMoodsByDate}
                  className="w-full md:w-auto py-1 px-3 rounded-lg bg-zinc-700 text-white text-sm hover:bg-zinc-600 transition-colors"
                >
                  Apply Filter
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-32 md:h-40">
                  <p>Loading...</p>
                </div>
              ) : mood.history.length > 0 ? (
                <div className="space-y-2 max-h-48 md:max-h-96 overflow-y-auto pr-1">
                  {mood.history.map((entry, idx) => (
                    <div
                      key={entry.id || idx}
                      className="p-2 md:p-4 bg-zinc-800/90 rounded-lg border border-zinc-700"
                    >
                      <div className="flex items-center mb-1 md:mb-2">
                        <div className="mr-2">
                          <MoodIcon
                            type={entry.type}
                            size={20}
                            isActive={true}
                          />
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-medium capitalize">
                            {entry.type}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {formatDate(entry.date)}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-zinc-300">
                        "{entry.note}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-400">
                  No mood entries found for this period
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mood button component with monochrome styling
const MoodButton = ({ type, onClick, currentMood }) => {
  const labels = {
    sunny: "Sunny",
    cloudy: "Cloudy",
    rainy: "Rainy",
    stormy: "Stormy",
    snowy: "Snowy",
    electric: "Electric",
    loving: "Loving",
  };

  // Highlight the currently selected mood type
  const isSelected = currentMood === type;

  return (
    <button
      onClick={onClick}
      className={`p-2 md:p-3 rounded-lg flex flex-col items-center justify-center transition-all ${
        isSelected
          ? "bg-white text-black shadow-md"
          : "bg-zinc-800/90 border border-zinc-700 hover:bg-zinc-700"
      }`}
    >
      {type === "sunny" && (
        <Sun size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "cloudy" && (
        <Cloud size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "rainy" && (
        <CloudRain size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "stormy" && (
        <CloudLightning size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "snowy" && (
        <CloudSnow size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "electric" && (
        <Zap size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      {type === "loving" && (
        <Heart size={18} color={isSelected ? "#000000" : "#FFFFFF"} />
      )}
      <span className="text-xs mt-1 font-medium truncate">{labels[type]}</span>
    </button>
  );
};

export default ModernMoodTracker;
