import { twMerge } from "tailwind-merge";
import {
  LeftPanelState,
  MainPanelState,
  ViewState,
} from "@sharedTypes/appGeneral";
import { useDispatch, useSelector } from "react-redux";

import {
  switchLeftPanelState,
  switchMainViewState,
} from "@/store/slices/viewSlice";
import { GrBook, GrTree, GrView, GrEdit } from "react-icons/gr";
import { RootState } from "@/store/store";

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

  return (
    <div
      className={twMerge(
        "flex flex-row bg-emphasis split-line border-b icon-theme-primary",
        className
      )}
      style={{ WebkitAppRegion: "drag" } as React.CSSProperties}
    >
      <div className="flex h-8 w-full">
        {/* space for traffic light */}
        <div
          className="w-20 h-8 "
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        ></div>

        {/* left panel switcher and main view switcher*/}
        {currentViewState === "reading" && (
          <div
            className="w-16 h-8 flex items-center justify-center"
            style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
          >
            <div
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => dispatch(switchLeftPanelState())}
            >
              <PanelSwicherButton
                icon={leftPanelState === "file" ? <GrTree /> : <GrBook />}
              />
            </div>
            <div
              className="w-8 h-8 flex items-center justify-center"
              onClick={() => dispatch(switchMainViewState())}
            >
              <PanelSwicherButton
                icon={mainViewState === "reading" ? <GrView /> : <GrEdit />}
              />
            </div>
          </div>
        )}

        {/* title */}
        <div className="flex-1 h-8 flex items-center justify-center text-theme-base text-sm">
          {currentFile ? currentFile.name + "-" + mainViewState : "readiamond"}
        </div>

        {/* left panel switcher */}
        <div
          className="w-24 h-8 "
          style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}
        ></div>
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
