import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitReportRoutingModule } from './debit-report-routing.module';
import { DebitReportComponent } from './debit-report.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    DebitReportComponent
  ],
  imports: [
    CommonModule,
    DebitReportRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ]
})
export class DebitReportModule { }
