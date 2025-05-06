import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceReviewsComponent } from './place-reviews.component';

describe('PlaceReviewsComponent', () => {
  let component: PlaceReviewsComponent;
  let fixture: ComponentFixture<PlaceReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
