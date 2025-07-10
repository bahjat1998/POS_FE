import { Component, NgZone } from '@angular/core';
import { CacheService } from './shared/services/systemcore/cashe.service';
import { ManagementService } from './shared/services/Management/management.service';
import { StoreManagementService } from './shared/Store/Store-Management.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonOperationsService } from './shared/services/systemcore/third-partytoasty.service';
import { ShiftStateManagement } from './shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(
        private cacheService: CacheService,
        private common: CommonOperationsService,
        private storeManagementService: StoreManagementService, private ngZone: NgZone, public translate: TranslateService,
        private shiftManagement: ShiftStateManagement
    ) {
        let newLang = localStorage.getItem("lang") || 'ae'
        this.translate.setDefaultLang(newLang);
        this.translate.use(newLang);

        this.cacheService.initDB();
        this.shiftManagement.CheckDeviceKey();
        // this.storeManagementService.clear()
        this.storeManagementService.logAllStoredValues()
        this.storeManagementService.getCurrentUserLoginPath()
        setTimeout(() => {
            if ((window as any).electron) {
                (window as any).electron.ipcRenderer.on('clear-cache', () => {
                    this.cacheService.clear().then(() => {
                        console.log('Cache cleared successfully!');
                    });
                });
                (window as any).electron.ipcRenderer.on('print-idFilePath', (e: any, p: any) => {
                    console.log(e, p)
                });
            }
        }, 10);

        this.common.refreshNavs();
    }
    getCompanyInfo() {
        // this.managementService.GetCompanyInfo({}).subscribe(z => { })
        // lockTableIcon
    }


    // initializeApp() {
    //     this.platform.ready().then(() => {
    //         this.statusBar.styleDefault();
    //         this.splashScreen.hide();
    //     });
    // }

}
