import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { PlaceService } from '../../services/place.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-place-reviews',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './place-reviews.component.html',
  styleUrl: './place-reviews.component.css',
})
export class PlaceReviewsComponent implements OnInit {
  //represents the selectedPlace derived from the selectedPlace observable in PlaceService
  selectedPlace$!: Observable<ExpandedPlace | null>;

  //set containing the author_name property of expanded reviews in the template
  expandedReviews: Set<string> = new Set();
  //create an array to have an iterable for the creation of rating stars in the template
  //using the @for directive.
  maxRatingArr!: any[];

  maxRatingCount: number = 5; //represents the maximum number of rating (stars)

  constructor(private placeService: PlaceService) {}

  //assign the selected place observable to
  // this component's selectedPlace observable property
  ngOnInit(): void {
    const selectedPlaceFromService: Observable<ExpandedPlace | null> =
      this.placeService.selectedPlace$;
    this.selectedPlace$ = selectedPlaceFromService;

    this.maxRatingArr = Array(this.maxRatingCount).fill(0);
    console.log(this.maxRatingArr.length);
  }

  //method to determine if an individual review is added to
  //the set of expanded reviews (toggled read more)
  isExpanded(authorName: string) {
    return this.expandedReviews.has(authorName);
  }

  toggleReadMore(authorName: string) {
    if (this.isExpanded(authorName)) {
      this.expandedReviews.delete(authorName);
    } else {
      this.expandedReviews.add(authorName);
    }
  }
}
