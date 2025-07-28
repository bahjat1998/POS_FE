import { Component, ViewChild } from '@angular/core';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-select-item-variant-add-on',
  templateUrl: './select-item-variant-add-on.component.html',
  styleUrls: ['./select-item-variant-add-on.component.css']
})
export class SelectItemVariantAddOnComponent {
  componentData: any;
  options: any = {}
  fromOrder: any
  toOrder: any
  constructor(private gto: GeneralTemplateOperations, private managementService: ManagementService, public common: CommonOperationsService) {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
    gto.openPosSelectItemDetails$.subscribe((z: any) => {
      this.componentData = JSON.parse(JSON.stringify(z));
      console.log(z)
      this.openPosSelectItemDetails()
      this.otherData.variantQty = 1;
      this.otherData.note = '';
    })
  }
  @ViewChild("PosSelectItemDetails", { static: true }) PosSelectItemDetails?: any;
  openPosSelectItemDetails() {
    this.PosSelectItemDetails?.open();
  }


  closeSelectItemVariantAddOn(action: any = '') {
    if (action) {
      this.gto.closePosSelectItemDetails$.next(this.buildObjectFromSelection())
    }
    this.PosSelectItemDetails?.close();
  }

  buildObjectFromSelection() {
    let obj: any = {
      ...this.componentData
    }
    if (!obj['name']) {
      obj['name'] = this.common.currLang == 'en' ? this.componentData.nameEn : this.componentData.nameAr;
    }

    obj.price = obj.price;
    let selectedVariant = this.componentData.lstVariants.find((z: any) => z.selected)
    if (selectedVariant) {

      if (selectedVariant.repalceCurrentItemName) {
        obj.name = selectedVariant.name;
      }
      if (this.otherData.variantQty > 1) {
        if (selectedVariant.affectItemQty) {
          obj.quantity = this.otherData.variantQty ?? 1;
        } else if (this.otherData.variantQty) {
          selectedVariant.name = `${this.otherData.variantQty} X ${selectedVariant.name}`
        }
      }

      obj['variantId'] = selectedVariant.id;
      obj['variantName'] = selectedVariant.name;
      obj['variantPrice'] = selectedVariant.price;

      if (selectedVariant.asTotalPrice) {
        obj.price = obj['variantPrice']
      } else {
        obj.price += obj['variantPrice']
      }


    }
    obj.note = this.otherData.note
    let lstSelectedAddOns = this.componentData.lstItemAddOns.filter((z: any) => z.selected)
    if (lstSelectedAddOns) {
      obj['lstAddOns'] = lstSelectedAddOns.map((z: any) => {
        obj.price += z.qty * z.price
        return {
          addOnId: z.addOnId,
          addOnName: this.common.currLang == 'en' ? z.nameEn : z.nameAr,
          qty: z.qty,
          price: z.price,
          total: z.qty * z.price
        }
      })
    }

    obj.total = 1 * obj.price;
    return obj;
  }
  lstLkpKeys = ['lstPredefinedCurrenciesValues'];
  lstLkps: any = {}


  inputValue: any = ''

  handleCustomAction(action: any) {
    if (action == "Auto") {

    }
    else if (action == "Auto") {

    }
    else if (action == "Auto") {

    }
  }

  selectBox(type: any, row: any, withSave = false) {
    if (type == 0) {
      this.componentData.lstVariants.forEach((v: any) => v != row ? v.selected = false : '');
      row.selected = !row.selected
      if (withSave) {
        row.selected = true
        this.closeSelectItemVariantAddOn(1)
      }
    }
    else if (type == 1) {
      if (row.selected) {
        row.selected = false;
        row.qty = 0;
      }
      else if (!row.selected) {
        row.selected = true;
        this.lastSelectedAddOn = row;
        if (!row.qty) {
          row.qty = 1;
          row.total = row.qty * row.price;
        }
      }
    }
  }
  lastSelectedAddOn: any = {}
  currentCounter = 0;
  updateCalc($event: any) {
    this.currentCounter = $event;
    if (this.lastSelectedAddOn) {
      let newVal = ($event + '')[($event + '').length - 1]
      if (Number(newVal)) {
        this.lastSelectedAddOn.qty = newVal
      }
      else {
        this.lastSelectedAddOn.qty = 1
      }
    }
  }

  otherData: any = {
    variantQty: 1,
    note: ''
  }
  updateVariantQuantity($event: any) {
    let newVal = ($event + '')[($event + '').length - 1]
    if (Number(newVal)) {
      this.otherData.variantQty = Number(newVal)
    }
    else {
      this.otherData.variantQty = 1
    }
  }
}
