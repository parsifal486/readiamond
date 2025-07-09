import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentView } from "@store/slices/viewSlice";

const SideNavbar = () => {
  const dispatch = useDispatch();
  return (
    <div className="w-26 h-full bg-gray-100">
      SideNavbar
      <div>
        <button onClick={() => dispatch(setCurrentView("reading"))}>
          Reading
        </button>
      </div>
      <div>
        <button onClick={() => dispatch(setCurrentView("reviewing"))}>
          Reviewing
        </button>
      </div>
      <div>
        <button onClick={() => dispatch(setCurrentView("setting"))}>
          Setting
        </button>
      </div>
      <div>
        <button onClick={() => dispatch(setCurrentView("dashboard"))}>
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default SideNavbar;
