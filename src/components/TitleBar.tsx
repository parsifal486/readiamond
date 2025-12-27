import { twMerge } from 'tailwind-merge';
import {
  LeftPanelState,
  MainPanelState,
  ViewState,
} from '@sharedTypes/appGeneral';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import {
  switchLeftPanelState,
  switchMainViewState,
} from '@/store/slices/viewSlice';
import { GrBook, GrTree, GrView, GrEdit } from 'react-icons/gr';
import { RootState } from '@/store/store';
import {
  VscChromeMinimize,
  VscChromeMaximize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';

export default function TitleBar({ className }: { className: string }) {
  const leftPanelState = useSelector(
    (state: RootState) => state.view.leftPanelState
  ) as LeftPanelState;
  const dispatch = useDispatch();

  const mainViewState = useSelector(
    (state: RootState) => state.view.mainViewState
  ) as MainPanelState;

  const currentViewState = useSelector(
    (state: RootState) => state.view.currentView
  ) as ViewState;

  const currentFile = useSelector(
    (state: RootState) => state.file.currentFile
  ) as File;

  const platform = useSelector((state: RootState) => state.settings.platform);
  const [isMaximized, setIsMaximized] = useState(false);

  // Check initial window state and listen for changes
  useEffect(() => {
    if (platform === 'win32' && window.windowControl) {
      // Get initial state
      window.windowControl.isMaximized().then(setIsMaximized);

      // Listen for maximize/unmaximize events
      window.windowControl.onMaximize(() => setIsMaximized(true));
      window.windowControl.onUnmaximize(() => setIsMaximized(false));

      // Cleanup listeners on unmount
      return () => {
        window.windowControl.removeMaximizeListeners();
      };
    }
  }, [platform]);

  const handleMinimize = () => {
    if (window.windowControl) {
      window.windowControl.minimize();
    }
  };

  const handleMaximize = () => {
    if (window.windowControl) {
      window.windowControl.maximize();
    }
  };

  const handleRestore = () => {
    if (window.windowControl) {
      window.windowControl.restore();
    }
  };

  const handleClose = () => {
    if (window.windowControl) {
      window.windowControl.close();
    }
  };

  return (
    <div
      className={twMerge(
        'flex flex-row bg-emphasis split-line border-b icon-theme-primary',
        className
      )}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex h-8 w-full">
        {/* space for traffic light on macos */}
        {platform === 'darwin' && (
          <div
            className="w-20 h-8 "
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          ></div>
        )}

        {/* left panel switcher and main view switcher*/}
        {currentViewState === 'reading' && (
          <div
            className="w-16 h-8 flex items-center justify-center"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <div
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => dispatch(switchLeftPanelState())}
            >
              <PanelSwicherButton
                icon={leftPanelState === 'file' ? <GrTree /> : <GrBook />}
              />
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => dispatch(switchMainViewState())}
            >
              <PanelSwicherButton
                icon={mainViewState === 'reading' ? <GrView /> : <GrEdit />}
              />
            </div>
          </div>
        )}

        {/* title */}
        <div className="flex-1 h-8 flex items-center justify-center text-theme-base text-sm select-none">
          {currentViewState === 'reading' && currentFile
            ? currentFile.name + '-' + mainViewState
            : 'readiamond'}
        </div>

        {/* windows control buttons on windows */}
        {platform === 'win32' && (
          <div
            className="w-24 h-8 flex items-center justify-end"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            <WindowControlButton onClick={handleMinimize}>
              <VscChromeMinimize />
            </WindowControlButton>
            {isMaximized ? (
              <WindowControlButton onClick={handleRestore}>
                <VscChromeRestore />
              </WindowControlButton>
            ) : (
              <WindowControlButton onClick={handleMaximize}>
                <VscChromeMaximize />
              </WindowControlButton>
            )}
            <WindowControlButton onClick={handleClose} isClose>
              <VscChromeClose />
            </WindowControlButton>
          </div>
        )}
      </div>
    </div>
  );
}

const PanelSwicherButton: React.FC<{ icon: React.ReactNode }> = ({ icon }) => {
  return (
    <div className="group relative flex items-center justify-center h-7 w-7 bg-emphasis icon-theme-primary hover:bg-theme-primary hover:text-white rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer">
      {icon}
    </div>
  );
};

const WindowControlButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
  isClose?: boolean;
}> = ({ children, onClick, isClose = false }) => {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <button
        className={`w-8 h-8 flex items-center justify-center hover:bg-opacity-10 ${
          isClose
            ? 'hover:bg-red-500 hover:text-white'
            : 'hover:bg-theme-primary hover:bg-opacity-20'
        } transition-colors duration-150`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
};
