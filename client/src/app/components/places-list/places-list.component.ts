import { Component, OnInit, OutputEmitterRef, output } from '@angular/core';
import { PlaceDetailsComponent } from '../place-details/place-details.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Place } from '../../interfaces/place';
import { PlaceService } from '../../services/place.service';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-places-list',
  imports: [PlaceDetailsComponent, CommonModule, InfiniteScrollDirective],
  templateUrl: './places-list.component.html',
  styleUrl: './places-list.component.css',
})
export class PlacesListComponent implements OnInit {
  places$!: Observable<Place[]>;
  placeCardClicked: OutputEmitterRef<ExpandedPlace> = output<ExpandedPlace>();
  places: Place[] = [];
  isLoading$!: Observable<boolean>;
  hasNextPage$!: Observable<string | null>;
  isLoadingIndicator!: boolean;
  hasNextPage!: boolean;
  nextPageToken!: string | undefined;

  // toggleLoading = () => (this.isLoading = !this.isLoading);

  // loadData(): void {
  //   this.toggleLoading;
  // }

  ngOnInit(): void {
    this.places$ = this.placeService.places$;
    this.isLoading$ = this.placeService.isLoading$;
    this.hasNextPage$ = this.placeService.hasNextPage$;

    //subscribe to isLoading Observable from place service
    //and assign to the property of this class to use for
    //tracking if a recent request is still being loaded

    this.hasNextPage$.subscribe({
      next: (hasNextPage: string | null) => {
        if (hasNextPage === null) {
          this.hasNextPage = false;
          return;
        }
        this.hasNextPage = true;
      },
      error: (err) => {
        console.error('Error retrieving for next page status: ', err);
      },
    });
  }

  constructor(private placeService: PlaceService) {}

  onScroll() {
    console.log('Has next page? ', this.hasNextPage);
    if (this.hasNextPage) {
      console.log('Is it still loading? ', this.isLoadingIndicator);
      if (this.isLoadingIndicator) {
        return;
      }
      const nextPage$ = this.placeService.loadNextPage();
      if (nextPage$) {
        nextPage$.subscribe({
          next: () => {
            console.error('Called!');
          },
          error: (err) => {
            console.error('Error retrieving additional places');
          },
        });
      }
    }

    this.isLoading$.subscribe({
      next: (isLoading) => {
        this.isLoadingIndicator = isLoading;
      },
      error: (err) => {
        console.error('Failed to retrieve loading status');
      },
    });
  }

  reEmitCardClick(expandedPlace: ExpandedPlace) {
    this.placeCardClicked.emit(expandedPlace);
  }
}
