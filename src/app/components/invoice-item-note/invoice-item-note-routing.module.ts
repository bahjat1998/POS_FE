import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceItemNoteComponent } from './invoice-item-note.component';

const routes: Routes = [{ path: '', component: InvoiceItemNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceItemNoteRoutingModule { }
