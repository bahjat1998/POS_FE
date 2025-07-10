import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-floors-list',
  templateUrl: './floors-list.component.html',
  styleUrls: ['./floors-list.component.css']
})
export class FloorsListComponent {
  lstData: any = []
  constructor(private accountingService: AccountingService, private common: CommonOperationsService, private translate: TranslateService) {
    this.initPage()
  }
  initPage() {
    this.initParams()
    this.search()
  }
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params,
        isActive: this.params.isActive == '0' ? false : true

      }
      this.accountingService.FloorsList(req).subscribe(z => {
        this.lstData = z.lstData
        this.common.fixImagesUrls(this.lstData, 'img')
        this.params.rowsCount = z.rowsCount
        this.loading = false
      })
    }, 2);
  }
  loading: boolean = false;
  cols: any;
  params: any;

  initParams() {
    this.params = {
      p: 1,
      ps: 25,
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


  navToEdit(r: any) {
    this.common.navigateTo('/system/floors/cu/' + r.id)
  }
}
