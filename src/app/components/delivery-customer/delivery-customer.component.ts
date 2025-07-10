import { Component, ViewChild } from '@angular/core';
import { InvoiceHelperService } from 'src/app/service/InvoiceHelper.service';
import { ManagementService } from 'src/app/shared/services/Management/management.service';
import { CacheService } from 'src/app/shared/services/systemcore/cashe.service';
import { CommonOperationsService } from 'src/app/shared/services/systemcore/third-partytoasty.service';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-delivery-customer',
  templateUrl: './delivery-customer.component.html',
  styleUrls: ['./delivery-customer.component.css']
})
export class DeliveryCustomerComponent {
  model: any = {}
  componentData: any
  constructor(private gto: GeneralTemplateOperations, private invoiceHelperService: InvoiceHelperService, public common: CommonOperationsService, private cacheService: CacheService, private managementService: ManagementService) {
    gto.openPosDeliveryCustomer$.subscribe((z: any) => {
      this.componentData = z;
      if (this.componentData.orderDetails.deliveryCustomer) {
        if (this.beCustomer && this.beCustomer.id != this.model.deliveryCustomerId) {
          this.beCustomer = null;
        }
        this.componentData.orderDetails.deliveryCustomer.address = this.componentData.orderDetails.deliveryCustomerAddress;//should not be empty 
        this.model = this.componentData.orderDetails.deliveryCustomer;
      } else if (this.componentData.orderDetails.deliveryCustomerId) {

      }
      else {
        this.beCustomer = null;
        this.model = {}
      }

      if (!this.model.address) {
        this.model.address = {}
      }
      this.openModel()
      this.common.loadLkps(this.lstLkpKeys, this.lstLkps, this.handleLkpsLoaded.bind(this));


      if (!this.beCustomer && this.componentData.orderDetails.id && this.componentData.orderDetails.deliveryCustomer) {
        this.fetchSeletectedCustomerInfo(this.componentData.orderDetails.deliveryCustomer.phone1)
      }
      console.log("model", this.model)
    })
  }
  fetchSeletectedCustomerInfo(phone: any) {
    this.managementService.GetDeliveryCustomer({ phone: phone }).subscribe(z => {
      this.beCustomer = z;
      this.handleLkpsLoaded()
    });
  }
  handleLkpsLoaded() {
    this.fetchAreasNames()
  }
  lstLkpKeys = ['DeliveryAreas', 'SavedCustomerPhones'];
  lstLkps: any = {}
  @ViewChild("DeliveryCustomerPop", { static: true }) C_Popup?: any;
  openModel() {
    this.C_Popup?.open();
  }
  save() {
    this.componentData.orderDetails.changed = true
    this.componentData.orderDetails.deliveryCustomerId = this.componentData.orderDetails.deliveryCustomerId ?? this.model.deliveryCustomerId;
    if (!this.componentData.orderDetails.deliveryCustomerId)
      this.componentData.orderDetails.deliveryCustomer = this.model;

    if (this.model.CustomerInfoChanged) {
      this.componentData.orderDetails.deliveryCustomer = this.model.CustomerInfoChanged
    }

    this.componentData.orderDetails.deliveryCustomerAddressId = this.model.deliveryCustomerAddressId;
    this.componentData.orderDetails.newAddress = this.model.newAddress;
    if (this.componentData.orderDetails.deliveryCustomer && !this.componentData.orderDetails.deliveryCustomerId) {
      this.cacheService.remove('SavedCustomerPhones')
    }

    this.componentData.orderDetails.localDeliverySetup = this.model;

    this.fillDeliveryCost()
    this.C_Popup.close()
    this.lstLkps = {}
  }
  closeModel() {
    this.C_Popup.close();
    this.lstLkps = {}
  }
  fillDeliveryCost() {
    let relatedArea = this.lstLkps.DeliveryAreas.find((a: any) => a.value == this.model.address.areaId);
    if (relatedArea) {
      this.componentData.orderDetails.deliveryCost = relatedArea.decimal1;
      this.invoiceHelperService.calculateInvoiceTotals(this.componentData.orderDetails)
    }
  }
  SearchForRelatedPhone() {
    setTimeout(() => {
      if (this.lstLkps.SavedCustomerPhones && this.model.phone1 && this.model.phone1.length > 5) {
        let phoneToSearch = this.model.phone1.trim();
        if (this.lstLkps.SavedCustomerPhones.some((z: any) => z.label == phoneToSearch)) {
          this.managementService.GetDeliveryCustomer({ phone: phoneToSearch }).subscribe(z => {
            this.MapStoredCustomerToCurrent(z)
          });
        } else {
          this.clearCurrentSelected()
        }
      } else {
        this.clearCurrentSelected()
      }
    }, 5);
  }
  clearCurrentSelected() {
    this.beCustomer = null;
    delete this.model.name
    delete this.model.phone2
    this.model.address = {}
  }
  beCustomer: any = null;
  MapStoredCustomerToCurrent(storedCustomer: any) {
    this.beCustomer = storedCustomer;
    this.model.deliveryCustomer = {};
    this.model.deliveryCustomerId = storedCustomer.id;
    this.model.name = storedCustomer.name;
    this.model.phone1 = storedCustomer.phone1;
    this.model.phone2 = storedCustomer.phone2;
    if (storedCustomer.lstAddress.length > 0) {
      let LAI = storedCustomer.lstAddress.length - 1;
      this.selectAddress(storedCustomer.lstAddress[LAI])
    }
    this.fetchAreasNames()
  }
  fetchAreasNames() {
    if (this.beCustomer && this.lstLkps.DeliveryAreas) {
      this.beCustomer.lstAddress.forEach((add: any) => {
        let relatedAreaObj = this.lstLkps.DeliveryAreas.find((a: any) => a.value == add.areaId);
        add.area = relatedAreaObj;
      });
      this.AddressChanged()
    }
  }
  MasterInfoChanged() {
    setTimeout(() => {
      if (this.beCustomer && this.beCustomer.lstAddress) {
        if (this.beCustomer.name.trim() != this.model.name.trim() || this.beCustomer.phone2.trim() != this.model.phone2.trim()) {
          this.model.CustomerInfoChanged = {
            name: this.model.name,
            phone2: this.model.phone2
          }
        } else {
          delete this.model.CustomerInfoChanged
        }
      }
    }, 10);
  }
  AddressChanged() {
    setTimeout(() => {
      if (this.beCustomer && this.beCustomer.lstAddress) {
        let anyMatched = this.beCustomer.lstAddress.find((z: any) => z.address == this.model.address.address.trim() && z.areaId == this.model.address.areaId)
        if (!anyMatched) {
          delete this.model.deliveryCustomerAddressId
          this.model.newAddress = {
            address: this.model.address.address.trim(),
            areaId: this.model.address.areaId,
          }
        } else {
          delete this.model.newAddress
          this.model.deliveryCustomerAddressId = anyMatched.id
        }
      }
    }, 10);
  }

  selectAddress(address: any) {
    this.model.address.address = address.address
    this.model.address.areaId = address.areaId
    this.model.deliveryCustomerAddressId = address.id
  }
}
