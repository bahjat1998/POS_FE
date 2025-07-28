import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosDiscountCardShowComponent } from './pos-discount-card-show.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    PosDiscountCardShowComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [PosDiscountCardShowComponent]
})
export class PosDiscountCardShowModule { }
