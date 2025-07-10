import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-department-cu',
  templateUrl: './department-cu.component.html',
  styleUrls: ['./department-cu.component.scss']
})
export class DepartmentCuComponent {

  lang = "labelEn"
  modal: any = {}
  Id;
  constructor(private lookupsService: LookupsService, private managementService: ManagementService, private common: CommonOperationsService, private route: ActivatedRoute) {
    this.Id = this.route.snapshot.paramMap.get("id");
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }
  lstData = []
  ngOnInit(): void {
    this.pageInit()
  }

  pageInit() {
    if (this.Id) {
      this.GetDetails(this.Id)
    } else {
      this.modal = { isActive: 'true' }
    }
  }
  GetDetails(Id: any) {
    this.managementService.DepartmentDetails(Id).subscribe(z => {
      this.modal = this.parseObjFromServer(z);
    })
  }
  lstLkpKeys = ['Branch'];
  lstLkps: any = {}
  parseObjFromServer(z: any) {
    if (z['lstBranches']) {
      z['_lstBranches'] = z['lstBranches'].map((a: any) => a['branchId'])
    }
    z['isActive'] = z['isActive'] == true ? 'true' : 'false'
    return z;
  }
  prepareObjToServer(modal: any) {
    modal.isActive = modal.isActive == 'true';

    if (modal['_lstBranches']) {
      modal['lstBranches'] = modal['_lstBranches'].map((a: any) => { return { branchId: a } })
    }

    return modal;
  }
  reqFields: any = ['nameEn', 'nameAr']
  inputFailds: any = {}
  save() {
    let validRes = this.common.checkValidation(this.modal, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.modal);
      this.managementService.AddDepartment(modal).subscribe({
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
          this.common.error("Fill required fields","")
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields","")
    }
  }


  back() {
    this.common.navigateTo('../system/departments')
  }
}
