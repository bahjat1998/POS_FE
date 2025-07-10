import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSwitchAccountComponent } from './pos-switch-account.component';

describe('PosSwitchAccountComponent', () => {
  let component: PosSwitchAccountComponent;
  let fixture: ComponentFixture<PosSwitchAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSwitchAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosSwitchAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
