import { Injectable } from '@angular/core';

import { PrintService } from 'src/app/shared/services/systemcore/printer-manager.service';

import { tableLayouts } from 'pdfmake/build/pdfmake';
import { fontTajawalMedium } from '../../CommonPdf/TajawalMedium';

@Injectable({
    providedIn: 'root'
})
export class PosDrawerPdfService {
    paymentServerData: any = {};
    pdfContent: any = [];
    pageHeightCounter = 0;

    constructor(private printService: PrintService) {
    }

    async openNow() {
        this.pdfContent = await this.buildReport()
        this.printDoc(this.pdfContent);
    }

    async buildReport() {
        let rows = [];
        rows = [
            {
                layout: 'noBorders',
                table: {
                    headerRows: 1,
                    widths: ['*'],

                    body: [
                        [{ text: '.', margin: [0, 2, 0, 0], alignment: 'center' }],
                    ]
                }
            }
        ]
        this.pageHeightCounter += 11;
        return rows;
    }


    printDoc(pdfContent: any) {
        const def: any = {
            pageMargins: [0, 0, 0, 0],
            // 1 Centimeter (cm) is equal to 28.3464567 points (pt). 
            pageSize: {
                width: 226, height:
                    this.pageHeightCounter * 20
            },
            content: pdfContent,
            defaultStyle: {
                font: 'TajawalMedium',
                fontSize: 12,
            },
            styles: {
                filledHeader: {
                    bold: true,
                    fontSize: 14,
                    color: 'white',
                    fillColor: 'black',
                    alignment: 'center'
                },
                rightme:
                {
                    alignment: 'center'
                }

            }
        };

        setTimeout(() => {
            this.printService.printPdf('', { def: def, tableLayouts: tableLayouts, font: this.getFontDictionary(), vfs: this.getFontsVfs() }, this.pageHeightCounter * 8500);
        }, 10);

    }

    getFontsVfs() {
        return {
            'fontTajawalMedium': fontTajawalMedium
        }
    }
    getFontDictionary() {
        return {
            TajawalMedium: {
                normal: 'fontTajawalMedium',
                bold: 'fontTajawalMedium',
                italics: 'fontTajawalMedium',
                bolditalics: 'fontTajawalMedium'
            }
        }
    }

}
