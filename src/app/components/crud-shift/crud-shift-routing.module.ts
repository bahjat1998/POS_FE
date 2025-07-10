import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudShiftComponent } from './crud-shift.component';

const routes: Routes = [{ path: '', component: CrudShiftComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrudShiftRoutingModule { }
