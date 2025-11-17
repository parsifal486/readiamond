import { useEffect, useState } from 'react';
import { File, NewFileState, RenamingFileState } from '@sharedTypes/fileOperat';
// import { IoIosAddCircleOutline } from "react-icons/io";
import { FaPlus } from 'react-icons/fa6';
import { FaSortAmountUpAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentFile, setFileContent } from '@/store/slices/fileSlice';
import { RiDeleteBin4Line } from 'react-icons/ri';
import { MdDriveFileRenameOutline } from 'react-icons/md';

export const FileExplorer = () => {
  const dispatch = useDispatch();
  const selectedFile = useSelector(
    (state: RootState) => state.file.currentFile
  ) as File | null;

  const [files, setFiles] = useState<File[]>([]);

  const [newFileState, setNewFileState] = useState<NewFileState>({
    isCreating: false,
    tempName: '',
  });

  const [renamingFileState, setRenamingFileState] = useState<RenamingFileState>(
    {
      isRenaming: false,
      originalFile: null,
      tempName: '',
    }
  );

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await window.fileManager.getFileContentTable();
      setFiles(files);
    };
    fetchFiles();
  }, []);

  const handleFileClick = async (file: File) => {
    dispatch(setCurrentFile(file));
    const fileContent = await window.fileManager.getFileContent(file.path);
    dispatch(setFileContent(fileContent));
  };

  const startCreatingFile = () => {
    console.log('todo-feature: create new file');
    let fileName = 'Untitled.txt';
    let count = 0;
    //  check if file untitled already exists if exists, add a number to the end of the file name
    while (files.find(file => file.name === fileName)) {
      count++;
      fileName = `Untitled(${count}).txt`;
    }

    // empty the current file
    dispatch(
      setCurrentFile({
        name: '',
        path: '',
      })
    );

    setNewFileState({
      isCreating: true,
      tempName: fileName,
    });
  };

  const confirmCreatingFile = async () => {
    if (newFileState.tempName === '') {
      alert('file name cannot be empty');
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
          },
        ]);
        setNewFileState({
          isCreating: false,
          tempName: '',
        });
        dispatch(
          setCurrentFile({
            name: newFileState.tempName,
            path: result.path,
          })
        );
      }
    } catch (error) {
      alert('failed to create file');
    }
  };

  const handleCreatingFileFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    const lastDotIndex = value.lastIndexOf('.');

    if (lastDotIndex > 0) {
      // 如果找到点且不在开头，选中点之前的部分
      input.setSelectionRange(0, lastDotIndex);
    } else {
      // 如果没有扩展名，选中全部
      input.select();
    }
  };

  const handleDeleteFile = async (file: File, e: React.MouseEvent) => {
    // Prevent triggering the file click event
    e.stopPropagation();

    // Confirm deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${file.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const success = await window.fileManager.deleteFile(file.path);

      if (success) {
        // Remove file from local state
        setFiles(files.filter(f => f.path !== file.path));

        // If the deleted file is currently selected, clear selection
        if (selectedFile?.path === file.path) {
          dispatch(setCurrentFile({ name: '', path: '' }));
          dispatch(setFileContent(''));
        }
      } else {
        alert('Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleRenameFile = (file: File, e: React.MouseEvent) => {
    // Prevent triggering the file click event
    e.stopPropagation();

    // Set the renaming state
    setRenamingFileState({
      isRenaming: true,
      originalFile: file,
      tempName: file.name,
    });
  };

  const confirmRenamingFile = async () => {
    if (!renamingFileState.originalFile) {
      return;
    }

    if (renamingFileState.tempName === '') {
      alert('File name cannot be empty');
      return;
    }

    // If the name hasn't changed, just cancel
    if (renamingFileState.tempName === renamingFileState.originalFile.name) {
      setRenamingFileState({
        isRenaming: false,
        originalFile: null,
        tempName: '',
      });
      return;
    }

    try {
      const result = await window.fileManager.renameFile(
        renamingFileState.originalFile.path,
        renamingFileState.tempName
      );

      if (result) {
        // Update the files list
        setFiles(
          files.map(f =>
            f.path === renamingFileState.originalFile!.path ? result : f
          )
        );

        // If the renamed file is currently selected, update the selected file
        if (selectedFile?.path === renamingFileState.originalFile.path) {
          dispatch(setCurrentFile(result));
        }

        // Reset the renaming state
        setRenamingFileState({
          isRenaming: false,
          originalFile: null,
          tempName: '',
        });
      } else {
        alert('Failed to rename file');
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      alert('Failed to rename file');
    }
  };

  const handleRenamingFileFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    const lastDotIndex = value.lastIndexOf('.');

    if (lastDotIndex > 0) {
      // Select the part before the extension
      input.setSelectionRange(0, lastDotIndex);
    } else {
      // Select all if no extension
      input.select();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {files.length > 0 || newFileState.isCreating ? (
        // file display
        <div className="group flex h-full flex-col items-start justify-start">
          <div className="flex flex-1 w-full flex-col items-start justify-start">
            {/* file list */}
            {files.map(file => {
              // Check if this file is being renamed
              const isRenaming =
                renamingFileState.isRenaming &&
                renamingFileState.originalFile?.path === file.path;

              return (
                <div
                  className={`group relative flex items-center justify-between w-full h-10 px-3 py-2 cursor-pointer transition-all duration-200 hover:bg-theme-secondary
        ${selectedFile?.name === file.name ? 'bg-main' : ''}
      `}
                  key={file.path}
                  onClick={() => {
                    if (!isRenaming) {
                      handleFileClick(file);
                    }
                  }}
                >
                  {isRenaming ? (
                    // Show input when renaming
                    <input
                      className="w-full box-border focus:outline-none bg-transparent text-theme-strong"
                      autoFocus
                      type="text"
                      value={renamingFileState.tempName}
                      onFocus={handleRenamingFileFocus}
                      onChange={e => {
                        setRenamingFileState({
                          ...renamingFileState,
                          tempName: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        confirmRenamingFile();
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          confirmRenamingFile();
                        } else if (e.key === 'Escape') {
                          // Cancel renaming
                          setRenamingFileState({
                            isRenaming: false,
                            originalFile: null,
                            tempName: '',
                          });
                        }
                      }}
                      onClick={e => e.stopPropagation()}
                    />
                  ) : (
                    <>
                      {/* Left: File name and extension */}
                      <div className="flex items-baseline gap-1 flex-1 min-w-0">
                        <span className="text-theme-strong truncate">
                          {file.name.split('.')[0]}
                        </span>
                        <span className="text-sm text-theme-muted flex-shrink-0">
                          .{file.name.split('.')[1]}
                        </span>
                      </div>

                      {/* Left: edit button -rename file */}
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 ml-2 rounded hover:bg-theme-primary flex-shrink-0"
                        onClick={e => handleRenameFile(file, e)}
                        title={`Rename ${file.name}`}
                      >
                        <MdDriveFileRenameOutline className="w-4 h-4 text-theme-muted hover:text-theme-strong" />
                      </button>
                      {/* Right: Delete button - only visible on hover */}
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 ml-2 rounded hover:bg-theme-primary flex-shrink-0"
                        onClick={e => handleDeleteFile(file, e)}
                        title={`Delete ${file.name}`}
                      >
                        <RiDeleteBin4Line className="w-4 h-4 text-theme-muted hover:text-theme-strong" />
                      </button>
                    </>
                  )}
                </div>
              );
            })}
            {/* if creating new file */}
            {newFileState.isCreating && (
              <div className="w-full h-10 p-2 pl-4 bg-main">
                <input
                  className="w-full box-border focus:outline-none"
                  autoFocus
                  type="text"
                  value={newFileState.tempName}
                  onFocus={handleCreatingFileFocus}
                  onChange={e => {
                    setNewFileState({
                      ...newFileState,
                      tempName: e.target.value,
                    });
                  }}
                  onBlur={() => {
                    confirmCreatingFile();
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
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
