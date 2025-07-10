import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'headlessui-angular';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    TranslateModule
  ]
})
export class LoginModule { }
