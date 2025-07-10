import { DatePipe } from '@angular/common';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalHttpClient } from './http-client.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { LookupsService } from '../Lookups/lookups.service';
import { StoreManagementService } from '../../Store/Store-Management.service';
import { ShiftStateManagement } from '../../StateManagementServices/ShiftStateManagement/shift-state-management.service';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class CommonOperationsService {

  // addMinuteToDateTime(myDate: any, durationInMin: any) {
  //   let date = new Date(myDate)
  //   return date.setMinutes(date.getMinutes() + durationInMin);
  // }
  // getCurrentDayLkpKey(date: any) {
  //   return this.lstDaysLkps.find(z => z.value == date.getDay())?.value
  // }
  currLang: any = ""
  constructor(public datepipe: DatePipe, private accountService: AccountService, private lookupsService: LookupsService, private storeManagementService: StoreManagementService, private translate: TranslateService, private router: Router, private sanitizer: DomSanitizer, private localHttpClient: LocalHttpClient, private http: HttpClient) {
    this.currLang = localStorage.getItem("i18n_locale")
    if (!this.currLang) {
      this.currLang = 'en'
    }
    setTimeout(() => {
      this.translateCallback()
    }, 1500);
    this.loadCurrentUserInfo()
  }
  refreshNavs() {
    this.loadCurrentUserInfo();
    this.navs.forEach((m: any) => {
      if (m.child) {
        m.child = m.child.filter((z: any) => this.checkIfHasPermission(z.label))
      }
    })
    this.navs = this.navs.filter((z: any) => (z.child && z.child.length > 0) || this.checkIfHasPermission(z.label))
  }
  translateCallback() {
    this.translateList(this.lstWords)
  }
  lstWords: any = {
    "AreYouSure": "",
    "Confirm": "",
    "invStat0": "",
    "invStat1": ""
  }
  mapPaymentsMethod(PaymentMethodLkp: any) {
    let map: any = {};
    PaymentMethodLkp.forEach((pm: any) => {
      map[pm.str1] = pm.label
    });
    return map;
  }
  areYSureMsg = ''
  async confirmationMessage(title?: string, msg?: string, confirmLabel?: string) {
    let lstTranslate = this.lstWords
    return await Swal.fire({
      icon: 'question',
      title: title ?? lstTranslate['AreYouSure'],
      text: msg ?? "msg!",
      showCancelButton: true,
      confirmButtonText: confirmLabel ?? lstTranslate['Confirm'],
      padding: '2em',
      customClass: 'sweet-alerts',
    })//.then((result) => handleResult(result));
  }
  info(title: string, msg: string = "") {
    this.coloredToast('info', title, msg)
  }
  success(title: string = "Success", msg: string = "") {
    this.coloredToast('success', title, msg)
  }
  error(msg: string, title: string = "") {
    this.coloredToast('danger', title, msg)
  }
  coloredToast(color: string, title: string, text: string) {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      showCloseButton: true,
      customClass: {
        popup: `color-${color}`
      },
      target: document.getElementById(color + '-toast')
    });
    let obj: any = {};
    if (title) {
      obj['title'] = title
    }
    if (text) {
      obj['text'] = text
    }
    toast.fire(obj);
  };

  fixDateTimeFormats(data: any, keys: string | string[]) {
    const applyFix = (item: any, key: string) => {
      if (item[key]) {
        item[key] = this.dateTimeFormat(item[key]);
      }
    };

    const processItem = (item: any) => {
      if (Array.isArray(keys)) {
        keys.forEach(key => applyFix(item, key));
      } else {
        applyFix(item, keys);
      }
    };

    if (Array.isArray(data)) {
      data.forEach(d => processItem(d));
    } else {
      processItem(data);
    }
  }
  dateTimeFormat(val: any) {
    return val ? this.datepipe.transform(val, 'dd/MM/yyyy • h:mm a') : '';
  }


  dFormat = 'yyyy-MM-dd';
  dateFormat(val: any) {
    return val ? this.datepipe.transform(val, this.dFormat) : '';
  }
  tFormat = 'HH:mm:ss';
  timeFormat(val: string) {
    return val ? this.datepipe.transform(val, this.tFormat) : '';
  }
  navigateTo(link: string, queryParams: any = {}) {
    if (link)
      this.router.navigate([link], {
        queryParams: queryParams,
      })
  }

  openSepareteLinkInApp(link: string) {
    window.open(location.origin + "/#/" + link, '_blank');
  }

  openSepareteLink(link: string) {
    window.open(link, '_blank');
  }
  sanitizerHtml(txt: string) {
    return this.sanitizer.bypassSecurityTrustHtml(txt);
  }
  sanitizeriFrame(txt: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(txt);
  }

  getAttachemntUrl(imgName: string, defaultImgUrl = "") {
    if (imgName && imgName != 'Not Defined') {
      return `${this.localHttpClient.baseUrlWithoutApi}/Resources/${imgName}`
    } else {
      return defaultImgUrl
    }
  }
  getAttachmentUploadUrl() {
    return `${this.localHttpClient.baseUrlWithoutApi}/api/Attachments/upload`
  }
  makeid(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
  extractStringUntilFirstDot(inputString: string) {
    const dotIndex = inputString.indexOf('.');
    if (dotIndex !== -1) {
      return [
        inputString.substring(0, dotIndex),
        inputString.substring(dotIndex + 1, inputString.length),
      ];
    } else {
      return inputString;
    }
  }

  checkValidation(obj: any, props: string[], indexToFail: any = null) {
    let isValid = true;
    let failerFields: any[] = []
    props.forEach(key => {
      if (key.indexOf(".") == -1) {
        if (!Array.isArray(obj)) {
          if (!this.checkRowValidation(obj, key)) {
            isValid = false;
            failerFields.push({ key: key })
          }
        } else {
          obj.forEach((r: any, i) => {
            if (!this.checkRowValidation(r, key)) {
              isValid = false;
              failerFields.push({ key: key, i: i })
            }
          })
        }
      }
      else if (!Array.isArray(obj) && key.indexOf(".") != -1) {
        let splittedKeys = this.extractStringUntilFirstDot(key);
        let newSubObj = obj[splittedKeys[0]]
        let validationRes: any = this.checkValidation(newSubObj, [splittedKeys[1]])
        if (!validationRes.isValid) {
          isValid = false;
          failerFields.push(...validationRes.failerFields)
        }
      }
      else if (Array.isArray(obj) && key.indexOf(".") != -1) {
        obj.forEach((row: any, i) => {
          let splittedKeys = this.extractStringUntilFirstDot(key);
          let newSubObj = row[splittedKeys[0]]
          if (newSubObj) {
            let validationRes: any = this.checkValidation(newSubObj, [splittedKeys[1]])
            if (!validationRes.isValid) {
              isValid = false;
              failerFields.push(...validationRes.failerFields)
            }
          } else {
            isValid = false;
            failerFields.push({ key: splittedKeys[0], i: i })
          }

        })
      }
    })

    let objDerivedFields: any = {}
    failerFields.forEach(z => {
      objDerivedFields[z.key] = true
    });
    let res = { isValid: isValid, failerFields: objDerivedFields }
    //console.log(res)
    return res;
  }
  ShowModel(modal: any) {
    modal.visible = true;
  }
  CloseModel(modelId: string) {
    let doc: any = document;
    doc.querySelector('#' + modelId).classList.remove('md-show');
  }
  checkRowValidation(obj: any, z: any) {
    return obj[z];
  }
  saveFiles(file: any) {
    let randomKey = this.makeid(5);
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.http.post(this.getAttachmentUploadUrl(), formData, { reportProgress: true, observe: 'events', headers: this.httpOptions.headers })
        .subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          }
          else if (event.type === HttpEventType.Response) {
            resolve(event.body.strAttachmentsIds[0]);
          }
        }, e => {
          //console.log(e);
        });
    });

  }
  CopyValues(from: any, to: any, props: any) {
    if (from)
      props.forEach((p: any) => {
        if (typeof from[p] != 'undefined')
          to[p] = from[p]
      });
  }
  progress: any
  httpOptions = {
    headers: new HttpHeaders({
    })
  };
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem("lebwoiubpaneltoken")
      })
    };
  }
  tokenKey = "DQWK32%423$"
  userKey = "CurrentUserInfo"
  async saveAuth(c: any) {
    await this.storeManagementService.removeItem("CurrentShiftId");
    sessionStorage.setItem(this.tokenKey, c["token"]);

    localStorage.setItem(this.userKey, JSON.stringify({ name: c["nameEn"], posDetails: c['posDetails'], logo: c['logo'], userType: c['userType'], type: c["type"], email: c['email'], branchId: c["branchId"], departmentId: c['departmentId'], permissions: c.permissions ? JSON.parse(c.permissions) : {}, otherSetup: c.otherSetup ? JSON.parse(c.otherSetup) : {} }))
    localStorage.setItem("PDFSetup", JSON.stringify({ pdfMargins: c["pdfMargins"], pdfLetter: c["pdfLetter"] }))
    this.storeManagementService.refreshCurrentLogin();
    setTimeout(async () => {
      var isPOS = await this.storeManagementService.IsPosVersion()
      if (isPOS) {
        if (c['posDetails'] && c['posDetails'].posIsFloorPos) {
          this.navigateTo('../floors')
        }
        else {
          this.navigateTo('../pos')
        }
      }
      else {
        this.navigateTo('../')
        setTimeout(() => {
          location.reload();
        }, 300);
      }
    }, 10);
    this.loadCurrentUserInfo()
    setTimeout(() => {
      this.refreshNavs()
    }, 100);

  }
  localUserInfo: any = {}
  logo: any = ""
  loadCurrentUserInfo() {
    let local = localStorage.getItem(this.userKey);
    if (local) {
      this.localUserInfo = JSON.parse(local)
      if (this.localUserInfo.logo)
        this.logo = this.getAttachemntUrl(this.localUserInfo.logo)
    }
  }
  getCurrentUserType() {
    if (!this.localUserInfo) {
      this.loadCurrentUserInfo()
    }
    return this.localUserInfo.userType
  }
  getCurrentUserInfo() {
    if (!this.localUserInfo) {
      this.loadCurrentUserInfo()
    }
    return this.localUserInfo
  }
  getCurrentUserName() {
    if (!this.localUserInfo) {
      this.loadCurrentUserInfo()
    }
    return this.localUserInfo.name
  }
  checkIfHasPermission(p: any) {
    //console.log("this.localUserInfo", this.localUserInfo)
    if (!this.localUserInfo) this.localUserInfo = {}
    if (!this.localUserInfo.permissions) this.localUserInfo.permissions = {}
    return Object.keys(this.localUserInfo.permissions).some(z => z == p)
  }
  fillUserBranDepart(obj: any) {
    //No filling for admin => UserType will be 0 if admin logged in
    if (this.localUserInfo.userType) {
      obj['branchId'] = this.localUserInfo['branchId'];
      obj['departmentId'] = this.localUserInfo['departmentId'];
    }
  }
  async logout() {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    let logoutPath = await this.storeManagementService.getCurrentUserLoginPath()

    this.navigateTo(logoutPath)
  }
  readCurrentUser() {
    let current = localStorage.getItem(this.userKey);
    if (current) {
      return JSON.parse(current)
    }
    return {}
  }
  checkIfAuthenticated() {
    return localStorage.getItem(this.tokenKey)
  }
  calculateAge(birthdate: any) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    // Adjust if the birthdate month and day have not yet occurred this year
    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    return `${years} Years`;//, ${months} Months, and ${days} Days
  }

  getCurrentDateTimeString() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  autoWidth(ws: any, data: any) {
    const wscols = [];
    for (let i = 0; i < data[0].length; i++) {
      const maxLength = data.reduce((max: any, row: any) => Math.max(max, row[i] ? row[i].toString().length : 0), 10);
      wscols.push({ wch: maxLength });
    }
    ws['!cols'] = wscols;
  }
  sum(lst: any, prop: any) {
    if (lst)
      return lst.reduce((accumulator: any, currentValue: any) => accumulator + (currentValue[prop] ?? 0), 0);
    return 0
  }
  /*

  */
  exportToPDF(lstCols: any, lstData: any, orientation: any) {
    // this.exportDataPdfService.CreateReport(lstCols, lstData, orientation);
  }
  exportToExcel(lstCols: any, lstData: any) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: this.getCurrentDateTimeString(),
      Subject: this.getCurrentDateTimeString(),
      Author: "New Click",
      CreatedDate: new Date()
    };
    // Set column widths to auto
    wb.SheetNames.push("Sheet 1");

    let ws_data = this.extractData(lstCols, lstData)
    var ws = XLSX.utils.aoa_to_sheet(ws_data);

    this.autoWidth(ws, ws_data);

    // Make the first row bold
    const range = XLSX.utils.decode_range(ws['!ref'] ?? "");
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      if (!ws[cellAddress].s) ws[cellAddress].s = {};
      ws[cellAddress].s.font = { bold: true };
    }


    wb.Sheets["Sheet 1"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([this.s2ab(wbout)], { type: "application/octet-stream" }), `ExportData ${new Date()}.xlsx`);
  }

  extractData(lstCols: any, lstData: any) {
    var ws_data = [];
    //Headers
    let colsRow: any = [];
    lstCols.filter((z: any) => z.export).forEach((col: any) => {
      colsRow.push(col.title);
    });
    ws_data.push(colsRow)
    //Data

    lstData.forEach((d: any, i: any) => {
      let dataRow: any = [];
      lstCols.filter((z: any) => z.export).forEach((col: any) => {
        let fieldVal = col.prop == "INDEX" ? i + 1 : d[col.prop];
        if (col.type == "date") {
          fieldVal = this.dateFormat(fieldVal)
        }

        if (col.prop.indexOf(".") != -1) {
          let props = col.prop.split(".")
          fieldVal = d[props[0]][props[1]]
        }
        dataRow.push(fieldVal);
      });
      ws_data.push(dataRow)
    });
    return ws_data
  }

  s2ab(s: any) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
  }

  lstTablesStatus: any = [
    { label: "Avilable", value: 0, rgb: '#48ba79', fColor: '#FFF', color: 'bg-success' },
    { label: "Printed", value: 1, rgb: '#4361ee', fColor: '#FFF', color: 'bg-primary' },
    { label: "Busy", value: 2, rgb: '#e53e3e', fColor: '#FFF', color: 'bg-danger' }
  ]

  fillInvoiceStatus(inv: any) {
    if (inv && inv.invoiceStatus) {
      let relateStatus = this.lstInvoiceStatus.find((z: any) => z.value == inv.invoiceStatus);
      return relateStatus;
    } else {
      return this.lstInvoiceStatus[0]
    }
  }

  lstInvoiceStatus: any = [
    { label: "New", value: 0, color: 'bg-primary' },
    { label: "Pending", value: 1, color: 'bg-secondary' },
    { label: "Deleted", value: 2, color: 'bg-danger' },
    { label: "Printed", value: 3, color: 'bg-dark' },
    { label: "Paid", value: 4, color: 'bg-success' }
  ]
  lstPredefinedCurrenciesValues: any = [
    { label: "5", value: 5 },
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 }
  ]
  lstOrderPosType: any = [
    { label: "TakeAway", value: 0, rgb: '#48ba79', fColor: '#FFF', color: 'danger' },
    { label: "Delivary", value: 1, rgb: '#4361ee', fColor: '#FFF', color: 'success' },
    { label: "Table", value: 2, rgb: '#e53e3e', fColor: '#FFF', color: 'primary' }
  ]
  lstUserTypes: any = [
    { label: "Admin", value: 0, color: 'badge-outline-primary', BelongToUser: true },
    { label: "Users", value: 1, color: 'badge-outline-primary', BelongToUser: true },
    { label: "Suppliers", value: 2, color: 'badge-outline-success' },
    { label: "Customers", value: 3, color: 'badge-outline-secondary' },
    { label: "Others", value: 4, color: 'badge-outline-dark', BelongToUser: true },
  ]
  lstInvoiceType: any = [
    { label: 'Payed', value: 0 },
    { label: 'Received', value: 1 }
  ]
  lstShiftType: any = [
    { label: "PeerDevice", value: 0 },
    { label: "PeerBranch", value: 1 },
    { label: "PeerUser", value: 2 }
  ]
  lstPaymentTypes: any = [
    { label: 'Cash', value: 0 },
    { label: 'Deferred', value: 1 },
    { label: 'Installment', value: 2 }
  ]
  lstBindTypes = [
    { label: "X Icon", value: "x" },
    { label: "Gold screw", value: "b_2" },
    { label: "Silver screw", value: "b_3" },
    { label: "Two Layers Screw Colors", value: "b_4", showUpperColor: true, showLowerColor: true },
    { label: "implant surgical", value: "b_1" },
    { label: "Bridge", value: "br", showLowerColor: true, showUpperColor: true },
    { label: "Root Canal", value: "f", showLowerColor: true },
    { label: "Fill", value: "fillColor", fillTooth: true, showUpperColor: true, showLowerColor: true, showSurfaceColor: true },
    { label: "Fill Stroke", value: "fillStrokeColor", fillTooth: true, showUpperColor: true, showLowerColor: true, showSurfaceColor: true },
  ]
  lstItemType: any = [
    { label: "PhisicalItem", value: 0 },
    { label: "Service", value: 1 }
  ]
  getInvoiceTypeLbl(inv: any) {
    return inv.invoicePosType == 2 ? inv.posTableName : this.lstWords['invStat' + inv.invoicePosType]
  }

  mapDataTableToParams(last: any, newd: any) {
    //console.log(newd)
    last.p = newd.current_page;
    last.ps = newd.pagesize;

    last.OB = newd.sort_column;
    last.asc = newd.sort_direction == 'asc';

    return last
  }

  sortObjectsByProp(arr: any, prop: any) {
    return arr.sort((a: any, b: any) => {
      const aVal = a[prop];
      const bVal = b[prop];

      const aFalsy = !aVal;
      const bFalsy = !bVal;

      if (aFalsy && !bFalsy) return 1;  // a is falsy, b is not => a goes after
      if (!aFalsy && bFalsy) return -1; // b is falsy, a is not => b goes after
      if (aVal > bVal) return 1;
      if (aVal < bVal) return -1;
      return 0;
    });
  }
  fixImagesUrls(data: any, keys: string | string[]) {
    const applyFix = (item: any, key: string) => {
      if (item[key]) {
        item[key] = this.getAttachemntUrl(item[key]);
      }
    };

    const processItem = (item: any) => {
      if (Array.isArray(keys)) {
        keys.forEach(key => applyFix(item, key));
      } else {
        applyFix(item, keys);
      }
    };

    if (Array.isArray(data)) {
      data.forEach(d => processItem(d));
    } else {
      processItem(data);
    }
  }

  getCurrentPosSalesPriceListKey() {
    let currentUserInfo = this.getCurrentUserInfo();
    return currentUserInfo.posDetails.priceListKey;
  }
  fixItemDefaultUnits(data: any, priceListKey: any) {
    data.forEach((itm: any) => {
      // DefaultUnitId
      let relateDefaultUnit = itm.lstUnits.find((z: any) => z.unitId == itm.defaultUnitId);
      if (relateDefaultUnit) {
        // itm['price'] = relateDefaultUnit.price02;
        itm['price'] = relateDefaultUnit[priceListKey];
        itm['unitName'] = relateDefaultUnit.unitName;
        itm['unitId'] = relateDefaultUnit.unitId;
        itm['itemUnitId'] = relateDefaultUnit.id;

        if (itm['lstVariants'] && itm['lstVariants'].length > 0) {
          itm['lstVariants'].forEach((v: any) => {
            v['price'] = v[priceListKey];
          });
        }
        if (itm['lstItemAddOns'] && itm['lstItemAddOns'].length > 0) {
          itm['lstItemAddOns'].forEach((a: any) => {
            a['price'] = a[priceListKey];
          });
        }
      }
    });
    return data;
  }

  loadLkps(lstKeysRequiredOnInventoryLookups: any, lstInventoryLookupsByKey: any, callBack = () => { }) {
    let executeCallBack = () => Object.keys(lstInventoryLookupsByKey).length == lstKeysRequiredOnInventoryLookups.length && callBack()
    setTimeout(() => {
      lstKeysRequiredOnInventoryLookups.forEach((key: any) => {
        if (!lstInventoryLookupsByKey[key]) {
          if (typeof key == 'object') {
            this.lookupsService.LookupsWithObj(key).subscribe(z => {
              lstInventoryLookupsByKey[key.key] = z;
              executeCallBack();
            })
          }
          else if (key == "lstTablesStatus") {
            lstInventoryLookupsByKey[key] = this.lstTablesStatus;
            executeCallBack();
          }
          else if (key == "lstShiftType") {
            lstInventoryLookupsByKey[key] = this.lstShiftType;
            executeCallBack();
          }
          else if (key == "lstPaymentTypes") {
            lstInventoryLookupsByKey[key] = this.lstPaymentTypes;
            executeCallBack();
          }
          else if (key == "lstPredefinedCurrenciesValues") {
            lstInventoryLookupsByKey[key] = this.lstPredefinedCurrenciesValues;
            executeCallBack();
          }
          else if (key == "lstOrderPosType") {
            lstInventoryLookupsByKey[key] = this.lstOrderPosType;
            executeCallBack();
          }
          else if (key == "lstUserTypes") {
            lstInventoryLookupsByKey[key] = this.lstUserTypes;
            executeCallBack();
          }
          else if (key == "lstInvoiceType") {
            lstInventoryLookupsByKey[key] = this.lstInvoiceType;
            executeCallBack();
          }
          else if (key == "lstItemType") {
            lstInventoryLookupsByKey[key] = this.lstItemType;
            executeCallBack();
          }
          else if (key.indexOf("_Account_") > -1) {
            let accountType = key.split("_")[2];
            // if (!accountType) ;
            let active = key.split("_")[3];

            this.lookupsService.LookupsWithObj({ categoryCode: 'AccountBasedUserType', UserType: accountType ? Number(accountType) : '', activeOnly: active ? (active == 't' ? true : false) : '' }).subscribe(z => {
              lstInventoryLookupsByKey[key] = z;
              executeCallBack();
            })
          }
          else if (key.indexOf("_Account_") > -1) {
            // if (key.split("_").length > 0)
            let accountType = key.split("_")[2];
            // if (!accountType) ;
            let active = key.split("_")[3];

            this.lookupsService.LookupsWithObj({ categoryCode: 'AccountBasedUserType', UserType: accountType ? Number(accountType) : '', activeOnly: active ? (active == 't' ? true : false) : '' }).subscribe(z => {
              lstInventoryLookupsByKey[key] = z;
              executeCallBack();
            })
          }
          else if (key.indexOf("lstItemsLkp") > -1) {
            this.lookupsService.GetItemsListLkp({}).subscribe(z => {
              z.forEach((r: any) => {
                r['value'] = r.id;
                delete r.id;

                r['label'] = r.name;
                delete r.name;
              });
              lstInventoryLookupsByKey[key] = z;
              executeCallBack();
            })
          }
          else if (key == "PermissionGroups") {
            this.accountService.PermissionGroupsListQuery({}).subscribe(z => {
              lstInventoryLookupsByKey[key] = z;
              executeCallBack();
            })
          }
          else {
            this.lookupsService.Lookups(key).subscribe(z => {
              lstInventoryLookupsByKey[key] = z;
              executeCallBack();
            })
          }
        }
      })
    }, 10);
  }
  getRouteParam(route: ActivatedRoute, key: string, parseTo: string = 'string') {
    let routeVal: any = null;
    if (route) {
      let val = route.snapshot.paramMap.get(key);
      if (val || val == '0') {
        routeVal = val;
        if (parseTo == "num") {
          routeVal = Number(val)
        }
      }
    }
    return routeVal;
  }

  getLabelFromLkp(lkps: any, val: any) {
    if (!val && val !== 0) return ''
    if (!lkps) return ''
    let relatedLkp = lkps.find((z: any) => z.value == val);
    return relatedLkp ? relatedLkp.label : ""
  }

  getRelatedFromLkp(lkps: any, val: any, keyToCompare = 'value') {
    if (!val && val !== 0) return {}
    try {
      return lkps.find((z: any) => z[keyToCompare] == val) ?? {};
    } catch (e) {
      console.error(lkps, val)
    }
  }
  getRelatedFromLkpByLbl(lkps: any, val: any) {
    if (!val && val !== 0) return {}
    return lkps.find((z: any) => z.label == val) ?? {};
  }


  navs: any = [
    { label: 'Dashboard', route: "/" },
    { label: 'CompanyInfo', route: "/company-info" },
    {
      label: 'AccountsList', route: "/accounts",
      child: [
        { label: 'UsersList', route: "/accounts/users" },
        { label: 'SuppliersList', route: "/accounts/suppliers" },
        { label: 'CustomersList', route: "/accounts/customers" },
        { label: 'PermissionGroups', route: "/accounts/permissiongroup" },
      ]
    },
    {
      label: 'Vouchers', route: "/vouchers",
      child: [
        { label: 'ReceiptVouchers', route: "/vouchers/receipt" },
        { label: 'PaymentVouchers', route: "/vouchers/payment" }
      ]
    },
    {
      label: 'Shifts', route: "/shifts"
    },
    // { label: 'CompaniesList', route: "/companies" },
    { label: 'DepartmentsList', route: "/system/departments" },
    { label: 'FloorsList', route: "/system/floors" },
    { label: 'ItemsList', route: "/stock/items" },
    { label: 'InvoicesList', route: "/stock/invoices" },
    {
      label: 'Reports', route: "/reports",
      child: [
        { label: 'AccountStatement', route: "/reports/accountstatement" },
        { label: 'StockReport', route: "/reports/stockreport" },
        // { label: 'FinancialReport', route: "/reports/financialReport" },
        // { label: 'DebitReport', route: "/reports/debitReport" }
      ]
    },
    { label: 'LookupsList', route: "/system/lookups" }
  ]



  translateList(data: any) {
    if (data[0]) {
      data.forEach((z: any, index: any) => {
        if (z.title)
          this.translate.get(z.title).subscribe((res: string) => {
            z.title = res;
          });
        else if (z.label)
          this.translate.get(z.label).subscribe((res: string) => {
            z.label = res;
          });
        else if (z) {
          this.translate.get(z).subscribe((res: string) => {
            data[index] = res
          });
        }
      });
    } else {
      Object.keys(data).forEach(z => {
        this.translate.get(z).subscribe((res: string) => {
          data[z] = res;
        });
      })
    }

  }


  calculateBirthDate(age: number): Date {
    const today = new Date();
    const fullYears = Math.floor(age); // Full years
    const fractionOfYear = age - fullYears; // Fractional part of the age (e.g., 0.5)

    // Calculate the year of birth
    const birthYear = today.getFullYear() - fullYears;
    let birthDate = new Date(today.setFullYear(birthYear));

    // Handle the fractional part (months and days)
    const monthsInYear = 12;
    const monthAdjustment = Math.floor(fractionOfYear * monthsInYear);
    const dayAdjustment = Math.round((fractionOfYear * monthsInYear - monthAdjustment) * 30); // Approximation

    // Adjust the birth date by the fractional year (month and day)
    birthDate.setMonth(birthDate.getMonth() - monthAdjustment);
    birthDate.setDate(birthDate.getDate() - dayAdjustment);

    // Return the birth date
    return birthDate;
  }

  arabicFormat(txt: string) {
    if (txt) {
      txt = String(txt);
      var english = /^[A-Za-z0-9]*$/;

      var charsToReplace = [' ', '.', ')', ':', '/', '(', '-', '_', ',', '!', '@', '#', '$', '%', '-', '×', '>', '•'];
      var subStr = txt;
      charsToReplace.forEach(z => {
        subStr = subStr.split(z).join("");
      })
      if (!english.test(subStr)) {
        let words = txt.split(" ");
        if (words.length > 1) {
          words[1] = words[1] + ' ';
        }
        let paragraph = words.reverse().join(" ");
        paragraph = paragraph.replaceAll("(", "__TEMP__");
        paragraph = paragraph.replaceAll(")", "(");
        paragraph = paragraph.replaceAll("__TEMP__", ")");
        console.log(txt, paragraph)
        return paragraph;
      }
    }

    return txt;
  }
  lstPermissions: any = [
    { label: "Dashboard", value: "Dashboard" },
    { label: "CompanyInfo", value: "CompanyInfo" },
    { label: "UsersList", value: "UsersList" },
    { label: "SuppliersList", value: "SuppliersList" },
    { label: "CustomersList", value: "CustomersList" },
    { label: "PermissionGroups", value: "PermissionGroups" },
    { label: "ReceiptVouchers", value: "ReceiptVouchers" },
    { label: "PaymentVouchers", value: "PaymentVouchers" },
    { label: "DepartmentsList", value: "DepartmentsList" },
    { label: "ItemsList", value: "ItemsList" },
    { label: "InvoicesList", value: "InvoicesList" },
    { label: "AccountStatement", value: "AccountStatement" },
    { label: "StockReport", value: "StockReport" },
    { label: "FinancialReport", value: "FinancialReport" },
    { label: "DebitReport", value: "DebitReport" },
    { label: "LookupsList", value: "LookupsList" },
    { label: "POS", value: "POS" },
    { label: "Shifts", value: "Shifts" },
    { label: "AllowDeleteInvoices", value: "AllowDeleteInvoices" }
  ]
}
