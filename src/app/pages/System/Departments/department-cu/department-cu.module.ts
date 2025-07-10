import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentCuRoutingModule } from './department-cu-routing.module';
import { DepartmentCuComponent } from './department-cu.component';


import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'angular-custom-modal';

@NgModule({
  declarations: [
    DepartmentCuComponent
  ],
  imports: [
    CommonModule,
    DepartmentCuRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule
  ]
})
export class DepartmentCuModule { }
