// Main File for Electron

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import serve from "electron-serve";

import { replaceTscAliasPaths } from "tsc-alias";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { getPortPromise } from "portfinder";

// GRPC
import { credentials } from "@grpc/grpc-js";
import { GreeterClient } from "./services/grpc/helloworld_grpc_pb";
import { splashScreen } from "./windows/splash";
import { appWindow } from "./windows/app";
import { PyLayerService } from "@services/pyLayer";
import { handlePyLayer } from "./ipcMain/pyLayer";

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

// run renderer
const isProd = process.env.NODE_ENV !== "development";
if (isProd) {
  serve({ directory: "renderer/out" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

let pythonServer: ChildProcessWithoutNullStreams | null = null;

// ///////////////////////////////////////////////
// get python file path
const pythonPath = path.join(__dirname, "../../py_layer/greeter_server.py");
let stub: GreeterClient | null = null;

app.whenReady().then(async () => {
  ipcMain.on("set-title", handleSetTitle);
  const port = await getUnusedPort();
  console.log("PORT: ", port);

  // start python server
  pythonServer = spawn("python", [pythonPath, `${port}`]);
  pythonServer.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
  });

  // on error
  pythonServer.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  const stubtemp = await connectWithRetry(5, 1, port);
  stub = stubtemp as GreeterClient;

  const pyService = new PyLayerService();
  pyService.sayHello("IM Electron").then((res) => {
    console.log("Response from Python Server: ", res);
  });

  splashScreen.create();
  appWindow.create();

  handlePyLayer();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) appWindow.create();
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

process.on("SIGTERM", () => {
  console.log("Received SIGTERM. Exiting.");
  pythonServer?.kill(); // Ensure the child process is killed when you interrupt the process
  process.exit(0); // Exit the parent process cleanly
});

async function getUnusedPort() {
  const port = await getPortPromise();
  console.log(`Unused port found: ${port}`);
  return port;
}

async function connectWithRetry(
  attempts: number,
  interval: number,
  port: number
) {
  for (let i = 0; i < attempts; i++) {
    try {
      // Add a delay before each connection attempt
      await new Promise((resolve) => setTimeout(resolve, interval * 1000));

      const stub = new GreeterClient(
        "localhost:" + port,
        credentials.createInsecure()
      );

      // Add your connection logic here
      // If connection is successful, break the loop
      return stub;
    } catch (error) {
      console.error(
        `Attempt ${i + 1} failed. Retrying in ${interval} seconds...`
      );
    }
  }

  console.error(
    `Failed to connect after ${attempts} attempts. Terminating the app...`
  );
  app.quit();
}

export { stub };
