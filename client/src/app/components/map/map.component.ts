import { Component } from '@angular/core';
import {
  GoogleMapsModule,
  MapInfoWindow,
  MapMarker,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  center: google.maps.LatLngLiteral = { lat: 37.7749, lng: -122.4194 };
  zoom: number = 5;
  markers = [
    { lat: 40.73061, lng: -73.935242 },
    { lat: 40.74988, lng: -73.968285 },
  ];

  options: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
  };
}
