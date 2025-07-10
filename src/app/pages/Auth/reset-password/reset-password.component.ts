import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  currYear: number = new Date().getFullYear();
  inputFailds: any = {}
  model: any = {}
  userId: any = ""
  tempTokenCode: any = ""
  PageLayout = "SendMail"
  constructor(private managementService: ManagementService, private common: CommonOperationsService, private route: ActivatedRoute) {
    this.model['userId'] = this.route.snapshot.paramMap.get("userId");
    this.model['tempTokenCode'] = this.route.snapshot.paramMap.get("tempTokenCode");

    if (this.model['userId'] || this.model['tempTokenCode']) {
      this.PageLayout = "ChangePassword"
    }
  }

  loading: boolean = false;

  submitResetPassword() {
    if (!this.loading) {
      this.inputFailds = {}
      this.loading = true;
      // this.managementService.RequestResetPassword(this.model.email).subscribe(z => {
      //   this.loading = false;
      //   if (z) {

      //   } else {
      //     this.inputFailds['email'] = "Email not found, please try again";
      //   }
      // })
    }
  }



  changePassword() {
    if (!this.loading) {
      this.inputFailds = {}
      if (this.model.password != this.model.confirmPassword) {
        this.inputFailds['confirmPassword'] = "Confirm password not matched";
        return;
      }
      this.loading = true;
      // this.managementService.RequestResetPassword(this.model.password).subscribe(z => {
      //   this.loading = false;
      //   if (z) {

      //   } else {
      //     this.inputFailds['email'] = "Email not found, please try again";
      //   }
      // })
    }
  }
}
