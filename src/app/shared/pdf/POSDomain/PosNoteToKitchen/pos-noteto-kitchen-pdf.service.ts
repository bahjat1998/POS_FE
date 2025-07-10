import { Injectable } from '@angular/core';

import { CommonOperationsService } from '../../../services/systemcore/third-partytoasty.service';
import { PrintService } from 'src/app/shared/services/systemcore/printer-manager.service';

import { tableLayouts } from 'pdfmake/build/pdfmake';
import { fontTajawalMedium } from '../../CommonPdf/TajawalMedium';

@Injectable({
    providedIn: 'root'
})
export class PosNoteToKitchenPdfService {
    paymentServerData: any = {};
    pdfContent: any = [];
    pageHeightCounter = 0;

    constructor(private printService: PrintService, private common: CommonOperationsService) {
    }

    clearReport() {
        this.paymentServerData = {};
        this.pdfContent = [];
        this.pageHeightCounter = 0;
    }

    currLang: any
    async PrintPdf(data: any, printerName: any) {
        this.currLang = this.common.currLang
        this.clearReport()
        this.paymentServerData = data;
        this.pdfContent = await this.buildReport()
        this.printDoc(this.pdfContent, printerName);
    }

    async buildReport() {
        let rows = [];
        rows.push(this.simpleHeaderRowInfoText('', "*** Counter Note ***", 15))
        rows.push(this.simpleHeaderRowInfoText('Counter :', this.common.getCurrentUserName(), 12, false, [0, 3, 0, 0]));
        rows.push(this.simpleHeaderRowInfoText('Note : ', this.paymentServerData.note, 15));
        this.pageHeightCounter += 10;
        return rows;
    }
    simpleHeaderRowInfoText(label: any, value: any, fs = 7, barCodeTf = false, margin = [0, 0, 0, 0]) {
        let RowInfo: any = {
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: [40, '*'],
                body: [
                    [{ text: this.common.arabicFormat(label), border: [false, false, false, false], fontSize: 9 }, { text: this.common.arabicFormat(value), margin: margin, fontSize: fs, border: [false, false, false, false], alignment: 'left' }],
                ]
            }
        };
        if (barCodeTf) {
            RowInfo.table.widths = [80];
            RowInfo.table.body = [[{ text: this.common.arabicFormat(label), border: [false, false, false, false] }]];
        }
        return RowInfo;
    }
    printDoc(pdfContent: any, printerName: any) {
        const def: any = {
            pageMargins: [0, 0, 0, 0],
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
            this.printService.printPdf(printerName, { def: def, tableLayouts: tableLayouts, font: this.getFontDictionary(), vfs: this.getFontsVfs() }, this.pageHeightCounter * 8500);
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
