import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosReportsComponent } from './pos-reports.component';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { PosReportsRoutingModule } from './pos-reports-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [
    PosReportsComponent
  ],
  imports: [
    CommonModule,
    PosReportsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [PosReportsComponent]
})
export class PosReportsModule { }
