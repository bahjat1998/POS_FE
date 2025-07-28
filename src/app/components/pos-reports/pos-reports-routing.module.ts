import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosReportsComponent } from './pos-reports.component';

const routes: Routes = [{ path: '', component: PosReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosReportsRoutingModule { }
