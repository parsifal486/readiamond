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

  //const theme = "dark";
  const theme = "light";
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
