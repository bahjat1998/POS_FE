import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryCustomerRoutingModule } from './delivery-customer-routing.module';
import { DeliveryCustomerComponent } from './delivery-customer.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    DeliveryCustomerComponent
  ],
  imports: [
    CommonModule,
    DeliveryCustomerRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [DeliveryCustomerComponent]
})
export class DeliveryCustomerModule { }
