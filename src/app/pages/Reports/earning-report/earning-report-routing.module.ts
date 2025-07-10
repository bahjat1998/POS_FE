import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EarningReportComponent } from './earning-report.component';

const routes: Routes = [{ path: '', component: EarningReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EarningReportRoutingModule { }
