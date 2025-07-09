import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function ReadingPage(): React.JSX.Element {
  return (
    <div className="w-full h-full bg-main">
      <PanelGroup direction="horizontal" className="w-full h-full">
        {/* Left Column */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-emphasis p-4 border-r split-line">
            <h3 className="text-theme-primary font-semibold mb-4">
              Left Panel
            </h3>
            <p className="text-theme-base">Content for left column</p>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px border-split-line bg-split-line hover:bg-theme-primary transition-colors" />

        {/* Middle Column */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-main p-4">
            <h3 className="text-theme-primary font-semibold mb-4">
              Main Content
            </h3>
            <p className="text-theme-base">Content for middle column</p>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-split-line hover:bg-theme-primary transition-colors" />

        {/* Right Column */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-emphasis p-4 border-l split-line">
            <h3 className="text-theme-primary font-semibold mb-4">
              Right Panel
            </h3>
            <p className="text-theme-base">Content for right column</p>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
