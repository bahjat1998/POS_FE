import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RemoveItemRoutingModule } from './remove-item-routing.module';
import { RemoveItemComponent } from './remove-item.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'angular-custom-modal';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    RemoveItemComponent
  ],
  imports: [
    CommonModule,
    RemoveItemRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [
    RemoveItemComponent
  ]
})
export class RemoveItemModule { }
