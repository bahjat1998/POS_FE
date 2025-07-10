import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosExpensesListRoutingModule } from './pos-expenses-list-routing.module';
import { PosExpensesListComponent } from './pos-expenses-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { PosAddExpensesModule } from '../pos-add-expenses/pos-add-expenses.module';

@NgModule({
  declarations: [
    PosExpensesListComponent
  ],
  imports: [
    CommonModule,
    PosExpensesListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    PosAddExpensesModule
  ],
  exports: [PosExpensesListComponent]
})
export class PosExpensesListModule { }
