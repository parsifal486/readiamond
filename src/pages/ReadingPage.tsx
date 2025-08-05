import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { FileExplorer } from "@components/FileExplorer";
import { ReadingPanel } from "@components/ReadingPanel";
import WordExplorer from "@/components/WordExplorer";

export default function ReadingPage(): React.JSX.Element {
  const leftPanelState = useSelector(
    (state: RootState) => state.view.leftPanelState
  );

  return (
    <div className="w-full h-full bg-main">
      <PanelGroup direction="horizontal" className="w-full h-full">
        {/* Left Column */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-emphasis split-line flex flex-col">
            {leftPanelState === "file" ? (
              <FileExplorer />
            ) : (
              <WordExplorer />
            )}
          </div>
        </Panel>

        <PanelResizeHandle className="w-px border-split-line bg-split-line hover:bg-theme-primary transition-colors" />

        {/* Middle Column */}
        <Panel defaultSize={50} minSize={30}>
          <div className="h-full bg-main p-4">
            <ReadingPanel></ReadingPanel>
          </div>
        </Panel>

        <PanelResizeHandle className="w-px bg-split-line hover:bg-theme-primary transition-colors" />

        {/* Right Column */}
        <Panel defaultSize={25} minSize={15}>
          <div className="h-full bg-emphasis p-4 split-line">
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
