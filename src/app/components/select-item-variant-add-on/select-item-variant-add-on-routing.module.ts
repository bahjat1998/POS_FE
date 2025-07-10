import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SelectItemVariantAddOnComponent } from './select-item-variant-add-on.component';

const routes: Routes = [{ path: '', component: SelectItemVariantAddOnComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectItemVariantAddOnRoutingModule { }
