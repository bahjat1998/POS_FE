import { Component } from '@angular/core';
import { PrintAccountStatementPdf } from 'src/app/shared/pdf/PrintAccountStatementPdf/print-account-statement-pdf.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { DentalService } from 'src/app/shared/services/Dental/dental.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-debit-report',
  templateUrl: './debit-report.component.html',
  styleUrls: ['./debit-report.component.css']
})
export class DebitReportComponent {
  lstData: any = []
  reset() {
    this.initParams()
    this.search();
  }
  initParams() {
    this.params = {
      p: 1,
      ps: 15,
      rowsCount: 25,
      strSearch: "",
      OB: "fromDate",
      asc: false,
      isActive: '1'
    };
  }
  constructor(private common: CommonOperationsService, private managementService: ManagementService, private printAccountStatementPdf: PrintAccountStatementPdf) {
    this.initPage()
  }
  lstLkpKeys = ['_Account_'];
  lstLkps: any = {}

  initPage() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps,)
    this.initCols()
    this.reset()
  }
  Total: any
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params
      }
      this.managementService.DebitsListQuery(req).subscribe(z => {
        this.lstData = this.parseFromServer(z.lstData)
        this.params.rowsCount = z.rowsCount
        this.loading = false;
        this.Total = z.total;
      })
    }, 2);
  }
  loading: boolean = false;

  cols: any;
  params: any;
  initCols() {
    this.cols = [
      { field: 'id', title: 'ID', isUnique: true },
      { field: 'fromDate', title: 'FromDate', sort: true },
      { field: 'lastDealDate', title: 'LastDealDate', sort: true },
      { field: 'accountName', title: 'AccountName', sort: false },
      { field: 'total', title: 'Total', sort: true }
    ]
    this.common.translateList(this.cols)
  } 
  parseFromServer(lstData: any) {
    lstData.forEach((d: any) => {
    });
    return lstData
  }
  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }

}
