import { contextBridge, ipcRenderer } from "electron";

export const electronAPI = {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
  pyLayer: {
    sayHello: (name: string): Promise<string> =>
      ipcRenderer.invoke("pylayer:say-hello", name),
    sayHelloStreamReply: (name: string): void =>
      ipcRenderer.send("pylayer:say-hello-stream-reply", name),
    // Event listner
    onSayHelloStreamReply: (
      listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on("pylayer:say-hello-stream-reply", listener);
    },
    // Remove event listener
    offSayHelloStreamReply: () => {
      ipcRenderer.removeAllListeners("pylayer:say-hello-stream-reply");
    },
  },
};

contextBridge.exposeInMainWorld("electronAPI", electronAPI);
