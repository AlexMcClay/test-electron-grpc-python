import { BrowserWindow } from "electron";
const path = require("path");

class SplashScreen {
  private splashScreen: BrowserWindow | null;

  constructor() {
    this.splashScreen = null;
  }

  create() {
    this.splashScreen = new BrowserWindow(
      Object.assign({
        width: 500,
        height: 200,
        icon: path.join(__dirname, "../../../public/icons/icon.png"),
        frame: false,
        show: false,
      })
    );
    this.splashScreen.setResizable(false);
    console.log(__dirname);
    this.splashScreen.loadURL(
      "file://" + __dirname + "/../../splash/index.html"
    );
    this.splashScreen.on("closed", () => (this.splashScreen = null));
    this.splashScreen.webContents.on("did-finish-load", () => {
      if (this.splashScreen) {
        this.splashScreen.show();
      }
    });
  }

  destroy() {
    if (!this.splashScreen) return;
    this.splashScreen.close();
    this.splashScreen = null;
  }
}

export const splashScreen = new SplashScreen();
