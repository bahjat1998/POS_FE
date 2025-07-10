import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ViewChild } from '@angular/core';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pay-order-popup',
  templateUrl: './pay-order-popup.component.html',
  styleUrls: ['./pay-order-popup.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class PayOrderPopupComponent {
  componentData: any;
  options: any = {}
  constructor(private gto: GeneralTemplateOperations, private invoiceHelperService: InvoiceHelperService, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    gto.openPosPaymentScreen$.subscribe((z: any) => {
      this.componentData = z;
      this.resetModel()
      if (this.componentData.forOrderId) {
        this.managementService.InvoiceDetails({ id: this.componentData.forOrderId }).subscribe(inv => {
          this.componentData.orderDetails = inv;
          this.checkRelatedSelectedPredefinedCurr()
        })
      } else {
        this.checkRelatedSelectedPredefinedCurr()
      }
      this.componentData.paymentType = this.componentData.orderDetails.paymentType
      this.openModel()
    })

    this.common.translateList(this.lstWords)
    this.common.translateList(this.lstLkps['ExtraActions'])
  }
  @ViewChild("PosPaymentScreenPopup", { static: true }) PosPaymentScreenPopup?: any;
  openModel() {
    this.PosPaymentScreenPopup?.open();
  }
  lstLkpKeys = ['lstPredefinedCurrenciesValues', "PaymentMethod"];
  lstLkps: any = {
    'ExtraActions': [
      { label: "Clear", value: 'Clear', class: "btn-danger" },
      // { label: "ChangeCurrency", value: 'CC', class: "btn-secondary" },
      // { label: "Split", value: 'Split', class: "btn-info" },
      { label: "Auto", value: 'Auto', class: "btn-success" }
    ]
  }

  resetModel() {
    this.lstLkps['lstPredefinedCurrenciesValues'].forEach((r: any) => r.selected = false);
    this.clearBtn()
  }

  checkRelatedSelectedPredefinedCurr() {
    this.lstLkps['lstPredefinedCurrenciesValues'].forEach((r: any) => {
      if (r.value == this.componentData.orderDetails.paid) r.selected = true
      else r.selected = false;
    });
  }
  calcValue: any = ''
  handleCustomAction(action: any) {
    if (action == "Clear") {
      this.clearBtn()
    }
    else if (action == "Auto") {
      this.autoBtn()
    }
  }
  clearBtn() {
    this.reRenderCalc();
    this.updateInvoiceCalculateion(0);
    this.calcValue = ''
  }
  autoBtn() {
    this.calcValue = this.componentData.orderDetails.finalTotal;
    this.updateInvoiceCalculateion(this.componentData.orderDetails.finalTotal);
  }
  updateInvoiceCalculateion(paidAmount: any) {
    this.componentData.orderDetails.paid = paidAmount;
    this.invoiceHelperService.updateInvoiceCalculateion(this.componentData.orderDetails)
    this.checkRelatedSelectedPredefinedCurr()
  }
  updateCalc($event: any) {
    this.calcValue = $event
    this.updateInvoiceCalculateion(Number($event))
  }
  selectPredefinedCurrency(r: any) {
    this.calcValue = r.value
    // this.calcValue
    this.updateInvoiceCalculateion(r.value)
  }
  renderCalc = true;
  reRenderCalc() {
    this.renderCalc = false;
    setTimeout(() => {
      this.renderCalc = true
    }, 10);
  }
  lstWords = {
    "PaymentShouldEqualTotal": ""
  }

  save(withoutPrinters = "") {
    //This validation should be appear if only not default account selected
    let currentUserInfo = this.common.getCurrentUserInfo();
    if (this.componentData.orderDetails.accountId == currentUserInfo.posDetails.posSalesAccountId) {
      if (this.componentData.orderDetails.paid < this.componentData.orderDetails.finalTotal || this.componentData.orderDetails.paid == 0) {
        this.common.error(this.lstWords["PaymentShouldEqualTotal"])
        return;
      }
    }
    if (this.componentData.orderDetails.id) {
      this.gto.closePosPaymentScreen$.next({ ...this.componentData.orderDetails, paymentType: this.componentData.paymentType, paid: this.componentData.orderDetails.paid, source: this.componentData.source, withoutPrinters: withoutPrinters })
      this.PosPaymentScreenPopup.close()
    }
    else if (this.componentData.source == "SPLIT") {
      this.gto.closePosPaymentScreen$.next({ ...this.componentData.orderDetails, paymentType: this.componentData.paymentType, paid: this.componentData.orderDetails.paid, source: this.componentData.source, withoutPrinters: withoutPrinters })
      this.PosPaymentScreenPopup.close()
    }
    else {
      this.common.info("wait");
      setTimeout(() => {
        this.save()
      }, 500);
    }
  }

  handleChangePaymentMethod(selectedPaymentEnum: any) {
    this.componentData.paymentType = selectedPaymentEnum;
  }
}
