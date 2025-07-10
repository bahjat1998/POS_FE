import { Injectable } from "@angular/core";
import { StoreManagementService } from "../../Store/Store-Management.service";
import { AccountingService } from "../../services/Accounting/Accounting.service";
import { GeneralTemplateOperations } from "../account/account.service";
import { PosShiftPdfService } from "../../pdf/POSDomain/PosShift/pos-shift-pdf.service";
import { CommonOperationsService } from "../../services/systemcore/third-partytoasty.service";

@Injectable({
  providedIn: 'root'
})
export class ShiftStateManagement {
  DeviceKey: any = ""
  CurrentShiftId: any = ""
  constructor(private store: StoreManagementService, private common: CommonOperationsService, private posShiftPdfService: PosShiftPdfService, private accountingService: AccountingService, private gto: GeneralTemplateOperations) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this));
  }

  async CheckDeviceKey() {
    if (!this.DeviceKey) {
      this.DeviceKey = await this.store.getItemLocal("DeviceKey")
      if (!this.DeviceKey) {
        //Create Key
        this.DeviceKey = await this.store.GetNewDeviceToken();
        this.store.setItemLocal("DeviceKey", this.DeviceKey);
        return this.DeviceKey;
      }
    }
    return this.DeviceKey
  }

  checkedFromBe: any = ""
  async CheckCurrentShift(callBacks: any = {}) {
    let executeFinish = () => callBacks.OnFinish ? callBacks.OnFinish() : '';
    await this.CheckDeviceKey();
    if (!this.CurrentShiftId) {
      //Check if stored locally 
      this.CurrentShiftId = await this.store.getItemLocal("CurrentShiftId");
      //Check in the BE 
      if (!this.CurrentShiftId && !this.checkedFromBe && sessionStorage.getItem("DQWK32%423$")) {
        this.checkedFromBe = true;
        this.accountingService.ShiftDetails({ DeviceKey: this.DeviceKey ? this.DeviceKey : "DEVICETOKEN", ActiveOnly: true }).subscribe(z => {
          if (z && z.id) {
            this.CurrentShiftId = z.id;
            this.SetCurrentShiftId(this.CurrentShiftId)
            executeFinish()
            this.checkedFromBe = false;
          }
        })
      } else {
        this.SetCurrentShiftId(this.CurrentShiftId)
        executeFinish()
      }
    } else {
      this.SetCurrentShiftId(this.CurrentShiftId)
      executeFinish()
    }
  }

  SetCurrentShiftId(currentShiftId: any) {
    this.store.setItemLocal("CurrentShiftId", currentShiftId);
    this.CurrentShiftId = currentShiftId;
    this.gto.currentActiveShiftChanged$.next(this.CurrentShiftId)
    this.lastClosedShiftDetails = null;
  }
  ClearCurrentShiftId() {
    this.store.removeItem("CurrentShiftId");
    this.CurrentShiftId = 0;
    this.gto.currentActiveShiftChanged$.next('')
  }
  CreateShift() {
    //Create Shift Logic
  }
  CloseShift() {
    //Create Shift Logic
  }
  ShiftCommand(flag: any) {
    if (flag == "Create") {
      this.CheckCurrentShift({ CreateShift: () => this.CreateShift() })
    }
    else if (flag == "Close") {
      //CloseShift
    }
    else if (flag == "ShowDetails") {
      //ShowDetails
    }
  }

  lastClosedShiftDetails: any = {};
  PrintClosedShift(shiftId: any) {
    this.accountingService.ShiftDetails({ ShiftId: shiftId }).subscribe(z => {
      if (z.id) {
        this.lastClosedShiftDetails = z;
        this.PrintShiftDetails(z)
      }
    })
  }
  lstLkpKeys = ['PaymentMethod'];
  lstLkps: any = {}
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
  }

  PrintShiftDetails(details: any) {
    if (details.lstPaymentTotals)
      details.lstPaymentTotals.forEach((p: any) => {
        p.lbl = this.PaymentMethodMap[p.paymentMethod];
      });
    this.posShiftPdfService.PrintPdf(details)
  }
}
