import { Component } from '@angular/core';
import { PlaceSearchComponent } from './components/place-search/place-search.component';

@Component({
  selector: 'app-root',
  imports: [PlaceSearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'client';
}
