import { readdir } from "node:fs/promises";
import path from "node:path";
import { getSetting } from "./settingManager";
import { File } from "@sharedTypes/fileOperat";
import { ipcMain } from "electron";

export class FileManager {
  workingDirectory: string;
  files: File[] = [];
  
  constructor() {
    this.workingDirectory = getSetting("workingDirectory") as string;
    console.log("workingDirectory=======================>",this.workingDirectory);
    this.initialize();
  }

  private async initialize(){
    if(this.workingDirectory && this.workingDirectory.trim() !== ""){
      this.getFiles().then((files) => {
        if(files.length > 0){
          this.files = files;
      }
    }).catch((error) => {
      console.error("Error loading files:", error);
      this.files = [];
    });
  }}

  //function for filemanager
  async getFiles(): Promise<File[]> {
    const fileNames = await readdir(this.workingDirectory);
    const files: File[] = [];
    for(const fileName of fileNames){
      //filt md and text
      if(fileName.endsWith(".md") || fileName.endsWith(".txt")){
        const filePath = path.join(this.workingDirectory, fileName);
        files.push({name: fileName, path: filePath, extension: path.extname(fileName)});
      }
    }
    return files;
  }


  //public function
  async getFileContentTable(): Promise<File[]> {
    return this.files;
  }

  async refreshFiles(){
    this.files = await this.getFiles();
  }

  registerIPC(){
    ipcMain.handle('get-file-content-table', async () => {
      return this.getFileContentTable();
    })
  }
}

const fileManager = new FileManager();
//register ipc

export default fileManager;