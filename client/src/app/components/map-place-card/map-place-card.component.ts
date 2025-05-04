import { Component, input, InputSignal } from '@angular/core';
import { ExpandedPlace } from '../../interfaces/expanded-place';

@Component({
  selector: 'app-map-place-card',
  imports: [],
  templateUrl: './map-place-card.component.html',
  styleUrl: './map-place-card.component.css',
})
export class MapPlaceCardComponent {
  selectedPlace: InputSignal<ExpandedPlace | undefined> =
    input<ExpandedPlace>();
}
