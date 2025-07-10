import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteToKitchenRoutingModule } from './note-to-kitchen-routing.module';
import { NoteToKitchenComponent } from './note-to-kitchen.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';

@NgModule({
  declarations: [
    NoteToKitchenComponent
  ],
  imports: [
    CommonModule,
    NoteToKitchenRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [NoteToKitchenComponent]
})
export class NoteToKitchenModule { }
