import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { POSMainPageRoutingModule } from './posmain-page-routing.module';
import { POSMainPageComponent } from './posmain-page.component';
import { MoveOrderItemsModule } from 'src/app/components/move-order-items/move-order-items.module';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'headlessui-angular';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { PayOrderPopupModule } from 'src/app/components/pay-order-popup/pay-order-popup.module';
import { CartItemsModule } from 'src/app/components/cart-items/cart-items.module';
import { SelectItemVariantAddOnModule } from 'src/app/components/select-item-variant-add-on/select-item-variant-add-on.module';
import { PosOrdersListModule } from 'src/app/components/pos-orders-list/pos-orders-list.module';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { CrudShiftModule } from 'src/app/components/crud-shift/crud-shift.module';
import { SharedModule } from 'src/app/shared/services/shared.module';
import { PosPageLayoutModule } from 'src/app/components/pos-page-layout/pos-page-layout.module';
import { NoteToKitchenModule } from 'src/app/components/note-to-kitchen/note-to-kitchen.module';
import { PosStockReportModule } from 'src/app/components/pos-stock-report/pos-stock-report.module';
import { PosSwitchAccountModule } from 'src/app/components/pos-switch-account/pos-switch-account.module';
import { PosExpensesListModule } from 'src/app/components/PosExpenses/pos-expenses-list/pos-expenses-list.module';
import { DeliveryCustomerModule } from 'src/app/components/delivery-customer/delivery-customer.module';
import { PosOrderDetailsModule } from 'src/app/components/pos-order-details/pos-order-details.module';
import { PosItemsSearchModule } from 'src/app/components/pos-items-search/pos-items-search.module';
import { PosReportsModule } from 'src/app/components/pos-reports/pos-reports.module';
import { PosBarcodeReaderModule } from 'src/app/components/pos-barcode-reader/pos-barcode-reader.module';
import { PosApplyDiscountModule } from 'src/app/components/pos-apply-discount/pos-apply-discount.module';
import { PosRemoveInvoiceModule } from 'src/app/components/pos-remove-invoice/pos-remove-invoice.module';


@NgModule({
  declarations: [
    POSMainPageComponent
  ],
  imports: [
    CommonModule,
    POSMainPageRoutingModule,
    MoveOrderItemsModule,
    FormsModule,
    MenuModule,
    IconModule,
    PayOrderPopupModule,
    CartItemsModule,
    SelectItemVariantAddOnModule,
    PosOrdersListModule,
    CrudShiftModule,
    SharedModule,
    PosPageLayoutModule,
    NoteToKitchenModule,
    PosStockReportModule,
    PosSwitchAccountModule,
    PosExpensesListModule,
    DeliveryCustomerModule,
    PosOrderDetailsModule,
    PosItemsSearchModule,
    ScrollingModule,
    PosReportsModule,
    PosBarcodeReaderModule,
    PosApplyDiscountModule,
    PosRemoveInvoiceModule
  ],
  providers: [InvoiceHelperService]
})
export class POSMainPageModule { }
