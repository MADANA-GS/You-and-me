import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Adjust the path as needed
import axios from "axios";

// Global variable for backend URL
const API_BASE_URL = import.meta.env.VITE_BACKEND;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const FutureGoalsTracker = () => {
  const { auth } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split("T")[0];
  };

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    targetDate: getCurrentDate(),
    priority: "medium",
    progress: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Fetch goals from API using axios
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await api.get("/goal");
      setGoals(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error connecting to the server");
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle clicking outside the modal to close it
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (showModal && e.target.classList.contains("modal-overlay")) {
        setShowModal(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [showModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  // Add new goal using axios
  const addGoal = async () => {
    if (newGoal.title.trim() === "") return;

    try {
      const response = await api.post("/goal", {
        title: newGoal.title,
        description: newGoal.description,
        targetDate: newGoal.targetDate,
        priority: newGoal.priority,
        progress: 0,
      });

      // Add the new goal to the state
      setGoals([...goals, response.data.data]);

      // Reset form
      setNewGoal({
        title: "",
        description: "",
        targetDate: getCurrentDate(),
        priority: "medium",
        progress: 0,
      });
      setShowModal(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create goal");
      console.error("Error adding goal:", err);
    }
  };

  // Update progress using axios
  const updateProgress = async (id, newProgress) => {
    try {
      await api.patch(`/goal/${id}/progress`, { progress: newProgress });

      // Update the goal in the state
      setGoals(
        goals.map((goal) =>
          goal._id === id ? { ...goal, progress: newProgress } : goal
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update goal progress");
      console.error("Error updating goal:", err);
    }
  };

  // Delete goal using axios
  const deleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await api.delete(`/goal/${id}`);

      // Remove the goal from the state
      setGoals(goals.filter((goal) => goal._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete goal");
      console.error("Error deleting goal:", err);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter goals based on search and priority
  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || goal.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-blue-500";
    }
  };

  // Check if user is not authenticated or not admin
  const isNotAdmin = !auth.isAuthenticated || auth.role !== "admin";

  return (
    <div className="bg-black md:mt-12 mt-16 text-white min-h-screen w-full">
      {/* Non-Admin Access Notification */}
      {/* Non-Admin Access Notification */}
      {!auth.isAuthenticated || auth.role !== "admin" ? (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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
      {/* Gradient header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-800 to-blue-900 py-6 px-4 md:py-8 md:px-6 shadow-xl w-full">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between w-full">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Our Journey Together
              </h1>
              <p className="text-blue-200 text-sm md:text-base">
                Building our future, one goal at a time
              </p>
            </div>

            <div className="mt-4 md:mt-0 relative w-full md:w-auto">
              <div
                className={`flex items-center bg-gray-900 rounded-lg border ${
                  isSearchFocused
                    ? "border-blue-400 shadow-lg"
                    : "border-gray-700"
                } overflow-hidden transition-all duration-300 w-full`}
              >
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="bg-gray-900 text-white px-4 py-2 w-full focus:outline-none"
                />
                <span className="px-3 text-gray-400">
                  {/* Search icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 w-full">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gray-900 rounded-lg p-4 shadow-lg w-full">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="ml-2 bg-gray-800 text-white border border-gray-700 rounded px-3 py-1"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {auth.role === "admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg flex items-center transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Goal
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
            <button
              onClick={fetchGoals}
              className="mt-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Goal Count */}
        {!loading && !error && (
          <div className="mb-6 text-gray-400 text-sm md:text-base">
            Showing {filteredGoals.length} of {goals.length} goals
          </div>
        )}

        {/* Goals Display */}
        {!loading && !error && viewMode === "grid" ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {filteredGoals.map((goal) => (
              <div
                key={goal._id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 shadow-lg h-full w-full"
              >
                <div className="relative h-full flex flex-col w-full">
                  <div
                    className={`absolute top-0 left-0 w-2 h-full ${getPriorityColor(
                      goal.priority
                    )}`}
                  ></div>
                  <div className="p-4 pl-5 md:p-5 md:pl-6 flex-grow flex flex-col w-full">
                    <div className="flex justify-between items-start mb-2 w-full">
                      <h3 className="text-base md:text-lg font-bold text-white pr-2">
                        {goal.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                          goal.priority
                        )} text-white whitespace-nowrap`}
                      >
                        {goal.priority.charAt(0).toUpperCase() +
                          goal.priority.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base mb-3 flex-grow">
                      {goal.description}
                    </p>
                    <div className="flex flex-col md:flex-row justify-between text-blue-400 text-xs md:text-sm font-medium mb-3">
                      <div>Added: {formatDate(goal.createdAt)}</div>
                      <div>Target: {formatDate(goal.targetDate)}</div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-auto w-full">
                      <div className="mb-1 flex justify-between items-center w-full">
                        <span className="text-xs md:text-sm text-gray-400">
                          Progress
                        </span>
                        <span className="text-xs md:text-sm text-blue-400">
                          {goal.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>

                      {/* Admin Controls */}
                      <div className="flex justify-between w-full">
                        {/* Progress Controls */}
                        {auth.role === "admin" && (
                          <div className="flex gap-1 md:gap-2 flex-wrap">
                            {[0, 25, 50, 75, 100].map((value) => (
                              <button
                                key={value}
                                onClick={() => updateProgress(goal._id, value)}
                                className={`text-xs px-2 py-1 rounded ${
                                  goal.progress === value
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-800 text-gray-300"
                                }`}
                              >
                                {value}%
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Delete Button (Admin Only) */}
                        {auth.role === "admin" && (
                          <button
                            onClick={() => deleteGoal(goal._id)}
                            className="text-xs px-2 py-1 rounded bg-red-700 text-white hover:bg-red-800 ml-2"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="space-y-4 w-full">
            {filteredGoals.map((goal) => (
              <div
                key={goal._id}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 w-full"
              >
                <div className="flex flex-col md:flex-row w-full">
                  <div
                    className={`w-full md:w-2 h-2 md:h-auto ${getPriorityColor(
                      goal.priority
                    )}`}
                  ></div>
                  <div className="p-4 flex-grow w-full">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-3 w-full">
                      <div className="flex-grow">
                        <h3 className="text-base md:text-lg font-bold text-white mb-1">
                          {goal.title}
                        </h3>
                        <p className="text-gray-400 text-sm md:text-base">
                          {goal.description}
                        </p>
                      </div>
                      <div className="flex flex-row md:flex-col items-start md:items-end justify-between md:justify-start gap-2 md:ml-4 md:min-w-max">
                        <span
                          className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                            goal.priority
                          )} text-white inline-block`}
                        >
                          {goal.priority.charAt(0).toUpperCase() +
                            goal.priority.slice(1)}
                        </span>
                        <div className="flex flex-col text-right">
                          <span className="text-xs md:text-sm text-blue-400 whitespace-nowrap">
                            Added: {formatDate(goal.createdAt)}
                          </span>
                          <span className="text-xs md:text-sm text-blue-400 whitespace-nowrap">
                            Target: {formatDate(goal.targetDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-3 w-full">
                      <div className="flex-grow w-full">
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-xs md:text-sm text-blue-400 whitespace-nowrap">
                        {goal.progress}% Complete
                      </span>
                    </div>

                    {/* Admin Controls */}
                    {auth.role === "admin" && (
                      <div className="flex justify-between items-center mt-4">
                        {/* Progress Controls */}
                        <div className="flex gap-1 md:gap-2 flex-wrap">
                          {[0, 25, 50, 75, 100].map((value) => (
                            <button
                              key={value}
                              onClick={() => updateProgress(goal._id, value)}
                              className={`text-xs px-2 py-1 rounded ${
                                goal.progress === value
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-800 text-gray-300"
                              }`}
                            >
                              {value}%
                            </button>
                          ))}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteGoal(goal._id)}
                          className="text-xs px-2 py-1 rounded bg-red-700 text-white hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* Empty State */}
        {!loading && !error && filteredGoals.length === 0 && (
          <div className="text-center py-12 w-full">
            <div className="text-gray-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 md:h-16 md:w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              No goals found
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-4">
              {goals.length === 0
                ? "No goals have been created yet"
                : "Try changing your search or filter criteria"}
            </p>
            {goals.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterPriority("all");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Reset Filters
              </button>
            )}
            {goals.length === 0 && auth.role === "admin" && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Create Your First Goal
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal Popup - Only for Admin */}
      {showModal && auth.role === "admin" && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 modal-overlay backdrop-blur-sm">
          <div
            className="bg-gray-900 rounded-lg w-full max-w-md p-4 md:p-6 shadow-2xl border border-gray-700 animate-fadeIn max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-white">
                Add a New Goal
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-300">
                Goal Title
              </label>
              <input
                type="text"
                name="title"
                value={newGoal.title}
                onChange={handleInputChange}
                placeholder="Enter goal title"
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={newGoal.description}
                onChange={handleInputChange}
                placeholder="Describe your goal"
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 md:h-24 text-sm md:text-base"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-300">
                Priority
              </label>
              <div className="flex gap-2">
                {["low", "medium", "high"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setNewGoal({ ...newGoal, priority })}
                    className={`flex-1 py-2 rounded-md capitalize text-xs md:text-sm ${
                      newGoal.priority === priority
                        ? `${getPriorityColor(priority)} text-white`
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-1 md:mb-2 text-sm font-medium text-gray-300">
                Target Date
              </label>
              <input
                type="date"
                name="targetDate"
                value={newGoal.targetDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-md transition-colors duration-300 text-sm md:text-base"
              >
                Save Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Not Admin" Message */}
      {isNotAdmin && (
        <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 p-4 rounded-lg shadow-lg text-white text-sm">
          <p>Only administrators can add or modify goals.</p>
        </div>
      )}
    </div>
  );
};

export default FutureGoalsTracker;
