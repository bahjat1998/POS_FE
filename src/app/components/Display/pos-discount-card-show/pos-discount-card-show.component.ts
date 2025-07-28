import { Component, Input } from '@angular/core';
import { GeneralTemplateOperations } from 'src/app/shared/StateManagementServices/account/account.service';

@Component({
  selector: 'app-pos-discount-card-show',
  templateUrl: './pos-discount-card-show.component.html',
  styleUrls: ['./pos-discount-card-show.component.css']
})
export class PosDiscountCardShowComponent {
  model: any
  @Input() set orderDetails(z: any) {
    this.model = z
  }

  @Input() withClick = false;
  @Input() sm = false;


  constructor(private gto: GeneralTemplateOperations) {
  }

  openApplyPosDiscount() {
    this.gto.openApplyPosDiscount$.next({ orderDetails: this.model })
  }
}
