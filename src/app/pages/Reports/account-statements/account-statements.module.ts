import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountStatementsRoutingModule } from './account-statements-routing.module';
import { AccountStatementsComponent } from './account-statements.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuModule } from 'headlessui-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    AccountStatementsComponent
  ],
  imports: [
    CommonModule,
    AccountStatementsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class AccountStatementsModule { }
