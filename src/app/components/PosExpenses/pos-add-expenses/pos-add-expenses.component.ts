import { Component, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-add-expenses',
  templateUrl: './pos-add-expenses.component.html',
  styleUrls: ['./pos-add-expenses.component.css']
})
export class PosAddExpensesComponent {
  componentData: any
  filters: any = {}
  modal: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private accountService: AccountService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    gto.openPosAddExpense$.subscribe((z: any) => {
      this.componentData = z;
      this.modal = {}
      this.openPosAddExpense()
    })
  }
  @ViewChild("PosAddExpes", { static: true }) PosSwtAcc?: any;
  openPosAddExpense() {
    (this.PosSwtAcc).closeOnOutsideClick = false;
    this.PosSwtAcc?.open();
  }
  reqFields: any = ['paymentMainTypeId', 'total']
  inputFailds: any = {}
  saving: any = false
  save() {
    if (!this.saving) {
      this.saving = true;
      this.inputFailds = {}
      let validRes = this.common.checkValidation(this.modal, this.reqFields);
      if (validRes.isValid) {
        let modal = this.prepareObjToServer(this.modal);
        this.accountService.AddVoucher(modal).subscribe({
          next: (z: any) => {
            this.saving = false;
            if (z.status) {
              this.PosSwtAcc?.close();
              this.gto.closePosAddExpense$.next(1)
            }
          }, error: e => {
            this.saving = false;
            return false
          }
        })
      } else {
        this.inputFailds = validRes.failerFields
        this.saving = false;
        this.common.error("Fill required fields", "")
        return false
      }
    }
    return true
  }
  prepareObjToServer(modal: any) {
    modal.VoucherType = 1;
    modal.IsPosExpense = true;
    modal.ShiftId = this.shiftStateManagement.CurrentShiftId;
    return modal;
  }
  closeModel() {
    this.PosSwtAcc?.close();
  }

  ngOnInit() {
  }

  lstLkpKeys: any = ['VoucherReason'];
  lstLkps: any = {}
}
