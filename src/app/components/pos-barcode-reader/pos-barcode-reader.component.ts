import { Component } from '@angular/core';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pos-barcode-reader',
  templateUrl: './pos-barcode-reader.component.html',
  styleUrls: ['./pos-barcode-reader.component.css']
})
export class PosBarcodeReaderComponent {
  private barcodeBuffer: string = '';
  private lastKeyTime: number = 0;
  private barcodeTimeout: any = null;
  private isReadingBarcode: boolean = false;

  constructor(private managementService: ManagementService, private gto: GeneralTemplateOperations, private invoiceHelperService: InvoiceHelperService) { }
  onInputKeyDown(event: KeyboardEvent) {

    setTimeout(() => {
      this.searchItemBarcode(this.barcode)
    }, 1000);
    return;
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastKeyTime;
    this.lastKeyTime = currentTime;

    // Only process printable characters (ignore Shift, Tab, etc.)
    if (event.key.length === 1) {
      // Fast keypress → barcode mode
      if (timeDiff < 50) {
        this.isReadingBarcode = true;
        this.barcodeBuffer += event.key;
      } else {
        this.isReadingBarcode = false;
        this.barcodeBuffer = event.key;
      }

      // Delay processing to detect full barcode
      clearTimeout(this.barcodeTimeout);
      this.barcodeTimeout = setTimeout(() => {
        if (this.barcodeBuffer.length >= 5) {
          const barcode = this.barcodeBuffer;
          console.log('🔍 Barcode detected:', barcode);
          this.searchItemBarcode(barcode)
        } else {
          this.clearCurrentBarcode()
        }

        this.barcodeBuffer = '';
        this.isReadingBarcode = false;
      }, 100);
    }
  }
  notFound = false
  async searchItemBarcode(txtBarcode: any) {
    let req = {
      ...this.invoiceHelperService.getBarcodeObject(txtBarcode)
    }
    let z: any = await this.managementService.ItemListWithDetailsSearchFromCache(req);
    if (z.lstData && z.lstData.length > 0 && z.lstData[0]) {
      this.selectItem(z.lstData[0]);
      this.clearCurrentBarcode()
    } else {
      this.notFound = true
      setTimeout(() => {
        this.clearCurrentBarcode()
      }, 2000);
    }
  }
  barcode: any
  clearCurrentBarcode() {
    this.barcode = ''
    this.notFound = false
  }
  selectItem(selectedItem: any) {
    this.gto.closePosItemsSearch$.next({ action: 'add', itm: selectedItem });
  }

}
