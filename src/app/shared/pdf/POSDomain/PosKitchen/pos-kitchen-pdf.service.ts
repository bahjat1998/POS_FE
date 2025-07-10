import { Injectable } from '@angular/core';

import { CommonOperationsService } from '../../../services/systemcore/third-partytoasty.service';
import { PrintService } from 'src/app/shared/services/systemcore/printer-manager.service';

import pdfMake from '../../pdfFontsWrapper';
import { tableLayouts } from 'pdfmake/build/pdfmake';
import { fontTajawalMedium } from '../../CommonPdf/TajawalMedium';

@Injectable({
    providedIn: 'root'
})
export class PosKitchenPdfService {
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
        // rows.push(this.simpleHeaderRowInfoText('# : ', this.paymentServerData.id, 9));
        if (this.paymentServerData.notes)
            rows.push(this.simpleHeaderRowInfoText('Note : ', this.paymentServerData.notes, 15));
        rows.push(this.simpleHeaderRowInfoText('Type : ', `${this.common.getInvoiceTypeLbl(this.paymentServerData)} * ${this.paymentServerData.id}`, 12));
        rows.push(this.simpleHeaderRowInfoText('Counter :', this.common.getCurrentUserName(), 12, false, [0, 3, 0, 0]));
        rows.push(this.simpleHeaderRowInfoText('ON Date :', this.common.dateTimeFormat(new Date()), 12));
        rows.push(this.buildInvoicePart());

        if (this.paymentServerData.deleted) {
            rows.unshift(this.getDeletedFlag)
            rows.push(this.getDeletedFlag)
        }
        this.pageHeightCounter += 10;
        return rows;
    }
    getDeletedFlag = this.simpleHeaderRowInfoText('', "XXXX Delete XXXX", 15)
    wihoutBorder = [false, false, false, false];
    buildInvoicePart() {
        let lstItems = this.paymentServerData.lstItems;
        let rows: any = [];
        let headers = [];

        headers.push(
            ...[
                { text: 'Item', border: [false, false, false, true], fontSize: 8 },
                { text: 'Qty', border: [false, false, false, true], fontSize: 8 }
            ],
        )

        rows.push(headers)
        this.pageHeightCounter += 10;
        this.paymentServerData.totalAmount = 0;
        lstItems.forEach((itm: any, i: any) => {
            let itmRow = []
            itmRow.push(
                ...[
                    { text: this.common.arabicFormat(itm.name) + " " + (itm.variantName && itm.variantName != itm.name ? `- ${itm.variantName}` : ''), fontSize: 13, border: this.wihoutBorder },
                    { text: itm.quantity, fontSize: 10, border: this.wihoutBorder },
                ],
            )
            rows.push(itmRow)

            if (itm.note) {
                itmRow = []
                itmRow.push(
                    ...[
                        { text: 'Note: ' + this.common.arabicFormat(itm.note), fontSize: 11, colSpan: 2, border: this.wihoutBorder }
                    ],
                )
                rows.push(itmRow)
            }
            if (itm.lstAddOns) {
                itm.lstAddOns.forEach((addon: any) => {
                    itmRow = []
                    itmRow.push(
                        ...[
                            { text: '•' + this.common.arabicFormat(addon.addOnName), fontSize: 11, border: this.wihoutBorder },
                            { text: addon.qty + '', fontSize: 11, border: this.wihoutBorder }
                        ]
                    )
                    rows.push(itmRow)
                });
            }
            let lastRow = rows[rows.length - 1];
            if (lastRow && lastRow.length > 0) {
                lastRow.forEach((z: any) => z.border = [false, false, false, true]);
            }
            this.pageHeightCounter += 1;
        });

        this.pageHeightCounter += 7;

        return {
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: ['*', 40],
                body: [
                    ...rows,
                ]
            }
        }
    }

    tableBottom(txt1: any, txt2: any, withBorderBTM = false, font = 9) {
        let emptyCell = { text: '', border: this.wihoutBorder }
        return [{ text: txt1, border: this.wihoutBorder, fontSize: 10 }, emptyCell, emptyCell, { text: txt2, margin: [0, 2, 0, 0], fontSize: font, border: withBorderBTM ? [false, false, false, true] : this.wihoutBorder, alignment: 'center' }]
    }
    tableBottomSplitter() {
        let emptyCell = { text: '', border: this.wihoutBorder }
        return [emptyCell, emptyCell, emptyCell, { text: '', margin: [0, 2, 0, 0], fontSize: 9, border: this.wihoutBorder, alignment: 'center' }]
    }
    numberFormatter(val: any) {
        return val ? val : 0;
    }
    logoDataUrl = '';
    getBase64ImageFromURL(url: any) {
        return new Promise((resolve, reject) => {
            if (!this.logoDataUrl) {
                var img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                img.crossOrigin = 'anonymous';

                img.onload = () => {
                    var canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;

                    var ctx: any = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    var dataURL = canvas.toDataURL("image/png");
                    this.logoDataUrl = dataURL
                    resolve(this.logoDataUrl);
                };

                img.onerror = error => {
                    alert(`Please set ${this.common.getAttachemntUrl('StoreLogo.jpg')} image`)
                    reject(error);
                };

                img.src = url;
            } else {
                resolve(this.logoDataUrl);
            }

        });
    }
    drowDashLine() {
        return {
            layout: {
                hLineStyle: function (i: any, node: any) {
                    return { dash: { length: 4, space: 3 } };
                },
            },
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: ['*'],
                body: [
                    [{ text: '', fontSize: 1, border: [false, false, false, true] }],
                ]
            }
        }
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
            // pdfMake.createPdf(def, tableLayouts, this.getFontDictionary(), this.getFontsVfs()).open();
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
