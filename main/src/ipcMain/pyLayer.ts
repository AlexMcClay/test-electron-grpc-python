import { PyLayerService } from "@services/pyLayer";
import { stub } from "@src/main";
import { HelloRequest } from "@src/services/grpc/helloworld_pb";
import { appWindow } from "@src/windows/app";
import { ipcMain } from "electron";

/**
 * IPC Main handler for file handling, it handles all file related events.
 * This function handles the following IPC Main events:
 * - file:saveImage: Save an image to a file path and upload it to a server.
 */
export function handlePyLayer() {
  const pyService = new PyLayerService();

  ipcMain.handle("pylayer:say-hello", async (_event, name) => {
    return pyService.sayHello(name);
  });

  ipcMain.on("pylayer:say-hello-stream-reply", async (_event, name) => {
    const req = new HelloRequest();
    req.setName(name);

    const window = appWindow.getWindow();
    if (window) {
    }

    if (stub) {
      console.time("sayHelloStreamReply");
      const stream = stub.sayHelloStreamReply(req);
      let message = "";
      stream.on("data", (res) => {
        message = res.getMessage();
        window?.webContents.send("pylayer:say-hello-stream-reply", message);
      });
      stream.on("end", () => {
        console.timeEnd("sayHelloStreamReply");
      });
      stream.on("error", (err) => {
        console.error(err);
        console.timeEnd("sayHelloStreamReply");
      });
    } else {
      const error = new Error("stub is null");
      console.error(error);
    }
  });
}
