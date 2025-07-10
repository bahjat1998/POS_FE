import { animate, style, transition, trigger } from '@angular/animations';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LookupsService } from 'src/app/shared/services/Lookups/lookups.service';
import { CacheService } from 'src/app/shared/services/systemcore/cashe.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';

@Component({
  selector: 'app-lookups',
  templateUrl: './lookups.component.html',
  styleUrls: ['./lookups.component.scss'],
  animations: [
    trigger('toggleAnimation', [
      transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
      transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
    ]),
  ]
})
export class LookupsComponent {
  addCategoryForm: any
  searchCategoryStr = new FormControl('')
  get addCategoryFormControls() {
    return this.addCategoryForm.controls
  }
  addLookupForm: any
  // searchLookupStr = new FormControl('')
  get addLookupFormControls() {
    return this.addLookupForm.controls
  }

  isModalShown = false;
  constructor(public common: CommonOperationsService, private cacheService: CacheService, private lookupsService: LookupsService) {
    setTimeout(() => {
      this.searchCategories()
    }, 10);
    this.searchCategoryStr.valueChanges.subscribe(z => {
      this.searchCategories()
    })

    this.refreshLookups();
  }
  lstLkpKeys = ['lstColors', 'lstInvoiceType'];
  lstLkps: any = {}

  refreshLookups() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps)
  }
  /* Start Add Category  */
  public paggingManager = {
    id: 'x',
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 10
  }
  pageChanged($e: any) {
    this.paggingManager.currentPage = $e;
    this.searchCategories();
  }

  selectedCategory: any = {}
  selectCategory(r: any) {
    if (!this.selectedCategory || this.selectedCategory.id != r.id) {
      this.searchLookups(r.id)
    }
    this.selectedCategory = r
  }


  @ViewChild("addCategoryModal", { static: true }) addCategoryModal?: any;
  openAddCategory(obj: any = null) {
    this.initialAddCategoryForm(obj);
    this.addCategoryModal?.open();
  }
  initialAddCategoryForm(obj: any) {
    if (!obj) obj = {}
    this.addCategoryForm = new FormGroup({
      id: new FormControl(obj['id'] ?? ''),
      code: new FormControl(obj['code'] ?? '', Validators.required),
      nameEn: new FormControl(obj['nameEn'] ?? '', Validators.required),
      nameAr: new FormControl(obj['nameAr'] ?? '', Validators.required)
    });
  }
  closeAddCategory(save: boolean = false) {
    if (!this.addCategoryForm.valid) {
      this.common.error("Fill required fields", "")
      return;
    }
    if (save) {
      this.lookupsService.AddCategory({ ...this.addCategoryForm.value, isActive: true }).subscribe(z => {
        if (z.status) {
          this.searchCategories()
          this.common.success();
          this.addCategoryModal?.close();
        }
      })
    } else {
      this.addCategoryModal?.close();
    }
  }

  lstCategories: any = []
  searchCategories() {
    this.lookupsService.CategoryList(this.paggingManager.currentPage, 100, this.searchCategoryStr.value).subscribe(z => {
      this.lstCategories = z.lstData;
      this.paggingManager.totalItems = z.rowsCount
    })
  }
  /* End Add Category  */

  /* Start Add Lookup  */
  @ViewChild('addLookupModal') addLookupModal?: any;
  openAddLookup(obj: any = null) {
    if (!obj) obj = { 'categoryId': this.selectedCategory.id }
    this.initialAddLookupForm(obj);
    this.addLookupModal?.open();
  }
  initialAddLookupForm(obj: any) {
    if (!obj) obj = {}

    if (obj.categoryId) {
      obj.baseCategoryName = this.selectedCategory.code
    }
   
    this.addLookupForm = new FormGroup({
      id: new FormControl(obj['id'] ?? ''),
      categoryId: new FormControl(obj['categoryId'] ?? '', Validators.required),
      baseCategoryName: new FormControl({ value: obj['baseCategoryName'] ?? '', disabled: true }),
      nameEn: new FormControl(obj['nameEn'] ?? '', Validators.required),
      nameAr: new FormControl(obj['nameAr'] ?? '', Validators.required),
      bool1: new FormControl(obj['bool1'] ?? ''),
      bool2: new FormControl(obj['bool2'] ?? ''),
      bool3: new FormControl(obj['bool3'] ?? ''),
      str1: new FormControl(obj['str1'] ?? ''),
      str2: new FormControl(obj['str2'] ?? ''),
      str3: new FormControl(obj['str3'] ?? ''),
      str4: new FormControl(obj['str4'] ?? ''),
      str5: new FormControl(obj['str5'] ?? ''),
      decimal1: new FormControl(obj['decimal1'] ?? ''),
      nextLookupId: new FormControl(obj['nextLookupId'] ?? null),
      code: new FormControl(obj['code'] ?? '')
    });
  }
  closeAddLookup(save: boolean = false) {
    if (!this.addLookupForm.valid) {
      this.common.error("Fill required fields", "")
      return;
    }
    if (save) {
      this.lookupsService.AddLookup({ ...this.addLookupForm.value, isActive: true }).subscribe(z => {
        if (z.status) {
          this.searchLookups(this.selectedCategory.id)
          this.common.success();
          this.addLookupModal?.close();
          this.cacheService.remove(this.selectedCategory.code)
        }
      })
    } else {
      this.addLookupModal?.close();
    }
  }

  lstLookups: any = []
  searchLookups(baseCategoryId: any) {
    this.lookupsService.LookupList(baseCategoryId).subscribe(z => {
      if (this.selectedCategory.code == "InvoiceCategories") {
        z.lstData.forEach((r: any) => {
          r.str1 = Number(r.str1)
        });
      }
      this.lstLookups = z.lstData;
    })
  }
  /* End Add Lookup  */

  doctorsList: any = []

  sortData($e: any) { }

  getRelatedBind(str1: any) {
    return this.common.getRelatedFromLkp(this.common.lstBindTypes, str1) ?? {};
  }


}
