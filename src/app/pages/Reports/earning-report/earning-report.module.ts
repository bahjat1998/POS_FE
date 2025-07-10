import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EarningReportRoutingModule } from './earning-report-routing.module';
import { EarningReportComponent } from './earning-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    EarningReportComponent
  ],
  imports: [
    CommonModule,
    EarningReportRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class EarningReportModule { }
