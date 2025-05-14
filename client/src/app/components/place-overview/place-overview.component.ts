import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-place-overview',
  imports: [CommonModule],
  templateUrl: './place-overview.component.html',
  styleUrl: './place-overview.component.css',
})
export class PlaceOverviewComponent implements OnInit {
  //represents the selectedPlace derived from the selectedPlace observable in PlaceService
  selectedPlace$!: Observable<ExpandedPlace | null>;
  selectedPlace!: ExpandedPlace; //declare a second property that stores the emitted value from the observable for use in internal logic
  isDropdownClicked: boolean = false;
  operationStatus!: string;

  constructor(private placeService: PlaceService) {}

  //assign the selected place observable to
  // this component's selectedPlace observable property
  ngOnInit(): void {
    const selectedPlaceFromService: Observable<ExpandedPlace | null> =
      this.placeService.selectedPlace$;
    this.selectedPlace$ = selectedPlaceFromService;

    //subscribe to observable and assign emitted value to selectedPlace property
    this.selectedPlace$.subscribe({
      next: (selectedPlace) => {
        if (selectedPlace !== null) {
          console.log('Value of observable: ', selectedPlace);
          this.selectedPlace = selectedPlace;
        }
      },
      error: (err) => {
        console.error('Expanded place not found: ', err);
      },
    });
  }

  toggleDropdown(): void {
    this.isDropdownClicked === true
      ? (this.isDropdownClicked = false)
      : (this.isDropdownClicked = true);
  }
}
