import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LookupsRoutingModule } from './lookups-routing.module';
import { LookupsComponent } from './lookups.component';

import { IconModule } from 'src/app/shared/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'angular-custom-modal';
import { FileUploadModule } from 'src/app/shared/ControlsComponents/file-upload/file-upload.module';

@NgModule({
  declarations: [
    LookupsComponent
  ],
  imports: [
    CommonModule,
    LookupsRoutingModule,
    IconModule,
    FormsModule,
    DataTableModule,
    ReactiveFormsModule,
    TranslateModule,
    MenuModule,
    NgSelectModule,
    ModalModule,
    FileUploadModule
  ]
})
export class LookupsModule { }
