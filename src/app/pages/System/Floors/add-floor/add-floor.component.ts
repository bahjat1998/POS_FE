import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-add-floor',
  templateUrl: './add-floor.component.html',
  styleUrls: ['./add-floor.component.css']
})
export class AddFloorComponent {

  lang = "labelEn"
  modal: any = {}
  Id;
  constructor(private lookupsService: LookupsService, private accountingService: AccountingService, private common: CommonOperationsService, private route: ActivatedRoute) {
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
    this.accountingService.FloorDetails({ id: Id }).subscribe(z => {
      this.modal = this.parseObjFromServer(z);
    })
  }
  lstLkpKeys = [];
  lstLkps: any = {}
  parseObjFromServer(z: any) {
    z['isActive'] = z['isActive'] == true ? 'true' : 'false'
    return z;
  }
  prepareObjToServer(modal: any) {
    modal.isActive = modal.isActive == 'true';
    return modal;
  }
  reqFields: any = ['name']
  inputFailds: any = {}
  save() {
    let validRes = this.common.checkValidation(this.modal, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.modal);
      this.accountingService.AddFloor(modal).subscribe({
        next: (z: any) => {
          this.inputFailds = {}
          if (z.status) {
            this.common.success("تم الحفظ")
            this.Id = z['entityId']
            this.GetDetails(this.Id);
          }
          if (z['lstError'].length > 0) {
            this.common.error("Error", z['lstError'][0])
          }

        }, error: (e: any) => {
          this.common.error("Fill required fields", "")
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
    }
  }


  back() {
    this.common.navigateTo('../system/floors')
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
