import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-shifts-list',
  templateUrl: './shifts-list.component.html',
  styleUrls: ['./shifts-list.component.css']
})
export class ShiftsListComponent {
  lstData: any = []
  constructor(private accountingService: AccountingService, private common: CommonOperationsService, private translate: TranslateService, private route: ActivatedRoute) {
    this.initPage()
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }

  initPage() {
    this.initParams()
    this.initCols()
    this.search()
    this.translateCallback()
  }
  translateCallback() {
    this.common.translateList(this.cols)
  }



  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params,
        isActive: this.params.isActive == '0' ? false : true
      }
      this.accountingService.ShiftsList(req).subscribe(z => {
        this.lstData = z.lstData
        this.params.rowsCount = z.rowsCount
        this.loading = false
      })
    }, 2);
  }
  loading: boolean = false;

  cols: any;
  params: any;
  initCols() {
    this.cols = [
      { field: 'id', title: 'ID', isUnique: true },
      { field: 'openUserName', title: 'OpenUserName' },
      { field: 'closeUserName', title: 'CloseUserName' },
      { field: 'branchName', title: 'BranchName' },
      { field: 'Times', title: 'StartTime' },
      { field: 'totalSales', title: 'TotalSales' },
      { field: 'actions', title: 'Actions', sort: false },
    ]
  }
  initParams() {
    this.params = {
      p: 1,
      ps: 15,
      rowsCount: 25,
      strSearch: "",
      OB: "id",
      asc: false,
      isActive: '1'
    };
  }
  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }

  lstLkpKeys = ['_Account_1'];
  lstLkps: any = {}
}
