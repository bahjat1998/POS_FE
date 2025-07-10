import { Component, Input, ViewChild } from '@angular/core';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-crud-shift',
  templateUrl: './crud-shift.component.html',
  styleUrls: ['./crud-shift.component.css']
})
export class CrudShiftComponent {
  componentData: any;
  options: any = {}
  model: any = {}

  @Input() ShowButtons = true;

  currentShiftId: any

  constructor(private gto: GeneralTemplateOperations, private shiftManagement: ShiftStateManagement, private accountingService: AccountingService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.shiftManagement.CheckDeviceKey();
    this.common.translateList(this.lstWords);

    if (!this.currentShiftId) {
      this.shiftManagement.CheckCurrentShift({ OnFinish: this.handleShiftStatus.bind(this) })
    }
  }

  initialShiftData() {
    // let currentUserInfo = this.common.getCurrentUserInfo();
    // currentUserInfo.posDetails.
  }
  handleShiftStatus() {
    this.currentShiftId = this.shiftManagement.CurrentShiftId;
  }
  @ViewChild("PosShiftDetails", { static: true }) openPosShiftDetails?: any;
  @ViewChild("PosShiftClose", { static: true }) openPosShiftClose?: any;
  @ViewChild("PosShiftOpen", { static: true }) openPosShiftOpen?: any;
  openModel(modal: any) {
    modal?.open();
  }
  lstLkpKeys = [];
  lstLkps: any = {}

  save() {
    // this.gto.closePosPaymentScreen$.next({ ...this.componentData.orderDetails, paid: this.componentData.orderDetails.paid })
    this.openPosShiftDetails.close()
  }

  reqFields: any = []
  inputFailds: any = {}

  closeModel() {
    this.openPosShiftClose?.close()
    this.openPosShiftOpen?.close()
    this.openPosShiftDetails?.close()
  }

  //Start Create Shift Logic 
  openShift() {
    this.openModel(this.openPosShiftOpen);
  }
  async prepareObjToServer_CS(modal: any) {
    let obj = modal;
    obj.DeviceKey = await this.shiftManagement.CheckDeviceKey();
    return obj;
  }
  saving = false;
  async CreateShiftSave() {
    if (!this.saving) {
      this.saving = true;
      this.reqFields = ['startCash']
      this.inputFailds = {};
      let validRes = this.common.checkValidation(this.model, this.reqFields);
      if (validRes.isValid) {
        let obj = await this.prepareObjToServer_CS(this.model);
        this.accountingService.AddShift({
          OpenShift: obj
        }).subscribe({
          next: z => {
            this.saving = false;
            this.inputFailds = {}
            if (z.status) {
              this.common.success("تم الحفظ")
              this.currentShiftId = z['entityId'];
              this.shiftManagement.lastClosedShiftDetails = ''
              // this.gto.closePosShiftDetails$.next({
              //   flag: "CreateShift",
              //   newShiftId: currentShiftId
              // });

              this.shiftManagement.SetCurrentShiftId(this.currentShiftId);
              this.openPosShiftOpen.close()
              this.model = {}
            }
            if (z['lstError'].length > 0) {
              this.common.error("Error", z['lstError'][0])
            }
          }, error: e => {
            this.saving = false;
            this.common.error("Fill required fields", "")
          }
        })

      } else {
        this.saving = false;
        this.inputFailds = validRes.failerFields
        this.common.error("Fill required fields", "")
      }
    }
  }
  //End Create Shift Logic 






  //Start Close Shift Logic 
  shiftDetails: any = {}
  closeShift() {
    this.accountingService.ShiftDetails({ shiftId: this.currentShiftId }).subscribe(z => {
      this.shiftDetails = z;
    })
    this.openModel(this.openPosShiftClose);
  }
  prepareObjToServer_ClS(modal: any) {
    let obj = { ...modal, DeviceKey: this.shiftManagement.DeviceKey };
    return obj;
  }


  lstWords = {
    "PleaseCloseAllOpenedOrdersFirst": ""
  }
  CloseShiftSave() {
    if (!this.saving) {
      this.saving = true;
      this.reqFields = ['endCash']
      this.inputFailds = {};
      let validRes = this.common.checkValidation(this.model, this.reqFields);
      if (validRes.isValid) {
        let obj = this.prepareObjToServer_ClS(this.model);
        this.accountingService.AddShift({
          CloseShift: obj
        }).subscribe({
          next: z => {
            this.saving = false;
            this.inputFailds = {}
            if (z.status) {
              this.shiftManagement.PrintClosedShift(this.currentShiftId)
              this.common.success("تم الاغلاق")
              this.shiftManagement.ClearCurrentShiftId();
              this.openPosShiftClose?.close();
              this.currentShiftId = 0;
            }
            if (z['lstError'].length > 0) {
              let err = z['lstError'][0];
              if (err.indexOf("anyOpenedOrder") > -1) {
                this.common.error(this.lstWords['PleaseCloseAllOpenedOrdersFirst'] + '=>' + err.split("_")[1])
              }
              else {
                this.common.error(z['lstError'][0])
              }
            }
          }, error: e => {
            this.saving = false;
            this.common.error("Fill required fields", "")
          }
        })
      } else {
        this.saving = false;
        this.inputFailds = validRes.failerFields
        this.common.error("Fill required fields", "")
      }
    }
  }

  //End Close Shift Logic 
}
