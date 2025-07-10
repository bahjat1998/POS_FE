import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountStatementsComponent } from './account-statements.component';

const routes: Routes = [{ path: '', component: AccountStatementsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountStatementsRoutingModule { }
