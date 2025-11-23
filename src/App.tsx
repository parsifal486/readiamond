import SideNavbar from '@components/SideNavbar';
import DashboardPage from './pages/DashboardPage';
import SettingPage from './pages/SettingPage';
import ReviewingPage from './pages/ReviewingPage';
import ReadingPage from './pages/ReadingPage';
import { useSelector } from 'react-redux';
import { ViewState } from '@sharedTypes/appGeneral';
import { AppSettings } from '@sharedTypes/setting';
import { RootState } from '@store/store';
import TitleBar from '@components/TitleBar';
import { useEffect } from 'react';
import { loadSettings } from '@store/slices/settingsSlice';
import { useDispatch } from 'react-redux';
import PopupNotice from '@components/PopupNotice';

function App() {
  const theme = useSelector((state: RootState) => state.settings.theme);
  const dispatch = useDispatch();
  const hasNotices = useSelector(
    (state: RootState) => state.notice.notices.length > 0
  );

  // redux viewState to control pages displayed in the app
  const viewState: ViewState = useSelector(
    (state: RootState) => state.view.currentView
  );

  useEffect(() => {
    // Get all settings from the main process
    const initializeApp = async () => {
      try {
        const settings: AppSettings = await window.settings.getAllSettings();
        dispatch(loadSettings(settings));
      } catch (error) {
        console.error(
          'App.tsx: getAllSettings error=======================>',
          error
        );
      }
    };
    initializeApp();
  }, [dispatch]);

  //window resize event
  window.addEventListener('resize', () => {
    console.log('window resized');
  });

  // Render the app
  return (
    <div className={`w-full h-full flex flex-col ${theme} relative`}>
      {hasNotices && (
        <div className="fixed z-50 top-0 right-0 w-60">
          <PopupNotice />
        </div>
      )}
      <TitleBar className="w-full h-8" />
      <div className="absolute top-8 left-0 right-0 bottom-0 flex flex-row bg-main">
        <SideNavbar />
        {viewState === 'dashboard' && <DashboardPage />}
        {viewState === 'reviewing' && <ReviewingPage />}
        {viewState === 'setting' && <SettingPage />}
        {viewState === 'reading' && <ReadingPage />}
      </div>
    </div>
  );
}

export default App;
