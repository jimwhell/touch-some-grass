import { Component } from '@angular/core';
import { PlaceSearchComponent } from './components/place-search/place-search.component';
import { MapComponent } from './components/map/map.component';
import { PlacesListComponent } from './components/places-list/places-list.component';
import { ExpandedPlace } from './interfaces/expanded-place';

@Component({
  selector: 'app-root',
  imports: [PlaceSearchComponent, MapComponent, PlacesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';
  expandedPlace?: ExpandedPlace;

  assignSelectedPlace(place: ExpandedPlace) {
    console.log('Card clicked from app component: ', place);
    this.expandedPlace = place;
  }
}
