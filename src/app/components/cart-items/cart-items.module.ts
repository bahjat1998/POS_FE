import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartItemsRoutingModule } from './cart-items-routing.module';
import { CartItemsComponent } from './cart-items.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { SharedModule } from 'src/app/shared/services/shared.module';
import { InvoiceItemNoteModule } from '../invoice-item-note/invoice-item-note.module';
import { RemoveItemModule } from '../remove-item/remove-item.module';
import { ModalModule } from 'angular-custom-modal';
import { MenuModule } from 'headlessui-angular';
import { PosDiscountCardShowModule } from '../Display/pos-discount-card-show/pos-discount-card-show.module';


@NgModule({
  declarations: [
    CartItemsComponent
  ],
  imports: [
    CommonModule,
    CartItemsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    InvoiceItemNoteModule,
    RemoveItemModule,
    MenuModule,
    PosDiscountCardShowModule
  ],
  exports: [CartItemsComponent]
})
export class CartItemsModule { }
