import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentCuComponent } from './department-cu.component';

const routes: Routes = [{ path: '', component: DepartmentCuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentCuRoutingModule { }
