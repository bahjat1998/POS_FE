import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuppliersCuComponent } from './suppliers-cu.component';

const routes: Routes = [{ path: '', component: SuppliersCuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersCuRoutingModule { }
