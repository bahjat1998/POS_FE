import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrls: ['./permission-form.component.css']
})
export class PermissionFormComponent {
  @Input() permission: any = {}

  @Input() set setPermission(z: any) {
    this.permission = z;
    if (z['lstPermissions']) {
      this.permission['_permissions'] = JSON.parse(z['lstPermissions'])
    } else {
      this.permission['_permissions'] = {}
    }
  }

  @Output() bindVal = new EventEmitter<any>();

  ch() {
    this.bindVal.next(this.permission['_permissions'])
  }
  constructor(public common: CommonOperationsService) {
  }


  lstPosPermissions = [
    { isPos: true, label: "QuickPay", value: "QuickPay" },
    { isPos: true, label: "Split", value: "Split" },
    { isPos: true, label: "Tables", value: "Tables" },
    { isPos: true, label: "PrintTicket", value: "PrintTicket" },
    { isPos: true, label: "Other", value: "Other" },
    { isPos: true, label: "Drawer", value: "Drawer" },
    { isPos: true, label: "StockReport", value: "StockReport" },
    { isPos: true, label: "NoteToKitchen", value: "NoteToKitchen" },
    { isPos: true, label: "LastClosedShiftDetails", value: "LastClosedShiftDetails" },
    { isPos: true, label: "BuyInvoice", value: "BuyInvoice" },
    { isPos: true, label: "EmployeeInvoice", value: "EmployeeInvoice" },
    { isPos: true, label: "DisposalInvoice", value: "DisposalInvoice" },
    { isPos: true, label: "Expenses", value: "Expenses" },
    { isPos: true, label: "PendingList", value: "PendingList" },
    { isPos: true, label: "Pending", value: "Pending" },
    { isPos: true, label: "DeliveryCustomer", value: "DeliveryCustomer" },
    { isPos: true, label: "Pay", value: "Pay" },
    { isPos: true, label: "DeleteItemAfterSave", value: "DeleteItemAfterSave" },
    { isPos: true, label: "ChangeDiscount", value: "ChangeDiscount" },
    { isPos: true, label: "ChangeService", value: "ChangeService" }
  ]
}
