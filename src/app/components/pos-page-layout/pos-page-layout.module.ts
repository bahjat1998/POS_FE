import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosPageLayoutRoutingModule } from './pos-page-layout-routing.module';
import { PosPageLayoutComponent } from './pos-page-layout.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { SharedModule } from 'src/app/shared/services/shared.module';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    PosPageLayoutComponent
  ],
  imports: [
    CommonModule,
    PosPageLayoutRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [PosPageLayoutComponent]
})
export class PosPageLayoutModule { }
