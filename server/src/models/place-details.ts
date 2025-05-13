import { PlaceDetailsResponseDetails } from "./place-details-response-details";
import { PlaceReview } from "./placeReview";

//fields are made optional, since some requests for places
//from the place details API may return some null values, such as rating.
export interface PlaceDetails {
  open_now?: boolean;
  weekday_text?: string[];
  overview?: string;
  reviews?: PlaceReview[];
  total_user_rating?: number;
}
