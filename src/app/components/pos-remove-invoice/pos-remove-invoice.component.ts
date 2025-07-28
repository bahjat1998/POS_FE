import { Component, ViewChild } from '@angular/core';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pos-remove-invoice',
  templateUrl: './pos-remove-invoice.component.html',
  styleUrls: ['./pos-remove-invoice.component.css']
})
export class PosRemoveInvoiceComponent {
  componentData: any;
  model: any = {}
  flag = '';
  constructor(private gto: GeneralTemplateOperations, public common: CommonOperationsService, private managementService: ManagementService) {
    gto.openPosRemoveInvoice$.subscribe((z: any) => {
      this.model = z
      this.componentData = z;
      this.openModel()
    })
  }


  lstLkpKeys = ['DeleteReason'];
  lstLkps: any = {}

  ngOnInit(): void {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }

  @ViewChild("PosRInv", { static: true }) PosRInv?: any;
  openModel() {
    this.PosRInv?.open();
  }
  save() {
    if (!this.model.deleteReasonId) {
      return;
    }
    let req = {
      flag: 1,
      ...this.model
    }
    this.managementService.InvoiceCommands(req).subscribe(z => {
      if (z.status) {
        this.common.success("Deleted");
        this.gto.closePosRemoveInvoice$.next(true)
      } else {
        if (z.lstError && z.lstError.length > 0) {
          this.common.confirmationMessage(undefined, z.lstError[0])
        }
      }
    })
    this.PosRInv.close()
  }
  closeModel() {
    this.PosRInv.close();
  }

}
