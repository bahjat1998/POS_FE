import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosOrdersListRoutingModule } from './pos-orders-list-routing.module';
import { PosOrdersListComponent } from './pos-orders-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { PosDiscountCardShowModule } from '../Display/pos-discount-card-show/pos-discount-card-show.module';


@NgModule({
  declarations: [
    PosOrdersListComponent
  ],
  imports: [
    CommonModule,
    PosOrdersListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    PosDiscountCardShowModule
  ],
  exports: [PosOrdersListComponent]
})
export class PosOrdersListModule { }
