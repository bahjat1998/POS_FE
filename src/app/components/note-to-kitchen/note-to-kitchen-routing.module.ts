import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoteToKitchenComponent } from './note-to-kitchen.component';

const routes: Routes = [{ path: '', component: NoteToKitchenComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteToKitchenRoutingModule { }
