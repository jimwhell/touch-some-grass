import { Component } from '@angular/core';
import { PlaceSearchComponent } from './components/place-search/place-search.component';
import { MapComponent } from './components/map/map.component';
import { PlacesListComponent } from './components/places-list/places-list.component';
import { Place } from './interfaces/place';

@Component({
  selector: 'app-root',
  imports: [PlaceSearchComponent, MapComponent, PlacesListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';
  place?: Place;

  assignSelectedPlace(place: Place) {
    console.log('Card clicked from app component: ', place);
    this.place = place;
  }
}
