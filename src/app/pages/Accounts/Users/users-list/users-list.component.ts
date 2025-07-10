import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ]
})
export class UsersListComponent {
  lstData: any = []
  constructor(private accountService: AccountService, private common: CommonOperationsService, private translate: TranslateService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.initPage()
    });
    this.initPage()
    this.common.translateList(this.lstWords);
  }

  lstLkpKeys = ['Gender', 'City'];
  lstLkps: any = {}
  initPage() {
    this.initParams()
    this.initCols()
    this.search()
    this.translateCallback()

    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)

  }

  translateCallback() {
    this.cols.forEach((z: any) => {
      this.translate.get(z.title).subscribe((res: string) => {
        z.title = res;
      });
    })

    this.common.lstUserTypes.forEach((z: any) => {
      this.translate.get(z.label).subscribe((res: string) => {
        z.label = res;
      });
    })
  }



  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params,
        isActive: this.params.isActive == '0' ? false : true
      }
      this.accountService.AccountList(req).subscribe(z => {
        z.lstData.forEach((z: any, i: any) => {
          let relatedType = this.common.lstUserTypes.find((a: any) => a.value == z.userType)
          if (relatedType) {
            z['type'] = {
              color: relatedType.color,
              label: relatedType.label
            }
          }
        });
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
      { field: 'nameEn', title: 'EnglishName' },
      { field: 'nameAr', title: 'ArabicName' },
      { field: 'email', title: 'Email' },
      { field: 'phone1', title: 'Phone' },
      { field: 'cityId', title: 'City' },
      { field: 'genderId', title: 'Gender' },
      { field: 'userType', title: 'Type' },
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
      isActive: '1',
      userType: [0, 1, 4]
    };
  }
  pageSizeChange($event: any) {
    //console.log($event)
  }

  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }


  accountdbClick(r: any) {
    this.common.navigateTo(`/users/cu/${r.id}`)
  }

  lstWords: any = {
    "aysactv": "",
    "aysuwtdti": "",
    "?": ""
  };
  async deleteAcc(id: any) {
    let result = await this.common.confirmationMessage(undefined, `${this.lstWords['aysuwtdti']} ${this.lstWords['?']}`);
    if (result.value) {
      let result1 = await this.common.confirmationMessage(undefined, `After deleting this item, you will not be able to recover it!`);
      if (result1.value) {
        this.accountService.QuickAccountCommands({ flag: 'DeleteAccount', id: id }).subscribe(z => {
          if (z.status) {
            this.search()
            this.common.success("Deleted")
          }
        })
      }
    }
  }
}
