import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CommonOperationsService } from '../../services/systemcore/third-partytoasty.service';
import { GeneralPdfManagerService } from '../GeneralPdfManager/general-pdf-manager.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class InvoiceReportPdf {
    pdfContent: any;
    data: any
    pdfHeaderCallBack: any = ""
    constructor(private common: CommonOperationsService, private general: GeneralPdfManagerService) { }
    async CreateReport(data: any) {
        this.pdfContent = [];
        this.data = data;
        this.printOrder()
        this.general.printDoc(this.pdfContent)
    }
    printOrder() {
        this.pdfContent.push([
            this.patientIntoPart(),
            this.buildSplitter(),
            this.buildTablePart(this.data.lstItems),
            this.finalResult(this.data.lstItems),
            this.buildSplitter(),
        ])
    }
    patientIntoPart() {
        let cD: any = new Date();
        let master = this.data;
        let body = [];
        body.push(
            [this.simpleHeaderRowInfoText("To Account:", master.accountName), { text: '' }, this.simpleHeaderRowInfoText("On Date:", this.common.dateTimeFormat(cD))],
        );
        // let FromToRow = [];
        // if (this.data['fromDate'] || this.data['toDate']) {
        //     if (this.data['fromDate']) {
        //         FromToRow.push(this.simpleHeaderRowInfoText("From Date:", this.common.dateFormat(this.data['fromDate'])));
        //     } else {
        //         FromToRow.push({ text: ' ' })
        //     }

        //     FromToRow.push({ text: ' ' })

        //     if (this.data['toDate']) {
        //         FromToRow.push(this.simpleHeaderRowInfoText("To Date:", this.common.dateFormat(this.data['toDate'])));
        //     } else {
        //         FromToRow.push({ text: ' ' })
        //     }
        //     body.push(FromToRow)
        // }
        return {
            layout: 'noBorders',
            table: {
                widths: ['*', 150, '*'],

                body: body
            }
        }
    }
    buildSplitter() {
        return [
            {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 'auto',
                        canvas: [
                            // Draw circles
                            { type: 'ellipse', x: 15, y: 5, color: '#70cae2', r1: 5, r2: 5 },
                            { type: 'ellipse', x: 30, y: 5, color: '#70cae2', r1: 5, r2: 5 },
                            { type: 'ellipse', x: 45, y: 5, color: '#70cae2', r1: 5, r2: 5 },
                            // Draw line
                            { type: 'rect', x: 60, y: 0, w: 300, h: 10, r: 5, color: '#70cae2' }
                        ]
                    }
                ],
                margin: [0, 20, 0, 20]
            }
        ]
    }

    simpleHeaderRowInfoText(label: any, value: any) {
        let borderFalse = [false, false, false, false];
        let RowInfo: any = {
            layout: 'noBorders',
            table: {
                margin: [0, 0, 0, 0],
                headerRows: 1,
                widths: [80, '*'],
                body: [
                    [{ text: this.general.arabicFormat(label), bold: true, border: borderFalse }, { text: this.general.arabicFormat(value), border: borderFalse, alignment: 'left' }],
                ]
            }
        };
        return RowInfo;
    }
    lstCols: any = []
    buildTablePart(lstData: any) {
        this.lstCols = [
            { pdfWidth: 20, prop: 'i', title: '' },
            { pdfWidth: 150, prop: 'itemName', title: 'Item Name' },
            { pdfWidth: 90, prop: 'price', title: 'Price' },
            { pdfWidth: '*', prop: 'unitName', title: 'Unit' },
            { pdfWidth: '*', prop: 'quantity', title: 'Quantity' },
            { pdfWidth: 90, prop: 'total', title: 'Total', rule: ["", "Center"], alignment: 'center' }
        ];
        return this.tableDesign(this.lstCols, lstData)
    }
    tableDesign(lstCols: any, lstData: any) {
        let TableBody = [];
        let widths: any = [];
        let cols: any = []
        lstCols.forEach((col: any) => {
            cols.push({ text: col.title ?? '', style: 'tableHeader', alignment: col.alignment ? col.alignment : 'left' });
            widths.push(col.pdfWidth ?? '*');
        });
        TableBody.push(cols);

        lstData.forEach((d: any, i: any) => {
            let dataRows: any = [];
            lstCols.forEach((col: any) => {
                let val = d[col.prop] ?? '';
                if (col.prop == 'i') {
                    val = (i + 1) + '';
                }
                let cell: any = { text: val, style: 'tableCell' };

                if (col['rule']) {
                    if (col.rule.indexOf('widgets') > -1) {
                        cell = d[col.prop];
                    }
                    if (col.rule.indexOf('MinusToConst') > -1) {
                        cell.text = val < 0 ? val * -1 : val;
                    }
                    if (col.rule.indexOf('Center') > -1) {
                        cell['alignment'] = 'center';
                    }
                }

                dataRows.push(cell);
            });
            TableBody.push(dataRows);
        });

        return [
            {
                table: {
                    headerRows: 1,
                    widths: widths,
                    body: TableBody
                },
                layout: {
                    hLineWidth: function (i: number, node: any) {
                        return (i == 0 || i == 1 || i === node.table.body.length) ? 0 : 1;
                    },
                    vLineWidth: function (i: number) {
                        return 0;
                    },
                    hLineColor: function (i: number) {
                        if (i != 0) {
                            return '#00A9CE';
                        }
                        return ''
                    },
                    paddingTop: function (i: number, node: any) {
                        return 5;
                    },
                    paddingBottom: function (i: number, node: any) {
                        return 5;
                    },
                    fillColor: function (rowIndex: number, node: any, columnIndex: number) {
                        return (rowIndex === 0) ? '#00A9CE' : null;
                    },
                    textColor: function (rowIndex: number, node: any, columnIndex: number) {
                        return (rowIndex === 0) ? 'white' : 'black';
                    }
                }
            }
        ]
    }
    finalResult(lstData: any) {
        let orderTotal = this.common.sum(lstData, 'total');
        return {
            margin: [0, 10, 0, 0],
            table: {
                layout: 'noBorders',
                widths: this.lstCols.map((z: any) => z.pdfWidth),
                body: [
                    [{ text: "" }, { text: "" }, { text: "" }, { text: "" }, { text: "Final Total :", margin: [5, 0, 0, 0], style: 'tableCell' }, { color: orderTotal < 0 ? "" : "", text: orderTotal, fontSize: 14, bold: true, alignment: 'center' }],
                ]
            },
            layout: 'noBorders'
        }

    }

}
