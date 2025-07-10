import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { PosDrawerPdfService } from 'src/app/shared/pdf/POSDomain/PosDrawer/pos-drawer-pdf.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';
import { ShiftStateManagement } from 'src/app/shared/StateManagementServices/ShiftStateManagement/shift-state-management.service';

@Component({
  selector: 'app-posmain-page',
  templateUrl: './posmain-page.component.html',
  styleUrls: ['./posmain-page.component.css'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ],
})
export class POSMainPageComponent {
  lstLkpKeys = ['ItemGroups'];
  lstLkps: any = {}
  model: any = {}
  routeTableId: any;
  routeTblName: any;
  routeInvoiceId: any;
  routeInvoiceType: any;
  currentLayout: any = {}
  p: any = {}
  constructor(private gto: GeneralTemplateOperations, public invoiceHelperService: InvoiceHelperService, private posDrawer: PosDrawerPdfService, private router: Router, public common: CommonOperationsService, public shiftStateManagement: ShiftStateManagement, private managementService: ManagementService, private route: ActivatedRoute) {
    this.fetchItemsFromRemote()
    this.handlePosRoutesSetup()
    this.gto.changeScreenTitle$.next({ display: "none" })
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.handleLkpsLoaded.bind(this));
    this.subscribeToEvents()
    this.common.translateList(this.lstWords)
    this.fillLayout()
    this.setupShortCuts()
    this.resetPermissions()
  }

  resetPermissions() {
    this.p = this.common.getCurrentUserInfo().permissions
  }
  fetchItemsFromRemote() {
    this.managementService.LoadAllItemsAndCacheIt({}).subscribe(z => {
      if (this.selectedCategory && (!this.selectedCategory.lstItems || this.selectedCategory.lstItems.length == 0))
        this.loadItems(this.selectedCategory)
    })
  }
  async fillLayout() {
    this.currentLayout = await this.gto.getStyle()
  }

  handlePosRoutesSetup() {
    this.routeTableId = this.route.snapshot.queryParamMap.get("tId");
    this.routeTblName = this.route.snapshot.queryParamMap.get("t");
    if (this.routeTableId) {
      this.getInvoiceDetails({ tableId: this.routeTableId }, { onFinish: () => this.clearCurrentRoutesParams() })
    }

    this.routeInvoiceId = this.route.snapshot.queryParamMap.get("oId");
    if (this.routeInvoiceId) {
      this.getInvoiceDetails({ id: this.routeInvoiceId }, { onFinish: () => this.clearCurrentRoutesParams() })
    }

    this.routeInvoiceType = this.route.snapshot.queryParamMap.get("posType");
    if (this.routeInvoiceType) {
      this.resetCurrentInvoice();
      this.clearCurrentRoutesParams()
    }
    else {
      this.resetCurrentInvoice();
    }

  }
  closePosSelectItemDetails!: Subscription;
  closePosPaymentScreen!: Subscription;
  closePosOrdersList!: Subscription;
  closePosMoveOrderItems!: Subscription;
  currentActiveShiftChanged!: Subscription;
  closePosSelectAccount!: Subscription;
  closePosItemsSearch!: Subscription;

  subscribeToEvents() {
    this.closePosSelectItemDetails = this.gto.closePosSelectItemDetails$.subscribe(a => this.handleCloseSelectItem(a))
    this.closePosPaymentScreen = this.gto.closePosPaymentScreen$.subscribe(a => this.handleClosePosPayment(a))
    this.closePosOrdersList = this.gto.closePosOrdersList$.subscribe(a => this.handleClosePosOrdersList(a))
    this.closePosMoveOrderItems = this.gto.closePosMoveOrderItems$.subscribe(a => this.handleClosePosMoveOrderItems(a))
    this.currentActiveShiftChanged = this.gto.currentActiveShiftChanged$.subscribe(a => this.handleCurrentActiveShiftChanged(a))
    this.currentActiveShiftChanged = this.gto.closePosSelectAccount$.subscribe(a => {
      this.handleSelectSupplierAccount(a)
      this.handleSelectEmployeeAccount(a)
      this.handleSelectDestructionAccount(a)
    })
    this.closePosItemsSearch = this.gto.closePosItemsSearch$.subscribe(a => this.handleClosePosItemsSearch(a))
  }

  ngOnDestroy() {
    if (this.closePosSelectItemDetails) { this.closePosSelectItemDetails.unsubscribe(); }
    if (this.closePosPaymentScreen) { this.closePosPaymentScreen.unsubscribe(); }
    if (this.closePosOrdersList) { this.closePosOrdersList.unsubscribe(); }
    if (this.closePosMoveOrderItems) { this.closePosMoveOrderItems.unsubscribe(); }
    if (this.currentActiveShiftChanged) { this.currentActiveShiftChanged.unsubscribe(); }
    if (this.closePosSelectAccount) { this.closePosSelectAccount.unsubscribe(); }
    if (this.closePosItemsSearch) { this.closePosItemsSearch.unsubscribe(); }
  }


  handleLkpsLoaded() {
    if (this.lstLkps['ItemGroups']) {
      // this.lstLkps['ItemGroups'] = [...this.lstLkps['ItemGroups'], ...this.lstLkps['ItemGroups']]
      this.common.sortObjectsByProp(this.lstLkps['ItemGroups'], 'str3')
      this.selectCategory(this.lstLkps['ItemGroups'][0])
      this.common.fixImagesUrls(this.lstLkps['ItemGroups'], 'str1');
      this.gto.refreshStyle()
    }
  }
  selectedCategory: any = {}
  selectCategory(r: any) {
    let lastSelectedCategory = this.selectedCategory;
    this.selectedCategory = r;
    setTimeout(() => {
      //Make selected Category binding into UI
      this.loadItems(r)
    }, 1);
    setTimeout(() => {
      //Clear last category items
      lastSelectedCategory.lstItems = []
    }, 100);
  }

  getCurrentPriceListKey() {
    if (!this.customPriceListKey) {
      return this.common.getCurrentPosSalesPriceListKey()
    }
    else {
      return this.customPriceListKey
    }
  }

  async loadItems(cat: any, subCatId: any = undefined) {
    let z: any = await this.managementService.ItemListWithDetailsFromCache({ GroupId: cat.value, SubGroupId: subCatId });
    if (z.lstData) {
      this.common.fixImagesUrls(z.lstData, ['img'])
      z.lstData.forEach((i: any) => this.common.fixImagesUrls(i.lstVariants, ['img']));
      z.lstData.forEach((i: any) => this.common.fixImagesUrls(i.lstItemAddOns, ['img']));
      this.common.fixItemDefaultUnits(z.lstData, this.getCurrentPriceListKey())
      cat.lstItems = z.lstData;
      this.chunkedItems = this.chunkArray(cat.lstItems, this.currentLayout.Items.cols ?? 5);
      this.gto.refreshStyle()
    }
  }

  defaultCategoryImage = 'https://t3.ftcdn.net/jpg/00/78/87/94/360_F_78879462_KyMC4iWhDHLlEEZDAOLiDWPuubnAaMMk.jpg';
  selectItem(item: any) {
    this.CheckItemTypeToAdd(item)
    this.model.changed = true;
  }
  CheckItemTypeToAdd(item: any) {
    if (!this.model['lstItems']) { this.model['lstItems'] = [] }
    if (!item.lstVariants || item.lstVariants.length == 0) {
      this.DirectAddItemToCart(item)
      this.itemsListChanged()
      this.notifyNewItemAddedToCart()
    } else {
      this.gto.openPosSelectItemDetails$.next(item)
    }
  }
  lastItemAdded: any;
  DirectAddItemToCart(item: any) {
    let newCartItem = this.mapItemToCart(item, item.quantity ?? 1, item.note);
    let declaredBefore = this.checkIfItemDeclaredBefore(newCartItem);
    if (!declaredBefore) {
      this.model['lstItems'].push(newCartItem)
    } else {
      declaredBefore.quantity += item.quantity ?? 1;
    }
    this.lastItemAdded = declaredBefore ?? newCartItem;
    this.markItemAsSelected(this.lastItemAdded)
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
  getItemKey(itm: any) {
    return `${itm.itemId}_${itm.variantId ?? ''}_${itm.note}_${itm.unitId ?? ""}_${itm.sentToKit ?? "F"}_${itm.lstAddOns ? itm.lstAddOns.sort((a: any, b: any) => a.addOnId - b.addOnId).map((a: any) => `${a.addOnId}.${a.qty}`).join(",") : ''}`
  }
  checkIfItemDeclaredBefore(item: any) {
    let relatedCartItem = this.model.lstItems.find((z: any) => z.key == item.key)
    return relatedCartItem
  }
  mapItemToCart(item: any, qty = 1, note = '') {
    let newCartItem: any = {
      itemId: item.id,
      price: item.price,
      unitId: item.unitId,
      itemUnitId: item.itemUnitId,
      quantity: qty,
      groupId: item.groupId,
      note: note
    };
    if (this.model.allowChangeUnit || (item.lstUnits && item.lstUnits.length >= 2)) {
      newCartItem.lstUnits = item.lstUnits
      newCartItem.selectedUnit = newCartItem.lstUnits.find((z: any) => z.unitId == item.defaultUnitId)
    }
    if (item.name) {
      newCartItem['name'] = item.name
    } else {
      newCartItem['name'] = this.common.currLang == 'en' ? item.nameEn : item.nameAr
    }
    if (item.variantId) {
      newCartItem.variantId = item.variantId
      newCartItem.variantName = item.variantName
      newCartItem.variantPrice = item.variantPrice
    }
    if (item.lstAddOns) {
      newCartItem.lstAddOns = item.lstAddOns
    }

    newCartItem.key = this.getItemKey(newCartItem)
    return newCartItem;
  }

  handleCloseSelectItem(itm: any) {
    if (itm) {
      this.DirectAddItemToCart(itm)
      this.itemsListChanged()
      this.notifyNewItemAddedToCart()
    }
  }

  notifyNewItemAddedToCart() {
    this.gto.newItemAddedToCart$.next(1)
  }

  // General methods
  itemsListChanged(invoice: any = this.model) {
    this.invoiceHelperService.refreshItemPrices(invoice)
    this.refreshInvoiceTotalQty(this.model)
    this.checkDiscountAmountLimits()
  }

  refreshInvoiceTotalQty(inv: any) {
    if (inv && inv.lstItems)
      inv.totQty = this.common.sum(inv.lstItems, 'quantity')
  }
  addItemsHashKey(inv: any) { //Call it when retrieve order details
    if (inv && inv.lstItems)
      inv.lstItems.forEach((itm: any) => {
        if (!itm.key)
          itm.key = this.getItemKey(itm);
      });
  }
  cartChangeItemQty = (itm: any, newQty: any) => {
    itm.quantity = newQty;
    this.itemsListChanged();
  }
  cartChangeDiscountService = () => {
    this.invoiceHelperService.calculateInvoiceTotals(this.model);
  }


  PendingBtn() {
    if (this.model.changed) {
      this.MakeOrderPending(this.model, {
        ...this.generalPendingOrderCallbacks,
        onPost: this.PreSubmitOrderPrintPending.bind(this),
        success: this.AfterSubmitOrderPrintPending.bind(this)
      })
    } else {
      this.resetCurrentInvoice()
    }
    this.resetCustomAccountIfSetted()
  }

  btnSearch() {
    this.gto.openPosItemsSearch$.next(1)
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
  MakeOrderPending(invoice: any = this.model, callBacks: any = {}) {
    if (this.isValidInvoice(invoice)) {
      if (callBacks.onPost) {
        callBacks.onPost(invoice);
      }
      let obj = this.prepareObjToServer(invoice);
      this.managementService.AddInvoice(obj).subscribe(z => {
        if (z.status) {
          invoice.id = z.entityId
          if (callBacks.success) {
            callBacks.success(invoice)
          }
        }
      })
    } else {
      if (callBacks.error) {
        callBacks.error(invoice)
      }
    }
  }

  getInvoiceDetails(req: any, callBacks: any = {}, invoiceRepo = 'model') {
    let thit: any = this;
    this.managementService.InvoiceDetails(req).subscribe(z => {
      if (z) {
        z.lstItems.forEach((itm: any) => itm._sentToKit = itm.sentToKit);
        thit[invoiceRepo] = z;
      }
      else {
        this.resetCurrentInvoice();
      }
      if (callBacks.onFinish) {
        callBacks.onFinish()
      }
      this.addItemsHashKey(thit[invoiceRepo])
      this.refreshInvoiceTotalQty(thit[invoiceRepo])
      this.checkIfPricelistNotBelongToDefaultCurrentPosAccount(thit[invoiceRepo])
    })
  }
  checkIfPricelistNotBelongToDefaultCurrentPosAccount(invoice: any) {
    let currentUserInfo = this.common.getCurrentUserInfo();
    if (invoice.accountId != currentUserInfo.posDetails.posSalesAccountId) {
      this.customPriceListKey = invoice.priceListKey
      this.loadItems(this.selectedCategory)
    }
  }
  printInvoice(invoice: any, PrintTo = 'Cash') {
    console.log("Print inv", PrintTo)
    if (PrintTo.indexOf("Cash") > -1) {
      this.invoiceHelperService.printInvoice(invoice);
    }
    if (PrintTo.indexOf("Kit") > -1) {
      this.invoiceHelperService.lstItemGroupsLkp = this.lstLkps['ItemGroups']
      let ItmsToPrint = [];
      if (invoice.lstItems) { ItmsToPrint.push(...invoice.lstItems) }
      if (invoice.lstDeletedItems) { ItmsToPrint.push(...invoice.lstDeletedItems) }
      this.invoiceHelperService.printInvoicePartsToKitchens({ ...invoice, lstItems: ItmsToPrint });
    }
  }
  toTables() {
    if (this.model.changed) {
      this.tempSaveOrderTable()
      this.MakeOrderPending(this.model, {
        ...this.generalPendingOrderCallbacks, error: '',
        onPost: this.PreSubmitOrderPrintPending.bind(this),
        success: this.AfterSubmitOrderPrintPending.bind(this)
      })
    }
    this.common.navigateTo("../floors");
  }
  tempSaveOrderTable() {
    if (this.model.posTableId && this.model.lstItems && this.model.lstItems.length > 0) {
      console.log("Save To Table", this.model.posTableId)
      localStorage.setItem("tempTblBusy", this.model.posTableId)
    }
  }
  clearCurrentRoutesParams() {
    this.routeTableId = '';
    this.routeTblName = '';
    this.routeInvoiceId = '';
    this.routeInvoiceType = '';
    this.router.navigate([], {
      queryParams: {}
    });
  }
  resetCurrentInvoice() {
    let currentUserInfo = this.common.getCurrentUserInfo();
    this.model = {
      invoiceStatus: 1,
      invoicePosType: 0,
      invoiceCategoryId: currentUserInfo.posDetails.invoiceCategoryId,
      accountId: currentUserInfo.posDetails.posSalesAccountId,
      invoiceType: currentUserInfo.posDetails.invoiceType,
      accountName: currentUserInfo.posDetails.mainAccName,
      paymentType: 0,
      lstItems: []
      // ShiftId: this.shiftStateManagement.CurrentShiftId //should be runing at submit, because may close and open new shift after create this model
    }

    if (this.routeTableId) {
      this.model.invoicePosType = 2; //Table
      this.model.posTableId = this.routeTableId;
      this.model.posTableName = this.routeTblName;
    }

    if (this.routeInvoiceType) {
      this.model.invoicePosType = this.routeInvoiceType;
    }

    this.model = { ...this.model, ...this.customModificationForCurrentInvoice, changed: true }
  }

  isValidInvoice(invoice: any) {
    if (invoice && invoice.lstItems && invoice.lstItems.length > 0) {
      return true;
    }
    return false;
  }

  //Start Payscreen
  generalPaymentPrintingToIgnore = ''
  getGeneralPaymentPrintTag() {
    if (this.generalPaymentPrintingToIgnore == "Cash") {
      return 'Kit';
    }
    else if (this.generalPaymentPrintingToIgnore == "Kitchen") {
      return 'Cash';
    }
    else if (this.generalPaymentPrintingToIgnore == "All") {
      return '';
    }
    else return "Kit&Cash"
  }
  handleClosePosPayment(invoice: any) {
    if (invoice.source == "POS") {
      this.generalPaymentPrintingToIgnore = invoice.withoutPrinters;
      const callBacks = {
        onPost: this.PreSubmitOrderPrintPay.bind(this),
        success: this.AfterSubmitOrderPrintPay.bind(this)
      }
      this.invoiceHelperService.MakeOrderPayment(invoice, callBacks)
      this.resetCustomAccountIfSetted()
    }
  }

  PaymentBtn() {
    if (this.isValidInvoice(this.model)) {
      this.MakeOrderPending(this.model);
      this.PaymentScreen(this.model);
    } else {
      this.common.error(this.lstWords['NotValidOrder'])
    }
  }
  PaymentScreen(invoice: any) {
    this.gto.openPosPaymentScreen$.next({ orderDetails: invoice, source: "POS" })
  }

  QuickAutoPay() {
    if (this.isValidInvoice(this.model)) {
      this.model.invoiceStatus = 4;
      this.model.paid = this.model.finalTotal;
      this.model.remaining = 0;
      this.MakeOrderPending(this.model, {
        ...this.generalPendingOrderCallbacks,
        onPost: this.PreSubmitOrderPrintPay.bind(this),
        success: this.AfterSubmitOrderPrintPay.bind(this)
      })
      this.resetCustomAccountIfSetted()
    } else {
      this.common.error(this.lstWords['NotValidOrder'])
    }
  }
  //End Payscreen

  //Start Order List
  handleClosePosOrdersList(data: any) {
    if (data.action == "Pick") {
      //submit Last opened order 
      this.MakeOrderPending(this.model, {
        ...this.generalPendingOrderCallbacks, error: null,
        onPost: this.PreSubmitOrderPrintPending.bind(this),
        success: this.AfterSubmitOrderPrintPending.bind(this)
      })
      this.getInvoiceDetails({ id: data.inv.id });
    }
  }
  showOrdersList() {
    this.gto.openPosOrdersList$.next({ apiFilters: { invoiceStatus: 1 }, buttons: { Pick: 1 } })
  }
  //End Order List



  // Start Split Logic 
  openSplitInvoice(inv: any = this.model) {
    if (this.isValidInvoice(inv)) {
      //Make order pending
      // setTimeout(() => {
      this.MakeOrderPending(this.model, { success: () => { this.gto.splitOrderPendingSourceIdArrived$.next(this.model.id) } })
      // }, 5000);
      let fromOrder = JSON.parse(JSON.stringify(inv))

      let toOrder: any = { lstItems: [] };
      this.common.CopyValues(fromOrder, toOrder, ['discPer', 'discAmount', 'serPer', 'serAmount', 'accountId', 'posTableId', 'invoicePosType', 'invoiceCategoryId'])

      this.gto.openPosMoveOrderItems$.next({
        fromOrder: fromOrder,
        toOrder: toOrder,
        buttons: { PAY: true }
      })
    } else {
      this.common.error(this.lstWords['NotValidOrder'])
    }
  }

  handleClosePosMoveOrderItems(payload: any) {
    if (payload.action == "RefreshCurrentOrder") {
      this.getInvoiceDetails({ id: this.model.id })
    }
  }
  openPosSetup() {
    this.gto.openPosStyleSetup$.next(1)
  }
  printTicket() {
    this.model.invoiceStatus = 3;
    this.MakeOrderPending(this.model, {
      ...this.generalPendingOrderCallbacks,
      onPost: this.PreSubmitOrderPrintPay.bind(this),
      success: this.AfterSubmitOrderPrintPay.bind(this)
    })
  }
  LOG() {

  }
  //End Split Logic

  lstWords = {
    "NotValidOrder": ""
  }
  generalPendingOrderCallbacks = {
    onPost: (inv: any) => { this.resetCurrentInvoice() },
    success: (inv: any) => { this.common.success("تم الحفظ"); },
    error: (inv: any) => this.common.error("Empty", "")
  }
  MarkItemsAsSentToKit(inv: any) {
    inv.lstItems.forEach((itm: any) => itm.sentToKit = true);
  }
  PreSubmitOrderPrintPending(inv: any) {
    if (inv.id) {
      this.printInvoice(inv, 'Kit')
      inv.printedBeforeSubmit = true;
    }
    this.MarkItemsAsSentToKit(inv)
    this.generalPendingOrderCallbacks.onPost(inv)
  }
  AfterSubmitOrderPrintPending(inv: any) {
    if (inv.id && !inv.printedBeforeSubmit) {
      this.printInvoice(inv, 'Kit')
    }
    this.generalPendingOrderCallbacks.success(inv)
  }
  PreSubmitOrderPrintPay(inv: any) {
    if (inv.id) {
      if (this.getGeneralPaymentPrintTag())
        this.printInvoice(inv, this.getGeneralPaymentPrintTag())
      inv.printedBeforeSubmit = true;
      this.generalPaymentPrintingToIgnore = '';
    }
    this.MarkItemsAsSentToKit(inv)
    this.generalPendingOrderCallbacks.onPost(inv)
  }
  AfterSubmitOrderPrintPay(inv: any) {
    if (inv.id && !inv.printedBeforeSubmit) {
      if (this.getGeneralPaymentPrintTag())
        this.printInvoice(inv, this.getGeneralPaymentPrintTag())
      this.generalPaymentPrintingToIgnore = '';
    }
    this.generalPendingOrderCallbacks.success(inv)
  }
  openDrawer() {
    this.posDrawer.openNow()
  }
  logout() {
    this.shiftStateManagement.ClearCurrentShiftId()
    this.common.logout()
  }

  noteToKitchen() {
    this.gto.openPosNoteToKitchen$.next(1);
  }
  enablePrintLastClsoedShift = false;
  handleCurrentActiveShiftChanged(a: any) {
    setTimeout(() => {
      this.enablePrintLastClsoedShift = this.shiftStateManagement.lastClosedShiftDetails ? true : false;
    }, 1000);
  }

  printLastClosedShiftDetails() {
    if (this.shiftStateManagement.lastClosedShiftDetails) {
      this.shiftStateManagement.PrintShiftDetails(this.shiftStateManagement.lastClosedShiftDetails)
    }
  }


  openStockReport() {
    this.gto.openPosStockReport$.next(1)
  }

  customPriceListKey = "";
  customModificationForCurrentInvoice: any = {}
  resetCustomAccountIfSetted() {
    if (this.customPriceListKey) {
      this.customPriceListKey = "";
      this.customModificationForCurrentInvoice = {}
      this.loadItems(this.selectedCategory);
      this.resetCurrentInvoice();
    }
  }
  openBuyInvoice() {
    this.gto.openPosSelectAccount$.next({
      title: "SupplierAccount",
      selectLabel: "SelectSupplierAccount",
      source: "_Account_2_t",
      doneLbl: "StartInvoice",
      id: "SA"
    })
  }
  handleSelectSupplierAccount(z: any) {
    if (z.id == "SA") {
      if (z.accountId) {
        this.customPriceListKey = z.account.str1;
        this.loadItems(this.selectedCategory);
        let currentUserInfo = this.common.getCurrentUserInfo();
        this.customModificationForCurrentInvoice = {
          invoiceCategoryId: currentUserInfo.posDetails.buyInvoiceCategoryId,
          accountId: z.account.value,
          accountName: z.account.label,
          customCartTag: "BuyInvoice",
          allowChangeUnit: true,
          priceListKey: this.customPriceListKey,
          invoiceType: 0
        }
        this.resetCurrentInvoice()
      }
      else {
        this.customPriceListKey = '';
        this.customModificationForCurrentInvoice = {}
        this.loadItems(this.selectedCategory)
      }
    }
  }



  openEmployeeInvoice() {
    this.gto.openPosSelectAccount$.next({
      title: "InvoiceForEmployee",
      selectLabel: "SelectEmployee",
      source: "_Account_1_t",
      doneLbl: "StartInvoice",
      id: "EmpA"
    })
  }
  handleSelectEmployeeAccount(z: any) {
    if (z.id == "EmpA") {
      if (z.accountId) {
        this.customPriceListKey = z.account.str1;
        this.loadItems(this.selectedCategory);
        this.customModificationForCurrentInvoice = {
          accountId: z.account.value,
          accountName: z.account.label,
          customCartTag: "EmployeeInvoice",
          allowChangeUnit: true,
          priceListKey: this.customPriceListKey
        }
        this.resetCurrentInvoice()
      }
      else {
        this.customPriceListKey = '';
        this.customModificationForCurrentInvoice = {}
        this.loadItems(this.selectedCategory)
      }
    }
  }


  openDisposalInvoice() {
    let currentUserInfo = this.common.getCurrentUserInfo();
    if (!currentUserInfo.posDetails.disposalInvoiceCatId) {
      this.common.confirmationMessage("Error", "Please Fill Disposal Invoice Category In Branch Setup");
      return;
    }
    this.gto.openPosSelectAccount$.next({
      title: "DestructionAccount",
      selectLabel: "SelectAccount",
      source: "_Account_4_t",
      doneLbl: "StartInvoice",
      id: "Dest",
      defaultDestructionAccount: currentUserInfo.posDetails.adjustmentAccountId ?? '',
      NotesLabel: 'DisposalReason'
    })
  }
  enableDispose: any
  handleSelectDestructionAccount(z: any) {
    if (z.id == "Dest") {
      if (z.accountId) {
        this.customPriceListKey = z.account.str1;
        this.loadItems(this.selectedCategory);
        let currentUserInfo = this.common.getCurrentUserInfo();
        this.customModificationForCurrentInvoice = {
          invoiceCategoryId: currentUserInfo.posDetails.disposalInvoiceCatId,
          accountId: z.account.value,
          accountName: z.account.label,
          customCartTag: "DisposalInvoice",
          allowChangeUnit: true,
          priceListKey: this.customPriceListKey,
          notes: z.note
        }
        this.resetCurrentInvoice()
        this.enableDispose = true
        this.p = { DisposalInvoice: true }
      }
      else {
        this.customPriceListKey = '';
        this.customModificationForCurrentInvoice = {}
        this.loadItems(this.selectedCategory)
      }
    }
  }
  SaveDisposalInvoice() {
    this.model.invoiceStatus = 4;
    this.MakeOrderPending(this.model, {
      ...this.generalPendingOrderCallbacks,
      onPost: () => {
        this.resetCurrentInvoice();
        this.CancelDisposalInvoice()
      },
      success: this.AfterSubmitOrderPrintPending.bind(this)
    })
  }

  CancelDisposalInvoice() {
    this.customPriceListKey = '';
    this.customModificationForCurrentInvoice = {}
    this.loadItems(this.selectedCategory)
    this.resetCurrentInvoice();
    this.resetPermissions()
    this.enableDispose = false
  }

  openAddExpenses() {
    this.gto.PosExpenseList$.next(1)
  }


  SetDeliveryCustomer() {
    this.gto.openPosDeliveryCustomer$.next({ orderDetails: this.model })
  }

  lstShortCuts: any = []
  async setupShortCuts() {
    let setup: any = await this.gto.getStyle();
    if (setup.lstShortCutsActionsLkp && setup.lstShortCutsActionsLkp.length > 0 && setup.lstShortCutsActionsLkp.some((z: any) => z.key)) {
      this.lstShortCuts = setup.lstShortCutsActionsLkp
    }

  }
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    console.log(event.key)
    // if (event.ctrlKey && event.key === 's') {
    //   event.preventDefault();
    //   console.log('Ctrl + S pressed');
    //   // Add your custom logic here
    // }
    this.lstShortCuts.forEach((z: any) => {
      if (z.action && z.key) {
        if (Number(event.key) && z.key == "nums") {
          console.log("action", z.action);
          this.gto.shortCutDetection$.next({ ...z, pressOn: Number(event.key) })
        }
        else if (z.key == event.key) {
          console.log("action", z.action);
          let thit: any = this;
          if (z.bind && !z.handleBy) {
            thit[z.bind]();
          } else if (z.handleBy) {
            this.gto.shortCutDetection$.next({ ...z })
          }
          event.preventDefault();
        }
      }
    });
  }
  handleClosePosItemsSearch(c: any) {
    if (c.action == 'add') {
      c.itm = this.common.fixItemDefaultUnits([c.itm], this.getCurrentPriceListKey())[0]
      this.CheckItemTypeToAdd(c.itm);
    }
  }
  trackByRowIndex = (index: number, row: any[]): number => {
    setTimeout(() => {
      console.log(index)
      this.gto.fixGridChunks()
    }, 1);
    return index;
  }

  onScrollIndexChange(_: any) {
    this.gto.fixGridChunks()
  }
  chunkedItems: any[][] = [];
  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
  checkDiscountAmountLimits() {
    if (this.model.discAmount && this.p['MaximumDiscount']) {
      if (this.model.discAmount > this.p['MaximumDiscount']) {
        delete this.model.discAmount;
        delete this.model.discPer;
        this.invoiceHelperService.calculateInvoiceTotals(this.model)
        this.common.error("MaximumDiscountExceeded")
      }
    }
  }


}
