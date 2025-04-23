import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PlaceQuery } from '../interfaces/place-query';
import { Observable } from 'rxjs';
import { Place } from '../interfaces/place';
@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(private apiService: ApiService) {}
  private apiUrl: string = '/api/places';

  searchPlaces(query: PlaceQuery): Observable<Place[]> {
    return this.apiService.post(this.apiUrl, query);
  }

  getPhoto(photoReference: string) {
    const baseUrl = this.apiService.baseUrl;
    return `${baseUrl}${this.apiUrl}/photo?photoReference=${photoReference}`;
  }
}
