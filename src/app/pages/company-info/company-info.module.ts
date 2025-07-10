import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyInfoRoutingModule } from './company-info-routing.module';
import { CompanyInfoComponent } from './company-info.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    CompanyInfoComponent
  ],
  imports: [
    CommonModule,
    CompanyInfoRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule
  ]
})
export class CompanyInfoModule { }
