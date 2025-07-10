import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosExpensesListComponent } from './pos-expenses-list.component';

const routes: Routes = [{ path: '', component: PosExpensesListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosExpensesListRoutingModule { }
