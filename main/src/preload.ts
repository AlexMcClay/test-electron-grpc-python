import { contextBridge, ipcRenderer } from "electron";

export const electronAPI = {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  pyLayer: {
    sayHello: (name: string): Promise<string> =>
      ipcRenderer.invoke("pylayer:say-hello", name),
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
