import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSelector } from "react-redux";
import { RootState } from "@store/store";
import { FileExplorer } from "@components/FileExplorer";
import { ReadingPanel } from "@components/ReadingPanel";
import WordExplorer from "@/components/WordExplorer";
import { switchLeftPanelState } from "@/store/slices/viewSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ReadingSupportPanel from "@/components/readingSupportPanel";

export default function ReadingPage(): React.JSX.Element {
  const dispatch = useDispatch();

  const leftPanelState = useSelector(
    (state: RootState) => state.view.leftPanelState
  );

  const selectedWord = useSelector(
    (state: RootState) => state.reading.selectedWord
  );

  const selectedSentence = useSelector(
    (state: RootState) => state.reading.selectedSentence
  );

  useEffect(()=>{
    if(selectedWord.trim()&&leftPanelState !== 'dictionary'){
      dispatch(switchLeftPanelState());
    }
  },[selectedWord, leftPanelState, dispatch])

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
            
            <ReadingSupportPanel selectedWord={selectedWord} selectedSentence={selectedSentence} />
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
}
