import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-shifts-cu',
  templateUrl: './shifts-cu.component.html',
  styleUrls: ['./shifts-cu.component.css']
})
export class ShiftsCuComponent {
  lang = "labelEn"
  modal: any = {}
  Id;
  constructor(private lookupsService: LookupsService, private accountingService: AccountingService, public common: CommonOperationsService, private route: ActivatedRoute) {
    this.Id = this.route.snapshot.paramMap.get("id");
    this.selectTab(this.lstTabs[0]);
  }
  lstData = []
  selectedTab: any = {}
  lstTabs = [
    { label: "ShiftOrders", value: 0 },
    { label: "ShiftVouchers", value: 1 }
  ]
  selectTab(t: any) {
    this.selectedTab = t;
  }
  ngOnInit(): void {
    this.pageInit()
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this));
    setTimeout(() => {

    }, 10);
  }
  lstLkpKeys = ['PaymentMethod'];
  lstLkps: any = {}
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
  }
  pageInit() {
    if (this.Id) {
      this.GetDetails(this.Id)
    } else {
      this.modal = { isActive: 'true' }
    }
  }
  GetDetails(Id: any) {
    this.accountingService.ShiftDetails({ shiftId: Id }).subscribe(z => {
      this.modal = this.parseObjFromServer(z);
    })
  }
  parseObjFromServer(z: any) {
    if (z['lstDepartmentBranches']) {
      z['_lstDepartmentBranches'] = z['lstDepartmentBranches'].map((a: any) => a['branchId'])
    }
    z['isActive'] = z['isActive'] == true ? 'true' : 'false'
    return z;
  }
  prepareObjToServer(modal: any) {
    modal.isActive = modal.isActive == 'true';

    if (modal['_lstDepartmentBranches']) {
      modal['lstDepartmentBranches'] = modal['_lstDepartmentBranches'].map((a: any) => { return { branchId: a } })
    }

    return modal;
  }

  back() {
    this.common.navigateTo('../shifts/cu')
  }
  deleteRow(details: any, i: any) {
    this.modal[details].splice(i, 1);
  }
  newRow(details: any) {
    if (!this.modal[details]) this.modal[details] = []
    let obj = {}
    this.modal[details].push(obj);
  }
}
