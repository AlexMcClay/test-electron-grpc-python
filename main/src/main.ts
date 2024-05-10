// Main File for Electron

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import serve from "electron-serve";

import { replaceTscAliasPaths } from "tsc-alias";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import fs from "fs";

// GRPC
import { credentials } from "@grpc/grpc-js";
import { GreeterClient } from "./services/grpc/helloworld_grpc_pb";
import { HelloRequest } from "./services/grpc/helloworld_pb";

replaceTscAliasPaths();

require("dotenv").config({
  path: app.isPackaged
    ? path.join(process.resourcesPath, ".env")
    : path.resolve(process.cwd(), ".env"),
});

function handleSetTitle(event: any, title: string) {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win !== null) {
    win.setTitle(title);
  }
}

// Loading Screen
let splash: BrowserWindow | null;
const createSplashScreen = () => {
  /// create a browser window
  splash = new BrowserWindow(
    Object.assign({
      width: 200,
      height: 100,
      /// remove the window frame, so it will become a frameless window
      frame: false,
    })
  );
  splash.setResizable(false);
  console.log(__dirname);
  splash.loadURL("file://" + __dirname + "/../splash/index.html");
  splash.on("closed", () => (splash = null));
  splash.webContents.on("did-finish-load", () => {
    if (splash) {
      splash.show();
    }
  });
};

// run renderer
const isProd = process.env.NODE_ENV !== "development";
if (isProd) {
  serve({ directory: "renderer/out" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      devTools: !isProd,
    },
    show: false,
  });

  // Expose URL
  if (isProd) {
    win.loadURL("app://./home.html");
  } else {
    // const port = process.argv[2];
    win.loadURL("http://localhost:3000/");
  }

  win.webContents.on("did-finish-load", () => {
    /// then close the loading screen window and show the main window
    if (splash) {
      splash.close();
    }
    // win.maximize();
    win.show();
  });
};

let pythonServer: ChildProcessWithoutNullStreams | null = null;
const portPath = path.join(app.getPath("documents"), "app", "port.txt");

// ///////////////////////////////////////////////
// get python file path
const pythonPath = path.join(__dirname, "../../py_layer/greeter_server.py");

app.whenReady().then(async () => {
  ipcMain.on("set-title", handleSetTitle);

  // start python server
  pythonServer = spawn("python", [pythonPath]);
  pythonServer.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // get the port of the server by reading /Documents/app/port.txt
  const port = await readPortFile(portPath);
  console.log("PORT: ", port);
  const stub = new GreeterClient(
    "localhost:" + port,
    credentials.createInsecure()
  );

  const req = new HelloRequest();
  req.setName("Electron");
  stub.sayHello(req, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log(response.getMessage());
    }
  });

  createSplashScreen();
  console.log(pythonPath);
  console.log("PATH", pythonPath);
  // createWindow();
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  app.quit();
  // terminate ptyhon server
  pythonServer?.kill();
});

// CLEANUP

// Handle parent exit events
process.on("exit", (code) => {
  console.log(`Parent process is exiting with code ${code}`);
  pythonServer?.kill(); // Kill the child process when parent exits
});

process.on("SIGINT", () => {
  console.log("Received SIGINT. Exiting.");
  pythonServer?.kill(); // Ensure the child process is killed when you interrupt the process
  process.exit(0); // Exit the parent process cleanly
});

function readPortFile(
  portPath: string,
  maxAttempts: number = 5,
  currentAttempt: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(portPath, "utf8", (err, data) => {
      if (err) {
        if (err.code === "ENOENT" && currentAttempt < maxAttempts) {
          // If file doesn't exist and we haven't reached max attempts, wait 1 second and try again
          console.error(
            `File not found, attempt ${currentAttempt}. Retrying in 1 second...`
          );
          setTimeout(
            () =>
              resolve(readPortFile(portPath, maxAttempts, currentAttempt + 1)),
            1000
          );
        } else {
          // If file doesn't exist and we've reached max attempts, or if there's another error, reject the promise
          reject(err);
        }
      } else {
        // console.log("PORT: ", data);
        resolve(data);
      }
    });
  });
}
