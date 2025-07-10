import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FileUploadRoutingModule } from './file-upload-routing.module';
import { FileUploadComponent } from './file-upload.component';


@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    FileUploadRoutingModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
