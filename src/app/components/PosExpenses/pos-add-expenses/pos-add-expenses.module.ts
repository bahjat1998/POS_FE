import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosAddExpensesRoutingModule } from './pos-add-expenses-routing.module';
import { PosAddExpensesComponent } from './pos-add-expenses.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PosAddExpensesComponent
  ],
  imports: [
    CommonModule,
    PosAddExpensesRoutingModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [PosAddExpensesComponent]
})
export class PosAddExpensesModule { }
