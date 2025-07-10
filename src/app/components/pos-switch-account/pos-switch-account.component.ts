import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-switch-account',
  templateUrl: './pos-switch-account.component.html',
  styleUrls: ['./pos-switch-account.component.css']
})
export class PosSwitchAccountComponent {
  private openPosSelectAccountSub: Subscription;
  componentData: any
  filters: any = {}
  modal: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private common: CommonOperationsService) {
    this.openPosSelectAccountSub = gto.openPosSelectAccount$.subscribe((z: any) => {
      this.componentData = z;
      this.modal = {}
      if (z.defaultDestructionAccount) {
        this.modal['accountId'] = this.componentData.defaultDestructionAccount
      }
      this.lstLkpKeys.push(this.componentData.source)
      this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
      this.fixFilters()
      this.openPosSelectAccount()
    })
  }
  ngOnDestroy() {
    if (this.openPosSelectAccountSub) {
      this.openPosSelectAccountSub.unsubscribe();
    }
  }

  fixFilters() {
    if (!this.filters) this.filters = {}
    if (!this.filters['selectedList']) {
      this.filters['selectedList'] = 0
    }
  }
  @ViewChild("PosSwtAccop", { static: true }) PosSwtAcc?: any;
  openPosSelectAccount() {
    (this.PosSwtAcc).closeOnOutsideClick = false;
    this.PosSwtAcc?.open();
  }
  save() {
    this.PosSwtAcc?.close();
    let relatedAccountInfo = this.lstLkps[this.componentData.source].find((z: any) => z.value == this.modal['accountId'])
    this.gto.closePosSelectAccount$.next({ ...this.componentData, ...this.modal, account: relatedAccountInfo })
  }
  closeModel() {
    this.PosSwtAcc?.close();
    this.gto.closePosSelectAccount$.next({ ...this.componentData }) //Make sure to close with component data to clear parent component setups
  }

  ngOnInit() {
  }

  lstLkpKeys: any = [];
  lstLkps: any = {}
}
