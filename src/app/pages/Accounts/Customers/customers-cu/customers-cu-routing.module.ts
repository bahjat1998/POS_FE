import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomersCuComponent } from './customers-cu.component';

const routes: Routes = [{ path: '', component: CustomersCuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersCuRoutingModule { }
