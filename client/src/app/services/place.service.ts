import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PlaceQuery } from '../interfaces/place-query';
import { BehaviorSubject, Observable, tap, timer, switchMap } from 'rxjs';
import { Place } from '../interfaces/place';
import { PlaceDetail } from '../interfaces/place-detail';
import { ExpandedPlace } from '../interfaces/expanded-place';
import { PaginatedPlaces } from '../interfaces/paginatedPlaces';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private apiService: ApiService) {}
  private totalPlaces!: number;
  private currentPlaces: number = 0;
  private limit: number = 5;

  //behavior subject representing the selected Place. Assign initially to null.
  private selectedPlaceSubject = new BehaviorSubject<ExpandedPlace | null>(
    null
  );
  //holds the value of the selected place which is shared by the routed components inside map-place-card (overview and reviews component)
  selectedPlace$ = this.selectedPlaceSubject.asObservable();

  private placesSubject = new BehaviorSubject<Place[]>([]);
  places$ = this.placesSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  private querySubject = new BehaviorSubject<PlaceQuery | null>(null);
  query$ = this.querySubject.asObservable();

  private nextPageSubject = new BehaviorSubject<string | null>(null);
  hasNextPage$ = this.nextPageSubject.asObservable();

  private apiUrl: string = '/api/places';

  //method to fetch places from server
  searchPlaces(query: PlaceQuery): Observable<PaginatedPlaces> {
    this.isLoadingSubject.next(true);

    const nextPageToken: string | null = this.nextPageSubject.value;
    console.log('Bitch ass token: ', nextPageToken);
    let params: HttpParams = new HttpParams();

    if (nextPageToken !== null) {
      params = params.set('nextPageToken', nextPageToken); //assign the value of the initial HttpParams instance to the value of the created HttpInstance by setting the query parameter
    }

    return this.apiService
      .post<PaginatedPlaces, PlaceQuery>(`${this.apiUrl}`, query, { params })
      .pipe(
        tap((response: PaginatedPlaces) => {
          console.log('Has nextpageToken: ', response.nextPageToken);
          if (!response.nextPageToken) {
            this.nextPageSubject.next(null);
            return;
          }
          this.nextPageSubject.next(response.nextPageToken);
          const places: Place[] = response.places;
          places.forEach((place: Place) => {
            let placeType = place.primaryType;
            if (typeof placeType === 'undefined') {
              console.error('Place type not found for: ', place.displayName);
              return;
            }
            place.primaryType = this.getFormattedType(placeType);
          });
          this.placesSubject.next(places);
          this.isLoadingSubject.next(false);
        })
      );
  }

  setQuery(query: PlaceQuery): void {
    this.querySubject.next(query);
    console.log('New query set: ', query);
  }

  loadNextPage(): Observable<PaginatedPlaces> | undefined {
    if (this.nextPageSubject.value) {
      this.isLoadingSubject.next(true);
      const query = this.querySubject.value;
      if (query === null) {
        return;
      }
      const currentDisplayedPlaces: Place[] = this.placesSubject.value;
      return timer(2500).pipe(
        switchMap(() => this.searchPlaces(query)),
        tap((response: PaginatedPlaces) => {
          const additionalPlaces = response.places;
          this.placesSubject.next([
            ...currentDisplayedPlaces,
            ...additionalPlaces,
          ]);
          this.isLoadingSubject.next(false);
        })
      );
    }
    return;
  }

  //method to return the route endpoint for the template to fetch the image from the server
  getPhoto(photoReference: string): string {
    const baseUrl = this.apiService.baseUrl;
    return `${baseUrl}${this.apiUrl}/photo?photoReference=${photoReference}`;
  }

  getPlaceDetails(placeId: string): Observable<PlaceDetail> {
    return this.apiService.get(`${this.apiUrl}/${placeId}`);
  }

  //method to assign the selected place
  assignSelectedPlace(selectedPlace: ExpandedPlace): void {
    this.selectedPlaceSubject.next(selectedPlace);
  }

  //if place object contains primary type attribute, modify the primaryType
  // property inside the place object. Else, cancel the execution of the method.
  getFormattedType(primaryType: string): string {
    return primaryType?.replaceAll('_', ' ');
  }
}
