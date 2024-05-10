import { electronAPI } from "../main/src/preload";

declare global {
  interface Window {
    electronAPI: typeof electronAPI;
  }
}

export {};
