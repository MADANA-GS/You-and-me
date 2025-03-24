import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  Clock,
  User,
  X,
  AlertCircle,
  ChevronRight,
  Flame,
  Activity,
  Trash2,
  Heart,
} from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const getAllAngry = async () => {
  const data = await axios.get(`${import.meta.env.VITE_BACKEND}/angry-message`);
  return data.data;
};

const addAngry = async (formdata) => {
  const data = await axios.post(
    `${import.meta.env.VITE_BACKEND}/angry-message`,
    formdata
  );
  return data;
};

const deleteAngry = async (id) => {
  const data = await axios.delete(
    `${import.meta.env.VITE_BACKEND}/angry-message/${id}`
  );
  return data;
};

// Heart-based loading component
const HeartLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3].map((i) => (
          <Heart
            key={i}
            size={32}
            className={`text-red-500 animate-pulse`}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1.5s",
            }}
            fill="#ef4444"
          />
        ))}
      </div>
      <p className="text-red-400 font-bold text-lg animate-pulse">
        LOADING DRAMA...
      </p>
    </div>
  );
};

const AngryRoom = () => {
  const [fights, setFights] = useState([]);
  const [selectedFight, setSelectedFight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [newFight, setNewFight] = useState({
    date: "",
    duration: "",
    initiator: "",
    reason: "",
    resolution: "",
    intensity: "medium",
    notes: "",
  });

  const { auth } = useContext(AuthContext);
  
  const getALL = async () => {
    setLoading(true); // Set loading to true before fetching data
    try {
      const data = await getAllAngry();
      if (data.success) {
        setFights(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      // Add a small delay to make the loading animation visible (optional)
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  useEffect(() => {
    getALL();
  }, []); // Remove newFight dependency to prevent unnecessary API calls

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleShowDetails = (fight) => {
    if (auth.role === "admin") {
      setSelectedFight(fight);
      setShowModal(true);
    } else {
      setShowAccessDeniedModal(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFight((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFight = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true before adding new fight
    const formdata = new FormData(e.target);
    const data = {
      date: formdata.get("date"),
      duration: formdata.get("duration"),
      initiator: formdata.get("initiator"),
      reason: formdata.get("reason"),
      resolution: formdata.get("resolution"),
      intensity: formdata.get("intensity"),
      notes: formdata.get("notes"),
    };

    try {
      const newdata = await addAngry(data);
      console.log(newdata);
      // Refresh the fights data after adding a new fight
      getALL();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    setShowAddModal(false);
    setNewFight({
      date: "",
      duration: "",
      initiator: "",
      reason: "",
      resolution: "",
      intensity: "medium",
      notes: "",
    });
  };

  const handleDeleteFight = async (id, e) => {
    e.stopPropagation(); // Prevent modal from opening when delete button is clicked
    
    if (window.confirm("Are you sure you want to delete this conflict record?")) {
      setLoading(true); // Set loading to true before deleting
      try {
        const response = await deleteAngry(id);
        if (response.data.success) {
          // Update the fights list after deletion
          setFights(fights.filter(fight => fight._id !== id));
          // If the deleted fight is currently being viewed, close the modal
          if (selectedFight && selectedFight._id === id) {
            setShowModal(false);
          }
        }
      } catch (error) {
        console.log(error);
        alert("Failed to delete the conflict record");
      } finally {
        setLoading(false);
      }
    }
  };

  const getIntensityStyle = (intensity) => {
    switch (intensity) {
      case "high":
        return "bg-red-600 border-red-800";
      case "medium":
        return "bg-orange-600 border-orange-800";
      case "low":
        return "bg-yellow-600 border-yellow-800";
      default:
        return "bg-orange-600 border-orange-800";
    }
  };

  const getIntensityIcon = (intensity) => {
    switch (intensity) {
      case "high":
        return <Flame size={20} className="text-red-300" />;
      case "medium":
        return <Activity size={20} className="text-orange-300" />;
      case "low":
        return <AlertCircle size={20} className="text-yellow-300" />;
      default:
        return <Activity size={20} className="text-orange-300" />;
    }
  };

  // Heart beat animation for new add button
  const HeartBeatButton = ({ onClick, children, className }) => {
    const [hover, setHover] = useState(false);
    
    return (
      <button
        onClick={onClick}
        className={`${className} relative transition-all duration-300 ${hover ? 'scale-105' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && (
          <Heart
            className="absolute -top-3 -right-3 text-red-500 animate-ping"
            size={20}
            fill="#ef4444"
          />
        )}
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b mt-12 from-black to-red-950 text-white">
      <header className="border-b border-red-700 py-6 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-red-500 flex items-center justify-center md:justify-start">
                RAGE CAGE
                <Heart 
                  className="ml-2 text-red-500" 
                  size={32} 
                  fill="#ef4444"
                />
              </h1>
              <p className="text-base md:text-lg text-red-400 mt-2">
                Track and reflect on heated conflicts
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="bg-red-700 text-white py-3 px-6 rounded-lg font-bold border border-red-500 text-lg">
                MELTDOWN COUNT: {fights.length}
              </div>

              {auth.role === "admin" && (
                <HeartBeatButton
                  onClick={() => setShowAddModal(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 border border-red-500 font-bold text-lg w-full sm:w-auto"
                >
                  RECORD ANGER
                </HeartBeatButton>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-red-400">
            DRAMA COLLECTION
          </h2>
          <p className="text-base md:text-lg text-red-300">
            Click on any conflict to see the full damage report
          </p>
        </div>

        {loading ? (
          <HeartLoader />
        ) : fights.length > 0 ? (
          <div className="space-y-5">
            {fights.map((fight, index) => (
              <div
                key={index}
                onClick={() => handleShowDetails(fight)}
                className={`border rounded-lg p-5 cursor-pointer transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${getIntensityStyle(
                  fight.intensity
                )} hover:brightness-125`}
              >
                <div className="w-full sm:w-auto">
                  <div className="flex items-center mb-2">
                    <Calendar size={18} className="mr-2 text-red-300" />
                    <span className="text-gray-200 text-base md:text-lg">
                      {formatDate(fight.date)} • {fight.time}
                    </span>
                  </div>
                  <div className={`text-white text-base md:text-lg font-medium truncate max-w-full sm:max-w-sm ${auth.role !== "admin" && "filter blur-sm select-none hover:blur-lg"}`}>
                    {fight.reason}
                  </div>
                  {auth.role !== "admin" && (
                    <div className="text-red-300 text-sm mt-1 italic">
                      (Login as admin to view details)
                    </div>
                  )}
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-0 w-full sm:w-auto justify-between">
                  <div className="text-sm mb-0 sm:mb-2">
                    <span className="px-4 py-2 bg-black text-white rounded-full text-sm md:text-base border border-red-500">
                      {fight.initiator}
                    </span>
                  </div>
                  <div className="flex items-center text-sm md:text-base text-gray-300">
                    <Clock size={16} className="mr-2 text-red-300" />
                    <span>{fight.duration}</span>
                  </div>
                </div>
                <div className=""> 
              <h1>added by {(auth?.user?.username).split(" ")[0]}</h1>
                
                </div>
                <div className="flex items-center">
                  {auth.role === "admin" && (
                    <button 
                      onClick={(e) => handleDeleteFight(fight._id, e)}
                      className="mr-2 p-2 rounded-full hover:bg-red-900 text-red-300 hover:text-white"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                  <ChevronRight
                    size={24}
                    className="text-red-400 hidden sm:block"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-red-700 rounded-lg bg-red-950 bg-opacity-30">
            <p className="mb-6 text-red-400 text-xl">
              No conflicts recorded yet. Too calm?
            </p>
            {auth.role === "admin" && (
              <HeartBeatButton
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-800 border border-red-500 font-bold text-lg"
              >
                DOCUMENT FIRST OUTBURST
              </HeartBeatButton>
            )}
          </div>
        )}
      </main>

      {showModal && selectedFight && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div
            className={`rounded-lg w-full max-w-md border p-6 ${getIntensityStyle(
              selectedFight.intensity
            )}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center">
                {getIntensityIcon(selectedFight.intensity)}
                <span className="ml-2">MELTDOWN REPORT</span>
              </h2>
              <div className="flex items-center">
                {auth.role === "admin" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFight(selectedFight._id, e);
                    }}
                    className="mr-3 p-2 rounded-full hover:bg-red-900 text-red-300 hover:text-white"
                    title="Delete conflict"
                  >
                    <Trash2 size={22} />
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-red-200 p-2"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between border-b border-red-800 pb-4">
                <div className="flex items-center">
                  <Calendar size={20} className="mr-2 text-red-300" />
                  <span className="text-white text-lg">
                    {formatDate(selectedFight.date)} • {selectedFight.time}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock size={20} className="mr-2 text-red-300" />
                  <span className="text-white text-lg">
                    {selectedFight.duration}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-red-300 mb-2 font-medium text-lg">
                  RAGE STARTER:
                </div>
                <div className="flex items-center">
                  <User size={20} className="mr-2 text-red-300" />
                  <span className="font-medium text-white text-lg">
                    {selectedFight.initiator}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-red-300 mb-2 font-medium text-lg">
                  TRIGGER:
                </div>
                <p className="text-white text-lg">{selectedFight.reason}</p>
              </div>

              <div>
                <div className="text-red-300 mb-2 font-medium text-lg">
                  RESOLUTION:
                </div>
                <p className="text-white text-lg">{selectedFight.resolution}</p>
              </div>

              {selectedFight.notes && (
                <div className="bg-black bg-opacity-40 p-4 rounded-lg border-l-4 border-red-500 mt-3">
                  <div className="text-red-300 mb-2 flex items-center font-medium text-lg">
                    <AlertCircle size={18} className="mr-2" />
                    REFLECTION:
                  </div>
                  <p className="text-base md:text-lg text-white">
                    {selectedFight.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 border border-red-500 text-lg font-medium"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      {showAccessDeniedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-red-950 to-black rounded-lg w-full max-w-md border border-red-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-red-400">
                NICE TRY, SNOOP!
              </h2>
              <button
                onClick={() => setShowAccessDeniedModal(false)}
                className="text-white hover:text-red-300 p-2"
                type="button"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-center py-6">
              <div className="flex justify-center mb-4">
                <Heart 
                  size={64} 
                  className="text-red-500 animate-ping" 
                  fill="#ef4444"
                  style={{ animationDuration: "2s" }}
                />
              </div>
              <p className="text-xl text-white mb-3">
                Who do you think you are?!
              </p>
              <p className="text-lg text-red-300 mb-6">
                This is our private drama collection! Go find your own relationship problems to snoop through!
              </p>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowAccessDeniedModal(false)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 border border-red-500 text-lg font-medium"
              >
                SCRAM!
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-red-950 to-black rounded-lg w-full max-w-md border border-red-700 p-6 max-h-screen overflow-y-auto">
            <form onSubmit={handleAddFight}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-red-400 flex items-center">
                  <Heart 
                    size={24} 
                    className="mr-2 text-red-500" 
                    fill="#ef4444" 
                  />
                  DOCUMENT YOUR RAGE
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-white hover:text-red-300 p-2"
                  type="button"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    DATE OF INCIDENT
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newFight.date}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white focus:border-red-500 focus:outline-none text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    DURATION OF CONFLICT
                  </label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g. 30 minutes"
                    value={newFight.duration}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white focus:border-red-500 focus:outline-none text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    INITIATED BY
                  </label>
                  <select
                    name="initiator"
                    value={newFight.initiator}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white focus:border-red-500 focus:outline-none text-lg"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Me">Me</option>
                    <option value="Partner">Partner</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    INTENSITY LEVEL
                  </label>
                  <select
                    name="intensity"
                    value={newFight.intensity}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white focus:border-red-500 focus:outline-none text-lg"
                  >
                    <option value="low">Low (Annoyed)</option>
                    <option value="medium">Medium (Heated)</option>
                    <option value="high">High (Furious)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    REASON FOR CONFLICT
                  </label>
                  <textarea
                    name="reason"
                    placeholder="What ignited this conflict?"
                    value={newFight.reason}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white h-24 focus:border-red-500 focus:outline-none text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    RESOLUTION (IF ANY)
                  </label>
                  <textarea
                    name="resolution"
                    placeholder="How was the conflict defused?"
                    value={newFight.resolution}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white h-24 focus:border-red-500 focus:outline-none text-lg"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-base md:text-lg text-red-300">
                    NOTES/REFLECTION
                  </label>
                  <textarea
                    name="notes"
                    placeholder="What did you learn?"
                    value={newFight.notes}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-red-700 p-3 rounded-lg text-white h-24 focus:border-red-500 focus:outline-none text-lg"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="border border-red-500 px-6 py-3 rounded-lg hover:bg-gray-900 text-lg w-full sm:w-auto order-2 sm:order-1"
                  type="button"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-800 border border-red-500 text-lg font-medium w-full sm:w-auto order-1 sm:order-2"
                  disabled={
                    !newFight.date || !newFight.initiator || !newFight.reason
                  }
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Heart size={20} className="mr-2 animate-pulse" fill="#fff" />
                      SAVING...
                    </span>
                  ) : (
                    "SAVE"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add a full-screen heart loader for initial page load or during operations */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Heart
                  key={i}
                  size={i % 2 === 0 ? 48 : 36}
                  className="text-red-500 mx-1 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    animationDuration: "1.5s",
                  }}
                  fill={i % 2 === 0 ? "#ef4444" : "#b91c1c"}
                />
              ))}
            </div>
            <p className="text-red-400 font-bold text-xl animate-pulse">
              LOADING DRAMA...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AngryRoom;