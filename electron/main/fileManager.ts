import { readdir, readFile, unlink } from "node:fs/promises";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { app } from "electron";
import { getSetting, setSetting } from "./settingManager";
import { File } from "@sharedTypes/fileOperat";
import { ipcMain } from "electron";

export class FileManager {
  workingDirectory: string;
  files: File[] = [];

  constructor() {
    this.workingDirectory = getSetting('workingDirectory') as string;

    //check the validation of the working directory. if not valid, set the default working directory to user documents
    if (!this.workingDirectory || this.workingDirectory.trim() === '') {
      this.workingDirectory = path.join(app.getPath('documents'), 'ReadiaMond');
      setSetting('workingDirectory', this.workingDirectory);
    }

    this.initialize();
  }

  private async initialize() {
    if (this.workingDirectory && this.workingDirectory.trim() !== '') {
      this.getFiles()
        .then(files => {
          if (files.length > 0) {
            this.files = files;
          }
        })
        .catch(error => {
          console.error('Error loading files:', error);
          this.files = [];
        });
    }
  }

  //function for filemanager
  async getFiles(): Promise<File[]> {
    const fileNames = await readdir(this.workingDirectory);
    const files: File[] = [];
    for (const fileName of fileNames) {
      //filt md and text
      if (fileName.endsWith('.md') || fileName.endsWith('.txt')) {
        const filePath = path.join(this.workingDirectory, fileName);
        files.push({ name: fileName, path: filePath });
      }
    }
    return files;
  }

  //public function
  async getFileContentTable(): Promise<File[]> {
    return this.files;
  }

  async createFile(fileName: string): Promise<File | null> {
    //check the extension name
    //if not md or txt, add or replace with .md
    if (!fileName.endsWith('.md') && !fileName.endsWith('.txt')) {
      if (fileName.includes('.')) {
        fileName = fileName.replace(/\.[^.]+$/, '.txt');
      } else {
        fileName = fileName + '.txt';
      }
    }

    const filePath = path.join(this.workingDirectory, fileName);
    try {
      await writeFile(filePath, '');
      return { name: fileName, path: filePath };
    } catch (error) {
      console.error('Error creating file:', error);
      return null;
    }
  }

  async refreshFiles() {
    this.files = await this.getFiles();
  }

  async getFileContent(filePath: string) {
    return await readFile(filePath, 'utf8');
  }

  async saveFile(filePath: string, content: string) {
    try {
      await writeFile(filePath, content);
      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await unlink(filePath);
      // Refresh the file list after deletion
      await this.refreshFiles();
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  registerIPC() {
    ipcMain.handle('get-file-content-table', async () => {
      return this.getFileContentTable();
    });

    ipcMain.handle('create-file', async (_, fileName: string) => {
      return this.createFile(fileName);
    });

    ipcMain.handle('get-file-content', async (_, filePath: string) => {
      return this.getFileContent(filePath);
    });

    ipcMain.handle(
      'save-file',
      async (_, filePath: string, content: string) => {
        return this.saveFile(filePath, content);
      }
    );

    ipcMain.handle('delete-file', async (_, filePath: string) => {
      return this.deleteFile(filePath);
    });
  }
}

const fileManager = new FileManager();
//register ipc

export default fileManager;