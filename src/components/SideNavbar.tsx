import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "@store/slices/viewSlice";
import { MdSettings } from "react-icons/md";
import { GrStorage } from "react-icons/gr";
import { GrDocumentText } from "react-icons/gr";
import { TbCards } from "react-icons/tb";

type SideBarIconProps = {
  icon: React.ReactNode;
  text: string;
};

const SideNavbar = () => {
  const dispatch = useDispatch();
  return (
    <div className="w-9 h-full flex flex-col justify-between items-center border-r split-line bg-emphasis icon-theme-primary">
      <div className="flex flex-col justify-evenly items-center h-20">
        <button onClick={() => dispatch(setCurrentView("reading"))}>
          <SideBarIcon icon={<GrDocumentText />} text="Reading" />
        </button>
        <button onClick={() => dispatch(setCurrentView("reviewing"))}>
          <SideBarIcon icon={<TbCards />} text="Reviewing" />
        </button>
      </div>
      <div className="flex flex-col justify-evenly items-center  h-20">
        <button onClick={() => dispatch(setCurrentView("dashboard"))}>
          <SideBarIcon icon={<GrStorage />} text="Dashboard" />
        </button>
        <button onClick={() => dispatch(setCurrentView("setting"))}>
          <SideBarIcon icon={<MdSettings />} text="Setting" />
        </button>
      </div>
    </div>
  );
};

const SideBarIcon: React.FC<SideBarIconProps> = ({ icon, text }) => {
  return (
    <div className="group relative flex items-center justify-center h-8 w-8 bg-emphasis icon-theme-primary hover:bg-theme-primary hover:text-white rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer">
      {icon}
      {text && (
        <span className="text-shadow  absolute w-auto p-1 m-2 min-w-max left-14 rounded-md shadow-md text-theme-base text-xs font-bold transition-all duration-100 scale-0 opacity-0 origin-left group-hover:scale-100 group-hover:opacity-100">
          {text}
        </span>
      )}
    </div>
  );
};

export default SideNavbar;
