import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionGroupRoutingModule } from './permission-group-routing.module';
import { PermissionGroupComponent } from './permission-group.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuModule } from 'headlessui-angular';
import { PermissionFormModule } from './permission-form/permission-form.module';


@NgModule({
  declarations: [
    PermissionGroupComponent
  ],
  imports: [
    CommonModule,
    PermissionGroupRoutingModule,
    IconModule,
    DataTableModule,
    TranslateModule,
    NgSelectModule,
    MenuModule,
    FormsModule,
    PermissionFormModule
  ]
})
export class PermissionGroupModule { }
