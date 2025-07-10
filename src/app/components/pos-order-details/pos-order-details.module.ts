import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosOrderDetailsRoutingModule } from './pos-order-details-routing.module';
import { PosOrderDetailsComponent } from './pos-order-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';


@NgModule({
  declarations: [
    PosOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    PosOrderDetailsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [PosOrderDetailsComponent]
})
export class PosOrderDetailsModule { }
