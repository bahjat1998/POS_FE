import { Component } from '@angular/core';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-earning-report',
  templateUrl: './earning-report.component.html',
  styleUrls: ['./earning-report.component.css']
})
export class EarningReportComponent {
  lstData: any = []
  reset() {
    this.params = {
      fromDate: this.common.dateFormat((new Date()).setMonth(new Date().getMonth() - 1).toString()),
      toDate: this.common.dateFormat((new Date()).toString()),
    }
    this.search();
  }
  constructor(private common: CommonOperationsService, private managementService: ManagementService) {
    this.initPage()
  }
  lstLkpKeys = [];
  lstLkps: any = {}

  initPage() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps,)
    this.initCols()
    this.reset()
  }
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params
      }
      this.managementService.EarningReportQuery(req).subscribe(z => {
        z.lstRows.forEach((r: any) => {
          if (r.flag == 'asCard' || r.extraFlag == 'asCard') {
            if (r.label == "totalTreatments") {
              r.color = "bg-gradient-to-r from-cyan-500 to-violet-400"
            } else if (r.label == "totalRecipts") {
              r.color = "bg-gradient-to-r from-violet-500 to-cyan-200"
            } else if (r.label == "totalPayemtns") {
              r.color = "bg-gradient-to-r from-cyan-500 to-violet-400"
            }  else if (r.label == "totalBuyInvoices") {
              r.color = "bg-gradient-to-r from-violet-500 to-violet-400"
            } 
            // else if (r.label == "TotalVisitsRevenu") {
            //   r.color = "bg-gradient-to-r from-fuchsia-500 to-fuchsia-400"
            // }
          }
        });
        this.lstData = this.parseFromServer(z.lstRows)
        this.params.rowsCount = z.rowsCount
        this.loading = false;
      })
    }, 2);
  }
  statusChanged(r: any) {
    r.isSelected = !r.isSelected;
    this.search()
  }
  loading: boolean = false;

  cols: any;
  params: any = {};
  initCols() {
    this.cols = [
      { field: 'id', title: 'ID', isUnique: true },
      { field: 'createDate', title: 'OnDate', sort: false },
      { field: 'TransType', title: 'TransactionType', sort: false },
      { field: 'TransDetails', title: 'TransactionDetails', sort: false },
      { field: 'total', title: 'Total', sort: false }
    ]
    this.common.translateList(this.cols)
  }
  parseFromServer(lstData: any) {
    return lstData
  }
}
