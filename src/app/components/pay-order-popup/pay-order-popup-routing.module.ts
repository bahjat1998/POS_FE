import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayOrderPopupComponent } from './pay-order-popup.component';

const routes: Routes = [{ path: '', component: PayOrderPopupComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayOrderPopupRoutingModule { }
