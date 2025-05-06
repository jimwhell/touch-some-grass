import { PlaceReview } from './place-review';

export interface PlaceDetail {
  weekday_text: string[];
  overview: string;
  reviews?: PlaceReview[];
}
