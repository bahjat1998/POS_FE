import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectItemVariantAddOnRoutingModule } from './select-item-variant-add-on-routing.module';
import { SelectItemVariantAddOnComponent } from './select-item-variant-add-on.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { CartItemsModule } from '../cart-items/cart-items.module';
import { CalcModule } from '../calc/calc.module';

@NgModule({
  declarations: [
    SelectItemVariantAddOnComponent
  ],
  imports: [
    CommonModule,
    SelectItemVariantAddOnRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    CartItemsModule,
    CalcModule
  ],
  exports: [SelectItemVariantAddOnComponent]
})
export class SelectItemVariantAddOnModule { }
