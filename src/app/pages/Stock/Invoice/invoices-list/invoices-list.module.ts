import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesListRoutingModule } from './invoices-list-routing.module';
import { InvoicesListComponent } from './invoices-list.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    InvoicesListComponent
  ],
  imports: [
    CommonModule,
    InvoicesListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule
  ],
  exports: [InvoicesListComponent]
})
export class InvoicesListModule { }
