import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.scss']
})
export class DepartmentListComponent {
  lstData: any = []
  constructor(private managementService: ManagementService, private common: CommonOperationsService, private translate: TranslateService, private route: ActivatedRoute) {
    this.initPage()
  }

  initPage() {
    this.initParams()
    this.initCols()
    this.search()
    this.translateCallback()
  }
  translateCallback() {
    this.cols.forEach((z: any) => {
      this.translate.get(z.title).subscribe((res: string) => {
        z.title = res;
      });
    })

    // this.common.lstUserTypes.forEach((z: any) => {
    //   this.translate.get(z.label).subscribe((res: string) => {
    //     z.label = res;
    //   });
    // })
  }



  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params,
        isActive: this.params.isActive == '0' ? false : true

      }
      this.managementService.DepartmentsList(req).subscribe(z => {
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
      { field: 'key', title: 'key' },
      { field: 'nameEn', title: 'EnglishName' },
      { field: 'nameAr', title: 'ArabicName' },
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
}
