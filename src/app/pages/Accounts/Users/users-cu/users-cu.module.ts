import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersCuRoutingModule } from './users-cu-routing.module';
import { UsersCuComponent } from './users-cu.component';

import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FileUploadModule } from 'src/app/shared/ControlsComponents/file-upload/file-upload.module';
import { PermissionFormModule } from '../../permission-group/permission-form/permission-form.module';

@NgModule({
  declarations: [
    UsersCuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    UsersCuRoutingModule,
    IconModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule,
    FileUploadModule,
    PermissionFormModule
  ], 
  exports: [
    UsersCuComponent
  ]
})
export class UsersCuModule { }
