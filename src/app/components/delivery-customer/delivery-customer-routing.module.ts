import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryCustomerComponent } from './delivery-customer.component';

const routes: Routes = [{ path: '', component: DeliveryCustomerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryCustomerRoutingModule { }
