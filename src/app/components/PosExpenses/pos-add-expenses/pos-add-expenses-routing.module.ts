import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosAddExpensesComponent } from './pos-add-expenses.component';

const routes: Routes = [{ path: '', component: PosAddExpensesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosAddExpensesRoutingModule { }
