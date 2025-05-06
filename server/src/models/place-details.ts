import { PlaceDetailsResponseDetails } from "./place-details-response-details";
import { PlaceReview } from "./placeReview";

export interface PlaceDetails {
  open_now?: boolean;
  weekday_text?: string[];
  overview?: string;
  reviews?: PlaceReview[];
}
