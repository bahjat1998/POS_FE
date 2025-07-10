import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersCuRoutingModule } from './suppliers-cu-routing.module';
import { SuppliersCuComponent } from './suppliers-cu.component';

import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'src/app/shared/ControlsComponents/file-upload/file-upload.module';

@NgModule({
  declarations: [
    SuppliersCuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SuppliersCuRoutingModule,
    IconModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    FileUploadModule
  ], 
  exports: [
    SuppliersCuComponent
  ]
})
export class SuppliersCuModule { }
