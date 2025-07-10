import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionFormComponent } from './permission-form.component';

const routes: Routes = [{ path: '', component: PermissionFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionFormRoutingModule { }
