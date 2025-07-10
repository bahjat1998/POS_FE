import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { POSMainPageComponent } from './posmain-page.component';

const routes: Routes = [{ path: '', component: POSMainPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class POSMainPageRoutingModule { }
