import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitReportComponent } from './debit-report.component';

const routes: Routes = [{ path: '', component: DebitReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DebitReportRoutingModule { }
