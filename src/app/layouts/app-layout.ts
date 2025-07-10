import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppService } from '../service/app.service';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from '../shared/services/account/account.service';
import { CommonOperationsService } from '../shared/services/systemcore/third-partytoasty.service';
import { StoreManagementService } from '../shared/Store/Store-Management.service';

@Component({
    selector: 'app-root',
    templateUrl: './app-layout.html',
})
export class AppLayout {
    store: any = {};
    showTopButton = false;
    constructor(private storeManagementService: StoreManagementService, public translate: TranslateService, public storeData: Store<any>, private common: CommonOperationsService, private accountService: AccountService, private service: AppService, private router: Router) {
        this.initStore();
        setTimeout(() => {
            if (!this.store)
                this.store = {
                    isDarkMode: false,
                    mainLayout: 'app',
                    theme: 'light',
                    menu: 'vertical',
                    layout: 'full',
                    rtlClass: 'ltr',
                    animation: '',
                    navbar: 'navbar-sticky',
                    locale: 'en',
                    sidebar: false,
                    languageList: [
                        { code: 'en', name: 'English' },
                        { code: 'ae', name: 'Arabic' },
                    ],
                    isShowMainLoader: false,
                    semidark: false,
                }
        }, 1);

        setTimeout(() => {
            this.checkDep()
        }, 2000);

        setTimeout(() => {
            this.checkIfPos()
        }, 100);
    }

    async checkIfPos() {
        if (await this.storeManagementService.IsPosVersion()) {
            this.storeData.dispatch({ type: 'toggleMenu', payload: 'horizontal' });
            setTimeout(() => {
                const header = document.querySelector('header');
                if (header) {
                    header.remove();
                }
            }, 100);
        }
    }
    headerClass = '';
    ngOnInit() {
        this.initAnimation();
        this.toggleLoader();
        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
                this.showTopButton = true;
            } else {
                this.showTopButton = false;
            }
        });
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', () => { });
    }

    initAnimation() {
        this.service.changeAnimation();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.service.changeAnimation();
            }
        });

        const ele: any = document.querySelector('.animation');
        ele.addEventListener('animationend', () => {
            this.service.changeAnimation('remove');
        });
    }

    toggleLoader() {
        this.storeData.dispatch({ type: 'toggleMainLoader', payload: true });
        setTimeout(() => {
            this.storeData.dispatch({ type: 'toggleMainLoader', payload: false });
        }, 500);
    }

    initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d: any) => {
                if (!d) d = {
                    isDarkMode: false,
                    mainLayout: 'app',
                    theme: 'light',
                    menu: 'vertical',
                    layout: 'full',
                    rtlClass: 'ltr',
                    animation: '',
                    navbar: 'navbar-sticky',
                    locale: 'en',
                    sidebar: false,
                    languageList: [
                        { code: 'en', name: 'English' },
                        { code: 'ae', name: 'Arabic' },
                    ],
                    isShowMainLoader: false,
                    semidark: false,
                }
                this.store = d;
            });


    }

    goToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    licenseMsg: any = ""
    checkDep() {
        this.licenseMsg = localStorage.getItem("L");
        if (this.licenseMsg) {
            this.accountService.QuickAccountQueries({ flag: 'CheckCL' }).subscribe(z => {
                if (z.val) {
                    if (z.val == "false") {
                        this.common.logout();
                    } else {
                        localStorage.setItem("L", z.val);
                    }
                }
                this.licenseMsg = z.val;
            })
        }
    }
}
