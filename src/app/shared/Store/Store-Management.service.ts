import { Injectable } from '@angular/core';

declare global {
    interface Window {
        electronStore: {
            get: (key: string) => any;
            set: (key: string, value: any) => any;
            delete: (key: string) => any;
            keys: () => any;
        };
    }
}

@Injectable({
    providedIn: 'root'
})
export class StoreManagementService {
    private electron = (window as any).electron;

    constructor() { }
    async setItemLocal(key: string, value: any) {
        try {
            const json = JSON.stringify(value);
            localStorage.setItem(key, json);
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    }
    async setItem(key: string, value: any) {
        if (!this.isAppElectron()) {
            try {
                const json = JSON.stringify(value);
                localStorage.setItem(key, json);
            } catch (e) {
                console.error('Error saving to localStorage', e);
            }
        }
        else {
            try {
                await window.electronStore.set(key, value);
            } catch (e) {
                console.error('Error saving to electronStore', e);
            }
        }
    }

    async getItem<T>(key: string) {
        if (!this.isAppElectron()) {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) as T : null;
            } catch (e) {
                console.error('Error reading from localStorage', e);
                return null;
            }
        }
        else {
            try {
                const value = await window.electronStore.get(key);
                return value as T;
            } catch (e) {
                console.error('Error reading from electronStore', e);
                return null;
            }
        }
    }
    async getItemLocal<T>(key: string) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) as T : null;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return null;
        }
    }
    async removeItem(key: string) {
        if (!this.isAppElectron()) {
            localStorage.removeItem(key);
        }
        else {
            try {
                localStorage.removeItem(key);
                await window.electronStore.delete(key);
            } catch (e) {
                console.error('Error removing from electronStore', e);
            }
        }
    }

    async clear() {
        if (!this.isAppElectron()) {
            localStorage.clear();
            sessionStorage.clear();
        }
        else {
            localStorage.clear();
            sessionStorage.clear();
            try {
                const keys = await this.getAllKeys();
                for (const key of keys) {
                    await window.electronStore.delete(key);
                }
            } catch (e) {
                console.error('Error clearing electronStore', e);
            }
        }
    }
    private async getAllKeys(): Promise<string[]> {
        // You'll need to expose a method in your preload script to get all keys, like:
        // contextBridge.exposeInMainWorld('electronStore', { ..., keys: () => ipcRenderer.invoke('electron-store-keys') })
        if (this.isAppElectron() && window.electronStore['keys']) {
            return await window.electronStore['keys']();
        } else {
            return Object.keys(localStorage);
        }
    }
    hasKey(key: string): boolean {
        if (!this.isAppElectron()) {
            return localStorage.getItem(key) !== null;
        }
        else {
            return false;
            //Electron 
        }
    }
    async logAllStoredValues(): Promise<void> {
        if (this.isAppElectron()) {
            console.log('🔵 ElectronStore Contents:');
            try {
                const keys = await this.getAllKeys();
                for (const key of keys) {
                    const value = await window.electronStore.get(key);
                    console.log(`- ${key}:`, value);
                }
            } catch (e) {
                console.error('Error logging electronStore contents', e);
            }
        }
    }
    GetNewDeviceToken() {
        if (!this.isAppElectron()) {
            return this.makeid(5)
        } else {
            return this.getDeviceId()
        }
    }
    async getDeviceId(): Promise<string> {
        let newDeviceKeyGenerated = await this.electron?.ipcRenderer.invoke('get-device-id');
        return newDeviceKeyGenerated;
    }
    isAppElectron() {
        return window && window.electronStore
    }

    makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    currentLogin: any
    async refreshCurrentLogin() {
        this.currentLogin = await this.getItem("loginSetup");
        if (!this.currentLogin) {
            this.currentLogin = "Panel"
        }
        this.currentLogin = this.currentLogin == "Panel" ? "../login" : "../loginPos"
    }
    async getCurrentUserLoginPath() {
        if (!this.currentLogin) {
            await this.refreshCurrentLogin()
        }
        return this.currentLogin
    }

    async IsPosVersion() {
        await this.getCurrentUserLoginPath()
        return this.currentLogin == "../loginPos"
    }
}
