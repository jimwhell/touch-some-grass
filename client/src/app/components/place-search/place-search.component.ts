import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { PlaceService } from '../../services/place.service';
import { PlaceQuery } from '../../interfaces/place-query';
import { Place } from '../../interfaces/place';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-search',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './place-search.component.html',
  styleUrl: './place-search.component.css',
})
export class PlaceSearchComponent {
  // Inject FormBuilder instance using Angular's inject function
  private formBuilder = inject(FormBuilder);
  searchBarIsLoading: boolean = false;

  places$!: Observable<Place[]>;

  // Define a reactive form with a single 'query' input field and a required validator
  queryForm = this.formBuilder.group({
    query: ['', Validators.required],
  });

  constructor(private placeService: PlaceService) {
    this.places$ = this.placeService.places$;
  }

  // Getter to easily access the 'query' form control
  get query() {
    return this.queryForm.get('query');
  }

  // Submit the form, send the query to the backend, and update the places list
  submitQuery() {
    if (this.queryForm.valid) {
      this.searchBarIsLoading = true;
      console.log('Search bar is loading: ', this.searchBarIsLoading);
      // Extract the query value; fallback not needed due to validator but kept safe
      const queryValue = this.query?.value || '';

      // Build the request body according to PlaceQuery interface
      const requestBody: PlaceQuery = { query: queryValue };
      this.placeService.setQuery(requestBody);
      // Call the service to fetch places, and handle response or error
      this.placeService.searchPlaces(requestBody).subscribe({
        next: () => {
          this.searchBarIsLoading = false;
        },
        error: (err) => {
          this.searchBarIsLoading = false;
          console.error('Error fetching search results');
        },
      });
      console.log('Search bar is loading: ', this.searchBarIsLoading);
    }
  }

  //method to retrieve the endpoint URL from the placeService to acquire the place image file
  getPhotoFromReference(photoReference: string) {
    return this.placeService.getPhoto(photoReference);
  }
}
