import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablesViewComponent } from './tables-view.component';

const routes: Routes = [{ path: '', component: TablesViewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TablesViewRoutingModule { }
