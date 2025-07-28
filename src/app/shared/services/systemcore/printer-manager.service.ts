import { Injectable } from '@angular/core';

import pdfMake from '../../pdf/pdfFontsWrapper';
import { tableLayouts } from 'pdfmake/build/pdfmake';
import { GeneralTemplateOperations } from '../../StateManagementServices/account/account.service';
import { CommonOperationsService } from './third-partytoasty.service';

@Injectable({
    providedIn: 'root'
})
export class PrintService {


    private electron = (window as any).electron;
    constructor(private gto: GeneralTemplateOperations, private common: CommonOperationsService) {
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

            console.log(pdfBuffer);
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
    setup: any
    async getCurrentLayout() {
        if (!this.setup) {
            let z = await this.gto.getStyle()
            if (z.setup) { this.setup = z.setup }
            else this.setup = { printMethod: "local" }
        }
        return this.setup
    }
    async printPdf(printerName: string, doc: any, height: any): Promise<void> {
        let setup = await this.getCurrentLayout()
        return new Promise<void>((resolve, reject) => {
            try {
                const pdfDocGenerator = pdfMake.createPdf(doc.def, doc.tableLayouts, doc.font, doc.vfs);
                pdfDocGenerator.getBuffer(async (buffer) => {
                    if (setup.printMethod == 'local') {
                        try {
                            const pdfPath = await this.savePdfToTemp(buffer);
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
                    }
                    else if (setup.printMethod == 'api') {
                        const file = new File([buffer], `printFile-${Date.now()}-${Math.random().toString(36).substring(2, 10)}_${printerName}.pdf`, { type: 'application/pdf' });
                        this.common.saveFilesForPrinting(file).then(id => console.log('Uploaded file ID:', id));
                    }
                    else if (setup.printMethod == 'WebView') {
                        const blob = new Blob([buffer], { type: 'application/pdf' });
                        const blobUrl = URL.createObjectURL(blob);
                        window.open(blobUrl, '_blank');
                    }
                });
            } catch (error) {
                console.error('Error generating PDF:', error);
                reject(error);
            }
        });
    }
}
