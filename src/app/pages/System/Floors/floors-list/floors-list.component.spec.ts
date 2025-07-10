import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloorsListComponent } from './floors-list.component';

describe('FloorsListComponent', () => {
  let component: FloorsListComponent;
  let fixture: ComponentFixture<FloorsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloorsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
