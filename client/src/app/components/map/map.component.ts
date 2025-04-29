import {
  Component,
  input,
  InputSignal,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Place } from '../../interfaces/place';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnChanges {
  @ViewChild('mapRef') mapRef!: GoogleMap;
  selectedPlace: InputSignal<Place | undefined> = input<Place>();
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom: number = 10;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 },
  ];

  options: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    this.assignCenter();
  }

  assignCenter() {
    const placeLocation = this.selectedPlace()?.location;
    console.log('place location: ', placeLocation);
    if (placeLocation) {
      this.mapRef.panTo({
        lat: placeLocation.latitude,
        lng: placeLocation.longitude,
      });
      this.zoom = 18;
    }
  }
}
