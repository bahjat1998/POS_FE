import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftsCuRoutingModule } from './shifts-cu-routing.module';
import { ShiftsCuComponent } from './shifts-cu.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { InvoicesListModule } from '../../Stock/Invoice/invoices-list/invoices-list.module';
import { VochersListModule } from '../../Vouchers/vochers-list/vochers-list.module';


@NgModule({
  declarations: [
    ShiftsCuComponent
  ],
  imports: [
    CommonModule,
    ShiftsCuRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule,
    InvoicesListModule,
    VochersListModule
  ]
})
export class ShiftsCuModule { }
