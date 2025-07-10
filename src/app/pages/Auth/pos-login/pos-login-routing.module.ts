import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosLoginComponent } from './pos-login.component';

const routes: Routes = [{ path: '', component: PosLoginComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosLoginRoutingModule { }
