import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class CartItemsComponent {
  model: any = {}

  invStatus: any = {}
  cOrderLbl = ''
  @Input() set orderDetails(data: any) {
    this.model = data ?? {};
    this.invStatus = this.common.fillInvoiceStatus(this.model)
    this.scrollToBottom()

    setTimeout(() => {
      // this.cOrderLbl = this.common.getInvoiceTypeLbl(this.model)
      if (this.model.invoiceType == 0) {
        this.model.customLbl = "BuyInvoice"
        this.model.invName = "Order"
      }
      else if (this.model.invoiceType == 1) {
        this.model.customLbl = this.model.invoicePosType == 2 ? this.model.posTableName : ('invStat' + this.model.invoicePosType)
        this.model.invName = "NewOrder"
      }
    }, 10);
  }
  p: any = {}
  constructor(public common: CommonOperationsService, private gto: GeneralTemplateOperations, private invoiceHelperService: InvoiceHelperService) {
    this.subscribeToEvents()
    this.p = this.common.getCurrentUserInfo().permissions
  }

  newItemAddedToCartSubscriber!: Subscription;
  shortCutDetectionSubscriber!: Subscription;

  subscribeToEvents() {
    this.newItemAddedToCartSubscriber = this.gto.newItemAddedToCart$.subscribe(a => this.handleNewItemAdded())
    this.shortCutDetectionSubscriber = this.gto.shortCutDetection$.subscribe(a => this.handleShortCut(a))
  }

  ngOnDestroy() {
    if (this.newItemAddedToCartSubscriber) { this.newItemAddedToCartSubscriber.unsubscribe(); }
    if (this.shortCutDetectionSubscriber) { this.shortCutDetectionSubscriber.unsubscribe(); }
  }
  handleNewItemAdded() {
    this.scrollToBottom()
  }
  getSelectedItem() {
    return this.model.lstItems.find((z: any) => z.selected)
  }

  handleShortCut(command: any) {
    if (command.handleBy == "cart") {
      if (command.action == "CQ") {
        this.ChangeQuantity(command.pressOn)
      }
      else if (command.bind) {
        let thit: any = this;
        thit[command.bind]();
      }
    }
  }
  @Input() cartChangeItemQty: any = () => { console.log("ERR0001") }
  @Input() calculateInvoiceTotals: any = () => { console.log("ERR0002") }
  @Input() checkDiscountAmountLimits: any = () => { console.log("ERR0002") }
  @Input() style: any = {
    textSize: 'text-lg',
    itemsView: 0, // 0 or 1,
    totalsView: 0, // 0 or 1
    spaceYaxis: 6,
    masterClasses: "cartView",
    titlePt: 4,
    extraItemsListClass: ""
  }

  plusMinQty(item: any, operation = '+') {
    if (operation == '+') {
      this.cartChangeItemQty(item, ++item.quantity)
    }
    else if (operation == '-' && item.quantity > 1) {
      this.cartChangeItemQty(item, --item.quantity)
    }
  }

  changeInvoiceTotals(flag: any) {
    this.calculateInvoiceTotals(this.model, flag)
    this.model.changed = true;
    this.checkDiscountAmountLimits()
  }
  openOrderNotes() {
    this.openNotes(this.model, 'inv')
  }

  openNotes(item: any, flag = "itm") {
    this.gto.openPosInvoiceItemNote$.next({ obj: item, flag: flag })
  }


  scrollToBottom() {
    setTimeout(() => {
      let list: any = document.getElementById('itemsList');
      if (list)
        list.scrollTop = list.scrollHeight;
    }, 90);
  }
  async deleteItem(itm: any) {
    if (itm.id) {
      this.gto.openPosRemoveItem$.next({
        inv: this.model,
        itm: itm
      });
    } else {
      if (itm.quantity == 1) {
        this.model.lstItems = this.model.lstItems.filter((z: any) => z != itm);
      } else {
        itm.quantity -= 1;
      }
    }
    this.invoiceHelperService.refreshItemPrices(this.model)
  }
  selectedUnitChanged(newUnit: any, item: any) {
    item.selectedUnit = newUnit;
    if (newUnit) {
      item['price'] = newUnit[this.model.priceListKey ?? this.common.getCurrentPosSalesPriceListKey()];
      item['unitId'] = newUnit.unitId;
    }
    this.invoiceHelperService.refreshItemPrices(this.model)
  }

  openPosOrderDetails() {
    this.gto.openPosOrderDetails$.next({ orderDetails: this.model })
  }
  markItemAsSelected(itm: any) {
    this.model.lstItems.forEach((z: any) => {
      if (z == itm) {
        z.selected = true
      }
      else {
        z.selected = false
      }
    });
  }



  //ShortCuts
  SNIOC() {
    let itm = this.getSelectedItem();
    if (itm) {
      const index = this.model.lstItems.findIndex((a: any) => a.selected == true);
      const nextItem = index !== -1 && index < this.model.lstItems.length - 1 ? this.model.lstItems[index + 1] : this.model.lstItems[0];
      this.markItemAsSelected(nextItem)
    }
    else if (this.model.lstItems && this.model.lstItems.length > 0) {
      this.markItemAsSelected(this.model.lstItems[0])
    }
  }
  SPIOC() {
    let itm = this.getSelectedItem();
    if (itm) {
      const index = this.model.lstItems.findIndex((a: any) => a.selected == true);
      const nextItem = index > 0 ? this.model.lstItems[index - 1] : this.model.lstItems[0];
      this.markItemAsSelected(nextItem)
    }
    else if (this.model.lstItems && this.model.lstItems.length > 0) {
      this.markItemAsSelected(this.model.lstItems[this.model.lstItems.length - 1])
    }
  }
  ChangeUnit() {
    let itm = this.getSelectedItem();
    if (itm) {
      if (itm.lstUnits && itm.lstUnits.length > 1) {
        const index = itm.lstUnits.findIndex((a: any) => a.unitId == itm.unitId);
        const nextUnit = index !== -1 && index < itm.lstUnits.length - 1 ? itm.lstUnits[index + 1] : itm.lstUnits[0];
        this.selectedUnitChanged(nextUnit, itm)
      }
    }
  }
  DecreseQuantitiy() {
    let itm = this.getSelectedItem();
    if (itm)
      this.plusMinQty(itm, '-')
  }
  IncreaseQuantitiy() {
    let itm = this.getSelectedItem();
    if (itm)
      this.plusMinQty(itm, '+')
  }
  LastItemNote() {
    let itm = this.getSelectedItem();
    if (itm)
      this.openNotes(itm)
  }
  ChangeQuantity(pressOn: any) {
    let itm = this.getSelectedItem();
    if (itm) {
      itm.quantity = pressOn;
      this.invoiceHelperService.refreshItemPrices(this.model)
      this.model.totQty = this.common.sum(this.model.lstItems, 'quantity')
    }
  }
}
