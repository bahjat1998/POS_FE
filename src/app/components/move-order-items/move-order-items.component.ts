import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-move-order-items',
  templateUrl: './move-order-items.component.html',
  styleUrls: ['./move-order-items.component.css']
})
export class MoveOrderItemsComponent {
  componentData: any;
  options: any = {}
  fromOrder: any
  toOrder: any
  constructor(private gto: GeneralTemplateOperations, private shiftStateManagement: ShiftStateManagement, public invoiceHelperService: InvoiceHelperService, private managementService: ManagementService, private common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    this.openPosMoveOrderItemsSub = gto.openPosMoveOrderItems$.subscribe((z: any) => {
      this.componentData = z;
      if (this.componentData.fromTableId) {
        this.loadOrderDetails(this.componentData.fromTableId, 'fromOrder')
      }
      else {
        this.fromOrder = this.componentData.fromOrder;
      }

      if (this.componentData.toTableId) {
        this.loadOrderDetails(this.componentData.toTableId, 'toOrder')
      }
      else {
        this.toOrder = this.componentData.toOrder;
      }
      // this.filters = this.componentData.apiFilters;
      this.openPosMoveOrderItems()
      this.PartiallyDestroy()
      this.subscribeToEvents();
    })

  }


  closePosPaymentScreen!: Subscription;
  splitOrderPendingSourceIdArrived!: Subscription;
  openPosMoveOrderItemsSub!: Subscription;
  subscribeToEvents() {
    this.closePosPaymentScreen = this.gto.closePosPaymentScreen$.subscribe(a => this.handleClosePosPayment(a))
    this.splitOrderPendingSourceIdArrived = this.gto.splitOrderPendingSourceIdArrived$.subscribe(a => this.componentData.fromOrder.id = a)
  }
  PartiallyDestroy() {
    if (this.closePosPaymentScreen) { this.closePosPaymentScreen.unsubscribe(); }
    if (this.splitOrderPendingSourceIdArrived) { this.splitOrderPendingSourceIdArrived.unsubscribe(); }
  }
  ngOnDestroy() {
    this.PartiallyDestroy()
    if (this.openPosMoveOrderItemsSub) { this.openPosMoveOrderItemsSub.unsubscribe(); }
  }

  enableMultiple() {
    this.options['enableMultiple'] = !this.options['enableMultiple']
  }

  @ViewChild("PosMoveOrderItemsPopup", { static: true }) PosMoveOrderItemsPopup?: any;
  openPosMoveOrderItems() {
    this.PosMoveOrderItemsPopup?.open();
  }
  actionPosMoveOrderItems = (action = '', order = '') => {
    this.PosMoveOrderItemsPopup?.close();
    this.gto.closePosMoveOrderItems$.next({ action: action, order: order })
  }

  closePosMoveOrderItemsPopup(action = '') {
  }
  handlePayAction() {
    if (!this.componentData.fromOrder || !this.componentData.fromOrder.lstItems || this.componentData.fromOrder.lstItems.length == 0) {
      this.common.error("Source Order Can't Be Empty", "")
      return
    }
    if (!this.componentData.toOrder || !this.componentData.toOrder.lstItems || this.componentData.toOrder.lstItems.length == 0) {
      this.common.error("Target Order Can't Be Empty", "")
      return
    }
    if (!this.componentData.fromOrder.id) {
      this.common.error("Source Order Can't Be Not Saved, wait until save first order", "")
      return
    }
    this.PosMoveOrderItemsPopup?.close();
    this.gto.openPosPaymentScreen$.next({ orderDetails: this.componentData.toOrder, source: 'SPLIT' });
  }


