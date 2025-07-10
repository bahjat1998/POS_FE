import { Component, ViewChild } from '@angular/core';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-invoice-item-note',
  templateUrl: './invoice-item-note.component.html',
  styleUrls: ['./invoice-item-note.component.css']
})
export class InvoiceItemNoteComponent {
  componentData: any;
  model: any = {}
  flag = '';
  constructor(private gto: GeneralTemplateOperations, public common: CommonOperationsService) {
    gto.openPosInvoiceItemNote$.subscribe((z: any) => {
      this.model = {}
      this.componentData = z.obj;
      this.flag = z.flag
      if (z.flag == "itm") {
        if (this.componentData['note']) {
          this.model['note'] = this.componentData['note']
        }
      } else if (z.flag == "inv") {
        if (this.componentData['notes']) {
          this.model['note'] = this.componentData['notes']
        }
      }
      this.openModel()
    })
  }
  @ViewChild("PosInvItemNote", { static: true }) openPosInvItemNote?: any;
  openModel() {
    this.openPosInvItemNote?.open();
  }
  save() {
    if (this.flag == "itm") {
      this.componentData['note'] = this.model['note']
    } else if (this.flag == "inv") {
      this.componentData['notes'] = this.model['note']
    }
    this.openPosInvItemNote.close()
  }
  closeModel() {
    this.openPosInvItemNote.close();
  }
}
