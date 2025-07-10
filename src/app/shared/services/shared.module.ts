import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ShiftBlockDirective } from '../directives/shift-block.directive';

@NgModule({
  declarations: [
    ShiftBlockDirective
  ],
  imports: [
    CommonModule,
    
  ],
  exports: [
    TranslateModule,
    ShiftBlockDirective
  ]
})

export class SharedModule { }
