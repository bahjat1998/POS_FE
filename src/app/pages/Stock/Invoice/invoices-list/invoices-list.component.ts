import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-invoices-list',
  templateUrl: './invoices-list.component.html',
  styleUrls: ['./invoices-list.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ]
})
export class InvoicesListComponent {
  lstData: any = []
  otherData: any = {}
  @Input() extraParams: any = { canAdd: true }
  permissions: any = {}
  constructor(private managementService: ManagementService, private common: CommonOperationsService, private route: ActivatedRoute) {
    this.initPage()
    this.common.translateList(this.lstWords);

    this.permissions['ADI'] = this.common.checkIfHasPermission("AllowDeleteInvoices")
  }

  lstLkpKeys = ['InvoiceCategories', '_Account_4', 'PaymentMethod'];
  lstLkps: any = {}
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
  }

  initPage() {
    this.initParams()
    this.initCols()
    this.search()
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this));
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
        isActive: this.params.isActive == '0' ? false : true,
        ...this.extraParams
      }

      if (this.params['deletedOnly']) {
        req['invoiceStatus'] = 2
      }
      this.managementService.InvoiceList(req).subscribe(z => {
        this.otherData = z;
        this.lstData = this.otherData.lstData
        this.params.rowsCount = z.rowsCount
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
      { field: 'accountName', title: 'AccountName' },
      { field: 'branchName', title: 'BranchName' },
      { field: 'finalTotal', title: 'FinalTotal' },
      // { field: 'paid', title: 'Paid' },
      // { field: 'remaining', title: 'Remaining' },
      { field: 'invoiceCategoryName', title: 'InvoiceCategory' },
      { field: 'createBy', title: 'CreateByName' },
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
  lstWords: any = {
    "AreYouSure": "",
    "DeleteThisInvoice": "",
    "?": ""
  };
  async deleteInvoice(id: any) {
    let result = await this.common.confirmationMessage(this.lstWords['AreYouSure'], `${this.lstWords['DeleteThisInvoice']} ${this.lstWords['?']}`);
    if (result.value) {
      let result1 = await this.common.confirmationMessage(undefined, `After deleting this item, you will not be able to recover it!`);
      if (result1.value) {
        let req = {
          flag: 1,
          InvoiceId: id
        }
        this.managementService.InvoiceCommands(req).subscribe(z => {
          if (z.status) {
            this.search()
            this.common.success("Deleted")
          } else {
            if (z.lstError && z.lstError.length > 0) {
              this.common.confirmationMessage(undefined, z.lstError[0])
            }
          }
        })
      }
    }
  }
}
