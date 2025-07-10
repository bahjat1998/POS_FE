import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosItemsSearchRoutingModule } from './pos-items-search-routing.module';
import { PosItemsSearchComponent } from './pos-items-search.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';
@NgModule({
  declarations: [
    PosItemsSearchComponent
  ],
  imports: [
    CommonModule,
    PosItemsSearchRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [PosItemsSearchComponent]
})
export class PosItemsSearchModule { }
