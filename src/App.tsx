import { useState } from "react";
import SideNavbar from "./components/SideNavbar";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ReviewingPage from "./pages/ReviewingPage";
import ReadingPage from "./pages/ReadingPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="w-full h-full relative">
      <SideNavbar />

      <DashboardPage />
      <ReviewingPage />
      <SettingPage />
      <ReadingPage />
    </div>  
  );
}

export default App;
