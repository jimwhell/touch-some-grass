import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlaceCardComponent } from './map-place-card.component';

describe('MapPlaceCardComponent', () => {
  let component: MapPlaceCardComponent;
  let fixture: ComponentFixture<MapPlaceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPlaceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPlaceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
