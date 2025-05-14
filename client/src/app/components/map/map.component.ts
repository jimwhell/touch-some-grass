import {
  AfterViewInit,
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
  MapDirectionsRenderer,
  MapDirectionsService,
  MapAdvancedMarker,
} from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { Place } from '../../interfaces/place';
import { Observable, map } from 'rxjs';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { MapPlaceCardComponent } from '../map-place-card/map-place-card.component';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule, MapPlaceCardComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnChanges, AfterViewInit {
  @ViewChild('mapRef') mapRef!: GoogleMap;
  isViewInitialized: boolean = false;
  pixelOffset: google.maps.Size = new google.maps.Size(0, -30);
  directionsResult$!: Observable<google.maps.DirectionsResult | undefined>;
  selectedPlace: InputSignal<ExpandedPlace | undefined> =
    input<ExpandedPlace>();
  center: google.maps.LatLngLiteral = { lat: 13.41, lng: 122.56 };
  zoom: number = 6;
  formattedOperationalStatus!: string;
  markerPosition!: google.maps.LatLngLiteral;
  markerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    gmpDraggable: false,
    title: 'Selected Place',
  };

  constructor(private mapDirectionsService: MapDirectionsService) {}

  options: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
  };

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isViewInitialized) {
      this.assignCenter();
    }
  }

  addMarker(placeLocation: google.maps.LatLngLiteral) {
    this.markerPosition = placeLocation;
  }

  assignCenter() {
    const placeLocation = this.selectedPlace()?.location;
    if (placeLocation) {
      const position = {
        lat: placeLocation.latitude,
        lng: placeLocation.longitude,
      };
      this.addMarker(position);
      this.mapRef.panTo(position);
      this.zoom = 20;
    }
  }
}
