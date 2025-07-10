import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';
import { StoreManagementService } from 'src/app/shared/Store/Store-Management.service';

@Component({
  selector: 'app-pos-login',
  templateUrl: './pos-login.component.html',
  styleUrls: ['./pos-login.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class PosLoginComponent {
  store: any;
  loginModel: any = {}
  lstLkpKeys = ['Branch'];
  lstLkps: any = {}
  constructor(public translate: TranslateService, private accountService: AccountService, private shiftStateManagement: ShiftStateManagement, private common: CommonOperationsService, public storeData: Store<any>, public router: Router, private appSetting: AppService, private storeManagementService: StoreManagementService) {
    this.initStore();
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.handleSelectedBranch.bind(this))
  }
  handleSelectedBranch() {
    if (this.lstLkps['Branch'] && this.lstLkps['Branch'].length > 0) {
      this.loginModel.branchId = this.lstLkps['Branch'][0].value
    }
  }
  async initStore() {
    this.storeData
      .select((d) => d.index)
      .subscribe((d) => {
        this.store = d;
      });
  }

  changeLanguage(item: any) {
    this.translate.use(item.code);
    this.appSetting.toggleLanguage(item);
    if (this.store.locale?.toLowerCase() === 'ae') {
      this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
    } else {
      this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
    }
    window.location.reload();
  }
  loading = false;
  reqFields: any = ['branchId', 'userName', 'password']
  inputFailds: any = {}
  login() {
    let validRes = this.common.checkValidation(this.loginModel, this.reqFields);
    if (validRes.isValid) {
      this.loading = true;
      let req = {
        ...this.loginModel,
        isPosLogin: true
      }
      this.accountService.Login(req)
        .subscribe({
          next: (c: any) => {
            if (c['lstError'] && c['lstError'][0]) {
              this.common.error(c['lstError'][0])
              this.loading = false;
              return;
            }
            if (c["token"]) {
              this.common.saveAuth(c);
              this.shiftStateManagement.checkedFromBe = false;
              this.shiftStateManagement.CheckCurrentShift()
            }
          },
          error: (err: any) => {
            if (err.status == 400) {
              //console.log(err);
              alert(err.error.message);
            }
          }
        });
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
    }
  }

  counter = 0;
  fireClearAll() {
    this.counter += 1
    if (this.counter == 7) {
      this.storeManagementService.clear();
      console.log("Clear ALL DONE")
    }
  }

}
