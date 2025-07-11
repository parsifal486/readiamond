import SideNavbar from "@components/SideNavbar";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ReviewingPage from "./pages/ReviewingPage";
import ReadingPage from "./pages/ReadingPage";
import { useSelector } from "react-redux";
import { ViewState } from "@sharedTypes/appGeneral";
import { AppSettings } from "@sharedTypes/setting";
import { RootState } from "@store/store";
import TitleBar from "@components/TitleBar";
import { useState } from "react";

function App() {
  const [theme, setTheme] = useState<string>("light");

  // View State to control pages displayed in the app
  const viewState: ViewState = useSelector(
    (state: RootState) => state.view.currentView
  );

  // Get all settings from the main process
  window.settings.getAllSettings().then((setting: AppSettings) => {
    console.log(setting);
    setTheme(setting.theme);
  });

  //window resize event
  window.addEventListener("resize", () => {
    console.log("window resized");
  });

  // Render the app
  return (
    <div className={`w-full h-full flex flex-col ${theme}`}>
      <TitleBar className="w-full h-8" />
      <div className="w-full h-full relative flex flex-row bg-main ">
        <SideNavbar />
        {viewState === "dashboard" && <DashboardPage />}
        {viewState === "reviewing" && <ReviewingPage />}
        {viewState === "setting" && <SettingPage />}
        {viewState === "reading" && <ReadingPage />}
      </div>
    </div>
  );
}

export default App;
