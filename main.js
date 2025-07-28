import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron';
import Store from 'electron-store';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import treeKill from 'tree-kill';
import psList from 'ps-list';
import { exec } from 'child_process';
import { downloadAndExtract } from './utils/downloader.js';

async function killExistingInstances () {
    const processes = await psList();

    processes.forEach(proc => {
        if (
            (proc.name === 'NewClick POS.exe' || proc.name == 'electron.exe') &&
            proc.pid !== process.pid // don't kill current instance
        ) {
            console.log(`Killing process ${proc.pid}: ${proc.name}`);
            try {
                process.platform === 'win32' ? exec(`taskkill /PID ${proc.pid} /F`) : process.kill(proc.pid, 'SIGKILL');
            } catch (err) {
                console.error(`Failed to kill process ${proc.pid}`, err);
            }
        }
    });
}

// Call before anything else
await killExistingInstances();
// Initialize electron-storeconst Store = require('electron-store')
const store = new Store();

ipcMain.handle('electron-store-get', (_, key) => store.get(key));
ipcMain.handle('electron-store-set', (_, key, value) => store.set(key, value));
ipcMain.handle('electron-store-delete', (_, key) => store.delete(key));
ipcMain.handle('electron-store-keys', _ => Object.keys(store.store));

const gotTheLock = true; //app.requestSingleInstanceLock()
let mainWindow;
if (!gotTheLock) {
    app.whenReady().then(() => {
        dialog.showMessageBoxSync({
            type: 'warning',
            buttons: ['OK'],
            defaultId: 0,
            title: 'Application is already running',
            message: 'This application is already running. Please close it before opening another instance.'
        });

        app.quit(); // Exit after showing the message
        process.exit(0);
    });
} else {
    const menuSetup = [
        {
            label: 'App',
            submenu: [
                { role: 'quit' },
                { role: 'toggleDevTools' },
                {
                    label: 'Clear Cache',
                    click: () => {
                        const focusedWindow = BrowserWindow.getFocusedWindow();
                        if (focusedWindow) {
                            focusedWindow.webContents.send('clear-cache');
                        }
                    }
                },
                {
                    label: 'Key',
                    click: () => {
                        const focusedWindow = BrowserWindow.getFocusedWindow();
                        if (focusedWindow) {
                            focusedWindow.webContents.send('print-idFilePath', { fileKeyDir: path.join(app.getPath('userData'), 'licence.txt') });
                        }
                    }
                },
                {
                    label: 'Download Latest Version',
                    click: () => {
                        const focusedWindow = BrowserWindow.getFocusedWindow();
                        if (focusedWindow) {
                            downloadAndExtract(focusedWindow);
                        }
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [{ role: 'reload' }, { role: 'zoomIn' }, { role: 'zoomOut' }]
        }
    ];
    console.log('Icon path:', path.join(__dirname, 'assets', 'icon.ico'));
    app.whenReady().then(() => {
        mainWindow = new BrowserWindow({
            width: 1280,
            height: 720,
            icon: path.join(__dirname, 'dist', 'assets/icon.ico'),
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                contextIsolation: true,
                nodeIntegration: false,
                webSecurity: false
            }
        });
        mainWindow.maximize();
        const appUrl = app.isPackaged ? `file://${path.join(__dirname, 'dist', 'index.html')}` : 'http://localhost:4200';
        console.log(appUrl);
        mainWindow.loadURL(appUrl);

        // const appUrl = app.isPackaged ? `file://${path.join(__dirname, '../dist/index.html')}` : 'http://localhost:4200';
        // console.log(appUrl);
        // mainWindow.loadURL(appUrl);
        // Confirm on close
        mainWindow.on('close', event => {
            const choice = dialog.showMessageBoxSync(mainWindow, {
                type: 'question',
                buttons: ['No', 'Yes'],
                title: 'Confirm',
                message: 'Are you sure you want to exit?'
            });
            if (choice === 0) event.preventDefault();
        });

        // Load printer list
        mainWindow.webContents.once('did-finish-load', () => {
            mainWindow.webContents
                .getPrintersAsync()
                .then(list => {
                    mainWindow.webContents.send('printers', list);
                })
                .catch(error => {
                    console.error('Error fetching printers:', error);
                });
        });

        // Refocus window after blur (for keyboard bug workaround)
        // mainWindow.on('blur', () => {
        //   setTimeout(() => {
        //     if (mainWindow && !mainWindow.isDestroyed()) {
        //       mainWindow.focus();
        //     }
        //   }, 100);
        // });

        const menu = Menu.buildFromTemplate(menuSetup);
        Menu.setApplicationMenu(menu);

        // Save PDF to temporary file
        ipcMain.handle('save-pdf', async (event, { pdfBuffer }) => {
            try {
                const tempPath = path.join(app.getPath('temp'), `printFile-${Date.now()}-${Math.random().toString(36).substring(2, 10)}.pdf`);
                fs.writeFileSync(tempPath, Buffer.from(pdfBuffer));
                return tempPath;
            } catch (error) {
                console.error('Error saving PDF:', error, app.getPath('temp'));
                throw error;
            }
        });
        // Print job queue
        const printQueue = [];
        let isPrinting = false;

        async function runPrintJob (pdfPath, printerName) {
            return new Promise((resolve, reject) => {
                const pdfToPrinterPath = `"C:\\Program Files\\SumatraPDF\\SumatraPDF.exe"`;
                const command = printerName
                    ? `${pdfToPrinterPath} -print-to "${printerName}" "${pdfPath}"` // optional: add printer name
                    : `${pdfToPrinterPath} -print-to-default "${pdfPath}"`;

                console.log('🖨️ Running command:', command);

                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('❌ Print failed:', stderr || error.message);
                        reject(new Error('Print failed: ' + (stderr || error.message)));
                    } else {
                        console.log('✅ Printed successfully: - ' + (printerName ?? 'CASH'), stdout);
                        setTimeout(() => {
                            fs.unlink(pdfPath, err => {
                                if (err) {
                                    console.error('⚠️ Failed to delete temp file:', err.message);
                                } else {
                                    console.log('🗑️ Temp file deleted:', pdfPath);
                                }
                            });
                        }, 50000);
                        resolve('Printed successfully');
                    }
                });
            });
        }

        async function processNextPrintJob () {
            if (isPrinting || printQueue.length === 0) return;

            isPrinting = true;
            const { pdfPath, printerName, resolve, reject } = printQueue.shift();

            try {
                const result = await runPrintJob(pdfPath, printerName);
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                isPrinting = false;
                processNextPrintJob(); // process the next job
            }
        }

        ipcMain.handle('print-pdf', async (event, { pdfPath, printerName }) => {
            if (!fs.existsSync(pdfPath)) {
                throw new Error('PDF file does not exist: ' + pdfPath);
            }

            return new Promise((resolve, reject) => {
                printQueue.push({ pdfPath, printerName, resolve, reject });
                processNextPrintJob();
            });
        });

        // Expose printer list
        ipcMain.handle('get-printers', async () => {
            return await mainWindow.webContents.getPrintersAsync();
        });
        function killSelfAndAll () {
            const pid = process.pid;
            console.log(`Killing process tree for PID ${pid}`);

            treeKill(pid, 'SIGKILL', err => {
                if (err) {
                    console.error('Failed to kill process tree:', err);
                }
                process.exit(0); // Fallback in case some processes remain
            });
        }

        // Close app if all windows are closed (except on macOS)
        app.on('before-quit', killSelfAndAll);
        app.on('window-all-closed', killSelfAndAll);
        process.on('exit', killSelfAndAll);

        // ipcMain.handle('get-device-id', async () => {
        //     try {
        //         // Use machine ID (Persistent across reboots)
        //         const id = machineIdSync().substring(0, 16);
        //         console.log('get-device-id', id);
        //         return id;
        //     } catch (error) {
        //         console.error('Error fetching device ID:', error);
        //         return null;
        //     }
        // });

        const idFilePath = path.join(app.getPath('userData'), 'licence.txt');

        function getAppId () {
            try {
                if (fs.existsSync(idFilePath)) {
                    // If an ID already exists, read and return it
                    const id = fs.readFileSync(idFilePath, 'utf-8').trim();
                    console.log('Using existing App ID:', id);
                    return id;
                } else {
                    // Generate a new UUID, save it, and return it
                    const newId = uuidv4();
                    fs.writeFileSync(idFilePath, newId, 'utf-8');
                    console.log('Generated new App ID:', newId);
                    return newId;
                }
            } catch (error) {
                console.error('Error accessing App ID file:', error);
                return null;
            }
        }
        ipcMain.handle('get-device-id', async () => {
            console.log('get-device-id (App ID)--');
            const id = getAppId();
            console.log('get-device-id (App ID)', id);
            return id;
        });
    });
}
