import { useEffect, useState } from "react";
import { File, NewFileState } from "@sharedTypes/fileOperat";
import { IoIosAddCircleOutline } from "react-icons/io";

export const FileExplorer = () => {
  const [files, setFiles] = useState<File[]>([]);

  const [newFileState, setNewFileState] = useState<NewFileState>({
    isCreating: false,
    tempName: "",
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await window.fileManager.getFileContentTable();
      setFiles(files);
    };
    fetchFiles();
  }, []);

  const startCreatingFile = () => {
    console.log("todo-feature: create new file");
    setNewFileState({
      isCreating: true,
      tempName: "Untitled",
    });
  };

  // const cancelCreatingFile = () => {
  //   setNewFileState({
  //     isCreating: false,
  //     tempName: "",
  //   });
  // };

  const confirmCreatingFile = async () => {
    if (newFileState.tempName === "") {
      alert("file name cannot be empty");
      return;
    }

    try {
      const result = await window.fileManager.createFile(newFileState.tempName);
      if (result) {
        setFiles([
          ...files,
          {
            name: newFileState.tempName,
            path: result.path,
            extension: result.extension,
          },
        ]);
        setNewFileState({
          isCreating: false,
          tempName: "",
        });
      }
    } catch (error) {
      alert("failed to create file");
    }
  };

  return (
    <div className="h-full">
      {files.length > 0 || newFileState.isCreating ? (
        // file list
        <div>
          {files.map((file) => (
            <div key={file.name}>{file.name}</div>
          ))}
          {newFileState.isCreating && (
            <div>
              <input
                type="text"
                value={newFileState.tempName}
                onChange={(e) => {
                  setNewFileState({
                    ...newFileState,
                    tempName: e.target.value,
                  });
                }}
                onBlur={() => {
                  confirmCreatingFile();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    confirmCreatingFile();
                  }
                }}
              />
            </div>
          )}
        </div>
      ) : (
        // create new file tip
        <div className="flex flex-col items-center justify-center h-full mb-20">
          <div
            className="hover:cursor-pointer hover:text-shadow p-4 rounded-md flex flex-col items-center justify-center"
            onClick={() => {
              startCreatingFile();
            }}
          >
            <div className="text-sm text-theme-base">file not found</div>
            <IoIosAddCircleOutline className="w-20 h-20" />
            <div className="text-sm text-theme-base">click to create</div>
          </div>
        </div>
      )}
    </div>
  );
};
