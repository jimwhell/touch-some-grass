import { Routes } from '@angular/router';
import { PlaceOverviewComponent } from './components/place-overview/place-overview.component';
import { PlaceReviewsComponent } from './components/place-reviews/place-reviews.component';
import { MapPlaceCardComponent } from './components/map-place-card/map-place-card.component';

export const routes: Routes = [
  {
    path: 'overview',
    component: PlaceOverviewComponent,
  },
  {
    path: 'reviews',
    component: PlaceReviewsComponent,
  },
];
