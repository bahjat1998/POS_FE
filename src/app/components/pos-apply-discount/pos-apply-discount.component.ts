import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pos-apply-discount',
  templateUrl: './pos-apply-discount.component.html',
  styleUrls: ['./pos-apply-discount.component.css']
})
export class PosApplyDiscountComponent {
  private openApplyPosDiscountSub: Subscription;
  filters: any = {}
  modal: any = {}
  localModel: any = {}

  constructor(private gto: GeneralTemplateOperations, private accountingService: AccountingService, private invoiceHelperService: InvoiceHelperService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.openApplyPosDiscountSub = gto.openApplyPosDiscount$.subscribe((z: any) => {
      this.modal = z.orderDetails
      if (this.modal.discountResponse) {
        this.localModel = this.modal.discountResponse
      } else if (this.modal['discountAccountId']) {
        this.localModel['selectedAccountId'] = this.modal['discountAccountId']
        this.accountChanged()
      }
      else {
        this.clearLocalModule()
      }
      this.openPosSelectAccount()
    })
  }
  ngOnDestroy() {
    if (this.openApplyPosDiscountSub) {
      this.openApplyPosDiscountSub.unsubscribe();
    }
  }

  loading = false;
  accountChanged() {
    setTimeout(() => {
      if (this.localModel['selectedAccountId']) {
        let req = {
          Flag: "LoadAccountDiscount",
          int01: this.localModel['selectedAccountId']
        }
        this.loading = true
        this.accountingService.CommonAccountingQueries(req).subscribe(z => {
          this.loading = false
          this.localModel = { ...this.localModel, ...z.accountDiscountQuery, loaded: true }
        }, e => this.loading = false)
      }
    }, 10);
  }
  @ViewChild("PosSlctAccDisc", { static: true }) PosSlctAccDisc?: any;
  openPosSelectAccount() {
    (this.PosSlctAccDisc).closeOnOutsideClick = false;
    this.PosSlctAccDisc?.open();
  }
  save() {
    this.modal['discountAccountId'] = this.localModel.accountId;
    if (this.localModel.discountAmount) {
      this.modal.discAmount = this.localModel.discountAmount
    }
    else if (this.localModel.discountPercentage) {
      this.modal.discPer = this.localModel.discountPercentage
    }
    let discountAcc = this.lstLkps['_Account_1_t'].find((z: any) => z.value == this.localModel['accountId']);
    if (discountAcc) {
      this.modal.discountAccountName = discountAcc.label
    }
    this.modal.discountResponse = this.localModel
    this.invoiceHelperService.calculateInvoiceTotals(this.modal, this.localModel.discountAmount ? 'discAmount' : 'discPer')
    this.PosSlctAccDisc?.close();
    this.modal.changed = true;
  }
  clearLocalModule() {
    this.localModel = {}
  }
  removeDiscount() {
    delete this.modal['discountAccountId']
    this.modal['discAmount'] = 0
    delete this.modal['discPer']
    delete this.modal['discountAccountName']
    delete this.modal.discountResponse
    this.invoiceHelperService.calculateInvoiceTotals(this.modal, 'discAmount')
    this.modal.changed = true;
    this.PosSlctAccDisc?.close();
  }
  closeModel() {
    this.PosSlctAccDisc?.close();
  }

  ngOnInit() {
  }

  lstLkpKeys: any = ['_Account_1_t'];
  lstLkps: any = {}
}
