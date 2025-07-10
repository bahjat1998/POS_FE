import { Injectable } from '@angular/core';

import { CommonOperationsService } from '../../../services/systemcore/third-partytoasty.service';
import { PrintService } from 'src/app/shared/services/systemcore/printer-manager.service';

import { tableLayouts } from 'pdfmake/build/pdfmake';
import { fontTajawalMedium } from '../../CommonPdf/TajawalMedium';

@Injectable({
    providedIn: 'root'
})
export class PosCachePdfService01 {
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
        let rows = [];
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
            this.simpleHeaderRowInfoText('النوع : ', `#${this.paymentServerData.id}   ${this.common.getInvoiceTypeLbl(this.paymentServerData)}`),
            this.simpleHeaderRowInfoText('الكاشير :', this.common.getCurrentUserName()),
            this.simpleHeaderRowInfoText('التاريخ :', this.common.dateTimeFormat(new Date())),
            this.simpleHeaderRowInfoText('ملاحظة :', this.paymentServerData.notes ?? "****"),
            this.buildInvoicePart(),
        ]


        let sourceDelivery: any
        if (this.paymentServerData.deliveryCustomer) {
            sourceDelivery = this.paymentServerData.deliveryCustomer;
            sourceDelivery.address = this.paymentServerData.deliveryCustomer.address;
        }
        else if (this.paymentServerData.localDeliverySetup) {
            sourceDelivery = this.paymentServerData.localDeliverySetup;
        }

        if (this.paymentServerData.deliveryCustomerAddress) {
            sourceDelivery['address'] = this.paymentServerData.deliveryCustomerAddress
        }
        if (sourceDelivery) {
            rows.push(this.drowDashLine())
            rows.push(this.simpleHeaderRowInfoText('معلومات التوصيل', '', 13, 118))
            rows.push(this.simpleHeaderRowInfoText('الاسم :', sourceDelivery.name))
            rows.push(this.simpleHeaderRowInfoText('الهاتف :', sourceDelivery.phone1 + ' ' + sourceDelivery.phone2 ? sourceDelivery.phone2 : ""))
            rows.push(this.simpleHeaderRowInfoText('العنوان :', sourceDelivery.address.address))
            rows.push(this.drowDashLine())
        }

        this.pageHeightCounter += 11;
        return rows;
    }

    wihoutBorder = [false, false, false, false];
    buildInvoicePart() {
        let lstItems = this.paymentServerData.lstItems;
        let rows: any = [];
        let headers = [];
        let tHBorder = [false, false, false, true]
        headers.push(
            ...[
                { text: 'المجموع', fontSize: 8, border: tHBorder, alignment: 'center' },
                { text: 'السعر', border: tHBorder, fontSize: 8, alignment: 'right' },
                { text: 'الكمية', border: tHBorder, fontSize: 8, alignment: 'right' },
                { text: 'الصنف', border: tHBorder, fontSize: 8, alignment: 'right' }
            ],
        )
        rows.push(headers)
        this.pageHeightCounter += 10;
        this.paymentServerData.totalAmount = 0;
        lstItems.forEach((itm: any, i: any) => {
            let itmRow = []

            itmRow.push(
                ...[
                    { text: itm.total, fontSize: 11, border: this.wihoutBorder, alignment: 'center' },
                    { text: itm.price, border: this.wihoutBorder, fontSize: 11, alignment: 'right' },
                    { text: itm.quantity, border: this.wihoutBorder, fontSize: 11, alignment: 'right' },
                    { text: this.common.arabicFormat(itm.name) + " " + (itm.variantName && itm.variantName != itm.name ? `- ${itm.variantName}` : ''), border: this.wihoutBorder, fontSize: 11, alignment: 'right' },
                ],
            )
            rows.push(itmRow)
            if (itm.lstAddOns) {
                itm.lstAddOns.forEach((addon: any) => {
                    itmRow = []
                    itmRow.push(
                        ...[
                            {
                                text: '', fontSize: 11, border: this.wihoutBorder
                            },
                            { text: (addon.price), fontSize: 10, border: this.wihoutBorder, alignment: 'right' },
                            { text: (addon.qty ?? 1), fontSize: 10, border: this.wihoutBorder, alignment: 'right' },
                            { text: '•' + this.common.arabicFormat(addon.addOnName), fontSize: 10, border: this.wihoutBorder, alignment: 'right' }
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

        if (this.paymentServerData.discAmount)
            rows.push(this.tableBottom('الخصم', this.paymentServerData.discAmount));
        if (this.paymentServerData.serAmount)
            rows.push(this.tableBottom('الخدمة', this.paymentServerData.serAmount));
        if (this.paymentServerData.deliveryCost)
            rows.push(this.tableBottom('التوصيل', this.paymentServerData.deliveryCost));

        rows.push(this.tableBottom('النهائي', this.paymentServerData.finalTotal, true));
        if ((this.paymentServerData.paid - this.paymentServerData.finalTotal) && this.paymentServerData.paid)
            rows.push(this.tableBottom('مرتجع', this.paymentServerData.paid - this.paymentServerData.finalTotal, true));
        rows.push(this.tableBottom('', ''));


        return {
            layout: {
                hLineStyle: function (i: any, node: any) {
                },
            },
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: [32, 23, 23, 80],
                body: [
                    ...rows,
                ]
            }
        }
    }

    tableBottom(txt1: any, txt2: any, withBorderBTM = false, font = 9) {
        let emptyCell = { text: '', border: this.wihoutBorder }
        return [{ text: txt2, margin: [0, 2, 0, 0], fontSize: font, border: withBorderBTM ? [false, false, false, true] : this.wihoutBorder, alignment: 'center' }, emptyCell, emptyCell, { text: txt1, border: this.wihoutBorder, fontSize: 10, alignment: 'right' }]
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

    simpleHeaderRowInfoText(label: any, value: any, fs = 10, cWidht1 = 50) {
        let RowInfo: any = {
            table: {
                layout: 'noBorders',
                headerRows: 1,
                widths: ['*', cWidht1],
                body: [
                    [{ text: this.common.arabicFormat(value), margin: [0, 0, 0, 0], fontSize: fs, border: [false, false, false, false], alignment: 'right' },
                    { text: this.common.arabicFormat(label), border: [false, false, false, false], fontSize: fs }],
                ]
            }
        };
        return RowInfo;
    }

    printDoc(pdfContent: any) {
        const def: any = {
            pageMargins: [5, 0, 5, 0],
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
