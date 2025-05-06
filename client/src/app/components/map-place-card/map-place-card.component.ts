import {
  Component,
  input,
  InputSignal,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PlaceService } from '../../services/place.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-map-place-card',
  imports: [RouterOutlet, RouterLink, TitleCasePipe],
  templateUrl: './map-place-card.component.html',
  styleUrl: './map-place-card.component.css',
})
export class MapPlaceCardComponent implements OnChanges {
  selectedPlace: InputSignal<ExpandedPlace | undefined> =
    input<ExpandedPlace>();

  constructor(private placeService: PlaceService) {}

  //if selectedPlace input property gains a value, assign its value to the selectedPlace subject inside placeService
  ngOnChanges(changes: SimpleChanges): void {
    const selectedPlaceData: ExpandedPlace | undefined = this.selectedPlace();
    if (selectedPlaceData != undefined) {
      this.placeService.assignSelectedPlace(selectedPlaceData);
    }
  }
}
