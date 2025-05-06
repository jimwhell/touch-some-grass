import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PlaceQuery } from '../interfaces/place-query';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { Place } from '../interfaces/place';
import { PlaceDetail } from '../interfaces/place-detail';
import { ExpandedPlace } from '../interfaces/expanded-place';
@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private apiService: ApiService) {}
  private placesSubject = new BehaviorSubject<Place[]>([]);

  //behavior subject representing the selected Place. Assign initially to null.
  private selectedPlaceSubject = new BehaviorSubject<ExpandedPlace | null>(
    null
  );

  places$ = this.placesSubject.asObservable();

  //holds the value of the selected place which is shared by the routed components inside map-place-card (overview and reviews component)
  selectedPlace$ = this.selectedPlaceSubject.asObservable();

  private apiUrl: string = '/api/places';

  //method to fetch places from server
  searchPlaces(query: PlaceQuery): Observable<Place[]> {
    return this.apiService.post<Place[], PlaceQuery>(this.apiUrl, query).pipe(
      tap((places: Place[]) => {
        places.forEach((place: Place) => {
          let placeType = place.primaryType;
          if (typeof placeType === 'undefined') {
            console.error('Place type not found for: ', place.displayName);
            return;
          }
          place.primaryType = this.getFormattedType(placeType);
        });
        this.placesSubject.next(places);
      })
    );
  }

  //method to return the route endpoint for the template to fetch the image from the server
  getPhoto(photoReference: string) {
    const baseUrl = this.apiService.baseUrl;
    return `${baseUrl}${this.apiUrl}/photo?photoReference=${photoReference}`;
  }

  getPlaceDetails(placeId: string): Observable<PlaceDetail> {
    return this.apiService.get(`${this.apiUrl}/${placeId}`);
  }

  //method to assign the selected place
  assignSelectedPlace(selectedPlace: ExpandedPlace) {
    this.selectedPlaceSubject.next(selectedPlace);
    this.selectedPlaceSubject.subscribe({
      next: (value) => {
        console.log('Value of selected place: ', value);
      },
    });
  }

  //if place object contains primary type attribute, modify the primaryType property inside the place object. Else, cancel the execution of the method.
  getFormattedType(primaryType: string): string {
    return primaryType?.replaceAll('_', ' ');
  }
}
