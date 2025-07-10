import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceItemNoteRoutingModule } from './invoice-item-note-routing.module';
import { InvoiceItemNoteComponent } from './invoice-item-note.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';


@NgModule({
  declarations: [
    InvoiceItemNoteComponent
  ],
  imports: [
    CommonModule,
    InvoiceItemNoteRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [
    InvoiceItemNoteComponent
  ]
})
export class InvoiceItemNoteModule { }
