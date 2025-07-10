import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersListRoutingModule } from './customers-list-routing.module';
import { CustomersListComponent } from './customers-list.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CustomersListComponent
  ],
  imports: [
    CommonModule,
    CustomersListRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule
  ]
})
export class CustomersListModule { }
