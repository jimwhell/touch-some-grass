import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { PlaceQuery } from '../interfaces/place-query';
import { Observable } from 'rxjs';
import { PlaceResponse } from '../interfaces/place-response';

@Injectable({
  providedIn: 'root',
})
export class QueryService {
  constructor(private apiService: ApiService) {}
  private apiUrl: string = '/api/search';

  searchPlaces(query: PlaceQuery): Observable<PlaceResponse> {
    return this.apiService.post(this.apiUrl, query);
  }
}
