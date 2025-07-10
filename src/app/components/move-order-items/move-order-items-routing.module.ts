import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoveOrderItemsComponent } from './move-order-items.component';

const routes: Routes = [{ path: '', component: MoveOrderItemsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoveOrderItemsRoutingModule { }
