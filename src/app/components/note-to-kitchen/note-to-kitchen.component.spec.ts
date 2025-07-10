import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteToKitchenComponent } from './note-to-kitchen.component';

describe('NoteToKitchenComponent', () => {
  let component: NoteToKitchenComponent;
  let fixture: ComponentFixture<NoteToKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoteToKitchenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteToKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
