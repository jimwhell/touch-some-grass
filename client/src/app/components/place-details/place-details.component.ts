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

@Component({
  selector: 'app-place-details',
  imports: [TitleCasePipe],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.css',
})
export class PlaceDetailsComponent implements OnInit {
  formattedType!: string | undefined;
  place: InputSignal<Place | undefined> = input<Place>();
  placeCardClicked: OutputEmitterRef<Place> = output<Place>();

  //on initialization, assigns the formatted type variable to the value returned by the getFormattedType method
  ngOnInit(): void {
    this.formattedType = this.getFormattedType();
  }

  constructor(private queryService: QueryService) {}

  getPhotoFromReference(photoReference: string) {
    return this.queryService.getPhoto(photoReference);
  }

  emitPlaceClick(event: MouseEvent, place: Place) {
    console.log(place);
    this.placeCardClicked.emit(place);
  }

  //if place object contains primary type attribute, return formatted type. Else, cancel the execution of the method.
  getFormattedType(): string | undefined {
    const placeType: string = this.place()?.primaryType!;
    if (!placeType) {
      return;
    }
    return placeType.replaceAll('_', ' ');
  }
}
