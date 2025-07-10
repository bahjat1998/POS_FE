import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosSwitchAccountComponent } from './pos-switch-account.component';

const routes: Routes = [{ path: '', component: PosSwitchAccountComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosSwitchAccountRoutingModule { }
