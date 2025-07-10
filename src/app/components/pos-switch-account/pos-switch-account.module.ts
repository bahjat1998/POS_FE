import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosSwitchAccountRoutingModule } from './pos-switch-account-routing.module';
import { PosSwitchAccountComponent } from './pos-switch-account.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PosSwitchAccountComponent
  ],
  imports: [
    CommonModule,
    PosSwitchAccountRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [PosSwitchAccountComponent]
})
export class PosSwitchAccountModule { }
