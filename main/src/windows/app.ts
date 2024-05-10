import { BrowserWindow } from "electron";
import path from "path";
import { isProd } from "@utils/index";
import { splashScreen } from "./splash";

class AppWindow {
  private mainWindow: BrowserWindow | null;

  constructor() {
    this.mainWindow = null;
  }

  create() {
    this.mainWindow = new BrowserWindow({
      webPreferences: {
        preload: path.join(__dirname, "../preload.js"),
        devTools: !isProd,
        webSecurity: true,
      },
      icon: path.join(__dirname, "../../public/icons/icon.png"),
      show: false,
      minWidth: 500,
      minHeight: 500,
    });

    if (isProd) {
      this.mainWindow.loadURL("app://./index.html");
    } else {
      this.mainWindow.loadURL("http://localhost:3000/");
    }

    this.mainWindow.webContents.on("did-finish-load", () => {
      splashScreen.destroy();
      if (this.mainWindow) {
        this.mainWindow.show();
      }
    });

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
  }

  destroy() {
    if (!this.mainWindow) return;
    this.mainWindow.close();
    this.mainWindow = null;
  }
}

export const appWindow = new AppWindow();