  handleSaveAction() {
    if (this.fromOrder) {
      if (!this.fromOrder.lstItems || this.fromOrder.lstItems.length == 0) {
        this.fromOrder.customHandle = 0;
        this.fromOrder = { id: this.fromOrder.id, customHandle: this.fromOrder.customHandle, lstItems: [] }
      } else {
        this.fromOrder.customHandle = 1;
      }
      this.invoiceHelperService.refreshItemPrices(this.fromOrder)
      this.MakeOrderPending(this.fromOrder, { success: () => { this.gto.closePosMoveOrderItems$.next(1) } })
    }


    if (this.toOrder) {
      if (!this.toOrder.lstItems || this.toOrder.lstItems.length == 0) {
        this.toOrder.customHandle = 0;
        this.toOrder = { id: this.toOrder.id, customHandle: this.toOrder.customHandle, lstItems: [] }
      } else {
        this.toOrder.customHandle = 1;
      }
      this.invoiceHelperService.refreshItemPrices(this.toOrder)
      this.MakeOrderPending(this.toOrder, { success: () => { this.gto.closePosMoveOrderItems$.next(1) } })
    }
    // setTimeout(() => {
    this.PosMoveOrderItemsPopup?.close();

    // }, 10);
  }
  handleClosePosPayment(splittedInvoice: any) {
    if (splittedInvoice.source == "SPLIT") {
      console.log("DEBUGGER", splittedInvoice.source, this.componentData.fromOrder, splittedInvoice)
      //Source Order
      this.invoiceHelperService.refreshItemPrices(this.componentData.fromOrder)
      this.MakeOrderPending(this.componentData.fromOrder)


      //Destination Order
      splittedInvoice.lstItems.forEach((itm: any) => delete itm.id);
      splittedInvoice.invoiceStatus = 4
      this.MakeOrderPending(splittedInvoice, {
        success: (inv: any) => {
          this.invoiceHelperService.printInvoice(inv)
          this.gto.closePosMoveOrderItems$.next({ action: 'RefreshCurrentOrder' });
        }
      })//invoice here include paid amount
    }
    this.PartiallyDestroy()
  }
  prepareObjToServer(invoice: any) {
    let toServerObj = JSON.parse(JSON.stringify(invoice))
    if (!toServerObj['ShiftId']) {
      toServerObj['ShiftId'] = this.shiftStateManagement.CurrentShiftId
    }
    if (toServerObj['lstDeletedItems']) {
      if (!toServerObj['lstItems']) toServerObj['lstItems'] = []
      toServerObj.lstDeletedItems.forEach((r: any) => delete r.id);
      toServerObj['lstItems'].push(...toServerObj.lstDeletedItems)
    }
    return toServerObj;
  }
  MakeOrderPending(invoice: any, callBacks: any = {}) {
    let obj = this.prepareObjToServer(invoice);
    this.managementService.AddInvoice(obj).subscribe(z => {
      if (z.status) {
        invoice.id = z.entityId
        if (callBacks.success) {
          callBacks.success(invoice)
        }
      }
    })
  }

  ngOnInit() {
  }

  lstLkpKeys = [];
  lstLkps: any = {}
  mapper: any = 0
  selectMapper(mapper: any) {
    this.mapper = mapper
  }
  navTo(r: any) {
    // this.common.navigateTo(`/customers/cu/v/${r.encodedId}/${r.customerStatus == 'APPROVED' ? true : false}`)
  }

  items = [
    {
      id: 1,
      text: 'Need to be approved',
      name: 'Kelly Young',
    },
    {
      id: 2,
      text: 'Meeting with client',
      name: 'Andy King',
    },
    {
      id: 3,
      text: 'Project Detail',
      name: 'Judy Holmes',
    },
    {
      id: 4,
      text: 'Edited Post Apporval',
      name: 'Vincent Carpenter',
    },
    {
      id: 5,
      text: 'Project Lead Pickup',
      name: 'Mary McDonald',
    },
  ];

  logg() {
    console.log(this.fromOrder, this.toOrder)
  }




  // fromOrder = [
  //   { id: 1, name: 'Apple' },
  //   { id: 2, name: 'Banana' }
  // ];

  // toOrder = [
  //   { id: 3, name: 'Orange' }
  // ];
  @ViewChild('leftContainer', { static: false }) leftEl!: ElementRef;
  @ViewChild('rightContainer', { static: false }) rightEl!: ElementRef;
  leftOptions = {
    group: 'icon',
    animation: 150,
    sort: false,
    onAdd: (event: any) => this.onAddToList(this.fromOrder, this.toOrder, event),
    onRemove: (event: any) => this.onRemoveToList(this.fromOrder, event),
    onChoose: (event: any) => {
      const isFromLeft = this.leftEl?.nativeElement && event.from === this.leftEl.nativeElement;
      const sourceArray = isFromLeft ? this.fromOrder.lstItems : this.toOrder.lstItems;

      const draggedItem = sourceArray[event.oldIndex];

      event.item.__draggedMeta__ = {
        sourceArray,
        sourceIndex: event.oldIndex,
        itemRef: draggedItem
      };


    }


  };

