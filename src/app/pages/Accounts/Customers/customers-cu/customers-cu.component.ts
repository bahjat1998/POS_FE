import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-customers-cu',
  templateUrl: './customers-cu.component.html',
  styleUrls: ['./customers-cu.component.css']
})
export class CustomersCuComponent {
  @Input() closeDialog: any;

  isModal = false;
  @Input() set SetInitial(z: any) {
    if (z['Id']) {
      this.Id = z['Id'];
    }
    this.isModal = true;
    this.pageInit()
  }

  lstPermissions = [
    { label: "Dashboard", value: "Dashboard" },
    { label: "CompanyInfo", value: "CompanyInfo" },
    { label: "UsersList", value: "UsersList" },
    { label: "ReceiptVouchers", value: "ReceiptVouchers" },
    { label: "PaymentVouchers", value: "PaymentVouchers" },
    { label: "DepartmentsList", value: "DepartmentsList" },
    { label: "ItemsList", value: "ItemsList" },
    { label: "InvoicesList", value: "InvoicesList" },
    { label: "AccountStatement", value: "AccountStatement" },
    // { label: "FinancialReport", value: "FinancialReport" },
    // { label: "DebitReport", value: "DebitReport" },
    { label: "LookupsList", value: "LookupsList" },
    { label: "POS", value: "POS" }
  ]

  model: any = {}
  Id: any
  constructor(private accountService: AccountService, private common: CommonOperationsService, private route: ActivatedRoute, private translate: TranslateService) {
    this.Id = this.common.getRouteParam(this.route, 'Id', 'num')
    this.common.translateList(this.tabs);
    this.common.translateList(this.lstPermissions);
  }
  lstLkpKeys = ['Gender', 'City', 'ItemsPricesLists', 'lstUserTypes', 'AttachmentType', 'Branch', 'Departments'];
  lstLkps: any = {}

  ngOnInit(): void {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.pageInit()
    this.selectTab(this.tabs[0])
  }

  pageInit() {
    if (this.Id) {
      this.ObjectDetails(this.Id)
    } else {
      this.model = { userType: 1, isActive: true, _permissions: {} }
      this.common.fillUserBranDepart(this.model)
    }
  }
  loading = false;
  ObjectDetails(Id: any) {
    this.loading = true
    this.accountService.AccountDetails(Id).subscribe(z => {
      this.model = this.parseObjFromServer(z);
      this.loading = false;
      this.calcAge()

    })
  }

  parseObjFromServer(z: any) {
    if (z['birthDate']) z['birthDate'] = this.common.dateFormat(z['birthDate']);
    if (z['startDate']) z['startDate'] = this.common.dateFormat(z['startDate']);

    if (z['permissions']) {
      z['_permissions'] = JSON.parse(z['permissions'])
    } else {
      z['_permissions'] = {}
    }

    if (z['lstBranches']) {
      z['_lstBranches'] = z['lstBranches'].map((a: any) => a['branchId'])
    }
    if (z['lstDepartments']) {
      z['_lstDepartments'] = z['lstDepartments'].map((a: any) => a['departmentId'])
    }
    return z;
  }
  prepareObjToServer(modal: any) {
    if (modal['_permissions']) {
      modal['permissions'] = JSON.stringify(modal['_permissions'])
    }

    if (modal['_lstBranches']) {
      modal['lstBranches'] = modal['_lstBranches'].map((a: any) => { return { branchId: a } })
    }
    if (modal['_lstDepartments']) {
      modal['lstDepartments'] = modal['_lstDepartments'].map((a: any) => { return { departmentId: a } })
    }
    if (!modal['nameEn']) {
      modal['nameEn'] = modal['nameAr']
    }
    return modal;
  }
  reqFields: any = ['nameAr']
  inputFailds: any = {}
  saving: boolean = false;
  save() {
    this.inputFailds = {}
    let validRes = this.common.checkValidation(this.model, this.reqFields);
    if (validRes.isValid) {
      let modal = this.prepareObjToServer(this.model);
      this.common.info("Please wait!", "")
      this.saving = true;
      this.accountService.AddAccount(modal).subscribe({
        next: z => {
          this.saving = false;
          if (z.status) {
            this.common.success("Saved")
            this.Id = z['entityId']
            if (this.isModal) {
              this.closeDialog(this.Id)
            } else {
              this.ObjectDetails(this.Id);
            }

          }
          else if (z['lstError'].length > 0) {
            this.common.error(z['lstError'][0])
          }

        }, error: e => {
          this.saving = false;
          return false
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
      return false
    }
    return true;
  }

  back() {
    this.common.navigateTo('../accounts/customers')
  }
  tabs: any = [
    { label: "MainInfo", value: 0, },
    { label: "AccountInfo", value: 1 },
    { label: "RelatedAttachments", value: 2 }
  ]
  selectedTab: any = {}
  selectTab(tab: any) {
    this.selectedTab = tab;
  }
  addRow(prop: any) {
    if (!this.model[prop]) this.model[prop] = [];
    this.model[prop].push({})
  }
  removeRow(prop: any, i: number) {
    if (!this.model[prop]) this.model[prop] = [];
    this.model[prop].splice(i, 1);
  }
  calculateBirthDate() {
    setTimeout(() => {
      if (Number(this.model['age'])) {
        let possibleBirthDate = this.common.calculateBirthDate(this.model['age']);
        this.model['birthDate'] = this.common.dateFormat(possibleBirthDate)
      }
    }, 10);
  }
  calcAge() {
    if (this.model['birthDate']) {
      this.model['age'] = this.common.calculateAge(this.model['birthDate'])
    }
  }

}
