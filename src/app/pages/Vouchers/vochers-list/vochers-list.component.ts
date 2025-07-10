import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-vochers-list',
  templateUrl: './vochers-list.component.html',
  styleUrls: ['./vochers-list.component.css']
})
export class VochersListComponent {
  lstData: any = []
  namedType = ""
  customParams: any;
  asInner: any
  @Input() set extraParams(z: any) {
    this.customParams = z.customParams;
    this.namedType = z.namedType;
    this.asInner = z.asInner;
    // setTimeout(() => {
    this.initParams()
    this.search()
    this.fillParamUserType()
    // }, 1);
  }

  constructor(private accountService: AccountService, private common: CommonOperationsService, private translate: TranslateService, private route: ActivatedRoute) {
    this.namedType = this.route.snapshot.params['type'];
    this.route.paramMap.subscribe(params => {
      this.namedType = this.route.snapshot.params['type'];
      this.initPage()
    });
    this.initPage()
  }

  lstLkpKeys = ['lstUserTypes', 'PaymentMethod', 'OtherUserType'];
  lstLkps: any = {}
  initPage() {
    this.initCols()
    this.fillParamUserType();
    if (!this.customParams) {
      this.initParams()
      this.search()
    }
    this.translateCallback()
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this))
  }
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
  }
  pageTitle: any = "";
  fillParamUserType() {
    this.pageTitle = 'Tit' + this.namedType;
  }
  translateCallback() {

    this.common.translateList(this.cols)
    this.common.translateList(this.common.lstUserTypes)
    this.common.translateList(this.lstWords)
  }


  total: any
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params,
        isActive: this.params.isActive == '0' ? false : true,
        includePatientLastVisit: this.namedType == 'patients'
      }
      this.accountService.VoucherList(req).subscribe(z => {
        z.lstData.forEach((z: any, i: any) => {
          let relatedType = this.common.lstUserTypes.find((a: any) => a.value == z.accountType)
          if (relatedType) {
            z['type'] = {
              color: relatedType.color,
              label: relatedType.label
            }
          }
          if (z['createDate']) {
            z['createDate'] = this.common.dateTimeFormat(z.createDate)
          }
        });
        this.lstData = z.lstData
        this.params.rowsCount = z.rowsCount
        this.loading = false
        this.total = z.total
      })
    }, 2);
  }
  loading: boolean = false;

  cols: any;
  params: any;
  initCols() {
    this.cols = [
      { field: 'id', title: 'ID', isUnique: true },
      { field: 'onDate', title: 'OnDate' },
      { field: 'accountType', title: 'AccountType' },
      { field: 'accountName', title: 'AccountName' },
      { field: 'Details', title: 'Details' },
      { field: 'total', title: 'Total' },
      { field: 'note', title: 'Note' },
      { field: 'actions', title: 'Actions', sort: false }
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
      ...this.customParams
    };
    if (this.namedType == "receipt") {
      this.params['voucherType'] = 0
    } else if (this.namedType == "payment") {
      this.params['voucherType'] = 1
    }

  }
  pageSizeChange($event: any) {
    //console.log($event)
  }

  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }

  accountListLkpKey = ""
  accountTypeChanged() {
    setTimeout(() => {
      if (this.params['accountType']) {
        this.accountListLkpKey = `_Account_${this.params['accountType']}_t`
        this.lstLkpKeys.push(this.accountListLkpKey)
        this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
      } else {
        this.accountListLkpKey = ''
      }
    }, 10);
  }



  @ViewChild("addVoucher", { static: true }) addVoucher?: any;
  addVoucherInitialData: any = {}
  addVoucherModel: any
  openAddVoucher(r: any = null) {
    if (r) {
      this.accountService.VoucherDetails(r.id).subscribe((z: any) => {
        this.initAndOpen(z)
      })
    } else {
      this.initAndOpen()
    }


  }
  initAndOpen(r: any = null) {
    this.addVoucherInitialData = {};
    if (r) {
      this.addVoucherInitialData = { ...r }
    }
    this.addVoucherInitialData = {
      ...this.addVoucherInitialData,
      voucher: this.addVoucherModel,
      voucherType: this.params['voucherType']
    }
    this.addVoucher?.open();
  }
  closeAddVoucher = () => {
    this.addVoucher?.close();
    this.search();
  }
  lstWords: any = {
    "aysactv": "",
    "aysuwtdti": "",
    "?": ""
  };
  async deleteDeleteVoucher(id: any) {
    let result = await this.common.confirmationMessage(undefined, `${this.lstWords['aysuwtdti']} ${this.lstWords['?']}`);
    if (result.value) {
      let result1 = await this.common.confirmationMessage(undefined, `After deleting this item, you will not be able to recover it!`);
      if (result1.value) {
        this.accountService.QuickAccountCommands({ flag: 'DeleteVoucher', id: id }).subscribe(z => {
          if (z.status) {
            this.search()
            this.common.success("Deleted")
          }
        })
      }
    }
  }
}
