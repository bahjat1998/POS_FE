import { Injectable } from '@angular/core';
import { CommonOperationsService } from '../shared/services/systemcore/third-partytoasty.service';
import { ManagementService } from '../shared/services/Management/management.service';
import { PosCachePdfService } from '../shared/pdf/POSDomain/PosCache/pos-cache-pdf.service';
import { PosKitchenPdfService } from '../shared/pdf/POSDomain/PosKitchen/pos-kitchen-pdf.service';
import { PosCachePdfService01 } from '../shared/pdf/POSDomain/PosCache/pos-cache-pdf01.service';

@Injectable()
export class InvoiceHelperService {
    lstItemGroupsLkp: any;
    constructor(private common: CommonOperationsService, private managementService: ManagementService, private posCachePdf: PosCachePdfService, private posCachePdf01: PosCachePdfService01, private posKitchenPdf: PosKitchenPdfService) {
        // this.common.translateList(this.lstWords)
    }
    MakeOrderPayment(invoice: any, callBacks: any = {}) {
        if (invoice.id) {
            let req = {
                flag: 0,
                InvoiceId: invoice.id,
                Paid: invoice.paid,
                Notes: invoice.notes,
                PaymentType: invoice.paymentType
            }
            if (callBacks.onPost) {
                callBacks.onPost(invoice);
            }
            console.log("InvoiceCommands", req)
            this.managementService.InvoiceCommands(req).subscribe(z => {
                if (z.status) {
                    this.common.success("تم الحفظ")
                    if (callBacks.success) {
                        callBacks.success(invoice)
                    }
                }
            }, e => {
                if (callBacks.error) {
                    callBacks.error(invoice)
                }
            })
        } else {
            //Should be not arrive here, this case need to be handled outside
            this.common.info("wait");
        }
    }
    clearInvoiceItemsPks(inv: any) {
        if (inv.lstItems) {
            inv.lstItems.forEach((z: any) => {
                delete z.id
            });
        }
        return inv;
    }
    refreshItemPrices(invoice: any) {
        invoice['lstItems'].forEach((itm: any) => {
            itm.total = itm.price * itm.quantity;
        });
        if (invoice['lstDeletedItems'])
            invoice['lstDeletedItems'].forEach((itm: any) => {
                itm.total = itm.price * itm.quantity;
            });
        this.calculateInvoiceTotals(invoice)
    }
    ApplyGeneralBranchServiceAndDiscount(invoice: any) {
        let currentUserInfo = this.common.getCurrentUserInfo();
        if (!currentUserInfo.posDetails) { return; }
        //Apply General Branch Pos Service
        if (!invoice['serAmount'] && !invoice['serPer'] && invoice.invoicePosType == 2) {
            if (currentUserInfo.posDetails.servicePercent) {
                invoice['serPer'] = currentUserInfo.posDetails.servicePercent
            }
            else if (currentUserInfo.posDetails.serviceAmount) {
                invoice['serAmount'] = currentUserInfo.posDetails.serviceAmount
            }
        }
        //Apply General Branch Pos Discount
        if (!invoice['discAmount'] && !invoice['discPer']) {
            if (currentUserInfo.posDetails.discountPercent) {
                invoice['discPer'] = currentUserInfo.posDetails.discountPercent
            }
            else if (currentUserInfo.posDetails.discountAmount) {
                invoice['discAmount'] = currentUserInfo.posDetails.discountAmount
            }
        }
    }
    calculateInvoiceTotals = (invoice: any, fireField: any = '') => {
        this.ApplyGeneralBranchServiceAndDiscount(invoice)
        invoice.totalBeforeDiscount = this.common.sum(invoice['lstItems'], 'total');
        if (fireField == "discPer") {
            invoice['discAmount'] = (invoice['totalBeforeDiscount'] * invoice['discPer'] / 100).toFixed(2);
        } else if (fireField == "discAmount") {
            invoice['discPer'] = (invoice['discAmount'] / invoice['totalBeforeDiscount'] * 100).toFixed(2)
        }
        else if (fireField == "" && invoice['discPer']) {
            invoice['discAmount'] = invoice['totalBeforeDiscount'] * invoice['discPer'] / 100;
        }
        if (!invoice['discAmount']) invoice['discAmount'] = 0
        invoice['discAmount'] = Math.round(invoice['discAmount']);

        if (fireField == "serPer") {
            invoice['serAmount'] = (invoice['totalBeforeDiscount'] * invoice['serPer'] / 100).toFixed(2);
        } else if (fireField == "serAmount") {
            invoice['serPer'] = (invoice['serAmount'] / invoice['totalBeforeDiscount'] * 100).toFixed(2);
        }
        else if (fireField == "" && invoice['serPer']) {
            invoice['serAmount'] = invoice['totalBeforeDiscount'] * invoice['serPer'] / 100;
        }
        if (!invoice['serAmount']) invoice['serAmount'] = 0
        invoice['serAmount'] = Math.round(invoice['serAmount']);

        invoice['finalTotal'] = invoice['totalBeforeDiscount'] + invoice['serAmount'] - invoice['discAmount'] + (invoice['deliveryCost'] ?? 0);
        this.updateInvoiceCalculateion(invoice)
    }

