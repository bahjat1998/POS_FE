import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosItemsSearchComponent } from './pos-items-search.component';

describe('PosItemsSearchComponent', () => {
  let component: PosItemsSearchComponent;
  let fixture: ComponentFixture<PosItemsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosItemsSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PosItemsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
