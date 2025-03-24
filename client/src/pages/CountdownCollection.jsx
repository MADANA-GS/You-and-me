import React, {
  useState,
  useEffect,
  useCallback,
  memo,
  useContext,
} from "react";
import { PlusCircle, X } from "lucide-react";
import axios from "axios";
import FlipCountdown from "../components/CountdownTimer";
import { AuthContext } from "../context/AuthContext";

const CountdownItem = memo(({ countdown }) => {
  const completed = new Date(countdown.date) <= new Date();
  const { auth } = useContext(AuthContext);

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-800 bg-black w-full">
      <div className="p-2 sm:p-4 text-center">
        {completed ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10">
            <div className="text-4xl sm:text-5xl text-white font-bold mb-4">
              COMPLETED!
            </div>
            <div className="text-xl sm:text-2xl">{countdown.message}</div>
          </div>
        ) : (
          <div className="py-2 sm:py-6 w-full flex justify-center items-center">
            <FlipCountdown
              targetDate={countdown.date}
              message={countdown.message}
            />
          </div>
        )}
      </div>
      <div className="p-2 sm:p-3 bg-white text-black text-center">
        <p className="text-base sm:text-lg font-semibold truncate">
          {countdown.message}
        </p>
        <p className="text-xs truncate">
          {new Date(countdown.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
});

const CountdownCollection = () => {
  const [countdowns, setCountdowns] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { auth } = useContext(AuthContext);
  const [role, setRole] = useState("user");
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND}/timer`)
      .then((response) => setCountdowns(response.data.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    setRole(auth.role);
    console.log(auth);
  }, [auth]);

  const handleAddCountdown = async () => {
    if (!newDate || !newMessage) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND}/timer`, {
        date: newDate,
        message: newMessage,
      });
      setCountdowns([...countdowns, response.data.data]);
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error adding countdown:", error);
    }
  };

  return (
    <div className="min-h-screen md:mt-12 mt-16 bg-black text-white p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Countdown Timers
        </h1>
        {!isAddingNew && role === "admin" && (
          <button
            onClick={() => setIsAddingNew(true)}
            className="mb-4 flex items-center gap-2 bg-white text-black px-3 py-1 text-sm rounded hover:bg-gray-200"
          >
            <PlusCircle size={16} /> Add New
          </button>
        )}

        {isAddingNew && (
          <div className="bg-black p-6 border border-white rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold">Add New Countdown</h2>
            <label className="block text-sm mt-2">Target Date</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full bg-black border border-white p-2 rounded text-white"
            />
            <label className="block text-sm mt-2">Message</label>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full bg-black border border-white p-2 rounded text-white"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleAddCountdown}
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Save
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="border border-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4 w-full">
          {countdowns.map((countdown) => (
            <CountdownItem key={countdown._id} countdown={countdown} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountdownCollection;
