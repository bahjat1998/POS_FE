import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddInvoiceRoutingModule } from './add-invoice-routing.module';
import { AddInvoiceComponent } from './add-invoice.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { MenuModule } from 'headlessui-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { SelectItemVariantAddOnModule } from 'src/app/components/select-item-variant-add-on/select-item-variant-add-on.module';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';


@NgModule({
  declarations: [
    AddInvoiceComponent
  ],
  imports: [
    CommonModule,
    AddInvoiceRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule,
    SelectItemVariantAddOnModule
  ],
  providers: [InvoiceHelperService]
})
export class AddInvoiceModule { }
