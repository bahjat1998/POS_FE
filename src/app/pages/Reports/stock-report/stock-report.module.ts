import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockReportRoutingModule } from './stock-report-routing.module';
import { StockReportComponent } from './stock-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';

@NgModule({
  declarations: [
    StockReportComponent
  ],
  imports: [
    CommonModule,
    StockReportRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class StockReportModule { }
