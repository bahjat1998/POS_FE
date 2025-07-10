import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftsListRoutingModule } from './shifts-list-routing.module';
import { ShiftsListComponent } from './shifts-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    ShiftsListComponent
  ],
  imports: [
    CommonModule,
    ShiftsListRoutingModule,
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
export class ShiftsListModule { }
