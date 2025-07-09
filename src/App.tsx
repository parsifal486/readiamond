import SideNavbar from "@components/SideNavbar";
import DashboardPage from "./pages/DashboardPage";
import SettingPage from "./pages/SettingPage";
import ReviewingPage from "./pages/ReviewingPage";
import ReadingPage from "./pages/ReadingPage";
import { useSelector } from "react-redux";
import { ViewState } from "@sharedTypes/appUi";
import { RootState } from "@store/store";
import TitleBar from "@components/TitleBar";

function App() {
  const viewState: ViewState = useSelector(
    (state: RootState) => state.view.currentView
  );
  return (
    <div className="w-full h-full flex flex-col ">
      <TitleBar className="w-full h-8 bg-gray-100" />
      <div className="w-full h-full relative flex flex-row ">
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
