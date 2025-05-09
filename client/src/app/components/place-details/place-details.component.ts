import {
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TitleCasePipe, AsyncPipe } from '@angular/common';
import { Place } from '../../interfaces/place';
import { PlaceService } from '../../services/place.service';
import { PlaceDetail } from '../../interfaces/place-detail';
import { filter, Observable } from 'rxjs';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { NgxStarsModule } from 'ngx-stars';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-place-details',
  imports: [TitleCasePipe, NgxStarsModule, AsyncPipe],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.css',
})
export class PlaceDetailsComponent implements OnInit {
  place: InputSignal<Place | undefined> = input<Place>();
  placeCardClicked: OutputEmitterRef<ExpandedPlace> = output<ExpandedPlace>();
  placeDetails!: PlaceDetail;
  placeFromList$!: Observable<Place>;

  //on initialization, assigns the formatted type variable to the value returned by the getFormattedType method
  ngOnInit(): void {
    this.getPhotoFromReference();
  }

  constructor(private placeService: PlaceService) {
    this.placeFromList$ = toObservable(this.place).pipe(
      filter((place): place is Place => place !== undefined)
    );
  }

  //assign the file image request link as a property to the place object
  getPhotoFromReference() {
    const place = this.place();
    const placePhoto = place?.photo;
    if (placePhoto) {
      const placePhotoFile = this.placeService.getPhoto(place?.photo);
      place.photo = placePhotoFile;
    }
  }

  emitPlaceClick(event: MouseEvent, placeDetails: PlaceDetail) {
    const expandedPlace: ExpandedPlace = {
      ...this.place()!,
      ...placeDetails,
    };

    this.placeCardClicked.emit(expandedPlace);
  }

  getPlaceDetails($event: MouseEvent) {
    const placeId = this.place()?.id;
    if (!placeId) {
      console.error('Place ID not found.');
      return;
    }
    this.placeService.getPlaceDetails(placeId).subscribe({
      next: (response: PlaceDetail) => {
        this.placeDetails = response;
        console.log(
          'Place details after formatting: ',
          this.placeDetails?.reviews
        );
        this.emitPlaceClick($event, this.placeDetails);
      },
      error: (err) => {
        console.error('Error in fecthing place details: ', err);
      },
    });
  }
}
