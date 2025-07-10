import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { StoreManagementService } from 'src/app/shared/Store/Store-Management.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class LoginComponent {
  currYear: number = new Date().getFullYear();

  form = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }
  store: any;
  constructor(private accountService: AccountService, private storeManagementService: StoreManagementService, public storeData: Store<any>, private common: CommonOperationsService, public translate: TranslateService, private appSetting: AppService) { }
  ngOnInit(): void {

    this.initStore();
  }
  // async checkLicen() {
  //   if (await localStorage.getItem('authenticated')) {
  //     localStorage.removeItem('authenticated');
  //   }
  // }
  async initStore() {
    this.storeData
      .select((d: any) => d.index)
      .subscribe((d: any) => {
        this.store = d;
      });
  }
  loading = false;
  login() {
    if (this.form.valid) {
      this.loading = true;
      this.accountService.Login(this.form.value)
        .subscribe({
          next: (c: any) => {
            if (c['lstError'] && c['lstError'][0]) {
              alert(c['lstError'][0]);
              this.loading = false;
              return;
            }
            else if (c['lstWarnings'] && c['lstWarnings'][0] && c['lstWarnings'][0] == "false") {
              this.common.error("Your license has expired. To continue using the program and unlock all features, please renew your subscription.")
              return;
            }
            if (c["token"] && c['lstWarnings'] && c['lstWarnings'][0] && c['lstWarnings'][0] != "false") {
              localStorage.setItem("L", c['lstWarnings'][0])
            } else {
              localStorage.removeItem("L")
            }
            if (c["token"]) {
              this.common.saveAuth(c);
            }
          },
          error: (err: any) => {
            if (err.status == 400) {
              //console.log(err);
              alert(err.error.message);
            }
          }
        });
    }
  }

  forgotPassword() {
    this.common.navigateTo("../reset-password")
  }
  async switchLogin() {
    let currentLogin = await this.storeManagementService.getItem("loginSetup");
    if (!currentLogin) {
      currentLogin = "Panel"
    }
    currentLogin = currentLogin == "Panel" ? "POS" : "Panel";
    this.storeManagementService.setItem("loginSetup", currentLogin);

    this.common.navigateTo(currentLogin == "Panel" ? "../login" : "../loginPos")
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
}
