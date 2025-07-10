import { Component, Input } from '@angular/core';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-add-voucher',
  templateUrl: './add-voucher.component.html',
  styleUrls: ['./add-voucher.component.css']
})
export class AddVoucherComponent {
  model: any = {}
  @Input() closeDialog: any;
  intialData: any
  @Input() set SetInitial(z: any) {
    this.intialData = z;
    this.model = this.prepareObjFromServer(z.voucher ?? z);
    this.accountTypeChanged();
    this.PaymentMethodChanged();
    this.pageInit(z);
  }

  lstLkpKeys = ['PaymentMethod', 'lstUserTypes', 'Bank', 'VoucherReason'];
  lstLkps: any = {}

  constructor(private common: CommonOperationsService, private accountService: AccountService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.PaymentMethodChanged.bind(this))
  }

  pageInit(z: any) {

  }

  accountListLkpKey = ""
  accountTypeChanged() {
    setTimeout(() => {
      if (this.model['accountType']) {
        this.accountListLkpKey = `_Account_${this.model['accountType']}_t`
        this.lstLkpKeys.push(this.accountListLkpKey)
        this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
      } else {
        this.accountListLkpKey = ''
      }
    }, 10);
  }

  prepareObjFromServer(z: any) {
    if (z.onDate) {
      z.chequeDate = this.common.dateFormat(z.chequeDate)
      z.onDate = this.common.dateFormat(z.onDate)
    }
    else {
      z = { voucherType: this.intialData.voucherType, onDate: this.common.dateFormat(new Date()) }
      z.onDate = this.common.dateFormat(z.onDate)
    }


    if (z.total)
      z.total = Math.abs(z.total)
    return z;
  }
  prepareObjToServer(modal: any) {
    // modal.voucherTypeName = this.common.getLabelFromLkp(this.lstLkps['PaymentType'], modal.paymentTypeId)
    modal.chequeBankName = this.common.getLabelFromLkp(this.lstLkps['Bank'], modal.chequeBankId)
    return modal;
  }
  currentPaymentType: any = {}
  PaymentMethodChanged() {
    setTimeout(() => {
      if (this.lstLkps['PaymentType']) {
        this.currentPaymentType = this.common.getRelatedFromLkp(this.lstLkps['PaymentType'], this.model.paymentTypeId)
      }
    }, 2);
  }
  reqFields: any = ['onDate', 'paymentType', 'total']
  inputFailds: any = {}
  saving: any = false
  save() {
    this.inputFailds = {}
    let validRes = this.common.checkValidation(this.model, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.model);
      this.common.info("Please wait!", "")
      this.saving = true;
      this.accountService.AddVoucher(modal).subscribe({
        next: (z: any) => {
          this.saving = false;
          if (z.status) {
            this.common.success("Saved")
            this.closeDialog()
          }
          // if (z['lstError'].length > 0) {
          //   this.common.error(z['lstError'][0])
          // }

        }, error: e => {
          this.saving = false;
          return false
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
      return false
    }
    return true;
  }
}
