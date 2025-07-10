import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosStockReportComponent } from './pos-stock-report.component';

const routes: Routes = [{ path: '', component: PosStockReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosStockReportRoutingModule { }
