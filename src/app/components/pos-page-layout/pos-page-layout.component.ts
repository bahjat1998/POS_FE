import { Component, Input, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CacheService } from 'src/app/shared/services/systemcore/cashe.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { StoreManagementService } from 'src/app/shared/Store/Store-Management.service';

@Component({
  selector: 'app-pos-page-layout',
  templateUrl: './pos-page-layout.component.html',
  styleUrls: ['./pos-page-layout.component.css']
})
export class PosPageLayoutComponent {
  model: any = {}
  async readStyleSetup() {
    let style: any = await this.storeManagementService.getItem("StyleSetup")
    if (style) {
      this.model = style;
      if (!this.model.setup) {
        this.model.setup = {}
      }
    } else {
      this.model = this.gto.DefaultStyle;
    }
    if (!this.model.lstShortCutsActionsLkp) {
      this.resetKeys()
    }
    else if (this.model.lstShortCutsActionsLkp.length != this.lstShortCutsActionsLkp.length) {
      this.lstShortCutsActionsLkp.forEach((ac: any) => {
        if (!this.model.lstShortCutsActionsLkp.some((sc: any) => sc.action == ac.value)) {
          this.model.lstShortCutsActionsLkp.push({ action: ac.value, bind: ac.bind, handleBy: ac.handleBy })
        }
      });
    }
    else if (this.model.lstShortCutsActionsLkp.length == this.lstShortCutsActionsLkp.length) {
      this.model.lstShortCutsActionsLkp.forEach((z: any) => {
        let r: any = this.lstShortCutsActionsLkp.find((sc: any) => sc.value == z.action);
        if (r && r.bind) {
          z.bind = r.bind;
        }
        if (r && r.handleBy) {
          z.handleBy = r.handleBy;
        }
      });
    }
    this.openModel()
    this.selectTab(this.tabs[0])
  }

  openPosStyleSetup: any
  constructor(public common: CommonOperationsService, private cacheService: CacheService, private managementService: ManagementService, private storeManagementService: StoreManagementService, private gto: GeneralTemplateOperations, private invoiceHelperService: InvoiceHelperService) {
    this.openPosStyleSetup = gto.openPosStyleSetup$.subscribe((z: any) => {
      this.readStyleSetup()
    })

    this.common.translateList(this.lstShortCutsActionsLkp)
  }

  ngOnDestroy() {
    if (this.openPosStyleSetup) {
      this.openPosStyleSetup.unsubscribe();
    }
  }
  @ViewChild("PosStyleSetup", { static: true }) PosStyleSetup?: any;
  openModel() {
    this.PosStyleSetup?.open();
  }

  close() {
    this.PosStyleSetup?.close();
  }
  save() {
    this.PosStyleSetup?.close();
    this.storeManagementService.setItem("StyleSetup", this.model)
  }
  tabs: any = [
    { label: "CategoriesPart", value: 0, },
    { label: "CategoryItems", value: 1 },
    { label: "Cart", value: 2 },
    { label: "ShortCuts", value: 3 },
    { label: "Setup", value: 4 }
  ]
  selectedTab: any = {}
  selectTab(tab: any) {
    this.selectedTab = tab;
  }
  lstCatLayout = [{ label: 'VER', value: 'V' }, { label: 'HOR', value: 'H' }, { label: 'LV', value: 'LV' }]
  lstItmLayout = [{ label: 'Style1', value: '0' }, { label: 'Style2', value: '1' }]

  styleChanged() {
    setTimeout(() => {
      this.gto.applyLayoutClasses(this.model)
      // this.gto.applyCartStyles(this.model)
      // this.gto.applyItemStyles(this.model)
    }, 10);
  }


  lstShortCutsKeysLkp: any = [
    { label: 'Numbers', value: 'nums' },
    { label: '*', value: '*' },
    { label: '-', value: '-' },
    { label: '+', value: '+' },
    { label: '/', value: '/' },
    { label: 'Enter', value: 'Enter' },
    { label: 'Backspace', value: 'Backspace' },
    { label: 'ArrowUp', value: 'ArrowUp' },
    { label: 'ArrowDown', value: 'ArrowDown' },
    { label: 'F1', value: 'F1' },
    { label: 'F2', value: 'F2' },
    { label: 'F3', value: 'F3' },
    { label: 'F4', value: 'F4' },
    { label: 'F5', value: 'F5' },
    { label: 'F6', value: 'F6' },
    { label: 'F7', value: 'F7' },
    { label: 'F8', value: 'F8' },
    { label: 'F9', value: 'F9' },
    { label: 'F10', value: 'F10' },
    { label: 'F11', value: 'F11' },
    { label: 'F12', value: 'F12' }
  ]
  lstShortCutsActionsLkp: any = [
    { label: 'ChangeQuantity', value: 'CQ', handleBy: 'cart', bind: 'ChangeQuantity' },
    { label: 'DecreseQuantitiy', value: 'DQ', handleBy: 'cart', bind: 'DecreseQuantitiy' },
    { label: 'IncreaseQuantitiy', value: 'IQ', handleBy: 'cart', bind: 'IncreaseQuantitiy' },
    { label: 'ChangeUnit', value: 'ChangeUnit', handleBy: 'cart', bind: 'ChangeUnit' },
    { label: 'OpenPayModel', value: 'OpenPayModel', bind: 'PaymentBtn' },
    { label: 'QuickPay', value: 'QuickPay', bind: 'QuickAutoPay' },
    { label: 'PendingOrders', value: 'PendingOrders', bind: 'showOrdersList' },
    { label: 'PendingOrder', value: 'PendingOrder', bind: 'PendingBtn' },
    { label: 'Tables', value: 'Tables', bind: 'toTables' },
    { label: 'SplitInvoice', value: 'SplitInvoice', bind: 'openSplitInvoice' },
    { label: 'NoteToKitchen', value: 'NoteToKitchen', bind: 'noteToKitchen' },
    { label: 'PrintTicket', value: 'PrintTicket', bind: 'printTicket' },
    { label: 'OpenDrawer', value: 'OpenDrawer', bind: 'openDrawer' },
    { label: 'LastItemNote', value: 'LastItemNote', handleBy: 'cart', bind: '**' },
    { label: 'OrderDetails', value: 'OrderDetails', handleBy: 'cart', bind: 'openPosOrderDetails' },
    { label: 'OrderNote', value: 'OrderNote', handleBy: 'cart', bind: 'openOrderNotes' },
    { label: 'SelectNextItemOnCart', value: 'SNIOC', handleBy: 'cart', bind: 'SNIOC' },
    { label: 'SelectPrevItemOnCart', value: 'SPIOC', handleBy: 'cart', bind: 'SPIOC' }
  ]


  resetKeys() {
    this.model.lstShortCutsActionsLkp = this.lstShortCutsActionsLkp.map((a: any) => {
      return { action: a.value, bind: a.bind, handleBy: a.handleBy };
    })
  }
  lstPrintMethods = [
    { label: 'Local', value: 'local' },
    { label: 'BasedOnRemote', value: 'api' },
    { label: 'WebView', value: 'WebView' },
  ]
  clearCache = false;
  async ClearCache() {
    this.clearCache = true;
    let result = await this.common.confirmationMessage(undefined, `You will be logged out`);
    if (result.value) {
      this.cacheService.clear();
      this.common.logout();
    }
  }
}
