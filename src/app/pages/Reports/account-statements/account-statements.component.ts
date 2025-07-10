import { Component } from '@angular/core';
import { PrintAccountStatementPdf } from 'src/app/shared/pdf/PrintAccountStatementPdf/print-account-statement-pdf.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { DentalService } from 'src/app/shared/services/Dental/dental.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-account-statements',
  templateUrl: './account-statements.component.html',
  styleUrls: ['./account-statements.component.css']
})
export class AccountStatementsComponent {
  lstData: any = []
  constructor(private common: CommonOperationsService, private dentalService: DentalService, private accountService: AccountService, private printAccountStatementPdf: PrintAccountStatementPdf) {
    this.initPage()
    this.common.translateList(this.lstWords);

    // this.params['accountId'] = 16
    // this.search()
    // setTimeout(() => {
    //   this.print()
    // }, 500);
  }
  lstLkpKeys = ['_Account_', 'PaymentMethod'];
  lstLkps: any = {}

  initPage() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.bindLkps.bind(this))
    this.initParams()
    this.initCols()
  }
  PaymentMethodMap: any = {}
  bindLkps() {
    if (this.lstLkps['PaymentMethod']) {
      this.PaymentMethodMap = this.common.mapPaymentsMethod(this.lstLkps['PaymentMethod'])
    }
  }
  data: any
  search() {
    setTimeout(() => {
      this.loading = true;
      let req = {
        ...this.params
      }
      this.dentalService.AccountStatement(req).subscribe(z => {
        this.data = z;
        this.lstData = this.parseFromServer(this.data.lstData)
        this.params.rowsCount = this.data.rowsCount
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
  params: any;
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
  lstWords: any = {
    "Payment": "",
    "Receipt": "",
    "BeginBalance": "",
    "Treatment": "",
    "Invoice": ""
  };
  parseFromServer(lstData: any) {
    if (lstData)
      lstData.forEach((d: any) => {
        if (d['treatmentId']) {
          d['TransType'] = `${this.lstWords['Treatment']}`
          d['TransTypeColor'] = 'primary'
        }
        // else if (d['invoiceId'] && d['storeFor'] == 1) {
        //   d['TransType'] = `${this.lstWords['InvoiceReceipt']}`
        //   d['TransTypeColor'] = 'success'
        // }
        // else if (d['invoiceId'] && d['storeFor'] == 2) { && d['storeFor'] == 5
        //   d['TransType'] = `${this.lstWords['InvoicePayment']}`
        //   d['TransTypeColor'] = 'success'
        // }
        else if (d['invoiceId']) {
          d['TransType'] = `${this.lstWords['Invoice']} - ${d['invoiceCategoryName']}`
          d['TransTypeColor'] = 'secondary'
        }
        else if (d['voucherId']) {
          d['TransType'] = `${this.lstWords['Receipt']}`
          d['TransTypeColor'] = 'success'
        }
        else if (d['id'] == 0) {
          d['TransType'] = `${this.lstWords['BeginBalance']}`
        }
        if (d['createDate']) {
          d['createDate'] = this.common.dateFormat(d.createDate)
        }
      });
    return lstData
  }
  changeServer(data: any) {
    this.params = this.common.mapDataTableToParams(this.params, data);
    this.search()
  }

  printLoading = false;
  print() {
    if (!this.printLoading) {
      this.printLoading = true;
      this.accountService.GetPrintDetails(this.params['accountId']).subscribe(z => {
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
