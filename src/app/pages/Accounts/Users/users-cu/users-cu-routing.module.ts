import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersCuComponent } from './users-cu.component';

const routes: Routes = [{ path: '', component: UsersCuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersCuRoutingModule { }
