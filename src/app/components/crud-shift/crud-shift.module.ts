import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CrudShiftRoutingModule } from './crud-shift-routing.module';
import { CrudShiftComponent } from './crud-shift.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';


@NgModule({
  declarations: [
    CrudShiftComponent
  ],
  imports: [
    CommonModule,
    CrudShiftRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule
  ],
  exports: [
    CrudShiftComponent
  ]
})
export class CrudShiftModule { }
