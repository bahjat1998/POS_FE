import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSMainPageComponent } from './posmain-page.component';

describe('POSMainPageComponent', () => {
  let component: POSMainPageComponent;
  let fixture: ComponentFixture<POSMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POSMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
