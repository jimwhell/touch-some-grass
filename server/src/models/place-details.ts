import { PlaceDetailsResponseDetails } from "./place-details-response-details";
import { PlaceReview } from "./placeReview";

export interface PlaceDetails {
  current_opening_hours?: {
    open_now: boolean;
    weekday_text: string[];
  };
  editorial_summary?: {
    overview: string;
  };
  reviews?: PlaceReview[];
}
