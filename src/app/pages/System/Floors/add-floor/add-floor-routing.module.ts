import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFloorComponent } from './add-floor.component';

const routes: Routes = [{ path: '', component: AddFloorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddFloorRoutingModule { }
