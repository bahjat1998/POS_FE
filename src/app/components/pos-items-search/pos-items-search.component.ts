import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-items-search',
  templateUrl: './pos-items-search.component.html',
  styleUrls: ['./pos-items-search.component.css']
})
export class PosItemsSearchComponent {
  private openPosItemsSearchSub: Subscription;
  componentData: any
  filters: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkp.bind(this))
    this.openPosItemsSearchSub = gto.openPosItemsSearch$.subscribe((z: any) => {

      this.componentData = z;
      this.changeServer({ current_page: 1, pagesize: 50, sort_column: '', sort_direction: '' })
      this.openPosItemsSearch()
    })

    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.openPosItemsSearchSub) {
      this.openPosItemsSearchSub.unsubscribe();
    }
  }

  @ViewChild("PosItmSrchop", { static: true }) PosItmSrch?: any;
  openPosItemsSearch() {
    this.PosItmSrch?.open();
  }
  actionPosOrdersList = (action = '', order = '') => {
    this.PosItmSrch?.close();
    this.gto.closePosOrdersList$.next({ action: action, order: order })
  }


  ngOnInit() {
  }
  bindLkp() {
    if (this.lstLkps.ItemGroups) {
      this.lstLkps.ItemGroupskv = {};
      this.lstLkps.ItemGroups.forEach((lv: any) => {
        this.lstLkps.ItemGroupskv[lv.value] = lv.label
      });
    }
  }
  lstLkpKeys = ['ItemGroups'];
  lstLkps: any = {}
  PaymentMethodMap: any = {}

  params: any = {};
  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }
  loading: boolean = false;
  lstData: any
  otherData: any = {}
  search() {
    if (this.params.strSearch && this.params.strSearch.length >= 2) {
      setTimeout(async () => {
        this.loading = true
        let req = {
          ...this.params,
          ...this.filters
        }
        let z: any = await this.managementService.ItemListWithDetailsSearchFromCache(req);
        this.otherData = z;
        this.common.fixImagesUrls(this.otherData.lstData, 'img');
        this.lstData = this.otherData.lstData
        this.lstData.forEach((r: any) => {
          if (r.lstUnits && r.lstUnits.length > 0) {
            r.uLbl = r.lstUnits.map((a: any) => a.unitName).join(" , ")
          }
          // if (r.lstVariants && r.lstUnits.length > 0) {
          //   r.uLbl = r.lstUnits.map((a: any) => a.unitName).join(" , ")
          // }
        });
        this.params.totalCount = Number(this.otherData.length)
        this.loading = false
        console.log(this.lstData)
      }, 1);
    } else {
      this.params.totalCount = 10;
      this.lstData = []
    }
  }
  cols: any = [
    { field: 'id', title: '#', isUnique: true },
    { field: 'nameAr', title: 'Name', sort: false },
    { field: 'Units', title: 'Units', sort: false },
    { field: 'Variants', title: 'Variants', sort: false },
    { field: 'category', title: 'Category', sort: false }
  ];

  addItem(r: any) {
    this.filters = {}
    this.params = {}
    this.lstData = []
    this.gto.closePosItemsSearch$.next({ action: 'add', itm: r });
    this.PosItmSrch.close()
  }
}
