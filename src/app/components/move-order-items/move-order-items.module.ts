import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoveOrderItemsRoutingModule } from './move-order-items-routing.module';
import { MoveOrderItemsComponent } from './move-order-items.component';

import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';

@NgModule({
  declarations: [
    MoveOrderItemsComponent
  ],
  imports: [
    CommonModule,
    MoveOrderItemsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    SortablejsModule
  ],
  exports: [MoveOrderItemsComponent]
})
export class MoveOrderItemsModule { }
