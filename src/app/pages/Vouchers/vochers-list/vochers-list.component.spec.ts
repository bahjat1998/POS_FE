import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VochersListComponent } from './vochers-list.component';

describe('VochersListComponent', () => {
  let component: VochersListComponent;
  let fixture: ComponentFixture<VochersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VochersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VochersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
