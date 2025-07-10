import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosStockReportRoutingModule } from './pos-stock-report-routing.module';
import { PosStockReportComponent } from './pos-stock-report.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';


@NgModule({
  declarations: [
    PosStockReportComponent
  ],
  imports: [
    CommonModule,
    PosStockReportRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [PosStockReportComponent]
})
export class PosStockReportModule { }