    updateInvoiceCalculateion(invoice: any) {
        invoice['remaining'] = ((invoice['finalTotal'] ?? 0) - (invoice['paid'] ?? 0)).toFixed(2);
        if (invoice['remaining'] < 0) {
            invoice['remaining'] = 0
        }
    }

    fetchInvoiceItemsPrinters(lstItems: any) {
        let printers: any = {};
        lstItems.forEach((itm: any) => {
            if (!printers[itm.groupId]) printers[itm.groupId] = { new: [], deleted: [] };
            if (!itm.isDeleted) {
                printers[itm.groupId].new.push(itm)
            }
            else {
                printers[itm.groupId].deleted.push(itm)
            }
        });

        Object.keys(printers).forEach((idKey: any) => {
            let relatedItemGroup = this.lstItemGroupsLkp.find((z: any) => z.value == idKey);
            if (relatedItemGroup) {
                if (!printers[relatedItemGroup.str2])
                    printers[relatedItemGroup.str2] = printers[idKey];
                else {
                    printers[relatedItemGroup.str2].new.push(...printers[idKey].new)
                    printers[relatedItemGroup.str2].deleted.push(...printers[idKey].deleted)
                }
                delete printers[idKey]
            }
        })
        return printers;
    }
    printInvoicePartsToKitchens(invoice: any) {
        console.log("KitchenPrinter")
        let lstItemsToSent = invoice['lstItems'].filter((z: any) => !z._sentToKit)
        let printers: any = {};
        if (lstItemsToSent) {
            lstItemsToSent.forEach((z: any) => z._sentToKit = true);
            printers = this.fetchInvoiceItemsPrinters(lstItemsToSent)
        }

        Object.keys(printers).forEach(k => {
            if (printers[k].new.length > 0)
                this.posKitchenPdf.PrintPdf({ ...invoice, lstItems: printers[k].new }, k)
            if (printers[k].deleted.length > 0)
                this.posKitchenPdf.PrintPdf({ ...invoice, lstItems: printers[k].deleted, deleted: true }, k)
        })
    }
    printInvoice(invoice: any) {
        // this.posCachePdf.PrintPdf(invoice)
        console.log("MainPrinter")
        this.posCachePdf01.PrintPdf(invoice)
    }


    addItemToDeletedList(invoice: any, itm: any, qty: any, deleteReasonId: any) {
        if (!invoice.lstDeletedItems) invoice.lstDeletedItems = [];
        // let relatedItm = invoice.lstItems.find((z: any) => z.id == itm.id);
        if (!(qty <= itm.quantity && qty > 0)) {
            return;
        }
        if (itm.quantity == 1 && !itm.sentToKit) {
            itm.isDeleted = true;
            itm.deleteReasonId = deleteReasonId;
            invoice.lstDeletedItems.push(itm);
            invoice.lstItems = invoice.lstItems.filter((z: any) => z != itm)
        } else if (itm.quantity > 1 || itm.sentToKit) {
            itm.quantity -= qty;
            invoice.lstDeletedItems.push({ ...itm, quantity: qty, isDeleted: true, deleteReasonId: deleteReasonId, _sentToKit: false });
            if (itm.quantity == 0) {
                itm.isDeleted = true;
                invoice.lstItems = invoice.lstItems.filter((z: any) => z != itm)
            }
        } else {
            console.log("Empty quantity to delete")
        }
        this.mergeDeletedItems(invoice)
        this.refreshItemPrices(invoice)
    }

    mergeDeletedItems(invoice: any) {
        if (invoice.lstDeletedItems) {
            let mapKey: any = {};
            invoice.lstDeletedItems.forEach((r: any) => {
                if (!mapKey[r.id]) {
                    mapKey[r.id] = r;
                } else {
                    mapKey[r.id].quantity += r.quantity;
                }
            });
        }
    }
}
