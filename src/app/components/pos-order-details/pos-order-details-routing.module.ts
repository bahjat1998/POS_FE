import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosOrderDetailsComponent } from './pos-order-details.component';

const routes: Routes = [{ path: '', component: PosOrderDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosOrderDetailsRoutingModule { }
