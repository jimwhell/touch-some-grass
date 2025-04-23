import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private httpClient: HttpClient) {}

  readonly baseUrl: string = 'http://localhost:3000';

  post<TResponse, TRequest>(
    url: string,
    body: TRequest
  ): Observable<TResponse> {
    return this.httpClient.post<TResponse>(`${this.baseUrl}${url}`, body);
  }

  get<TResponse>(url: string): Observable<TResponse> {
    return this.httpClient.get<TResponse>(`${this.baseUrl}${url}`);
  }
}
