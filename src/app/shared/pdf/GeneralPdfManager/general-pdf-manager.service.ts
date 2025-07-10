import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { fontTajawalMedium } from '../CommonPdf/TajawalMedium';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
    providedIn: 'root'
})
export class GeneralPdfManagerService {
    printDoc(pdfContent: any) {
        if (!localStorage.getItem('PDFSetup')) { alert("Please setup PDF first from company info!") }
        let pdfSetup: any = JSON.parse(localStorage.getItem('PDFSetup') ?? "{}");

        let backgroundDunc = () => {
            return {
                image: pdfSetup.pdfLetter, fit: [595, 839]
            }
        };
        let footerCallBack = (currentPage: any, pageCount: any) => {
            return [
                {
                    absolutePosition: { x: 18, y: 30 },
                    text: `THIS IS A SYSTEM GENERATED REPORT AND DOES NOT REQUIRE PHYSICAL SIGNATURE`,
                    fontSize: 8
                },
                {
                    absolutePosition: { x: 530, y: 140 },
                    text: `Page ${currentPage} of ${pageCount}`,
                    fontSize: 9
                }
            ];
        }
        let def: any = {
            pageMargins: JSON.parse(pdfSetup.pdfMargins),
            content: pdfContent,
            background: backgroundDunc,
            footer: footerCallBack,
            Times: {
                normal: 'Times-Roman',
                bold: 'Times-Bold',
                italics: 'Times-Italic',
                bolditalics: 'Times-BoldItalic'
            },
            styles: {
                tableHeader: {
                    fontSize: 14, bold: true, color: 'white', fillColor: '#00A9CE'//, alignment: 'center'
                },
                tableCell: {
                    fontSize: 12, color: '#000'//, alignment: 'center'
                }
            },
            defaultStyle: {
                font: 'g_Font'
            }
        };

        pdfMake.createPdf(def, {},
            {
                g_Font: {
                    normal: 'fontTajawalMedium',
                    bold: 'fontTajawalMedium',
                    italics: 'fontTajawalMedium',
                    bolditalics: 'fontTajawalMedium'
                },
            },
            {
                fontTajawalMedium: fontTajawalMedium
            }
        ).open();

    }


    tableDesign1(lstCols: any, lstData: any) {
        let TableBody = [];
        let widths: any = [];
        let cols: any = []
        lstCols.forEach((col: any) => {
            cols.push({ text: col.title ?? '', style: 'tableHeader' });
            widths.push(col.pdfWidth ?? '*');
        });
        TableBody.push(cols);

        lstData.forEach((d: any, i: any) => {
            let dataRows: any = [];
            lstCols.forEach((col: any) => {
                if (col.widgets) {
                    dataRows.push(d[col.prop]);
                } else {
                    let val = d[col.prop] ?? '';
                    if (col.prop == 'i') {
                        val = (i + 1) + '';
                    }
                    dataRows.push({ text: val, style: 'tableCell' });
                }

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

    arabicFormat(txt: string) {
        if (txt) {
            txt = String(txt);
            var english = /^[A-Za-z0-9]*$/;

            var charsToReplace = [' ', '•', ')', ':', '(', '-', '_', '/', '’', ',', '!', '@', '#', '$', '%', '\\', '.', '<', '>', "'", "\n", '%', ' '];
            var subStr = txt;
            charsToReplace.forEach(z => {
                subStr = subStr.split(z).join("");
            })
            if (!english.test(subStr)) {
                let splitted = txt.split(" ").reverse();
                let newTxt: any = [];
                splitted.forEach((t: any, i: any) => {
                    if (i == 1) newTxt.push(t + ' ')
                    else newTxt.push(t)
                });
                txt = newTxt.join(" ")
            }
        }

        return txt;
    }
}
