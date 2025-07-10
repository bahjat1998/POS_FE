import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosPageLayoutComponent } from './pos-page-layout.component';

const routes: Routes = [{ path: '', component: PosPageLayoutComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosPageLayoutRoutingModule { }
