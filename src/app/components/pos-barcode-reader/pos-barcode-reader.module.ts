import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosBarcodeReaderRoutingModule } from './pos-barcode-reader-routing.module';
import { PosBarcodeReaderComponent } from './pos-barcode-reader.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';

@NgModule({
  declarations: [
    PosBarcodeReaderComponent
  ],
  imports: [
    CommonModule,
    PosBarcodeReaderRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [PosBarcodeReaderComponent]
})
export class PosBarcodeReaderModule { }
