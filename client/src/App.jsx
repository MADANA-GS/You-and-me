import { Route, Routes } from "react-router-dom";
import FirstPage from "./pages/FirstPage";
import HeartMessage from "./pages/Heartmessage";
import Layout from "./pages/Layout";
import Aurora from "./pages/Aurora";
import MemoryGallery from "./pages/MemoryGallery";
import MemoryStoryPage from "./pages/MemoryStoryPage";
import MemoryUploadForm from "./pages/MemoryUploadForm";
import CountdownCollection from "./pages/CountdownCollection";
import AngryRoom from "./pages/AngryRoom";
import { AuthProvider } from "./context/AuthContext";
import DarkRomanticWeather from "./pages/DarkRomanticWeather";
import FutureGoalsTracker from "./pages/FutureGoalsTracker";

const App = () => {
  return (
    <div className="w-full min-h-screen bg-black fonter overflow-y-scroll  overflow-x-hidden">
        <Routes>
          {/* Wrap all pages inside Layout so Navbar is always present */}
          <Route path="/" element={<Layout />}>
            <Route index element={<FirstPage />} />
            <Route path="/aurora" element={<Aurora />} />
            <Route path="/memory" element={<MemoryGallery />} />
            <Route path="/memory/:id" element={<MemoryStoryPage />} />
            <Route path="/countdown" element={<CountdownCollection />} />
            <Route path="/weather" element={<DarkRomanticWeather />} />
            <Route path="/angryroom" element={<AngryRoom />} />
            <Route path="/goal" element={<FutureGoalsTracker />} />
            <Route path="/add-memory" element={<MemoryUploadForm />} />
            <Route path="/music-room" element={<HeartMessage />} />
          </Route>
        </Routes>
    </div>
  );
};

export default App;
