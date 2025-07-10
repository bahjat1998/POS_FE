import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorsListRoutingModule } from './floors-list-routing.module';
import { FloorsListComponent } from './floors-list.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuModule } from 'headlessui-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    FloorsListComponent
  ],
  imports: [
    CommonModule,
    FloorsListRoutingModule,
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
export class FloorsListModule { }
