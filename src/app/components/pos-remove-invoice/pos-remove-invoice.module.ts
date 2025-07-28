import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosRemoveInvoiceComponent } from './pos-remove-invoice.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PosRemoveInvoiceComponent
  ],
  imports: [
    CommonModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [
    PosRemoveInvoiceComponent
  ]
})
export class PosRemoveInvoiceModule { }
