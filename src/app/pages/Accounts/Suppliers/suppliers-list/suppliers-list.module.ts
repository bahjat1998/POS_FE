import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersListRoutingModule } from './suppliers-list-routing.module';
import { SuppliersListComponent } from './suppliers-list.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    SuppliersListComponent
  ],
  imports: [
    CommonModule,
    SuppliersListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule
  ]
})
export class SuppliersListModule { }
