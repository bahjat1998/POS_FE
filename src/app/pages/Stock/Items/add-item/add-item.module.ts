import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddItemRoutingModule } from './add-item-routing.module';
import { AddItemComponent } from './add-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from 'headlessui-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { FileUploadModule } from 'src/app/shared/ControlsComponents/file-upload/file-upload.module';


@NgModule({
  declarations: [
    AddItemComponent
  ],
  imports: [
    CommonModule,
    AddItemRoutingModule,
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
export class AddItemModule { }
