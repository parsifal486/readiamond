import { setFileContent } from "@/store/slices/fileSlice";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { TxtRenderer } from "./txtViewer/TxtRenderer";
import { MarkdownRenderer } from "./markdownViewer/MarkdownRenderer";

type fileType = "txt" | "md";

export const ReadingPanel = () => {
  //redux state
  const dispatch = useDispatch();
  const mainViewState = useSelector(
    (state: RootState) => state.view.mainViewState
  );
  const currentFileContent = useSelector(
    (state: RootState) => state.file.currentFileContent
  );

  const currentFile = useSelector((state: RootState) => state.file.currentFile);

  const [fileType, setFileType] = useState<fileType>("txt");

  const debouncedSaveFile = debounce((content: string, filePath: string) => {
    window.fileManager.saveFile(filePath, content);
  }, 1000);

  useEffect(() => {
    console.log("currentFile=====>", currentFile);
    //prase the file name and get the file type
    if (currentFile?.name.split(".")[1] === "txt") {
      setFileType("txt");
    } else {
      setFileType("md");
    }
  }, [currentFile]);

  //render the file content
  //edit mode
  if (mainViewState === "editing") {
    return (
      <textarea
        className="w-full h-full bg-theme-base text-theme-base focus:outline-none"
        value={currentFileContent || ""}
        onChange={(e) => {
          dispatch(setFileContent(e.target.value));
          debouncedSaveFile(e.target.value, currentFile?.path || "");
        }}
      />
    );
  } else {
    //reading mode
    if (fileType === "txt") {
      return <TxtRenderer content={currentFileContent || ""} />;
    } else {
      return <MarkdownRenderer content={currentFileContent || ""} />;
    }
  }
};



