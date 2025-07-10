import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VochersListRoutingModule } from './vochers-list-routing.module';
import { VochersListComponent } from './vochers-list.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { AddVoucherModule } from 'src/app/components/add-voucher/add-voucher.module';
@NgModule({
  declarations: [
    VochersListComponent
  ],
  imports: [
    CommonModule,
    VochersListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    ModalModule,
    AddVoucherModule
  ],
  exports: [VochersListComponent]
})
export class VochersListModule { }
