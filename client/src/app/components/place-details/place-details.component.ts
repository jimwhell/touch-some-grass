import { Component, Input, input, InputSignal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { Place } from '../../interfaces/place';
import { QueryService } from '../../services/query.service';

@Component({
  selector: 'app-place-details',
  imports: [TitleCasePipe],
  templateUrl: './place-details.component.html',
  styleUrl: './place-details.component.css',
})
export class PlaceDetailsComponent {
  constructor(private queryService: QueryService) {}

  place: InputSignal<Place | undefined> = input<Place>();

  getPhotoFromReference(photoReference: string) {
    return this.queryService.getPhoto(photoReference);
  }

  getFormattedType(): string {
    const placeType: string = this.place()?.primaryType!;
    return placeType.replaceAll('_', ' ');
  }
}
