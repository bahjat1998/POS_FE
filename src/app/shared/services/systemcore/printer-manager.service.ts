import { Injectable } from '@angular/core';

import pdfMake from '../../pdf/pdfFontsWrapper';
import { tableLayouts } from 'pdfmake/build/pdfmake';

@Injectable({
    providedIn: 'root'
})
export class PrintService {
    private electron = (window as any).electron;
    constructor() {
        if (!this.electron) {
            console.warn('Electron is not available! Running in browser mode.');
        }
    }

    async getPrinters(): Promise<any[]> {
        try {
            return await this.electron?.ipcRenderer.invoke('get-printers') || [];
        } catch (error) {
            console.error('Error fetching printers:', error);
            return [];
        }
    }

    async savePdfToTemp(pdfBuffer: ArrayBuffer): Promise<string | null> {
        try {
            if (!pdfBuffer) {
                throw new Error('Generated PDF buffer is empty');
            }

            const pdfPath = await this.electron?.ipcRenderer.invoke('save-pdf', { pdfBuffer });
            if (!pdfPath) {
                throw new Error('Failed to save PDF.');
            }

            return pdfPath;
        } catch (error) {
            console.error('Error saving PDF:', error);
            return null;
        }
    }

    async printPdf(printerName: string, doc: any, height: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                // pdfMake.createPdf(doc.def, doc.tableLayouts, doc.font, doc.vfs).open();
                // return;
                const pdfDocGenerator = pdfMake.createPdf(doc.def, doc.tableLayouts, doc.font, doc.vfs);
                pdfDocGenerator.getBuffer(async (buffer) => {
                    try {
                        const pdfPath = await this.savePdfToTemp(buffer);
                        console.log("heightheight+pdfPath", pdfPath)
                        if (!pdfPath) {
                            reject(new Error('Failed to save PDF.'));
                            return;
                        }
                        console.log("pdfPath", pdfPath)
                        await this.electron?.ipcRenderer.invoke('print-pdf', { printerName, pdfPath, height });
                        resolve();
                    } catch (error) {
                        console.error('Error printing PDF:', error);
                        reject(error);
                    }
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
                reject(error);
            }
        });
    }
}
