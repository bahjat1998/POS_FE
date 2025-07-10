import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { AccountingService } from 'src/app/shared/services/Accounting/Accounting.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { LocalHttpClient } from 'src/app/shared/services/systemcore/http-client.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-tables-view',
  templateUrl: './tables-view.component.html',
  styleUrls: ['./tables-view.component.css']
})
export class TablesViewComponent {
  comapnySetup: any
  constructor(private gto: GeneralTemplateOperations, private accountingService: AccountingService, private invoiceHelperService: InvoiceHelperService, private localHttpClient: LocalHttpClient, private common: CommonOperationsService, private managementService: ManagementService) {
    this.gto.changeScreenTitle$.next({ title: "TableScreen" })
    this.managementService.GetCompanyInfo({}).subscribe(z => {
      this.comapnySetup = z;
      this.common.fixImagesUrls(this.comapnySetup, ['lockTableImg', 'selectTableImg'])
    })


    this.subscribeToEvents()
  }
  closePosPaymentScreen!: Subscription;
  closePosOrdersList!: Subscription;
  openPosPaymentScreen!: Subscription;
  closePosMoveOrderItems!: Subscription;

  subscribeToEvents() {
    this.closePosPaymentScreen = this.gto.closePosPaymentScreen$.subscribe(a => this.handleClosePosPayment(a))
    this.closePosOrdersList = this.gto.closePosOrdersList$.subscribe(a => this.handleClosePosOrdersList(a))
    this.openPosPaymentScreen = this.gto.openPosPaymentScreen$.subscribe(a => this.handleCloseMoveTable(a))
    this.closePosMoveOrderItems = this.gto.closePosMoveOrderItems$.subscribe(a => this.handleClosePosMoveOrderItems(a))
  }
  ngOnDestroy() {
    if (this.closePosPaymentScreen) { this.closePosPaymentScreen.unsubscribe(); }
    if (this.closePosOrdersList) { this.closePosOrdersList.unsubscribe(); }
    if (this.openPosPaymentScreen) { this.openPosPaymentScreen.unsubscribe(); }
    if (this.closePosMoveOrderItems) { this.closePosMoveOrderItems.unsubscribe(); }
  }
  ngOnInit() {
    this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.checkLkps.bind(this))
    this.getFloorsData();
  }
  lstLkpKeys = ['lstTablesStatus'];
  lstLkps: any = {}
  checkLkps() {
    if (this.lstLkps['lstTablesStatus'])
      this.fetchTablesStatuses()
  }


  lstFloors: any = []
  getFloorsData() {
    this.accountingService.FloorsList({ p: 1, ps: 25 }).subscribe(z => {
      this.lstFloors = z.lstData;
      this.common.fixImagesUrls(this.lstFloors, 'img')
      if (this.lstFloors[0]) {
        this.selectFloor(this.lstFloors[0])
      }
      else {
        alert("No Floors Declared")
      }
    })
  }
  handleTempTableBusy(lstData: any) {
    let tempTblBusy = localStorage.getItem("tempTblBusy");
    if (tempTblBusy) {
      let tId = Number(tempTblBusy)
      if (!lstData.some((a: any) => a.id == tId)) {
        lstData.push({ id: tId, b: true })
      }
    }
    localStorage.removeItem("tempTblBusy")
    return lstData;
  }
  lstTables: any = []
  tablesLoaded = false;
  getTables(floorId: any) {
    let req = {
      floorId: floorId
    }
    this.tablesLoaded = false;
    this.accountingService.GetTablesStatuses(req).subscribe(a => {
      this.tablesLoaded = true;
      a.lstData = this.handleTempTableBusy(a.lstData)
      this.lstTables.forEach((tbl: any) => {
        //Is Busy 
        let isBusy = a.lstData.find((z: any) => z.id == tbl.id);
        if (isBusy) {
          if (isBusy.p) {
            tbl['status'] = 1
          }
          else if (isBusy.b) {
            tbl['status'] = 2
          }
        }
        else {
          tbl['status'] = 0
        }
      });
      this.fetchTablesStatuses()
    })
    // this.tablesLoaded = false;
    // this.managementService.GetTables(req).subscribe(a => {
    //   this.tablesLoaded = true;
    //   this.lstTables = a.lstData
    //   this.fetchTablesStatuses()
    // })
  }
  selectedFloor: any
  selectFloor(floor: any) {
    this.selectedFloor = floor
    this.lstTables = floor.lstTables
    this.refreshFloorSVG()
    this.getTables(this.selectedFloor.id)
    this.disableMoveOrder()
  }
  svgLoaded: any = false;
  refreshFloorSVG() {
    if (this.selectedFloor) {
      this.svgLoaded = false
      this.localHttpClient.getWithCustomOptions(this.selectedFloor.img, { responseType: 'text' }).subscribe((z: any) => {
        var doc = new DOMParser().parseFromString(z, 'application/xml').documentElement;
        let someElement: any = document.getElementById("svgBox")
        doc.setAttribute("width", "100%")
        doc.setAttribute("height", "100%")
        someElement.innerHTML = "";
        someElement.appendChild(
          someElement.ownerDocument.importNode(doc, true));
        this.svgLoaded = true;

        this.addTablesClickEvents();
        this.fetchTablesStatuses()
      }, e => {
        alert(`No svg declared for floor, ${this.selectedFloor.img}`)
        this.svgLoaded = false;
      })
    }
  }

  fetchTablesStatuses() {
    if (this.lstLkps['lstTablesStatus'] && this.tablesLoaded && this.svgLoaded) {
      let d: any = document;
      let svg = d.getElementById('svgBox').querySelector('svg');
      this.lstTables.forEach((tbl: any) => {
        let relatedStatusColor = this.lstLkps['lstTablesStatus'].find((a: any) => a.value == tbl.status)
        this.highlightWidget(svg, tbl.name, relatedStatusColor.rgb, relatedStatusColor.fColor);
      });
    }
  }
  addTablesClickEvents() {
    let d: any = document;
    let svg = d.getElementById('svgBox').querySelector('svg');
    let links = svg.querySelectorAll('a');
    links.forEach((link: any) => {
      let href = link.getAttributeNS('http://www.w3.org/1999/xlink', 'href');

      link.addEventListener('click', (event: any) => {
        event.preventDefault();
        let tableCode = href?.split('/').pop();
        this.handleTableClick(tableCode);
      });
    });
  }
  highlightWidget(svgElement: SVGElement, code: string, color: string, fColor: string): void {
    let links = svgElement.querySelectorAll('a');
    let targetLink = Array.from(links).find(link =>
      link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
    );

    if (!targetLink) {
      console.warn(`Code ${code} not found`);
      return;
    }

    let image = targetLink.querySelector('image');
    if (!image) {
      console.warn(`No <image> found inside link for ${code}`);
      return;
    }

    // Get <image> dimensions
    let x = parseFloat(image.getAttribute('x') || '0');
    let y = parseFloat(image.getAttribute('y') || '0');
    let width = parseFloat(image.getAttribute('width') || '100');
    let height = parseFloat(image.getAttribute('height') || '100');

    let imageContainer = targetLink.closest('g');
    if (!imageContainer) {
      console.warn(`No parent <g> found to append elements for ${code}`);
      return;
    }

    // === Add rectangular label (below or center) ===
    let labelWidth = 100;
    let labelHeight = 40;
    let labelX = x + (width - labelWidth) / 2;
    let labelY = y + (height - labelHeight) / 2;

    let labelFO = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    labelFO.setAttribute("x", labelX.toString());
    labelFO.setAttribute("y", labelY.toString());
    labelFO.setAttribute("width", labelWidth.toString());
    labelFO.setAttribute("height", labelHeight.toString());

    let labelDiv = document.createElement("div");
    labelDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    labelDiv.style.width = "100%";
    labelDiv.style.height = "100%";
    labelDiv.style.backgroundColor = color;
    labelDiv.style.display = "flex";
    labelDiv.style.alignItems = "center";
    labelDiv.style.justifyContent = "center";
    labelDiv.style.color = fColor;
    labelDiv.style.fontWeight = "bold";
    labelDiv.style.borderRadius = "6px";
    labelDiv.style.fontSize = "15px";
    labelDiv.textContent = `Note: ${code}`;
    labelDiv.onclick = () => this.handleTableClick(code);
    labelFO.appendChild(labelDiv);

    let badgeSize = 60;
    let badgeX = x + width - badgeSize + 10;  // top-right corner with margin
    let badgeY = y;

    let badgeFO = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    badgeFO.setAttribute("x", badgeX.toString());
    badgeFO.setAttribute("y", badgeY.toString());
    badgeFO.setAttribute("width", badgeSize.toString());
    badgeFO.setAttribute("height", badgeSize.toString());

    let badgeDiv = document.createElement("div");
    badgeDiv.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    badgeDiv.style.width = "100%";
    badgeDiv.style.height = "100%";
    badgeDiv.style.borderRadius = "50%";
    badgeDiv.style.backgroundColor = color;
    badgeDiv.style.display = "flex";
    badgeDiv.style.alignItems = "center";
    badgeDiv.style.justifyContent = "center";
    badgeDiv.style.fontWeight = "bold";
    badgeDiv.style.fontSize = "18px";
    badgeDiv.style.color = fColor;
    badgeDiv.style.boxShadow = "0 0 4px rgba(0,0,0,0.3)";
    badgeDiv.textContent = code;
    badgeDiv.onclick = () => this.handleTableClick(code);

    badgeFO.appendChild(badgeDiv);

    // === Append both to the container
    imageContainer.appendChild(labelFO);
    imageContainer.appendChild(badgeFO);
  }

  handleTableClick(tblName: any) {
    let relatedTbl = this.lstTables.find((a: any) => a.name == tblName)
    console.log(tblName, relatedTbl)
    if (this.isMoveOrderEnabeld) {
      if (!this.moveOrderModel) {
        this.moveOrderModel = {}
      }
      if (!this.moveOrderModel.fromTbl) {
        this.handleAddSelectIcon(tblName)
        this.moveOrderModel.fromTbl = tblName;
        this.moveOrderModel.fromTblId = relatedTbl.id;
      }
      else if (tblName != this.moveOrderModel.fromTbl) {
        if (this.moveOrderModel.toTbl) {
          if (this.hasBadgeIcon(this.moveOrderModel.toTbl, 'selectico')) {
            this.removeBadgeIconFromTable(this.moveOrderModel.toTbl, 'selectico')
          }
        }

        this.handleAddSelectIcon(tblName)
        this.moveOrderModel.toTbl = tblName
        this.moveOrderModel.toTblId = relatedTbl.id;

        this.gto.openPosMoveOrderItems$.next({
          fromTableId: this.moveOrderModel.fromTblId,
          toTableId: this.moveOrderModel.toTblId,
          fromTableInfo: { name: this.moveOrderModel.fromTbl, id: this.moveOrderModel.fromTblId },
          toTableInfo: { name: this.moveOrderModel.toTbl, id: this.moveOrderModel.toTblId },
          buttons: { "save": true },
          cF: 'TV'
        })


      }
    }
    else if (this.isPartiallyPayEnabeld == true) {
      this.PayInvoicePartially(relatedTbl.id)
    }
    else if (this.isPayEnabeld == true) {
      this.PayInvoice(relatedTbl.id)
    }
    else {
      this.common.navigateTo("../pos", { tId: relatedTbl.id, t: tblName })
    }
  }

  handleAddSelectIcon(tblName: any) {
    if (this.hasBadgeIcon(tblName, 'selectico')) {
      this.removeBadgeIconFromTable(tblName, 'selectico')
    }
    else {
      this.addBadgeIconToTable(tblName, 'selectico', 'top-left')
    }
  }
  addBadgeIconToTable(code: string, iconId: string, position: 'top-left' | 'bottom-left', imageSize = 24): void {
    const svgElement = document.getElementById('svgBox')?.querySelector('svg');
    if (!svgElement) return;

    const sourceImg = document.getElementById(iconId) as HTMLImageElement;
    if (!sourceImg || !sourceImg.src) {
      console.warn(`Icon with ID "${iconId}" not found or has no src`);
      return;
    }

    const iconUrl = sourceImg.src;

    const links = svgElement.querySelectorAll('a');
    const targetLink = Array.from(links).find(link =>
      link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
    );

    if (!targetLink) {
      console.warn(`Code ${code} not found`);
      return;
    }

    const tableImage = targetLink.querySelector('image');
    if (!tableImage) {
      console.warn(`No <image> inside <a> for ${code}`);
      return;
    }

    const x = parseFloat(tableImage.getAttribute('x') || '0');
    const y = parseFloat(tableImage.getAttribute('y') || '0');
    const height = parseFloat(tableImage.getAttribute('height') || '0');

    const imageContainer = targetLink.closest('g');
    if (!imageContainer) {
      console.warn(`No container <g> for ${code}`);
      return;
    }

    // Positioning logic
    let offsetX = x + 26;
    let offsetY = (position === 'top-left') ? y + 6 : y + height - imageSize - 6;

    const badgeImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
    badgeImage.setAttributeNS(null, "href", iconUrl);
    badgeImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", iconUrl);
    badgeImage.setAttribute("x", offsetX.toString());
    badgeImage.setAttribute("y", offsetY.toString());
    badgeImage.setAttribute("width", imageSize.toString());
    badgeImage.setAttribute("height", imageSize.toString());
    badgeImage.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Mark this icon uniquely with its code and type
    badgeImage.setAttribute("class", `badge-icon ${iconId}`);
    badgeImage.setAttribute("data-code", code);
    badgeImage.setAttribute("data-icon", iconId);

    imageContainer.appendChild(badgeImage);
  }

  hasBadgeIcon(code: string, iconId: string): boolean {
    const svgElement = document.getElementById('svgBox')?.querySelector('svg');
    if (!svgElement) return false;

    const links = svgElement.querySelectorAll('a');
    const targetLink = Array.from(links).find(link =>
      link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
    );

    if (!targetLink) return false;

    const imageContainer = targetLink.closest('g');
    if (!imageContainer) return false;

    return !!imageContainer.querySelector(`image.badge-icon.${iconId}`);
  }
  removeBadgeIconFromTable(code: string, iconId: string): void {
    const svgElement = document.getElementById('svgBox')?.querySelector('svg');
    if (!svgElement) return;

    const links = svgElement.querySelectorAll('a');
    const targetLink = Array.from(links).find(link =>
      link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
    );

    if (!targetLink) return;

    const imageContainer = targetLink.closest('g');
    if (!imageContainer) return;

    const badgeIcons = imageContainer.querySelectorAll(`image.badge-icon.${iconId}`);
    badgeIcons.forEach(icon => icon.remove());
  }
  removeAllIconsFromTable(code: string): void {
    const svgElement = document.getElementById('svgBox')?.querySelector('svg');
    if (!svgElement) return;

    const links = svgElement.querySelectorAll('a');
    const targetLink = Array.from(links).find(link =>
      link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
    );

    if (!targetLink) return;

    const imageContainer = targetLink.closest('g');
    if (!imageContainer) return;

    const allIcons = imageContainer.querySelectorAll(`image.badge-icon`);
    allIcons.forEach(icon => icon.remove());
  }
  clearAllBadgeIcons(iconId?: string): void {
    const svgElement = document.getElementById('svgBox')?.querySelector('svg');
    if (!svgElement) return;

    // Select either all badge icons or only those with a specific class (iconId)
    const selector = iconId ? `image.badge-icon.${iconId}` : `image.badge-icon`;
    const icons = svgElement.querySelectorAll(selector);

    icons.forEach(icon => icon.remove());
  }

  // addLockImageToTable(code: string, imageSize = 33): void {
  //   let d: any = document;
  //   let svgElement = d.getElementById('svgBox').querySelector('svg');
  //   // this.clearAllBadgeIcons(svgElement)
  //   let lockImg = document.getElementById('lockico') as HTMLImageElement;
  //   if (!lockImg || !lockImg.src) {
  //     console.warn('Lock icon not found or has no src');
  //     return;
  //   }

  //   let imageUrl = lockImg.src;

  //   let links: any = svgElement.querySelectorAll('a');
  //   let targetLink: any = Array.from(links).find((link: any) =>
  //     link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
  //   );

  //   if (!targetLink) {
  //     console.warn(`Code ${code} not found`);
  //     return;
  //   }

  //   let tableImage = targetLink.querySelector('image');
  //   if (!tableImage) {
  //     console.warn(`No <image> inside <a> for ${code}`);
  //     return;
  //   }

  //   let x = parseFloat(tableImage.getAttribute('x') || '0');
  //   let y = parseFloat(tableImage.getAttribute('y') || '0');

  //   let imageContainer = targetLink.closest('g');
  //   if (!imageContainer) {
  //     console.warn(`No container <g> for ${code}`);
  //     return;
  //   }

  //   let badgeImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
  //   badgeImage.setAttributeNS(null, "href", imageUrl); // SVG2 standard
  //   badgeImage.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", imageUrl); // backward compat
  //   badgeImage.setAttribute("x", (x + 26).toString());
  //   badgeImage.setAttribute("y", (y + 6).toString());
  //   badgeImage.setAttribute("width", imageSize.toString());
  //   badgeImage.setAttribute("height", imageSize.toString());
  //   badgeImage.setAttribute("preserveAspectRatio", "xMidYMid meet");
  //   badgeImage.setAttribute("class", "badge-icon");

  //   imageContainer.appendChild(badgeImage);
  // }
  // hasBadgeImage(code: string): boolean {

  //   let d: any = document;
  //   let svgElement = d.getElementById('svgBox').querySelector('svg');

  //   const links: any = svgElement.querySelectorAll('a');

  //   const targetLink: any = Array.from(links).find((link: any) =>
  //     link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
  //   );

  //   if (!targetLink) {
  //     console.warn(`Code ${code} not found`);
  //     return false;
  //   }

  //   const imageContainer = targetLink.closest('g');
  //   if (!imageContainer) {
  //     console.warn(`No <g> container found for ${code}`);
  //     return false;
  //   }

  //   // Check for <image class="badge-icon">
  //   return !!imageContainer.querySelector('image.badge-icon');
  // }
  // removeBadgeFromTable(code: string): void {
  //   let d: any = document;
  //   let svgElement: any = d.getElementById('svgBox').querySelector('svg');

  //   const links = svgElement.querySelectorAll('a');

  //   const targetLink: any = Array.from(links).find((link: any) =>
  //     link.getAttributeNS('http://www.w3.org/1999/xlink', 'href') === `https://app.diagrams.net/${code}`
  //   );

  //   if (!targetLink) {
  //     console.warn(`Code ${code} not found`);
  //     return;
  //   }

  //   const imageContainer = targetLink.closest('g');
  //   if (!imageContainer) {
  //     console.warn(`No <g> container found for ${code}`);
  //     return;
  //   }

  //   const badgeImages = imageContainer.querySelectorAll('image.badge-icon');
  //   badgeImages.forEach((icon: any) => icon.remove());
  // }

  // clearAllBadgeIcons(svgElement: SVGElement): void {
  //   const icons = svgElement.querySelectorAll('image.badge-icon');
  //   icons.forEach(icon => {
  //     icon.remove();
  //   });
  // }
  isMoveOrderEnabeld = false;
  moveOrderModel: any = {}
  enableMoveOrder() {
    this.isMoveOrderEnabeld = !this.isMoveOrderEnabeld;
    if (!this.isMoveOrderEnabeld) {
      this.disableMoveOrder()
    } else {
      this.disablePartiallyPay();
      this.disablePay();
    }
  }
  disableMoveOrder() {
    this.isMoveOrderEnabeld = false;
    this.moveOrderModel = {}
    this.clearAllBadgeIcons('selectico')
  }
  handleCloseMoveTable(z: any) {
    // if (z.source == 'SaveMove') {
    //   this.getTables(this.selectedFloor.id)
    // }
  }
  handleClosePosMoveOrderItems(a: any) {
    this.disableMoveOrder()
    this.getTables(this.selectedFloor.id)
  }
  //Start Orders List
  showOrdersList() {
    this.gto.openPosOrdersList$.next({ apiFilters: { invoiceStatus: 1 }, buttons: { Pick: 1 } })
  }
  handleClosePosOrdersList(data: any) {
    if (data.action == "Pick") {
      this.common.navigateTo("../pos", { oId: data.inv.id })
    }
    else if (data.action == "Pay") {
      this.gto.openPosPaymentScreen$.next({ forOrderId: data.inv.id })
    }
  }

  //End Orders List

  handleClosePosPayment(invoice: any) {
    this.invoiceHelperService.MakeOrderPayment(invoice);
    setTimeout(() => {
      this.getTables(this.selectedFloor.id)
      this.disablePartiallyPay()
      this.disablePay()
    }, 100);
  }

  fetchFloors() {

  }


  navigateToPos(posType: any) {
    this.common.navigateTo("../pos", { posType: posType })
  }




  isPartiallyPayEnabeld = false;
  partiallyPayOrder() {
    this.isPartiallyPayEnabeld = !this.isPartiallyPayEnabeld;
    if (!this.isPartiallyPayEnabeld) {
      this.disablePartiallyPay()
    } else {
      this.disableMoveOrder()
      this.disablePay()
    }
  }
  disablePartiallyPay() {
    this.isPartiallyPayEnabeld = false;
    this.clearAllBadgeIcons('selectico')
  }
  PayInvoicePartially(tableId: any) {
    let req = { tableId: tableId }
    this.managementService.InvoiceDetails(req).subscribe(fromOrder => {
      if (fromOrder) {
        let toOrder: any = { lstItems: [] };
        this.common.CopyValues(fromOrder, toOrder, ['discPer', 'discAmount', 'serPer', 'serAmount', 'accountId', 'posTableId', 'invoicePosType', 'invoiceCategoryId'])
        this.gto.openPosMoveOrderItems$.next({
          fromOrder: fromOrder,
          toOrder: toOrder,
          buttons: { PAY: true }
        })
      }
    })
  }


  isPayEnabeld = false;
  PayOrder() {
    this.isPayEnabeld = !this.isPayEnabeld;
    if (!this.isPayEnabeld) {
      this.disablePay()
    }
    else {
      this.disableMoveOrder();
      this.disablePartiallyPay()
    }
  }
  disablePay() {
    this.isPayEnabeld = false;
    this.clearAllBadgeIcons('selectico')
  }
  PayInvoice(tableId: any) {
    let req = { tableId: tableId }
    this.managementService.InvoiceDetails(req).subscribe(invoice => {
      this.gto.openPosPaymentScreen$.next({ orderDetails: invoice, source: "TV" })
    })
  }

}
