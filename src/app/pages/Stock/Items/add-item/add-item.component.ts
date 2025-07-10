import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {

  lang = "labelEn"
  modal: any = {}
  Id;
  constructor(private lookupsService: LookupsService, private managementService: ManagementService, public common: CommonOperationsService, private route: ActivatedRoute) {
    this.Id = this.route.snapshot.paramMap.get("id");
    this.selectTab(this.lstTabs[0])
  }
  lstData = []
  selectedTab: any = {}
  lstTabs = [
    { label: "ItemPrices", value: 0 },
    { label: "ItemVariants", value: 1 },
    { label: "AddOns", value: 2 }
  ]
  selectTab(t: any) {
    this.selectedTab = t;
  }
  ngOnInit(): void {
    // this.loadLookups()
    this.pageInit()
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }
  lstLkpKeys = ['lstItemType', 'ItemGroups', 'SubItemGroups', 'Stores', 'ItemUnits', 'ItemsPricesLists', 'lstItemsLkp'];
  lstLkps: any = {}
  pageInit() {
    if (this.Id) {
      this.GetDetails(this.Id)
    } else {
      this.modal = { isActive: 'true' }
    }
  }
  GetDetails(Id: any) {
    this.managementService.ItemDetails(Id).subscribe(z => {
      this.modal = this.parseObjFromServer(z);
    })
  }
  // lstKeysRequiredOnInventoryLookups = [];
  // lstInventoryLookupsByKey: any = {}
  // loadLookups() {
  //   this.lstKeysRequiredOnInventoryLookups.forEach(key => {
  //     this.lookupsService.Lookups(key).subscribe(z => {
  //       this.lstInventoryLookupsByKey[key] = z;
  //     })
  //   })
  // }
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
  reqFields: any = ['nameEn', 'nameAr', 'defaultUnitId']
  inputFailds: any = {}
  save() {
    let validRes = this.common.checkValidation(this.modal, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.modal);
      this.managementService.AddItem(modal).subscribe({
        next: z => {
          this.inputFailds = {}
          if (z.status) {
            this.common.success("تم الحفظ")
            this.Id = z['entityId']
            this.GetDetails(this.Id);
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
    this.common.navigateTo('../system/items')
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
