import { Injectable } from '@angular/core';

import { CommonOperationsService } from '../../../services/systemcore/third-partytoasty.service';
import { PrintService } from 'src/app/shared/services/systemcore/printer-manager.service';

import { tableLayouts } from 'pdfmake/build/pdfmake';
import { fontTajawalMedium } from '../../CommonPdf/TajawalMedium';

@Injectable({
    providedIn: 'root'
})
export class PosShiftPdfService {
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
    async PrintPdf(data: any) {
        this.currLang = this.common.currLang
        this.clearReport()
        this.paymentServerData = data;
        this.pdfContent = await this.buildReport()
        this.printDoc(this.pdfContent);
    }

    async buildReport() {
        let rows: any = [];
        rows = [
            {
                margin: [50, 2, 0, 0],
                columns: [
                    {
                        image: await this.getBase64ImageFromURL(this.common.getAttachemntUrl('StoreLogo.jpg')),
                        height: 90,
                        width: 120,
                        alignment: 'center'
                    }
                ]
            },
            {
                layout: 'noBorders',
                table: {
                    headerRows: 1,
                    widths: ['*'],

                    body: [
                        [{ text: this.common.arabicFormat("تقرير المبيعات"), margin: [0, 2, 0, 0], alignment: 'center' }],
                    ]
                }
            }
        ]
        rows.push(this.simpleHeaderRowInfoText('الفرع : ', this.paymentServerData.branchName, 13));
        rows.push(this.drowDashLine());
        rows.push(this.space());
        rows.push(this.simpleHeaderRowInfoText('فتح الشفت :', this.paymentServerData.openUserName));
        rows.push(this.simpleHeaderRowInfoText('اغلق الشفت :', this.paymentServerData.closeUserName));
        rows.push(this.drowDashLine());
        rows.push(this.space());
        rows.push(this.simpleHeaderRowInfoText('بداية الشفت : ', this.common.dateTimeFormat(this.paymentServerData.startTime)));
        rows.push(this.simpleHeaderRowInfoText('نهاية الشفت :', this.common.dateTimeFormat(this.paymentServerData.endTime)));
        rows.push(this.drowDashLine());
        rows.push(this.space());
        rows.push(this.simpleHeaderRowInfoText('رصيد البداية :', this.paymentServerData.startCash));
        rows.push(this.simpleHeaderRowInfoText('رصيد الاغلاق :', this.paymentServerData.endCash));
        rows.push(this.drowDashLine());
        rows.push(this.space());
        rows.push(this.simpleHeaderRowInfoText('مجموع المبيعات :', this.paymentServerData.totalSales));
        rows.push(this.drowDashLine());
        // if (this.paymentServerData.totalSalesInvoicesToEmployeeAccount)
            rows.push(this.simpleHeaderRowInfoText('مرصد على الموظف :', this.paymentServerData.totalSalesInvoicesToEmployeeAccount));
        // if (this.paymentServerData.totalBuyInvoicesPaid)
            rows.push(this.simpleHeaderRowInfoText('إجمالي الشراء المدفوع :', this.paymentServerData.totalBuyInvoicesPaid));
        rows.push(this.drowDashLine());
        rows.push(this.space());
        rows.push(this.simpleHeaderRowInfoText('ملاحظات الاغلاق :', this.paymentServerData.closingNotes));
        rows.push(this.simpleHeaderRowInfoText('تاريخ الطباعة :', this.common.dateTimeFormat(new Date())));


        rows.push(this.space());
        rows.push(this.drowDashLine());
        rows.push(this.space());
        // rows.push(this.simpleHeaderRowInfoText('المجاميع ', this.paymentServerData.closingNotes));
        this.paymentServerData.lstPaymentTotals.forEach((p: any) => {
            rows.push(this.simpleHeaderRowInfoText(`مجموع ${p.lbl} :`, p.total));
            rows.push(this.space());
            rows.push(this.drowDashLine());
            rows.push(this.space());
        });


        this.pageHeightCounter += 50;
        return rows;
    }

    wihoutBorder = [false, false, false, false];


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
        if (!this.logoDataUrl) {
            return new Promise((resolve, reject) => {
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
            });
        } else {
            return this.logoDataUrl;
        }
    }
    drowDashLine() {
        return {
            layout: {
                hLineStyle: function (i: any, node: any) {
                    return { dash: { length: 4, space: 1 } };
                },
            },
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: ['*'],
                body: [
                    [{ text: '', fontSize: 1, border: [false, false, false, true], margin: [0, 0, 0, 0] }],
                ]
            }
        }
    }
    space() {
        return { text: '', fontSize: 1, border: [false, false, false, true], margin: [0, 0, 0, 10] }
    }
    simpleHeaderRowInfoText(label: any, value: any, fs = 10, barCodeTf = false, margin = [0, 0, 0, 0]) {
        let RowInfo: any = {
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: ['*', 115],
                body: [
                    [{ text: this.common.arabicFormat(value), margin: margin, fontSize: fs, border: [false, false, false, false], alignment: 'right' },
                    { text: this.common.arabicFormat(label), border: [false, false, false, false], fontSize: 10 }],
                ]
            }
        };
        if (barCodeTf) {
            RowInfo.table.widths = [80];
            RowInfo.table.body = [[{ text: this.common.arabicFormat(label), border: [false, false, false, false] }]];
        }


        return RowInfo;
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
