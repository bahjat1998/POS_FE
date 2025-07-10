import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LookupsComponent } from './lookups.component';

const routes: Routes = [{ path: '', component: LookupsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LookupsRoutingModule { }
