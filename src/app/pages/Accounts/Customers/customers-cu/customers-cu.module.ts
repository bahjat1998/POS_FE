import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersCuRoutingModule } from './customers-cu-routing.module';
import { CustomersCuComponent } from './customers-cu.component';

import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'src/app/shared/ControlsComponents/file-upload/file-upload.module';

@NgModule({
  declarations: [
    CustomersCuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CustomersCuRoutingModule,
    IconModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    FileUploadModule
  ], 
  exports: [
    CustomersCuComponent
  ]
})
export class CustomersCuModule { }
