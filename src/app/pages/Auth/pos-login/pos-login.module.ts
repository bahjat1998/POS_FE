import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosLoginRoutingModule } from './pos-login-routing.module';
import { PosLoginComponent } from './pos-login.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PosLoginComponent
  ],
  imports: [
    CommonModule,
    PosLoginRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class PosLoginModule { }