  rightOptions = {
    group: 'icon',
    animation: 150,
    sort: false,
    onAdd: (event: any) => this.onAddToList(this.toOrder, this.fromOrder, event),
    onRemove: (event: any) => this.onRemoveToList(this.toOrder, event),
    onChoose: (event: any) => {
      const isFromLeft = this.leftEl?.nativeElement && event.from === this.leftEl.nativeElement;
      const sourceArray = isFromLeft ? this.fromOrder.lstItems : this.toOrder.lstItems;

      const draggedItem = sourceArray[event.oldIndex];

      event.item.__draggedMeta__ = {
        sourceArray,
        sourceIndex: event.oldIndex,
        itemRef: draggedItem
      };


    }


  };
  onAddToList(targetOrder: any, sourceOrder: any, event: any) {
    const draggedMeta = event.item.__draggedMeta__;
    if (!draggedMeta) return;

    const { itemRef, sourceArray, sourceIndex } = draggedMeta;

    if (this.mapper === 1) {
      const movedItem = { ...itemRef, quantity: 1 };

      targetOrder.lstItems.splice(event.newIndex, 0, movedItem);
      //Remove added item by the library from target
      targetOrder.lstItems = targetOrder.lstItems.filter((a: any) => a != itemRef);
      targetOrder.lstItems = this.mergeMatchedItems(targetOrder.lstItems)

      setTimeout(() => {
        itemRef.quantity -= 1;
        if (itemRef.quantity === 0) {
          // sourceOrder.lstItems.splice(sourceIndex, 1);
        } else {
          sourceOrder.lstItems.splice(sourceIndex, 0, itemRef);
        }
        sourceOrder.lstItems = this.mergeMatchedItems(sourceOrder.lstItems)
        this.refreshInvoicesCalculations()
      }, 1);

    } else {
      setTimeout(() => {
        targetOrder.lstItems = this.mergeMatchedItems(targetOrder.lstItems)
        sourceOrder.lstItems = this.mergeMatchedItems(sourceOrder.lstItems)
        this.refreshInvoicesCalculations()
      }, 10);
    }
  }
  refreshInvoicesCalculations() {
    console.log(this.fromOrder, this.toOrder)
    setTimeout(() => {
      this.invoiceHelperService.refreshItemPrices(this.fromOrder)
      this.invoiceHelperService.refreshItemPrices(this.toOrder)

      this.refreshInvoiceTotalQty(this.fromOrder)
      this.refreshInvoiceTotalQty(this.toOrder)
    }, 80);
  }
  mergeMatchedItems(items: any[]): any[] {
    const grouped = new Map<string, any>();

    for (const item of items) {
      const addOnsKey = item.lstAddOns ? [...item.lstAddOns].sort().join(',') : '';
      const variantKey = item.variant ?? '';
      const nameKey = item.name;

      const key = `${nameKey}__${variantKey}__${addOnsKey}`;

      if (!grouped.has(key)) {
        // If the item group doesn't exist, create a new entry
        grouped.set(key, { ...item });
      } else {
        // If the item group exists, add the quantity of the current item to the existing item
        const existingItem = grouped.get(key);
        existingItem.quantity += item.quantity;
      }
    }

    // Return the merged items as an array
    return Array.from(grouped.values());
  }

  onRemoveToList(order: any, event: any) {
    if (this.mapper === 1) {
      // Handled in onAdd
      return;
    }

    const draggedItem = event.item.__draggedItemRef;
    const index = order.lstItems.findIndex((i: any) => i === draggedItem);
    if (index !== -1) {
      order.lstItems.splice(index, 1);
    }
  }
  selectItm(r: any) {
    if (this.options['enableMultiple'])
      r.selected = !r.selected;
  }
  move(flag: any) {
    let moveItmFunc = (sourceOrder: any, targetOrder: any, index: any) => {
      let toMoveItem = sourceOrder.lstItems[index];
      if (this.mapper === 1) {
        const movedItem = { ...toMoveItem, quantity: 1 };
        targetOrder.lstItems.splice(0, 0, movedItem);
        targetOrder.lstItems = this.mergeMatchedItems(targetOrder.lstItems)
        setTimeout(() => {
          toMoveItem.quantity -= 1;
          if (toMoveItem.quantity === 0) {
            sourceOrder.lstItems.splice(index, 1);
          } else {
            sourceOrder.lstItems[index].quantity = toMoveItem.quantity;
          }
          sourceOrder.lstItems = this.mergeMatchedItems(sourceOrder.lstItems)
        }, 1);

      } else {
        targetOrder.lstItems.splice(0, 0, toMoveItem);
        sourceOrder.lstItems.splice(index, 1);
      }
    }
    let source: any = {};
    let target: any = {}

    if (flag == 'ltr') {
      source = this.fromOrder;
      target = this.toOrder
    }
    else if (flag == 'rtl') {
      source = this.toOrder;
      target = this.fromOrder
    }


    let tmpArr = source.lstItems.filter((a: any) => a.selected);
    tmpArr.reverse();
    tmpArr.forEach((itm: any, i: any) => {
      if (itm.selected) {
        let relatedItemInSourceIndex = source.lstItems.findIndex((a: any) => a == itm)
        moveItmFunc(source, target, relatedItemInSourceIndex);
      }
    });

    target.lstItems.forEach((z: any) => z.selected = false);
    source.lstItems.forEach((z: any) => z.selected = false);
    this.refreshInvoicesCalculations()

  }

