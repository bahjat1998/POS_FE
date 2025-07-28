import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosApplyDiscountRoutingModule } from './pos-apply-discount-routing.module';
import { PosApplyDiscountComponent } from './pos-apply-discount.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'angular-custom-modal';


@NgModule({
  declarations: [
    PosApplyDiscountComponent
  ],
  imports: [
    CommonModule,
    PosApplyDiscountRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ModalModule,
    NgSelectModule
  ],
  exports: [PosApplyDiscountComponent]
})
export class PosApplyDiscountModule { }
