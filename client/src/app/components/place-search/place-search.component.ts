import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { QueryService } from '../../services/query.service';
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

  places$!: Observable<Place[]>;

  // Define a reactive form with a single 'query' input field and a required validator
  queryForm = this.formBuilder.group({
    query: ['', Validators.required],
  });

  constructor(private queryService: QueryService) {
    this.places$ = this.queryService.places$;
  }

  // Getter to easily access the 'query' form control
  get query() {
    return this.queryForm.get('query');
  }

  // Submit the form, send the query to the backend, and update the places list
  submitQuery() {
    if (this.queryForm.valid) {
      // Extract the query value; fallback not needed due to validator but kept safe
      const queryValue = this.query?.value || '';

      // Build the request body according to PlaceQuery interface
      const requestBody: PlaceQuery = { query: queryValue };

      // Call the service to fetch places, and handle response or error
      this.queryService.searchPlaces(requestBody).subscribe({
        next: () => {},
        error: (err) => {
          console.error('Error fetching search results');
        },
      });
    }
  }

  //method to retrieve the endpoint URL from the queryService to acquire the place image file
  getPhotoFromReference(photoReference: string) {
    return this.queryService.getPhoto(photoReference);
  }
}
