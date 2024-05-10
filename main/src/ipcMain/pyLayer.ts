import { PyLayerService } from "@services/pyLayer";
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
}
