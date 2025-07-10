import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShiftsCuComponent } from './shifts-cu.component';

const routes: Routes = [{ path: '', component: ShiftsCuComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsCuRoutingModule { }
