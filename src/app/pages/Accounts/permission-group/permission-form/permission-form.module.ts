import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermissionFormRoutingModule } from './permission-form-routing.module';
import { PermissionFormComponent } from './permission-form.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuModule } from 'headlessui-angular';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PermissionFormComponent
  ],
  imports: [
    CommonModule,
    PermissionFormRoutingModule,
    IconModule,
    DataTableModule,
    TranslateModule,
    NgSelectModule,
    MenuModule,
    FormsModule
  ],
  exports: [PermissionFormComponent]
})
export class PermissionFormModule { }
