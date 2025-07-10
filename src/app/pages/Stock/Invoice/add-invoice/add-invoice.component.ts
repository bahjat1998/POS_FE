import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { InvoiceReportPdf } from 'src/app/shared/pdf/InvoiceReportPdf/invoice-report-pdf.service';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent {

  lang = "labelEn"
  modal: any = {}
  Id;
  invCategory;

  constructor(private lookupsService: LookupsService, private gto: GeneralTemplateOperations, public invoiceHelperService: InvoiceHelperService, private invoiceReportPdf: InvoiceReportPdf, private managementService: ManagementService, public common: CommonOperationsService, private route: ActivatedRoute) {
    this.Id = this.route.snapshot.paramMap.get("id");
    this.invCategory = this.common.getRouteParam(this.route, 'invCategory', 'num');
    this.selectTab(this.tabs[0])
    this.common.translateList(this.lstWords);
    this.loadItems()
    this.subscribeToEvents()
  }
  closePosSelectItemDetails!: Subscription;
  subscribeToEvents() {
    this.closePosSelectItemDetails = this.gto.closePosSelectItemDetails$.subscribe(a => this.handleCloseSelectItem(a))
  }
  fetchRouteInvCategory() {
    if (this.invCategory && this.lstLkps['InvoiceCategories']) {
      this.modal.invoiceCategoryId = this.invCategory;
      this.invoiceCategoryChanged()
    }
  }
  lstData = []
  ngOnInit(): void {
    this.loadLookups();
    this.pageInit();
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.handleLkps.bind(this));
  }
  handleLkps() {
    this.accountChanged(this.modal)
    this.fetchRouteInvCategory()
  }

  lstLkpKeys = ['_Account_', 'Branch', 'InvoiceCategories', 'lstInvoiceType', 'lstPaymentTypes', 'ItemsPricesLists', 'ItemUnits', 'Departments'];
  lstLkps: any = {}
  pageInit() {
    if (this.Id) {
      this.GetDetails(this.Id)
    } else {
      this.modal = { isActive: 'true', lstItems: [{}], paymentType: 0, discount: 0 };
      this.fetchRouteInvCategory()
    }
  }
  GetDetails(Id: any) {
    this.managementService.InvoiceDetails({ id: Id }).subscribe(z => {
      this.modal = this.parseObjFromServer(z);
      this.fetchSelectedItemsForInv()
    })
  }
  lstKeysRequiredOnInventoryLookups = [];
  lstInventoryLookupsByKey: any = {}
  loadLookups() {
    this.lstKeysRequiredOnInventoryLookups.forEach(key => {
      this.lookupsService.Lookups(key).subscribe(z => {
        this.lstInventoryLookupsByKey[key] = z;
      })
    })
  }
  parseObjFromServer(z: any) {
    if (z['lstDepartmentBranches']) {
      z['_lstDepartmentBranches'] = z['lstDepartmentBranches'].map((a: any) => a['branchId'])
    }
    z['isActive'] = z['isActive'] == true ? 'true' : 'false'

    this.accountChanged(z)
    return z;
  }
  prepareObjToServer(modal: any) {
    modal.isActive = modal.isActive == 'true';

    if (modal['_lstDepartmentBranches']) {
      modal['lstDepartmentBranches'] = modal['_lstDepartmentBranches'].map((a: any) => { return { branchId: a } })
    }

    modal['ComeFrom'] = 1
    return modal;
  }

  validateItems() {
    let reqFields = ['itemId', 'unitId', 'price', 'quantity']
    this.modal['lstItems'].forEach((itm: any) => {
      let validRes = this.common.checkValidation(itm, reqFields);
      if (!validRes.isValid) {
        itm.hasError = true;
      } else {
        delete itm.hasError
      }
    });
    return this.modal['lstItems'].filter((z: any) => !z.hasError).length;
  }
  print() {
    this.managementService.InvoiceReportQuery(this.Id).subscribe((z: any) => {
      this.invoiceReportPdf.CreateReport({ ...z })
    })
  }
  reqFields: any = ['accountId']
  inputFailds: any = {}
  save() {
    let validRes = this.common.checkValidation(this.modal, this.reqFields);
    let validRows = this.validateItems();
    if (validRes.isValid && validRows != this.modal['lstItems'].length) {
      this.common.error("Fill at least one valid item", "");
      return
    }

    if (validRes.isValid && validRows > 0) {
      let modal = this.prepareObjToServer(this.modal);
      this.managementService.AddInvoice(modal).subscribe({
        next: z => {
          this.inputFailds = {}
          if (z.status) {
            this.common.success("تم الحفظ")
            this.Id = z['entityId']
            this.GetDetails(this.Id);
          }
          if (z['lstError'].length > 0) {
            this.common.error("Error", z['lstError'][0])
          }

        }, error: e => {
          this.common.error("Fill required fields", "")
        }
      })
    } else {
      this.inputFailds = validRes.failerFields
      this.common.error("Fill required fields", "")
    }

  }
  back() {
    this.common.navigateTo('../stock/invoices')
  }
  lstWords: any = {
    "AreYouSure": "",
    "DeleteThisItem": "",
    "?": ""
  };
  async deleteRow(details: any, i: any) {
    if (this.modal[details][i].id) {
      let result = await this.common.confirmationMessage(this.lstWords['AreYouSure'], `${this.lstWords['DeleteThisItem']} ${this.lstWords['?']}`);
      if (result.value) {
        this.executeDelete(details, i)
        this.itemsListChanged()
      }
    } else {
      this.executeDelete(details, i)
      this.itemsListChanged()
    }

  }
  executeDelete(details: any, i: any) {
    this.modal[details].splice(i, 1);
  }
  newRow(details: any) {
    if (!this.modal[details]) this.modal[details] = []
    let obj = {}
    this.modal[details].push(obj);
  }
  invoicePaidChange() {
    setTimeout(() => {
      this.invoiceHelperService.updateInvoiceCalculateion(this.modal)
    }, 2);
  }
  itemsListChanged(invoice: any = this.modal) {
    this.invoiceHelperService.refreshItemPrices(invoice)
    this.refreshInvoiceTotalQty(this.modal)
  }
  refreshInvoiceTotalQty(inv: any) {
    if (inv && inv.lstItems)
      inv.totQty = this.common.sum(inv.lstItems, 'quantity')
  }
  selectItem(i: any, item: any) {
    this.CheckItemTypeToAdd(i, item)
  }
  handleCloseSelectItem(itm: any) {
    if (itm) {
      this.DirectAddItemToCart(this.lastSelectedIndex, itm)
      this.itemsListChanged()
    }
  }
  lastSelectedIndex = -1;
  CheckItemTypeToAdd(i: any, item: any) {
    this.lastSelectedIndex = i
    if (!this.modal['lstItems']) { this.modal['lstItems'] = [] }
    if (!item.selectedItemObj.lstVariants || item.selectedItemObj.lstVariants.length == 0) {
      this.DirectAddItemToCart(i, item.selectedItemObj ?? item)
      this.itemsListChanged()
    } else {
      this.gto.openPosSelectItemDetails$.next(item.selectedItemObj)
    }
  }
  DirectAddItemToCart(i: any, item: any) {
    let newCartItem = this.mapItemToCart(item);
    if (!newCartItem.lstAddOns) {
      delete this.modal['lstItems'][i]['lstAddOns']
    }
    this.modal['lstItems'][i] = { ...this.modal['lstItems'][i], ...newCartItem }
  }
  mapItemToCart(item: any, qty = 1) {
    console.log('mapItemToCart', item)
    let newCartItem: any = {
      itemId: item.id,
      price: item.price,
      unitId: item.unitId ?? item.defaultUnitId,
      itemUnitId: item.itemUnitId,
      quantity: qty
    };
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
  getItemKey(itm: any) {
    return `${itm.itemId}_${itm.variantId ?? ''}_${itm.lstAddOns ? itm.lstAddOns.sort((a: any, b: any) => a.addOnId - b.addOnId).map((a: any) => `${a.addOnId}.${a.qty}`).join(",") : ''}`
  }
  itemChanged(i: any, r: any) {
    setTimeout(() => {
      let relatedItm = this.common.getRelatedFromLkp(this.lstLkps['lstItemsLkp'], r['itemId'], 'id');
      r['selectedItemObj'] = relatedItm;
      this.selectItem(i, r)
    }, 1);
  }
  fetchSelectedItemsForInv() {
    if (this.modal.lstItems && this.lstLkps['lstItemsLkp']) {
      this.modal.lstItems.forEach((r: any) => r['selectedItemObj'] = this.common.getRelatedFromLkp(this.lstLkps['lstItemsLkp'], r['itemId'], 'id'));
    }
  }
  loadItems() {
    this.managementService.ItemListWithDetails({}).subscribe(z => {
      this.common.fixImagesUrls(z.lstData, ['img'])
      z.lstData.forEach((i: any) => this.common.fixImagesUrls(i.lstVariants, ['img']));
      z.lstData.forEach((i: any) => this.common.fixImagesUrls(i.lstItemAddOns, ['img']));
      z.lstData.forEach((r: any) => r.label = this.common.currLang == 'en' ? r.nameEn : r.nameAr);
      this.fixItemPrices()
      this.lstLkps['lstItemsLkp'] = z.lstData;
      this.fetchSelectedItemsForInv()
    })
  }

  fixItemPrices() {
    if (this.lstLkps['lstItemsLkp'] && this.modal && this.modal['accDefaultPriceListFlag'])
      this.common.fixItemDefaultUnits(this.lstLkps['lstItemsLkp'], this.modal['accDefaultPriceListFlag'])
  }
  unitChanged(r: any) {
    setTimeout(() => {
      let relatedUnitObj = this.common.getRelatedFromLkp(r.selectedItemObj.lstUnits, r.unitId, 'unitId');
      if (relatedUnitObj) {
        r['price'] = Number(relatedUnitObj[this.modal['accDefaultPriceListFlag']]);
        this.itemsListChanged(this.modal);
      }
    }, 1);
  }
  accountChanged(obj: any, fromFe = false) {
    setTimeout(() => {
      if (obj['accountId'] && this.lstLkps['_Account_'] && this.lstLkps['ItemsPricesLists']) {
        let account = this.common.getRelatedFromLkp(this.lstLkps['_Account_'], obj['accountId']);
        let relatedPrice = this.common.getRelatedFromLkp(this.lstLkps['ItemsPricesLists'], account.defaultPriceListId);
        obj['accDefaultPriceListFlag'] = relatedPrice.str1;

        if (fromFe && !obj['accDefaultPriceListFlag']) {
          alert("selected account not has a price list!")
        }
        this.fixItemPrices()
      } else if (fromFe == false) {
        delete obj['accDefaultPriceListFlag'];
      }
    }, 1);
  }
  changeInvoiceTotals(flag: any) {
    this.invoiceHelperService.calculateInvoiceTotals(this.modal, flag)
  }
  invoiceCategoryChanged() {
    if (this.modal['invoiceCategoryId'] && this.lstLkps['InvoiceCategories']) {
      let relatedInvoiceType = this.common.getRelatedFromLkp(this.lstLkps['InvoiceCategories'], this.modal['invoiceCategoryId']);
      if (relatedInvoiceType && relatedInvoiceType.str1) {
        this.modal['invoiceType'] = Number(relatedInvoiceType.str1)
      } else {
        alert("Invoice Type not filled, Check InvoiceCategories into lookups and fill related type.");
      }
    }
  }


  tabs: any = [
    { label: "Items", value: 0, },
    { label: "DeletedItems", value: 1 }
  ]
  selectedTab: any = {}
  selectTab(tab: any) {
    this.selectedTab = tab;
  }
  selectTabByVal(val: any) {
    this.selectTab(this.tabs.find((z: any) => z.value == val))
  }
}
