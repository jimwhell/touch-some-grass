import {
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
} from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Place } from '../../interfaces/place';
import { QueryService } from '../../services/query.service';
import { PlaceDetail } from '../../interfaces/place-detail';
import { Observable } from 'rxjs';
import { ExpandedPlace } from '../../interfaces/expanded-place';

@Component({
  selector: 'app-place-details',
  imports: [TitleCasePipe],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.css',
})
export class PlaceDetailsComponent implements OnInit {
  formattedType!: string | undefined;
  place: InputSignal<Place | undefined> = input<Place>();
  placeCardClicked: OutputEmitterRef<ExpandedPlace> = output<ExpandedPlace>();
  placeDetails!: PlaceDetail;

  //on initialization, assigns the formatted type variable to the value returned by the getFormattedType method
  ngOnInit(): void {
    this.formattedType = this.getFormattedType();
    this.getPhotoFromReference();
  }

  constructor(private queryService: QueryService) {}

  //assign the file image request link as a property to the place object
  getPhotoFromReference() {
    const place = this.place();
    const placePhoto = place?.photo;
    if (placePhoto) {
      const placePhotoFile = this.queryService.getPhoto(place?.photo);
      place.photo = placePhotoFile;
    }
  }

  emitPlaceClick(event: MouseEvent, placeDetails: PlaceDetail) {
    const expandedPlace: ExpandedPlace = {
      ...this.place()!,
      ...this.placeDetails,
    };

    this.placeCardClicked.emit(expandedPlace);
  }

  //if place object contains primary type attribute, return formatted type. Else, cancel the execution of the method.
  getFormattedType(): string | undefined {
    const placeType: string = this.place()?.primaryType!;
    if (!placeType) {
      return;
    }
    return placeType.replaceAll('_', ' ');
  }

  getPlaceDetails($event: MouseEvent) {
    const placeId = this.place()?.id;
    if (!placeId) {
      console.error('Place ID not found.');
      return;
    }
    this.queryService.getPlaceDetails(placeId).subscribe({
      next: (response: PlaceDetail) => {
        this.placeDetails = response;
        this.emitPlaceClick($event, this.placeDetails);
      },
      error: (err) => {
        console.error('Error in fecthing place details: ', err);
      },
    });
  }
}
