import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PosBarcodeReaderComponent } from './pos-barcode-reader.component';

const routes: Routes = [{ path: '', component: PosBarcodeReaderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosBarcodeReaderRoutingModule { }
