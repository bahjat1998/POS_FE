import { Component, ViewChild } from '@angular/core';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-remove-item',
  templateUrl: './remove-item.component.html',
  styleUrls: ['./remove-item.component.css']
})
export class RemoveItemComponent {
  componentData: any;
  model: any = {}
  flag = '';
  constructor(private gto: GeneralTemplateOperations, public common: CommonOperationsService, private invoiceHelperService: InvoiceHelperService) {
    gto.openPosRemoveItem$.subscribe((z: any) => {
      this.model = { qtyToDelete: z.itm.quantity }
      this.componentData = z;
      this.openModel()
    })
  }


  lstLkpKeys = ['DeleteReason'];
  lstLkps: any = {}

  ngOnInit(): void {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }



  @ViewChild("PosRemoveItem", { static: true }) PosRemoveItem?: any;
  openModel() {
    this.PosRemoveItem?.open();
  }
  save() {
    this.invoiceHelperService.addItemToDeletedList(this.componentData.inv, this.componentData.itm, this.model.qtyToDelete, this.model.deleteReasonId)
    this.PosRemoveItem.close()
  }
  closeModel() {
    this.PosRemoveItem.close();
  }


}
