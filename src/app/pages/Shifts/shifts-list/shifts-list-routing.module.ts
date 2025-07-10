import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftsListComponent } from './shifts-list.component';

const routes: Routes = [{ path: '', component: ShiftsListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsListRoutingModule { }
