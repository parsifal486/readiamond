import { useEffect, useState } from "react";
import { File, NewFileState } from "@sharedTypes/fileOperat";
// import { IoIosAddCircleOutline } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { FaSortAmountUpAlt } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

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
    let fileName = "Untitled.txt";
    let count = 0;
    //  check if file untitled already exists if exists, add a number to the end of the file name
    while (files.find((file) => file.name === fileName)) {
      count++;
      fileName = `Untitled(${count}).txt`;
    }
    setNewFileState({
      isCreating: true,
      tempName: fileName,
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
    <div className="h-full flex flex-col">
      {files.length > 0 || newFileState.isCreating ? (
        // file display
        <div className="group flex h-full flex-col items-start justify-start">
          <div className="flex flex-1 flex-col items-start justify-start">
            {/* file list */}
            {files.map((file) => (
              <div className="w-full h-10 p-2" key={file.name}>
                {file.name}
              </div>
            ))}
            {/* if creating new file */}
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
          {/* functionbar */}
          <div className="flex flex-row items-center justify-between w-full h-9">
            <div
              onClick={startCreatingFile}
              className="group-hover:flex hidden h-9 w-9 transition-all duration-300 hover:cursor-pointer text-theme-muted hover:text-theme-strong  items-center justify-center"
            >
              <FaPlus className="w-4 h-4" />
            </div>
            {/* todo: sort */}
            <div className="hidden h-9 w-9 transition-all duration-300 hover:cursor-pointer text-theme-muted hover:text-theme-strong  items-center justify-center ">
              <FaSortAmountUpAlt className="w-4 h-4" />
            </div>
          </div>
        </div>
      ) : (
        // create new file tip
        <div className="flex flex-col items-center justify-center h-full mb-20">
          <div
            className=" hover:cursor-pointer hover:text-shadow p-4 rounded-md flex flex-col items-center justify-center"
            onClick={() => {
              startCreatingFile();
            }}
          >
            <div className="text-sm text-theme-base">file not found</div>
            <FaPlus className="w-20 h-20" />
            <div className="text-sm text-theme-base">click to create</div>
          </div>
        </div>
      )}
    </div>
  );
};
