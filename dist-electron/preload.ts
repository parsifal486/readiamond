"use strict";
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("ipcRenderer", {
  
});
