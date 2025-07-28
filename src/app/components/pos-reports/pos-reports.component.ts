import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-reports',
  templateUrl: './pos-reports.component.html',
  styleUrls: ['./pos-reports.component.css']
})
export class PosReportsComponent {
  private openPosReportsSub: Subscription;
  componentData: any
  filters: any = {}
  buttons: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.openPosReportsSub = gto.openPosReports$.subscribe((z: any) => {
      this.componentData = z;
      this.SetFilters()
      this.selectTab(this.tabs[0])
      this.openPosReports()
    })
    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.openPosReportsSub) {
      this.openPosReportsSub.unsubscribe();
    }
  }

  @ViewChild("PosReportsPopup", { static: true }) PosReportsPopup?: any;
  openPosReports() {
    this.PosReportsPopup?.open();
  }
  actionPosReports = (action = '', order = '') => {
    this.PosReportsPopup?.close();
    // this.gto.closePosReports$.next({ action: action, order: order })
  }


  ngOnInit() {
  }

  lstLkpKeys = ['ItemGroups'];
  lstLkps: any = {
    "ItemsFilter": [
      { label: "Sales", value: 'Sales' },
      { label: "Deleted", value: 'Deleted' }
    ]
  }
  bindLkps() {
  }

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
        ...this.filters,
        ShiftId: this.shiftStateManagement.CurrentShiftId,
        flag: "Pos"
      }
      if (req.groupIds) {
        req.groupIds = req.groupIds.join(",")
      }
      this.managementService.PosSoldItems(req).subscribe(z => {
        this.otherData = z;
        this.common.fixDateTimeFormats(this.otherData.lstData, ['createDate'])
        this.otherData.lstData.forEach((r: any) => {
          let relatedLkp = this.common.getRelatedFromLkp(this.lstLkps['lstOrderPosType'], r.invoicePosType)
          r.InvoicePosTypeLbl = relatedLkp.label;
          r.InvoicePosTypeColor = relatedLkp.color;
        });
        this.lstData = this.otherData.lstData
        this.params.totalCount = Number(this.otherData.rowsCount)
        this.loading = false
      })
    }, 1);
  }
  cols: any = [
    { field: 'InvoiceId', title: 'InvoiceId' },
    { field: 'Name', title: 'Name' },
    { field: 'Details', title: 'Details' },
    { field: 'Prices', title: 'Prices' },
    { field: 'CreateDetails', title: 'CreateDetails' },
    { field: 'actions', title: 'Actions' }
  ];


  tabs: any = [
    { label: "SoldItems", value: 0, },
  ]
  selectedTab: any = {}
  selectTab(tab: any) {
    this.selectedTab = tab;

    if (this.selectedTab.value == 0) {
      this.changeServer({ current_page: 1, pagesize: 10, sort_column: '', sort_direction: '' })
    }
  }

  listAction(action: any, r: any) {
    
  }

  openPosOrderDetails(r: any) {
    this.gto.openPosOrderDetails$.next({ loadInvoiceId: r.invoiceId })
  }
  SetFilters() {
    this.filters = {
      "ItemsSelector": "Sales"
    };
  }
  ResetFilters() {
    this.SetFilters()
    this.search();
  }
}
