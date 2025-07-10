import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddVoucherComponent } from './add-voucher.component';

const routes: Routes = [{ path: '', component: AddVoucherComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddVoucherRoutingModule { }
