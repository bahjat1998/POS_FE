import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent {

  lang = "labelEn"
  modal: any = {}
  constructor(private lookupsService: LookupsService, private accountService: AccountService, private common: CommonOperationsService, private route: ActivatedRoute) {
  }
  lstData = []
  ngOnInit(): void {
    this.loadLookups()
    this.pageInit()
    this.selectTab(this.lstTabs[0])
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps);
  }

  pageInit() {
    this.GetDetails()
  }
  GetDetails() {
    this.accountService.CompanyDetails().subscribe(z => {
      this.modal = this.parseObjFromServer(z);
    })
  }
  lstKeysRequiredOnInventoryLookups = [];
  lstInventoryLookupsByKey: any = {}
  loadLookups() {
    this.lstKeysRequiredOnInventoryLookups.forEach(key => {
      this.lookupsService.Lookups(key).subscribe(z => {
        this.lstInventoryLookupsByKey[key] = z;
      })
    })
  }
  parseObjFromServer(z: any) {
    if (z) {
      if (z['lstDepartmentBranches']) {
        z['_lstDepartmentBranches'] = z['lstDepartmentBranches'].map((a: any) => a['branchId'])
      }
      z['isActive'] = z['isActive'] == true ? 'true' : 'false'

      if (z['otherSetup']) {
        z['_otherSetup'] = JSON.parse(z['otherSetup'])
      } else {
        z['_otherSetup'] = {}
      }
    } else {
      z = {}
    }
    return z;
  }
  prepareObjToServer(modal: any) {
    modal.isActive = modal.isActive == 'true';

    if (modal['_lstDepartmentBranches']) {
      modal['lstDepartmentBranches'] = modal['_lstDepartmentBranches'].map((a: any) => { return { branchId: a } })
    }

    if (modal['otherSetup']) {
      modal['otherSetup'] = JSON.stringify(modal['_otherSetup'])
    }
    return modal;
  }
  reqFields: any = ['nameEn', 'nameAr']
  inputFailds: any = {}
  save() {
    let validRes = this.common.checkValidation(this.modal, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.modal);
      this.accountService.AddCompany(modal).subscribe({
        next: z => {
          this.inputFailds = {}
          if (z.status) {
            this.common.success("تم الحفظ")
            this.GetDetails();
          }
          if (z['lstError'].length > 0) {
            this.common.error("Error", z['lstError'][0])
          }

        }, error: e => {
          this.common.error("Fill required fields", "")
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
    }
  }


  back() {
    this.common.navigateTo('../system/departments')
  }
  lstTabs = [
    { label: "CompanyBranches", value: 0 },
    { label: "ReportsSetup", value: 1 }
  ]
  lstWords: any = {
    "AreYouSure": "",
    "DeleteThisItem": "",
    "?": ""
  };
  lstLkpKeys = ['Branch', 'lstShiftType', '_Account_4', 'InvoiceCategories'];
  lstLkps: any = {}
  async deleteRow(details: any, i: any) {
    if (this.modal[details][i].id) {
      let result = await this.common.confirmationMessage(this.lstWords['AreYouSure'], `${this.lstWords['DeleteThisItem']} ${this.lstWords['?']}`);
      if (result.value) {
        this.executeDelete(details, i)
      }
    } else {
      this.executeDelete(details, i)
    }

  }
  executeDelete(details: any, i: any) {
    this.modal[details].splice(i, 1);
  }
  newRow(details: any) {
    if (!this.modal[details]) this.modal[details] = []
    let obj = {}
    this.modal[details].push(obj);
  }

  selectedTab: any = {}
  selectTab(t: any) {
    this.selectedTab = t;
  }
}
