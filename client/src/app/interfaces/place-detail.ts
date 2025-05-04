import { PlaceReview } from './place-review';

export interface PlaceDetail {
  current_opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  editorial_summary?: {
    overview: string;
  };
  reviews?: PlaceReview[];
}
