import { twMerge } from "tailwind-merge";
import { leftPanelState } from "@sharedTypes/appGeneral";
import { useDispatch, useSelector } from "react-redux";

import { switchLeftPanelState } from "@store/slices/readingLefPanel";
import { GrBook, GrTree } from "react-icons/gr";
import { RootState } from "@/store/store";

export default function TitleBar({ className }: { className: string }) {
  const leftPanelState = useSelector(
    (state: RootState) => state.readingLeftPanel.leftPanelState
  );
  const dispatch = useDispatch();

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

        {/* left panel switcher */}
        <div className="w-8 h-8 flex items-center justify-center" style={{ WebkitAppRegion: "no-drag" } as React.CSSProperties}>
          <div
            className="w-8 h-8 flex items-end justify-center"
            onClick={() => dispatch(switchLeftPanelState())}
          >
            <LeftPanelSwicherButton
              icon={leftPanelState === "file" ? <GrTree /> : <GrBook />}
            />
          </div>
        </div>

        {/* title */}
        <div className="flex-1 h-8 flex items-center justify-center text-theme-base text-sm">
          readiamond
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

const LeftPanelSwicherButton: React.FC<{ icon: React.ReactNode }> = ({
  icon,
}) => {
  return <div className="w-8 h-8 flex items-center justify-center">{icon}</div>;
};