  refreshInvoiceTotalQty(inv: any) {
    inv.totQty = this.common.sum(inv.lstItems, 'quantity')
  }
  fromOrderLoaded = false;
  toOrderLoaded = false;
  loadOrderDetails(tableId: any, orderBinding: any) {
    let req = { tableId: tableId }
    let thit: any = this;
    thit[orderBinding + 'Loaded'] = false;
    this.managementService.InvoiceDetails(req).subscribe(z => {
      thit[orderBinding] = z;
      thit[orderBinding + 'Loaded'] = true;
      this.handleLoadInvoices()
    })
  }

  handleLoadInvoices() {
    if (this.componentData.cF == "TV") {
      //This check if source or destination is null => this case means one of pairs not have order 
      //So this will be new order 
      if (this.fromOrderLoaded && this.toOrderLoaded) {
        if (this.fromOrder && !this.toOrder) {
          this.toOrder = { lstItems: [] };
          this.common.CopyValues(this.fromOrder, this.toOrder, ['discPer', 'discAmount', 'serPer', 'serAmount', 'accountId', 'posTableId', 'invoicePosType', 'invoiceCategoryId'])
          this.toOrder.posTableId = this.componentData.toTableInfo.id
          this.toOrder.posTableName = this.componentData.toTableInfo.name
          this.toOrder.invoiceStatus = 1
        }
        else if (!this.fromOrder && this.toOrder) {
          this.fromOrder = { lstItems: [] };
          this.common.CopyValues(this.toOrder, this.fromOrder, ['discPer', 'discAmount', 'serPer', 'serAmount', 'accountId', 'posTableId', 'invoicePosType', 'invoiceCategoryId'])
          this.fromOrder.posTableId = this.componentData.fromTableInfo.id
          this.fromOrder.posTableName = this.componentData.fromTableInfo.name
          this.fromOrder.invoiceStatus = 1
        }
      }
    }
  }
  // move(flag: any) {
  //   let moveItmFunc = (sourceOrder: any, targetOrder: any, index: any) => {
  //     let toMoveItem = sourceOrder.lstItems[index];
  //     if (this.mapper === 1) {
  //       const movedItem = { ...toMoveItem, quantity: 1 };
  //       targetOrder.lstItems.splice(0, 0, movedItem);
  //       targetOrder.lstItems = this.mergeMatchedItems(targetOrder.lstItems)
  //       setTimeout(() => {
  //         toMoveItem.quantity -= 1;
  //         if (toMoveItem.quantity === 0) {
  //           sourceOrder.lstItems.splice(index, 1);
  //         } else {
  //           sourceOrder.lstItems[index].quantity = toMoveItem.quantity;
  //         }
  //         sourceOrder.lstItems = this.mergeMatchedItems(sourceOrder.lstItems)
  //       }, 1);

  //     } else {
  //       targetOrder.lstItems.splice(0, 0, toMoveItem);
  //       sourceOrder.lstItems.splice(index, 1);
  //     }
  //   }

  //   if (flag == 'ltr') {
  //     let tmpArr = this.fromOrder.lstItems.filter((a: any) => a.selected);
  //     tmpArr.reverse();
  //     tmpArr.forEach((itm: any, i: any) => {
  //       if (itm.selected) {
  //         let relatedItemInSourceIndex = this.fromOrder.lstItems.findIndex((a: any) => a == itm)
  //         moveItmFunc(this.fromOrder, this.toOrder, relatedItemInSourceIndex);
  //       }
  //     });
  //   }
  //   else if (flag == 'rtl') {
  //     let tmpArr = this.toOrder.lstItems.filter((a: any) => a.selected);
  //     tmpArr.reverse();
  //     tmpArr.forEach((itm: any, i: any) => {
  //       if (itm.selected) {
  //         let relatedItemInSourceIndex = this.toOrder.lstItems.findIndex((a: any) => a == itm)
  //         moveItmFunc(this.toOrder, this.fromOrder, relatedItemInSourceIndex)
  //       }
  //     });
  //   }
  //   this.fromOrder.lstItems.forEach((z: any) => z.selected = false);
  //   this.toOrder.lstItems.forEach((z: any) => z.selected = false);

  // }
}
