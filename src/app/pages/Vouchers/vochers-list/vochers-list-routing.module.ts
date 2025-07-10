import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VochersListComponent } from './vochers-list.component';

const routes: Routes = [{ path: '', component: VochersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VochersListRoutingModule { }
