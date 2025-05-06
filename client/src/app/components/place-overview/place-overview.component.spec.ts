import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOverviewComponent } from './place-overview.component';

describe('PlaceOverviewComponent', () => {
  let component: PlaceOverviewComponent;
  let fixture: ComponentFixture<PlaceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
