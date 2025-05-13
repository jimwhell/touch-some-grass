import {
  Component,
  input,
  InputSignal,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { PlaceService } from '../../services/place.service';
import { TitleCasePipe, CommonModule } from '@angular/common';
import { Observable, filter } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgxStarsModule } from 'ngx-stars';

@Component({
  selector: 'app-map-place-card',
  imports: [
    RouterOutlet,
    RouterLink,
    TitleCasePipe,
    CommonModule,
    NgxStarsModule,
  ],
  templateUrl: './map-place-card.component.html',
  styleUrl: './map-place-card.component.css',
})
export class MapPlaceCardComponent implements OnInit, OnChanges {
  //input signal consisting of the selectedPlace to be passed by the parent mapComponent
  selectedPlace: InputSignal<ExpandedPlace | undefined> = input<
    ExpandedPlace | undefined
  >(undefined);

  selectedPlace$!: Observable<ExpandedPlace>; //observable to hold the selectedPlace data, to be used in the template

  constructor(private placeService: PlaceService, private router: Router) {
    // Convert the input signal to an observable and filter out undefined values for type narrowing, then assign the data to the selected place observable
    this.selectedPlace$ = toObservable(this.selectedPlace).pipe(
      filter((place): place is ExpandedPlace => place !== undefined)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    //pass the place input property once it is loaded into the assignSelectedPlace method of placeService
    const selectedPlaceData: ExpandedPlace | undefined = this.selectedPlace();
    if (selectedPlaceData !== undefined) {
      this.placeService.assignSelectedPlace(selectedPlaceData);
    }
  }

  //make /overview the default view upon component initialization
  ngOnInit(): void {
    this.router.navigate(['/overview']);
  }
}
