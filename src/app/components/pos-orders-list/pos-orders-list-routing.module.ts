import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosOrdersListComponent } from './pos-orders-list.component';

const routes: Routes = [{ path: '', component: PosOrdersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosOrdersListRoutingModule { }
