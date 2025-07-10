const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
        send: (channel, ...args) => ipcRenderer.send(channel, ...args),
        on: (channel, listener) => ipcRenderer.on(channel, (event, ...args) => listener(...args)),
        getDeviceId: () => ipcRenderer.invoke('get-device-id')
    }
});

contextBridge.exposeInMainWorld('electronStore', {
    get: key => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.invoke('electron-store-set', key, value),
    delete: key => ipcRenderer.invoke('electron-store-delete', key),
    keys: () => ipcRenderer.invoke('electron-store-keys')
});
