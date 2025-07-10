import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayOrderPopupRoutingModule } from './pay-order-popup-routing.module';
import { PayOrderPopupComponent } from './pay-order-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { CalcModule } from '../calc/calc.module';
import { SharedModule } from 'src/app/shared/services/shared.module';
import { MenuModule } from 'headlessui-angular';


@NgModule({
  declarations: [
    PayOrderPopupComponent
  ],
  imports: [
    CommonModule,
    PayOrderPopupRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    CartItemsModule,
    CalcModule,
    MenuModule
  ],
  exports: [PayOrderPopupComponent]
})
export class PayOrderPopupModule { }
