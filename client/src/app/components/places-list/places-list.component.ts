import { Component } from '@angular/core';
import { PlaceDetailsComponent } from '../place-details/place-details.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Place } from '../../interfaces/place';
import { QueryService } from '../../services/query.service';

@Component({
  selector: 'app-places-list',
  imports: [PlaceDetailsComponent, CommonModule],
  templateUrl: './places-list.component.html',
  styleUrl: './places-list.component.css',
})
export class PlacesListComponent {
  places$!: Observable<Place[]>;

  constructor(private queryService: QueryService) {
    this.places$ = this.queryService.places$;
  }
}
