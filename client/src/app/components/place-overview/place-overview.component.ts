import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-overview',
  imports: [CommonModule],
  templateUrl: './place-overview.component.html',
  styleUrl: './place-overview.component.css',
})
export class PlaceOverviewComponent implements OnInit {
  //represents the selectedPlace derived from the selectedPlace observable in PlaceService
  selectedPlace$!: Observable<ExpandedPlace | null>;
  isDropdownClicked: boolean = false;

  constructor(private placeService: PlaceService) {}

  //assign the selected place observable to
  // this component's selectedPlace observable property
  ngOnInit(): void {
    const selectedPlaceFromService = this.placeService.selectedPlace$;
    this.selectedPlace$ = selectedPlaceFromService;
  }

  toggleDropdown() {
    this.isDropdownClicked === true
      ? (this.isDropdownClicked = false)
      : (this.isDropdownClicked = true);
  }
}
