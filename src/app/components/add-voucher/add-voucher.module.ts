import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddVoucherRoutingModule } from './add-voucher-routing.module';
import { AddVoucherComponent } from './add-voucher.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconModule } from 'src/app/shared/icon/icon.module';


@NgModule({
  declarations: [
    AddVoucherComponent
  ],
  imports: [
    CommonModule,
    AddVoucherRoutingModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgSelectModule
  ],
  exports: [AddVoucherComponent]
})
export class AddVoucherModule { }
