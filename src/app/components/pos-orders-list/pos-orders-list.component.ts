import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-orders-list',
  templateUrl: './pos-orders-list.component.html',
  styleUrls: ['./pos-orders-list.component.css']
})
export class PosOrdersListComponent {
  private openPosOrdersListSub: Subscription;

  componentData: any
  filters: any = {}
  buttons: any = {}
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this))
    this.openPosOrdersListSub = gto.openPosOrdersList$.subscribe((z: any) => {
      this.componentData = z;
      this.filters = this.componentData.apiFilters;
      this.buttons = this.componentData.buttons;
      this.fixFilters()
      this.changeServer({ current_page: 1, pagesize: 10, sort_column: '', sort_direction: '' })
      this.openPosOrdersList()
    })

    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.openPosOrdersListSub) {
      this.openPosOrdersListSub.unsubscribe();
    }
  }

  fixFilters() {
    if (!this.filters) this.filters = {}
    if (!this.filters['invoiceStatus']) {
      this.filters['invoiceStatus'] = 1
    }
  }
  @ViewChild("PosOrdersListPopup", { static: true }) PosOrdersListPopup?: any;
  openPosOrdersList() {
    this.PosOrdersListPopup?.open();
  }
  actionPosOrdersList = (action = '', order = '') => {
    this.PosOrdersListPopup?.close();
    this.gto.closePosOrdersList$.next({ action: action, order: order })
  }


  ngOnInit() {
  }

  lstLkpKeys = ['lstOrderPosType', 'PaymentMethod'];
  lstLkps: any = {}
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
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
      this.managementService.InvoiceList(req).subscribe(z => {
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
    { field: 'OrderId', title: 'OrderId' },
    { field: 'AccountName', title: 'AccountName' },
    { field: 'Amount', title: 'Amount' },
    { field: 'PosTypeLbl', title: 'PosType' },
    { field: 'CreateDate', title: 'CreateDate' },
    { field: 'CreateByName', title: 'CreateByName' },
    { field: 'actions', title: 'Actions' }
  ];
  selectFilter(invoiceStatus: any) {
    this.filters['invoiceStatus'] = invoiceStatus;
    this.search()
  }

  listAction(action: any, r: any) {
    if (action == 'ShowOrderDetails') {
      this.openPosOrderDetails(r)
    }
    else {
      this.gto.closePosOrdersList$.next({ action, inv: r });
      this.PosOrdersListPopup.close()
    }
  }
  openPosOrderDetails(inv: any) {
    this.gto.openPosOrderDetails$.next({ loadInvoiceId: inv.id })
  }
  navTo(r: any) {
    // this.common.navigateTo(`/customers/cu/v/${r.encodedId}/${r.customerStatus == 'APPROVED' ? true : false}`)
  }
}
