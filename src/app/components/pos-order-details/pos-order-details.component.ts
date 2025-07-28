import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pos-order-details',
  templateUrl: './pos-order-details.component.html',
  styleUrls: ['./pos-order-details.component.css']
})
export class PosOrderDetailsComponent {
  private openPosOrderDetailsSub: Subscription;
  componentData: any
  model: any = {}
  sourceDelivery: any;
  constructor(gto: GeneralTemplateOperations, private managementService: ManagementService, private common: CommonOperationsService) {
    this.openPosOrderDetailsSub = gto.openPosOrderDetails$.subscribe((z: any) => {
      this.componentData = z;
      if (this.componentData.orderDetails) {
        this.model = this.componentData.orderDetails
      } else if (this.componentData.loadInvoiceId) {
        this.getInvoiceDetails(this.componentData.loadInvoiceId)
      }
      this.openPosOrderDetails()

      if (this.model.deliveryCustomer) {
        this.sourceDelivery = this.model.deliveryCustomer;
        this.sourceDelivery.address = this.model.deliveryCustomer.address;
      }
      else if (this.model.localDeliverySetup) {
        this.sourceDelivery = this.model.localDeliverySetup;
      }

      if (this.model.deliveryCustomerAddress) {
        this.sourceDelivery['address'] = this.model.deliveryCustomerAddress
      }
    })

    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.openPosOrderDetailsSub) {
      this.model = {}
      this.openPosOrderDetailsSub.unsubscribe();
    }
  }
  @ViewChild("C_Pop", { static: true }) C_Pop?: any;
  openPosOrderDetails() {
    this.C_Pop?.open();
  }
  close = () => {
    this.C_Pop?.close();
  }

  cols: any = [
    { field: 'ID_', title: '#' },
    { field: 'ItemName', title: 'ItemName' },
    { field: 'Details', title: 'Details' },
    { field: 'Quantity', title: 'Quantity' },
    { field: 'Price', title: 'Price' },
    { field: 'Total', title: 'Total' },
    { field: 'Audit', title: 'Audit' },
    { field: 'note', title: 'Notes' }
  ];
  render = true;
  getInvoiceDetails(id: any) {
    let req = {
      id: id
    }
    this.render = false
    this.managementService.InvoiceDetails(req).subscribe(z => {
      this.model = z;
      this.model.totQty = this.common.sum(this.model.lstItems, 'quantity')
      this.render = true
    })
  }
}
