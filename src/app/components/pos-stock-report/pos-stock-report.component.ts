import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-stock-report',
  templateUrl: './pos-stock-report.component.html',
  styleUrls: ['./pos-stock-report.component.css']
})
export class PosStockReportComponent {
  private openPosStockReportSub: Subscription;
  componentData: any
  filters: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.openPosStockReportSub = gto.openPosStockReport$.subscribe((z: any) => {
      this.componentData = z;
      this.fixFilters()
      this.changeServer({ current_page: 1, pagesize: 10, sort_column: '', sort_direction: '' })
      this.openPosStockReport()
    })

    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.openPosStockReportSub) {
      this.openPosStockReportSub.unsubscribe();
    }
  }

  fixFilters() {
    if (!this.filters) this.filters = {}
    if (!this.filters['selectedList']) {
      this.filters['selectedList'] = 0
    }
  }
  @ViewChild("PosStockReportPop", { static: true }) PosStockReportP?: any;
  openPosStockReport() {
    this.PosStockReportP?.open();
  }
  actionPosOrdersList = (action = '', order = '') => {
    this.PosStockReportP?.close();
    this.gto.closePosOrdersList$.next({ action: action, order: order })
  }


  ngOnInit() {
  }

  lstLkpKeys = [];
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
    setTimeout(() => {
      this.loading = true
      let req = {
        ...this.params,
        ...this.filters
      }

      if (this.filters['selectedList'] == 0) {
        req['MinAlarm'] = true;
      }
      else if (this.filters['selectedList'] == 1) {
      }
      this.managementService.StockReport(req).subscribe(z => {
        this.otherData = z;
        this.lstData = this.otherData.lstData
        this.params.totalCount = Number(this.otherData.rowsCount)
        this.loading = false
      })
    }, 1);
  }
  cols: any = [
    { field: 'id', title: 'ID', isUnique: true },
    { field: 'nameAr', title: 'Name', sort: false },
    { field: 'quantity', title: 'Quantity', sort: false },
    { field: 'minQtyAlarm', title: 'MinQtyAlarm', sort: false },
    { field: 'maxQtyAlarm', title: 'MaxQtyAlarm', sort: false }
  ];
  selectFilter(selectedList: any) {
    this.filters['selectedList'] = selectedList;
    this.search()
  }

  listAction(action: any, r: any) {
    this.gto.closePosOrdersList$.next({ action, inv: r });
    this.PosStockReportP.close()
  }
  navTo(r: any) {
  }
}
