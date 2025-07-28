import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosApplyDiscountComponent } from './pos-apply-discount.component';

const routes: Routes = [{ path: '', component: PosApplyDiscountComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosApplyDiscountRoutingModule { }
