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
export class PdfService {
    pdfContent: any;
    data: any
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
            this.buildTablePart(this.data.lstData)
        ])
    }
    patientIntoPart() {
        let account = this.data.accountDetails;
        return {
            layout: 'noBorders',
            table: {
                widths: ['*', 150, '*'],
                body: [
                    [this.simpleHeaderRowInfoText("Name:", account.nameEn), { text: '' }, this.simpleHeaderRowInfoText("Gender:", account.genderName)],
                    [this.simpleHeaderRowInfoText("Age:", this.common.calculateAge(account.birthDate)), { text: '' }, this.simpleHeaderRowInfoText("Date:", this.common.dateTimeFormat(new Date().toString()))]
                ]
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
                widths: [60, '*'],
                body: [
                    [{ text: this.general.arabicFormat(label), bold: true, border: borderFalse }, { text: this.general.arabicFormat(value), border: borderFalse, alignment: 'left' }],
                ]
            }
        };
        return RowInfo;
    }

    buildTablePart(lstData: any) {
        let lstCols = [
            { pdfWidth: 50, prop: 'i', title: '' },
            { pdfWidth: '*', prop: 'drugName', title: 'Medicament Name' },
            { pdfWidth: 150, prop: 'dosageDesc', title: 'Dosage' },
            { pdfWidth: 90, prop: 'dosageDurationDesc', title: 'Duration' }
        ];

        return this.general.tableDesign1(lstCols, lstData)
    }
    arabicFormat(txt: string) {
        // if (txt) {
        //     txt = String(txt);
        //     var english = /^[A-Za-z0-9]*$/;

        //     var charsToReplace = [' ', '•', ')', ':', '(', '-', '_', '/', '’', ',', '!', '@', '#', '$', '%', '\\', '.', '<', '>', "'", "\n", '%', ' '];
        //     var subStr = txt;
        //     charsToReplace.forEach(z => {
        //         subStr = subStr.split(z).join("");
        //     })
        //     if (!english.test(subStr)) {
        //         return txt.split(" ").reverse().join(" ")
        //     }
        // }

        return txt;
    }
}
