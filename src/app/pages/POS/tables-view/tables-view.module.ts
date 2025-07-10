import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TablesViewRoutingModule } from './tables-view-routing.module';
import { TablesViewComponent } from './tables-view.component';
import { PosOrdersListModule } from 'src/app/components/pos-orders-list/pos-orders-list.module';
import { TranslateModule } from '@ngx-translate/core';
import { MoveOrderItemsModule } from 'src/app/components/move-order-items/move-order-items.module';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { PayOrderPopupModule } from 'src/app/components/pay-order-popup/pay-order-popup.module';
import { SharedModule } from 'src/app/shared/services/shared.module';


@NgModule({
  declarations: [
    TablesViewComponent
  ],
  imports: [
    CommonModule,
    TablesViewRoutingModule,
    PosOrdersListModule,
    TranslateModule,
    MoveOrderItemsModule,
    PayOrderPopupModule,
    SharedModule
  ],
  providers: [InvoiceHelperService]
})
export class TablesViewModule { }
