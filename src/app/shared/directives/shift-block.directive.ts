import { Directive, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { ShiftStateManagement } from '../StateManagementServices/ShiftStateManagement/shift-state-management.service';
import { Subscription } from 'rxjs';
import { GeneralTemplateOperations } from '../StateManagementServices/account/account.service';

@Directive({
  selector: '[appShiftBlock]'
})
export class ShiftBlockDirective implements OnInit, OnDestroy {
  private shiftSub: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private shiftManagement: ShiftStateManagement,
    private gto: GeneralTemplateOperations
  ) { }

  ngOnInit(): void {
    this.shiftManagement.CheckCurrentShift();
    // Assuming gto has an observable for shift changes
    this.shiftSub = this.gto.currentActiveShiftChanged$
      .subscribe(shiftId => {
        const shouldDisable = !shiftId; // Disable if no shift is open
        this.updateDisabledState(shouldDisable);
      });
      
    if (!this.shiftManagement.CurrentShiftId) {
      this.updateDisabledState(true);
    }
  }

  private updateDisabledState(disabled: boolean) {
    const nativeEl = this.el.nativeElement;

    if (disabled) {
      this.renderer.setAttribute(nativeEl, 'disabled', 'true');

      // Don't block pointer-events completely — just prevent clicks
      this.renderer.setStyle(nativeEl, 'opacity', '0.5');
      this.renderer.setStyle(nativeEl, 'cursor', 'not-allowed');
      this.renderer.listen(nativeEl, 'click', (event: Event) => event.preventDefault());

      // Add tooltip
      this.renderer.setAttribute(nativeEl, 'title', 'You should open a shift first');
    } else {
      this.renderer.removeAttribute(nativeEl, 'disabled');
      this.renderer.removeStyle(nativeEl, 'opacity');
      this.renderer.removeStyle(nativeEl, 'cursor');

      // Remove tooltip
      this.renderer.removeAttribute(nativeEl, 'title');
    }
  }

  ngOnDestroy(): void {
    this.shiftSub?.unsubscribe();
  }
}
