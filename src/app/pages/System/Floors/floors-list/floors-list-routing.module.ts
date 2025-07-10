import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FloorsListComponent } from './floors-list.component';

const routes: Routes = [{ path: '', component: FloorsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FloorsListRoutingModule { }
