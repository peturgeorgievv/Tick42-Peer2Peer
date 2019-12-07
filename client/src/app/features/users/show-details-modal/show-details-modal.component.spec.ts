import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDetailsModalComponent } from './show-details-modal.component';

describe('ShowDetailsModalComponent', () => {
  let component: ShowDetailsModalComponent;
  let fixture: ComponentFixture<ShowDetailsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
