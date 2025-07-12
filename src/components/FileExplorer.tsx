import { useEffect, useState } from "react";
import { File } from "@sharedTypes/fileOperat";

export const FileExplorer = () => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await window.fileManager.getFileContentTable();
      console.log("files=======================>", files);
      setFiles(files);
    };
    fetchFiles();
  }, []);

  return (
    <div>
      {files.length > 0 ? (
        <div>
          {files.map((file) => (
            <div key={file.name}>{file.name}</div>
          ))}
        </div>
      ) : (
        <div>file not found</div>
      )}
    </div>
  );
};
