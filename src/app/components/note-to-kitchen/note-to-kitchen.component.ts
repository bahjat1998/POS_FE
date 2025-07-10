import { Component, ViewChild } from '@angular/core';
import { PosNoteToKitchenPdfService } from 'src/app/shared/pdf/POSDomain/PosNoteToKitchen/pos-noteto-kitchen-pdf.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-note-to-kitchen',
  templateUrl: './note-to-kitchen.component.html',
  styleUrls: ['./note-to-kitchen.component.css']
})
export class NoteToKitchenComponent {
  model: any = {}
  constructor(private gto: GeneralTemplateOperations, public common: CommonOperationsService, private noteToKitchenPdf: PosNoteToKitchenPdfService) {
    gto.openPosNoteToKitchen$.subscribe((z: any) => {
      this.model = {}
      this.openModel()
    })

    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.handleLkpsLoaded.bind(this));
  }

  lstPrinters: any = []
  handleLkpsLoaded() {
    this.lstLkps['ItemGroups'].forEach((g: any) => {
      if (g.str2 && !this.lstPrinters.some((a: any) => a.value == g.str2)) {
        this.lstPrinters.push({ value: g.str2, label: g.str2 })
      }
    });
  }
  lstLkpKeys = ['ItemGroups'];
  lstLkps: any = {}
  @ViewChild("NoteToKitchenPop", { static: true }) C_Popup?: any;
  openModel() {
    this.C_Popup?.open();
  }
  save() {
    this.lstPrinters.forEach((printer: any) => {
      if (printer.selected)
        this.noteToKitchenPdf.PrintPdf({ note: this.model.note }, printer.value)
    });
    this.C_Popup.close()
  }
  closeModel() {
    this.C_Popup.close();
  }
}
