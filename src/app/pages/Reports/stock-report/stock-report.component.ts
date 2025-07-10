import { Component } from '@angular/core';
import { PrintAccountStatementPdf } from 'src/app/shared/pdf/PrintAccountStatementPdf/print-account-statement-pdf.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css']
})
export class StockReportComponent {
  lstData: any = []
  constructor(private common: CommonOperationsService, private managementService: ManagementService, private printAccountStatementPdf: PrintAccountStatementPdf) {
    this.initPage()
    // this.params['accountId'] = 16
    // this.search()
    // setTimeout(() => {
    //   this.print()
    // }, 500);
  }
  lstLkpKeys = ['ItemUnits', 'Branch'];
  lstLkps: any = {}

  initPage() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps,)
    this.initParams()
    this.initCols()
    this.search()
  }
  data: any
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params
      }
      this.managementService.StockReport(req).subscribe(z => {
        this.data = z;
        this.lstData = this.data.lstData
        this.params.rowsCount = this.data.rowsCount
        this.loading = false;
      })
    }, 2);
  }

  loading: boolean = false;

  cols: any;
  params: any;
  initCols() {
    this.cols = [
      { field: 'id', title: 'ID', isUnique: true },
      { field: 'nameAr', title: 'Name', sort: false },
      { field: 'quantity', title: 'Quantity', sort: false },
      { field: 'minQtyAlarm', title: 'MinQtyAlarm', sort: false },
      { field: 'maxQtyAlarm', title: 'MaxQtyAlarm', sort: false }
    ]
    this.common.translateList(this.cols)
  }
  initParams() {
    this.params = {
      p: 1,
      ps: 15,
      rowsCount: 25,
      strSearch: "",
      OB: "createDate",
      asc: true,
      isActive: '1',
      // fromDate: this.common.dateFormat(new Date()),
      // toDate: this.common.dateFormat(new Date())
    };
  }
  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }

  printLoading = false;
  print() {
    if (!this.printLoading) {
      this.printLoading = true;
      this.managementService.StockReport(this.params['accountId']).subscribe(z => {
        this.printAccountStatementPdf.CreateReport({ ...this.params, accountDetails: z.accountDetails, lstData: this.lstData, dateCreated: z.dateCreated })
        this.printLoading = false;
      })
    }

  }

  showDetails(r: any) {
    if (r['visitId']) {
      this.common.navigateTo(`../visits/cu/${r.visitId}`)
    }
    else if (r['invoiceId']) {
      this.common.navigateTo(`../stock/invoices/cu/${r.invoiceId}`)
    }
  }
}
