import { Injectable } from '@angular/core';
import { CommonOperationsService } from '../shared/services/systemcore/third-partytoasty.service';
import { ManagementService } from '../shared/services/Management/management.service';
import { PosCachePdfService } from '../shared/pdf/POSDomain/PosCache/pos-cache-pdf.service';
import { PosKitchenPdfService } from '../shared/pdf/POSDomain/PosKitchen/pos-kitchen-pdf.service';
import { PosCachePdfService01 } from '../shared/pdf/POSDomain/PosCache/pos-cache-pdf01.service';

@Injectable()
export class MoveOrderItemsHelper {

    constructor(private common: CommonOperationsService, private managementService: ManagementService, private posCachePdf: PosCachePdfService, private posCachePdf01: PosCachePdfService01, private posKitchenPdf: PosKitchenPdfService) {
    }

    PaySplitInvoice(fromOrder: any, toOrder: any) {

    }
}
