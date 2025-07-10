// src/app/pdfFontsWrapper.ts
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { strGnuMICR } from './CommonPdf/newFont';
import { fontRobotoSlabSemiBold } from './CommonPdf/RobotoSlab-SemiBold';
import { fontRobotoSlabSemiLight } from './CommonPdf/RobotoSlab-SemiLight';
import { fontTajawalMedium } from './CommonPdf/TajawalMedium';


(pdfMake as any).vfs = {
  ...pdfFonts.pdfMake.vfs,
  GnuMICR_b64: strGnuMICR,
  fontRobotoSlabSemiBold,
  fontRobotoSlabSemiLight,
  fontTajawalMedium
};

(pdfMake as any).fonts = {
  GnuMICR: {
    normal: 'GnuMICR_b64',
    bold: 'GnuMICR_b64',
    italics: 'GnuMICR_b64',
    bolditalics: 'GnuMICR_b64',
  },
  RobotoSlabSemiBold: {
    normal: 'fontRobotoSlabSemiBold',
    bold: 'fontRobotoSlabSemiBold',
    italics: 'fontRobotoSlabSemiBold',
    bolditalics: 'fontRobotoSlabSemiBold',
  },
  RobotoSlabSemiLight: {
    normal: 'fontRobotoSlabSemiLight',
    bold: 'fontRobotoSlabSemiLight',
    italics: 'fontRobotoSlabSemiLight',
    bolditalics: 'fontRobotoSlabSemiLight',
  },
  TajawalMedium: {
    normal: 'fontTajawalMedium',
    bold: 'fontTajawalMedium',
    italics: 'fontTajawalMedium',
    bolditalics: 'fontTajawalMedium',
  }
};

export default pdfMake;
