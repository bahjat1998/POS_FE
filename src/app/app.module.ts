import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

//Routes
import { AppComponent } from './app.component';

// service
import { AppService } from './service/app.service';

// store
import { StoreModule } from '@ngrx/store';
import { indexReducer } from './store/index.reducer';

// headlessui
import { MenuModule } from 'headlessui-angular';

// perfect-scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

// dashboard
import { IndexComponent } from './index';

// Layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

import { HeaderComponent } from './layouts/header';
import { FooterComponent } from './layouts/footer';
import { SidebarComponent } from './layouts/sidebar';
import { ThemeCustomizerComponent } from './layouts/theme-customizer';
import { AppRoutingModule } from './app.route';
import { IconModule } from './shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { SharedModule } from './shared/services/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

@NgModule({
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MenuModule,
        SharedModule,
        StoreModule.forRoot({ index: indexReducer }),
        NgScrollbarModule.withConfig({
            visibility: 'hover',
            appearance: 'standard',
        }),
        IconModule,
        ModalModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpTranslateLoader,
                deps: [HttpClient],
            },
        }),
    ],
    declarations: [AppComponent, HeaderComponent, FooterComponent, SidebarComponent, ThemeCustomizerComponent, IndexComponent, AppLayout, AuthLayout],
    providers: [AppService, Title, DatePipe, { provide: LocationStrategy, useClass: HashLocationStrategy }],
    bootstrap: [AppComponent],
    exports: [ModalModule]
})
export class AppModule { }

// AOT compilation support
export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}