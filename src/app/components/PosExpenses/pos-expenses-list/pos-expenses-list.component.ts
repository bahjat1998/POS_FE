import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-pos-expenses-list',
  templateUrl: './pos-expenses-list.component.html',
  styleUrls: ['./pos-expenses-list.component.css']
})
export class PosExpensesListComponent {
  componentData: any
  filters: any = {}
  private closePosAddExpenseSub: Subscription;
  constructor(private gto: GeneralTemplateOperations, private accountService: AccountService, private shiftStateManagement: ShiftStateManagement, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this))
    gto.PosExpenseList$.subscribe((z: any) => {
      this.componentData = z;
      this.filters = this.componentData.apiFilters;
      this.fixFilters()
      this.changeServer({ current_page: 1, pagesize: 10, sort_column: '', sort_direction: '' })
      this.PosExpenseList()
    })
    this.closePosAddExpenseSub = gto.closePosAddExpense$.subscribe(() => this.search());

    this.common.translateList(this.cols)
  }
  ngOnDestroy() {
    if (this.closePosAddExpenseSub) {
      this.closePosAddExpenseSub.unsubscribe();
    }
  }

  fixFilters() {
    if (!this.filters) this.filters = {}
    if (!this.filters['invoiceStatus']) {
      this.filters['invoiceStatus'] = 1
    }
  }
  @ViewChild("PosExpenseListPopup", { static: true }) PosExpenseListPopup?: any;
  PosExpenseList() {
    this.PosExpenseListPopup?.open();
  }
  close = () => {
    this.PosExpenseListPopup?.close();
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
        VoucherType: 1
      }
      this.accountService.VoucherList(req).subscribe(z => {
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
    { field: 'id', title: 'ID', isUnique: true },
    { field: 'onDate', title: 'OnDate' },
    { field: 'accountName', title: 'AccountName' },
    { field: 'Details', title: 'Details' },
    { field: 'total', title: 'Total' },
    { field: 'note', title: 'Note' }
  ];


  openNewExpense() {
    this.gto.openPosAddExpense$.next(1)
  }
}
